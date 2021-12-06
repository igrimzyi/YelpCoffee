const express = require('express');
const router = express.Router({mergeParams:true});
const coffeeShop = require('../models/coffee');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js'); 

const catchAsync = require('../utils/catchAsync');

const validateReview = (req,res,next) =>{
    const {error} =reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req,res)=>{
    const coffee = await coffeeShop.findById(req.params.id);
    const review = new Review(req.body.review); 
    coffee.reviews.push(review);
    await review.save()
    await coffee.save()
    req.flash('success', 'Review Successfully Created')
    res.redirect(`/coffeeShops/${coffee._id}`)
}))
router.delete('/:reviewId', catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await coffeeShop.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted')
    res.redirect(`/coffeeShops/${id}`);
}
))

module.exports = router;