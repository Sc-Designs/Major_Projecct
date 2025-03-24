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

// GET map page.
router.get("/maps/:id", (req, res)=>{
  try{
    const {id} = req.params;
     res.status(200).render('Map',{id});
  } catch(error){
     console.error(error);
    res.status(500).redirect("/anithing");
  }
})

// GET error page.
router.get("/:anithing",(req,res)=>{
  res.render('error');
})
module.exports = router;
