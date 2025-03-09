let express = require('express');
let router = express.Router();
const { body } = require('express-validator');
const UserAuthController = require('../controllers/UserAuthController');
const isLoggedInMiddleware = require("../Middleware/isLoggedInMiddleware")
const upload = require("../config/multer-config");
const userModel = require("../Models/User-Model"); 

// User Registration GET methods 
router.get("/register",(req, res) => {
  try{
    res.render("Register");
  }catch(err){
    res.redirect("/:anithing");
  }
});
// User Registration POST methods 
router.post('/register',[
  body('name').isLength({min: 5}).withMessage('Name must be at least 5 characters long'),
  body('email').isEmail(),
  body('dob').isDate().withMessage('Date is not valid!'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
],
UserAuthController.registerUser
);
// User Login GET methods
router.get('/login',(req, res)=>{
  try {
    res.render("Login");
  }catch (err) {
    res.redirect("/:anithing");
  }
})

// User Login POST methods 
router.post('/login', [
  body('email').isEmail().withMessage('Email does not Valid!'),
], 
UserAuthController.loginUser
);

//  User Profile Picture POST methods
router.post(
  "/picture-upload",
  upload.single("profilepic"),
  UserAuthController.uploadProfilePic
);

// User Profile GET methods
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

// User OTP Verification GET methods
router.get("/otp-varification/:id", async (req, res) => {
  try{
    const user = await userModel.findOne({_id: req.params.id});
    if(!user) return res.status(404).json({message: "User not found"});
    res.render("Otp", {user: user});
  }catch(err){
    res.redirect("/:anithing");
  }
});

router.post("/otp-valid/:id",
  [
    body("otp").isLength({ min: 4 }).withMessage("OTP must be 4 characters long"),
  ],
  UserAuthController.otpVerification
)

// User Re-Send OTP Verification POST methods
router.post("/resend-otp", UserAuthController.ResendOtp);

// Logout Route GET methods
router.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error(err);
          return res.redirect("/users/profile");
      }
      req.session.destroy();
      res.clearCookie("userToken");
      res.redirect('/users/login');
  });
});

module.exports = router;