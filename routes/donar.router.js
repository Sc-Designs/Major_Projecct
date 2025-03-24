let express = require('express');
let router = express.Router();
const IsloggedIn = require("../Middleware/isLoggedInMiddleware");
const controllers = require("../controllers/BloodRequestController")

// Donar page GET method
router.get('/request-list',IsloggedIn, controllers.seeAllRequest);

// Donate From GET method
router.get("/donate_from/:id", IsloggedIn, controllers.donateFrom);

// Donar Accept POST method
router.post('/accept', IsloggedIn, controllers.donateAccept);

module.exports = router;