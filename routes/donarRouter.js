const json = require('body-parser/lib/types/json');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/donar', function(req, res) {
  try{
    res.send('Donar');
  }
  catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;