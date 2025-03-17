let express = require('express');
let router = express.Router();
const {
  requestForBlood,
  RequestHandlerPage,
} = require("../controllers/BloodRequestController");
const IsloggedIn = require("../Middleware/isLoggedInMiddleware")

/* GET home page. */
router.get('/blood',IsloggedIn, RequestHandlerPage);

router.post("/blood-request", requestForBlood);

module.exports = router;