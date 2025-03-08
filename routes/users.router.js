let express = require('express');
let router = express.Router();
const { body } = require('express-validator');
const UserAuthController = require('../controllers/UserAuthController');
const isLoggedInMiddleware = require("../Middleware/isLoggedInMiddleware")
const upload = require("../config/multer-config");
const userModel = require("../Models/User-Model"); 

/* User Registration */
router.get("/register",(req, res) => {
  try{
    res.render("Register");
  }catch(err){
    res.redirect("/:anithing");
  }
});

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

router.get('/login',(req, res)=>{
  try {
    res.render("Login");
  }catch (err) {
    res.redirect("/:anithing");
  }
})

/* User Login */
router.post('/login', [
  body('email').isEmail(),
], 
UserAuthController.loginUser
);

router.get('/profile',isLoggedInMiddleware, async (req, res) => {
  try{
    if(!req.user || !req.user.email) return res.status(401).send("Unauthorized access");
    const user = await userModel.findOne({email: req.user.email});
    
    if(!user) return res.status(404).send("User not found");
    res.render("Profile", { user, profilepic: user.profilepic || null });
  }catch(err){
    res.redirect("/:anithing");
  }
  });

// Logout Route
router.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error(err);
          return res.redirect("/users/profile");
      }
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.clearCookie("userToken");
      res.redirect('/users/login');
  });
});

router.get("/otp-varification/:id", (req, res) => {
  try{
    res.render("Otp");
  }catch(err){
    res.redirect("/:anithing");
  }
});

router.get("/resend-otp", UserAuthController.ResendOtp);

router.post(
  "/picture-upload",
  upload.single("profilepic"),
  UserAuthController.uploadProfilePic
);

module.exports = router;