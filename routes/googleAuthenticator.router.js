const express = require("express");
const router = express.Router();
const passport = require("passport");

/* Google Authentication */
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  /* Google Authentication Callback */
  router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/users/profile',
        failureRedirect: '/users/login',
        failureFlash: true
    })
  );

module.exports = router;