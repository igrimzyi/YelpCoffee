const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req,res)=>{
    res.render('users/register');
})
router.post('/register', catchAsync(async(req,res)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email,username});
    const registeredUser =await User.register(user, password);
    req.flash('success' ,'Welcome to Brewlicious!')
    req.redirect('/coffeeShops');
    } catch(e){
        req.flash('error', e.message)
        res.redirect('register');
    }
}))

router.get('/login' , (req,res)=>{
    res.render('users/login');
})

router.post('/login' , passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) ,(req,res) =>{
    req.flash('success', 'Welcome Back!');
    res.redirect('/coffeeShops')
})

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/coffeeShops')

})

module.exports = router;