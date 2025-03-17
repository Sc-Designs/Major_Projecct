let express = require('express');
let router = express.Router();
const IsloggedIn = require("../Middleware/isLoggedInMiddleware");
const {seeAllRequest} = require("../controllers/BloodRequestController")
/* GET home page. */
router.get('/request-list',IsloggedIn, seeAllRequest);

module.exports = router;