let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/blood', function(req, res) {
  try{
    res.status(200).render('Request-Page');
  }
  catch(error){
    console.error(error);
    res.status(500).redirect("/anithing");
  }
});

module.exports = router;