let express = require('express');
let router = express.Router();
const { requestForBlood, RequestHandlerPage } = require("../controllers/BloodRequestController");
const IsloggedIn = require("../Middleware/isLoggedInMiddleware")

/* Request page GET method */
router.get('/blood',IsloggedIn, RequestHandlerPage);

// Create a new request POST method
router.post("/blood-request", requestForBlood);

module.exports = router;