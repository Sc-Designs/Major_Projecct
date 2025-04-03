let express = require('express');
let router = express.Router();
const { body } = require('express-validator');
const UserAuthController = require('../controllers/UserAuthController');
const isLoggedInMiddleware = require("../Middleware/isLoggedInMiddleware")
const upload = require("../config/multer-config");
// User Registration GET methods 
router.get("/register", UserAuthController.registerPage);
// User Registration POST methods 
router.post('/register', [body('name').isLength({min: 5}).withMessage('Name must be at least 5 characters long'), body('email').isEmail(), body('dob').isDate().withMessage('Date is not valid!'), body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),], UserAuthController.registerUser );
// User Login GET methods
router.get('/login', UserAuthController.loginPage)
// User Login POST methods 
router.post('/login', [body('email').isEmail().withMessage('Email does not Valid!'),], UserAuthController.loginUser );
//  User Profile Picture POST methods
router.post("/picture-upload", upload.single("profilepic"), UserAuthController.uploadProfilePic );
// User Profile GET methods
router.get('/profile',isLoggedInMiddleware,UserAuthController.GetProfile);
// User OTP Verification GET methods
router.get("/otp-varification/:id", UserAuthController.IdWithOtpPage);
router.post("/otp-valid/:id", [body("otp").isLength({ min: 4 }).withMessage("OTP must be 4 characters long"),], UserAuthController.otpVerification )
// User Re-Send OTP Verification POST methods
router.post("/resend-otp", UserAuthController.ResendOtp);
// User Delete Blood-Request POST methods
router.post("/deletePost", UserAuthController.DeletePost);
// Logout Route GET methods
router.get('/logout', UserAuthController.logOutUser);
// User Add Blood Group POST methods
router.post("/add_blood_group", UserAuthController.AddBloodGroup);
// Asking Email For Change Password Page Get Methods
router.get('/changePassword', UserAuthController.frogerPassword);
//  Send OTP
router.post('/send-otp', UserAuthController.SendOtp);
// User OtpCenter Get Methods
router.get("/otpCenter/:id", UserAuthController.OtpCenter);
// User OtpCenter Verify Post Methods
router.post("/otpCenterVerify/:id", UserAuthController.OtpCenterVerification)
// User Re-Enter Password Get Methods
router.get("/reEnterPassword/:id", UserAuthController.ReEnterPasswordPage);
// User Re-Enter Password send DataBase Post Methods
router.post(
  "/rePassword/:id",
  [
    body("updatedpassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  UserAuthController.rePassword
);
module.exports = router;