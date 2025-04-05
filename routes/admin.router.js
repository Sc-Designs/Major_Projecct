const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  adminRegister,
  adminLogin,
  adminProfile,
  serverOnOffSettings,
  adminLogOut,
  uploadProfilePic,
  adminAllUsers,
  AllUser,
} = require("../controllers/AdminAuthController");
const adminIsLoggedInMiddleware = require('../Middleware/adminIsLoggedInMiddleware');
const upload = require("../config/multer-config");

router.post('/register', [body('fullname.firstname').isLength({min: 5}).withMessage('firstName must be at least 5 characters long'), body('fullname.lastname').isLength({min: 5}).withMessage('lastName must be at least 5 characters long'), body('email').isEmail().withMessage('Email is not valid!'), body('password').isLength({min: 8, max: 25}).withMessage('Password must be at least 8 characters long')], adminRegister );

router.post('/login', [body('email').isEmail().withMessage('Email is not valid!'), body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),], adminLogin );

router.get('/login', (req, res) => {
    try{
        res.status(200).render("adminLogin")
    }catch(error){
        console.error(error);
        res.status(500).json({message: error.message})
    }
})
router.get('/admin-profile',adminIsLoggedInMiddleware, adminProfile);
router.post(
  "/adminPic",
  upload.single("adminPic"),
  uploadProfilePic
);
router.post("/serverSettings", serverOnOffSettings);
router.get("/logout", adminLogOut);
router.get("/users", adminIsLoggedInMiddleware, adminAllUsers);
router.post("/all-users", adminIsLoggedInMiddleware, AllUser);
module.exports = router;