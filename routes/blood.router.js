let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/blood', function(req, res) {
  try{
    res.send('Blood');
  }
  catch(error){
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;