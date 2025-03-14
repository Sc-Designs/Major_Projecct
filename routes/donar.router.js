let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/request-list', function(req, res) {
  try{
    res.status(200).render('Donar');
  }
  catch(error){
    console.error(error);
    res.status(500).redirect("/anithing");
  }
});

module.exports = router;