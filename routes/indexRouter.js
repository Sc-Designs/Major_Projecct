var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  try{
    res.render('index', { title: 'Express' });
  }
  catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
