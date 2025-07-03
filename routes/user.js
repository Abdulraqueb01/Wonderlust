const express = require('express');
const router = express.Router();
let User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userControllers = require('../controllers/user.js');


// router.get('/signup',userControllers.renderSignUpForm );
// router.post('/signup', wrapAsync(userControllers.signup));
// router.get('/login',userControllers.renderLoginForm );
// router.post('/login',saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.login);


router.route('/signup')
    .get(userControllers.renderSignUpForm)
    .post(wrapAsync(userControllers.signup));
router.route('/login')
    .get(userControllers.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userControllers.login);

router.get('/logout',userControllers.logout);
module.exports = router;