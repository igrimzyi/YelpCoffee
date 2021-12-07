const express = require('express');
const  router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const coffeeShop = require('../models/coffee');
const {coffeeShopSchema} = require('../schemas.js'); 
const {isLoggedIn} = require('../middleware')

const validateCoffeeShop = (req,res,next)=>{
     
    const {error} =coffeeShopSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

router.get('/', catchAsync(async(req,res) => {
    const coffeeShops = await coffeeShop.find({});
    res.render('coffeeShops/index', {coffeeShops})
}));
router.get('/new', isLoggedIn, (req,res)=>{
    
    res.render('coffeeShops/new')
})

router.post('/', isLoggedIn, validateCoffeeShop, catchAsync(async(req,res,next)=>{
    
    // if(!req.body.coffee) throw new ExpressError('Invalid Data', 400);
    const coffee = new coffeeShop(req.body.coffeeShop);
    await coffee.save();
    req.flash('success', 'Successfully made a Coffee Shop') 
    res.redirect(`/coffeeShops/${coffee._id}`)
   }))

router.get('/:id', catchAsync(async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id).populate('reviews');
    if(!coffee){
        req.flash('error', 'Coffee Shop was not found')
        return res.redirect('/coffeeShops')
    }
    res.render('coffeeShops/show', {coffee})
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res)=>{
    const coffee = await coffeeShop.findById(req.params.id)
    if(!coffee){
        req.flash('error', 'Coffee Shop was not found')
        return res.redirect('/coffeeShops')
    }
    res.render('coffeeShops/edit', {coffee})

}));

router.put('/:id', isLoggedIn, validateCoffeeShop, async(req, res) =>{
    const {id} = req.params;
    const coffee = await coffeeShop.findByIdAndUpdate(id,{...req.body.coffeeShop})
    req.flash('success', 'successfully updated campground')
    res.redirect(`/coffeeShops/${coffee._id}`)
})
router.delete('/:id',isLoggedIn, catchAsync(async(req,res)=>{
    const{id} = req.params; 
    await coffeeShop.findByIdAndDelete(id); 
    req.flash('success', 'Successfully Deleted')
    res.redirect('/coffeeShops')
}));

module.exports = router;