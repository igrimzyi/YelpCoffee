const coffeeShop = require('../models/coffee');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const {cloudinary} = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async(req,res) => {
    const coffeeShops = await coffeeShop.find({});
    res.render('coffeeShops/index', {coffeeShops})
}
module.exports.renderNewForm = (req,res)=>{
    res.render('coffeeShops/new');
}

module.exports.createShop = async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.coffeeShop.location,
        limit: 1

    }).send()
    const coffee = new coffeeShop(req.body.coffeeShop);
    coffee.geometry = geoData.body.features[0].geometry
    coffee.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    coffee.author = req.user._id;
    await coffee.save();
    req.flash('success', 'Successfully made a Coffee Shop') 
    res.redirect(`/coffeeShops/${coffee._id}`)
   }
module.exports.showShop = async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id).populate({path:'reviews', populate:{path:'author'}}).populate('author');
    if(!coffee){
        req.flash('error', 'Coffee Shop was not found')
        return res.redirect('/coffeeShops')
    }
    res.render('coffeeShops/show', {coffee})
}
module.exports.renderEditForm = async(req, res)=>{
    const {id} = req.params;
    const coffee = await coffeeShop.findById(req.params.id)
    if(!coffee){
        req.flash('error', 'Coffee Shop was not found')
        return res.redirect('/coffeeShops')
    }
    res.render('coffeeShops/edit', {coffee})

}
module.exports.updateShop = async(req, res) =>{
    const {id} = req.params;
    const coffee = await coffeeShop.findByIdAndUpdate(id,{...req.body.coffeeShop})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    coffee.images.push(...imgs);
    await coffee.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename);
        }
    await coffee.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}})
   }
    req.flash('success', 'successfully updated campground')
    res.redirect(`/coffeeShops/${coffee._id}`)
}
module.exports.deleteShop = async(req,res)=>{
    const{id} = req.params; 
    await coffeeShop.findByIdAndDelete(id); 
    req.flash('success', 'Successfully Deleted')
    res.redirect('/coffeeShops')
}