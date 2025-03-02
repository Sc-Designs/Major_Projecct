let express = require('express');
let router = express.Router();

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