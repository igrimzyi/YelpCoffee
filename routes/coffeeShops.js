const express = require('express');
const  router = express.Router();
const coffeeshops = require('../controllers/coffeeshops')
const catchAsync = require('../utils/catchAsync');
const coffeeShop = require('../models/coffee');

const {isLoggedIn, isAuthor, validateCoffeeShop} = require('../middleware')


router.get('/', catchAsync(coffeeshops.index));

router.get('/new', isLoggedIn, coffeeshops.renderNewForm)

router.post('/', isLoggedIn, validateCoffeeShop, catchAsync(coffeeshops.createShop))

router.get('/:id', catchAsync(coffeeshops.showShop));

router.get('/:id/edit', isLoggedIn,isAuthor, catchAsync(coffeeshops.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCoffeeShop, catchAsync(coffeeshops.updateShop))

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(coffeeshops.deleteShop));

module.exports = router;