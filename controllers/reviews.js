const coffeeShop = require('../models/coffee');
const Review = require('../models/review');


module.exports.createReview = async (req,res)=>{
    const coffee = await coffeeShop.findById(req.params.id);
    const review = new Review(req.body.review); 
    review.author = req.user._id
    coffee.reviews.push(review);
    await review.save();
    await coffee.save();
    req.flash('success', 'Review Successfully Created');
    res.redirect(`/coffeeShops/${coffee._id}`);
}
module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await coffeeShop.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully Deleted')
    res.redirect(`/coffeeShops/${id}`);
}