const {coffeeShopSchema} = require('./schemas.js'); 
const ExpressError = require('./utils/ExpressError');
const coffeeShop = require('./models/coffee');
const {reviewSchema} = require('./schemas.js'); 
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next) =>{
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()){
        req.flash('error', 'you must be signed in')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCoffeeShop = (req,res,next)=>{
     
    const {error} =coffeeShopSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next ) =>{
    const {id} = req.params
    const coffee = await coffeeShop.findById(id);
    if( !coffee.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!')
        return res.redirect(`/coffeeShops/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async(req,res,next ) =>{
    const {id , reviewId} = req.params
    const review= await Review.findById(reviewId);
    if( !review.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission to do that!')
        return res.redirect(`/coffeeShops/${id}`)
    }
    next();
}


module.exports.validateReview = (req,res,next) =>{
    const {error} =reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}