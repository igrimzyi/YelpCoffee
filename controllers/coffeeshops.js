const coffeeShop = require('../models/coffee');

module.exports.index = async(req,res) => {
    const coffeeShops = await coffeeShop.find({});
    res.render('coffeeShops/index', {coffeeShops})
}
module.exports.renderNewForm = (req,res)=>{
    res.render('coffeeShops/new');
}

module.exports.createShop = async(req,res,next)=>{
    const coffee = new coffeeShop(req.body.coffeeShop);
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
    req.flash('success', 'successfully updated campground')
    res.redirect(`/coffeeShops/${coffee._id}`)
}
module.exports.deleteShop = async(req,res)=>{
    const{id} = req.params; 
    await coffeeShop.findByIdAndDelete(id); 
    req.flash('success', 'Successfully Deleted')
    res.redirect('/coffeeShops')
}