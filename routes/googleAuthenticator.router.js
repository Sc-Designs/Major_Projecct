const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleAuthController = require("../controllers/GoogleAuthController")

/* Google Authentication */
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }) );

/* Google Authentication Callback */
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/login', failureFlash: true }), GoogleAuthController.tokenSender );

module.exports = router;