let express = require('express');
let router = express.Router();
//  GET home page. 
 router.get('/', (req, res)=>{
   try{
     res.render('index');
   }
   catch(error){
     console.error(error);
    res.status(500).send('Server error');
   }
 });

module.exports = router;
