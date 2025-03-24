const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { adminRegister, adminLogin, adminProfile } = require('../controllers/AdminAuthController');
const adminIsLoggedInMiddleware = require('../Middleware/adminIsLoggedInMiddleware');

router.post('/register', [body('fullname.firstname').isLength({min: 5}).withMessage('firstName must be at least 5 characters long'), body('fullname.lastname').isLength({min: 5}).withMessage('lastName must be at least 5 characters long'), body('email').isEmail().withMessage('Email is not valid!'), body('password').isLength({min: 8, max: 25}).withMessage('Password must be at least 8 characters long')], adminRegister );

router.post('/login', [body('email').isEmail().withMessage('Email is not valid!'), body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),], adminLogin );

router.get('/login', (req, res) => {
    res.send('Login');
})

router.get('/admin-profile',adminIsLoggedInMiddleware, adminProfile)
module.exports = router;