const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const request = require('request');

router.get('/users/signin', (req, res) =>{
    res.render('users/signin');
});

router.post('/users/signin', (req,res) => {
    const token = req.body['g-recaptcha-response'];

    if(token == ''){
        req.flash('error_msg', 'Verify captcha');
        res.redirect('/users/signin');
        

    }else{

    const secretKey = "6Ld1lq4UAAAAAE2HdoPYOFZN-uj4ATpbStqrm0DJ";
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + token + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl,function(error,response,body) {
        console.log(body);
        body = JSON.parse(body);
       if(body.success !== undefined && !body.success) {
          req.flash('error_msg', 'Ploblem with captcha verification, try again');
          res.redirect('/users/signin');
        }
   
      });
    
    passport.authenticate('local', {
        successRedirect: '/notes',
        failureRedirect: '/users/signin',
        failureFlash: true
    })(req,res);
}
});


router.get('/users/signup', (req, res) =>{
    res.render('users/signup');
});

router.post('/users/signup', async (req,res) =>{
    const { name, email, password, confirm_password} =req.body;
    const errors = [];

    if( name.length <= 0){
        errors.push({text: 'Please insert your name'});
    }
    if( email.length <= 0){
        errors.push({text: 'Please insert your email'});
    }
    if( password.length <= 0){
        errors.push({text: 'Please insert your password'});
    }
    if( confirm_password.length <= 0){
        errors.push({text: 'Please insert your confirmation password'});
    }
    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if (password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'});
    }

    if(errors.length>0)
    {
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }
    else
    {
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'The email is already on use');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
         newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req,res) =>{
    req.logout();
    res.redirect('/');
});

module.exports = router;