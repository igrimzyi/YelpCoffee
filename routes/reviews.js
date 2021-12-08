const express = require('express');
const router = express.Router({mergeParams:true});
const coffeeShop = require('../models/coffee');
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const ExpressError = require('../utils/ExpressError');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const catchAsync = require('../utils/catchAsync');




router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;