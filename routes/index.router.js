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

 router.get("/maps", (req, res)=>{
  try{
     res.status(200).render('Map');
  } catch(error){
     console.error(error);
    res.status(500).redirect("/anithing");
  }
 })

router.get("/:anithing",(req,res)=>{
  res.render('error');
})
module.exports = router;
