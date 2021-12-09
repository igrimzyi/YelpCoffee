const express = require('express');
const  router = express.Router();
const coffeeshops = require('../controllers/coffeeshops')
const catchAsync = require('../utils/catchAsync');
const coffeeShop = require('../models/coffee');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

const {isLoggedIn, isAuthor, validateCoffeeShop} = require('../middleware')

router.route('/')
    .get(catchAsync(coffeeshops.index))
    // .post(isLoggedIn, validateCoffeeShop, catchAsync(coffeeshops.createShop))
    .post(upload.array('image'), (req,res)=>{
        res.send(req.body)
    })


router.get('/new', isLoggedIn, coffeeshops.renderNewForm)

router.route('/:id')
    .get( catchAsync(coffeeshops.showShop))
    .put(isLoggedIn, isAuthor, validateCoffeeShop, catchAsync(coffeeshops.updateShop))
    .delete(isLoggedIn, isAuthor, catchAsync(coffeeshops.deleteShop));

router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(coffeeshops.renderEditForm));





module.exports = router;