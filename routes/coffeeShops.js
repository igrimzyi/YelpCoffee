const express = require('express');
const  router = express.Router();
const coffeeshops = require('../controllers/coffeeshops')
const catchAsync = require('../utils/catchAsync');
const coffeeShop = require('../models/coffee');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage})

const {isLoggedIn, isAuthor, validateCoffeeShop} = require('../middleware')

router.route('/')
    .get(catchAsync(coffeeshops.index))
    .post(isLoggedIn,upload.array('image'),validateCoffeeShop, catchAsync(coffeeshops.createShop))
    

router.get('/new', isLoggedIn, coffeeshops.renderNewForm)

router.route('/:id')
    .get( catchAsync(coffeeshops.showShop))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCoffeeShop, catchAsync(coffeeshops.updateShop))
    .delete(isLoggedIn, isAuthor, catchAsync(coffeeshops.deleteShop));

router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(coffeeshops.renderEditForm));





module.exports = router;