var express = require('express');
var router = express.Router();
const { body } = require('express-validator');
const UserAuthController = require('../controllers/UserAuthController');

/* User Registration */
router.post('/register',[
  body('email').isEmail(),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
  body('fullname.firstname').isLength({min: 5}).withMessage('Name must be at least 5 characters long'),
  body('phone').isNumeric().withMessage('Phone number is not valid!'),
  body('address').isLength({min: 5}).withMessage('Address must be at least 5 characters long'),
  body('gender').isLength({min: 4}).withMessage('Gender must be at least 4 characters long'),
],
UserAuthController.registerUser
);

/* User Login */
router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
], 
UserAuthController.loginUser
);

module.exports = router;