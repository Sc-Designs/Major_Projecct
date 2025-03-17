const { userFinder } = require("../utlis/UserFinder");
const jwt = require("jsonwebtoken");
const { createBloodRequest } = require("../Services/blood.service");
const bloodRequestModel = require("../Models/Recivent-Model");

module.exports.requestForBlood = async( req,res )=>{
    try{
        const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
        if(!token){
            res.status(401).redirect("/users/login");
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userFinder({key: "email", query: decoded.email})
        if(!user){
            res.status(404).redirect("/users/login");
        }
        delete user._doc.password;
        const { blood_group } = req.body;
        if( blood_group === "nothing") return res.redirect("/users/profile");
        const newRequest = await createBloodRequest({
          userId: user._id,
          bloodType: req.body.blood_group,
        });
        user.bloodRequest.push(newRequest._id);
        await user.save();
        res.status(201).redirect("/users/profile");
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports.RequestHandlerPage = async (req, res) => {
  try {
    const allRequest = await bloodRequestModel
      .find()
      .populate({
        path: "userId",
        model: "user",
        select: "-password -__v",
      })
      .sort({ date: -1 })
      .lean();
    res.status(200).render("Request-Page", { posts: allRequest});
  } catch (error) {
    console.error("Error in RequestHandlerPage:", error.message, error.stack);
    res.status(500).redirect("/anithing");
  }
};

module.exports.seeAllRequest = async (req, res) =>{
  try{
    const allRequest = await bloodRequestModel
      .find()
      .populate({
        path: "userId",
        model: "user",
        select: "-password -__v",
      })
      .sort({ date: -1 })
      .lean();
    res.status(200).render('Donar', {posts: allRequest});
  }
  catch(error){
    console.error("Error in RequestHandlerPage:", error.message, error.stack);
    res.status(500).redirect("/anithing");
  }
}