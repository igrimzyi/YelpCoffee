const express = require('express');
const  router = express.Router();
const catchAsync = require('../utils/catchAsync');
const coffeeShop = require('../models/coffee');

const {isLoggedIn, isAuthor, validateCoffeeShop} = require('../middleware')


router.get('/', catchAsync(async(req,res) => {
    const coffeeShops = await coffeeShop.find({});
    res.render('coffeeShops/index', {coffeeShops})
}));
router.get('/new', isLoggedIn, (req,res)=>{
    
    res.render('coffeeShops/new')
})

router.post('/', isLoggedIn, validateCoffeeShop, catchAsync(async(req,res,next)=>{
    
    const coffee = new coffeeShop(req.body.coffeeShop);
    coffee.author = req.user._id;
    await coffee.save();
    req.flash('success', 'Successfully made a Coffee Shop') 
    res.redirect(`/coffeeShops/${coffee._id}`)
   }))

router.get('/:id', catchAsync(async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id).populate({path:'reviews', populate:{path:'author'}}).populate('author');
    if(!coffee){
        req.flash('error', 'Coffee Shop was not found')
        return res.redirect('/coffeeShops')
    }
    res.render('coffeeShops/show', {coffee})
}));

router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(async(req, res)=>{
    const {id} = req.params;
    const coffee = await coffeeShop.findById(req.params.id)
    if(!coffee){
        req.flash('error', 'Coffee Shop was not found')
        return res.redirect('/coffeeShops')
    }
    res.render('coffeeShops/edit', {coffee})

}));

router.put('/:id', isLoggedIn, isAuthor, validateCoffeeShop, async(req, res) =>{
    const {id} = req.params;
    const Coffee = await coffeeShop.findByIdAndUpdate(id,{...req.body.coffeeShop})
    req.flash('success', 'successfully updated campground')
    res.redirect(`/coffeeShops/${coffee._id}`)
})
router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async(req,res)=>{
    const{id} = req.params; 
    await coffeeShop.findByIdAndDelete(id); 
    req.flash('success', 'Successfully Deleted')
    res.redirect('/coffeeShops')
}));

module.exports = router;