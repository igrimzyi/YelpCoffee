const express = require('express');
const router = express.Router({mergeParams:true});
const coffeeShop = require('../models/coffee');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const catchAsync = require('../utils/catchAsync');




router.post('/', validateReview, isLoggedIn, catchAsync(async (req,res)=>{
    const coffee = await coffeeShop.findById(req.params.id);
    const review = new Review(req.body.review); 
    review.author = req.user._id
    coffee.reviews.push(review);
    await review.save();
    await coffee.save();
    req.flash('success', 'Review Successfully Created');
    res.redirect(`/coffeeShops/${coffee._id}`);
}))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await coffeeShop.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted')
    res.redirect(`/coffeeShops/${id}`);
}
))

module.exports = router;