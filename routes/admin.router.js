var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  try{
    res.send('Admin');
  }
  catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;