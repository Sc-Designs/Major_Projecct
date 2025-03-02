let express = require('express');
let router = express.Router();
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
], 
UserAuthController.loginUser
);

router.get('/profile', (req, res) => {
    res.render('Profile', { user: req.user });
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
      res.redirect('/users/profile');
  });
});

module.exports = router;