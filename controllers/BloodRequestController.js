const { userFinder } = require("../utlis/UserFinder");
const jwt = require("jsonwebtoken");
const { createBloodRequest } = require("../Services/blood.service");
const bloodRequestModel = require("../Models/Recivent-Model");
const moment = require("moment");
const userModel = require("../Models/User-Model");
const EmailSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails");
const dbgr = require("debug")("development:dev");

module.exports.requestForBlood = async( req,res )=>{
    try{
      const date = moment().format("DD/MM/YYYY");
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
        const { blood_group,number } = req.body;
        if (blood_group === "default") return res.redirect("/users/profile");
        const newRequest = await createBloodRequest({
          reciventId: user._id,
          bloodType: req.body.blood_group,
          number,
          date
        });
        user.bloodRequest.push(newRequest._id);
        await user.save();
        res.status(201).redirect("/users/profile");
    }catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

module.exports.RequestHandlerPage = async ( req,res ) => {
  try {
    const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.redirect("/users/login");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userFinder({key: "email", query: decoded.email});
    delete user._doc.password;
    const allPost = await bloodRequestModel.find({ reciventId : user._id}).sort({date: -1});
      if (!user) return res.redirect("/users/login");
      res.status(200).render("Request-Page", {requests : allPost, user: user});
  } catch (error) {
    console.error("Error in RequestHandlerPage:", error.message);
    res.status(500).redirect("/anithing");
  }
};

module.exports.seeAllRequest = async ( req,res ) =>{
  try{
    const token =
      req.cookies.userToken || req.headers.authorization?.split(" ")[1];
      const adminToken = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.redirect("/users/login");
    else if (!adminToken) return res.redirect("/admin/login");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const allRequest = await bloodRequestModel
      .find()
      .populate({
        path: "reciventId",
        model: "user",
        select: "-password -__v",
      })
      .sort({ date: -1 })
      .lean();
      const user = await userFinder({ key: "email", query: decoded.email });
      const fillterData = allRequest.filter((data) => {
        return data.reciventId._id.toString() !== user._id.toString();
      });
    res.status(200).render('Donar', {posts: fillterData});
  }
  catch(error){
    console.error("Error in RequestHandlerPage:", error.message, error.stack);
    res.status(500).redirect("/anithing");
  }
}

module.exports.donateFrom = async ( req,res ) => {
  try{
    const {id} = req.params;
    const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
    if(!token){
      res.status(401).redirect("/users/login");
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const request = await bloodRequestModel.findById(id)
    const recivent = await userFinder({key: "_id", query: request.reciventId._id.toString()})
    const user = await userFinder({key: "email", query: decoded.email})
    res.status(200).render("DonateFrom",{recivent, user, id})
  }catch(error){
    console.error("Error in donateFrom:", error.message, error.stack);
    res.status(500).redirect("/anithing");
  }
};

module.exports.donateAccept = async ( req,res ) =>{
  try{
  const { number, id, userId } = req.body;
  const bloodRequest = await bloodRequestModel.findOne({_id: id});
  if(!bloodRequest) res.redirect("/users/profile");
  const Donar = await userFinder({key: "_id", query: userId});
  const recivent = await userFinder({
    key: "_id",
    query: bloodRequest.reciventId.toString(),
  });
  bloodRequest.DonarNumber = number;
  bloodRequest.status = "Accepted";
  bloodRequest.donarId = Donar._id;
  await bloodRequest.save();
  Donar.Donate.push(bloodRequest._id);
  await Donar.save();
  await EmailSender.sendEmail({
    email: recivent.email,
    sub: "Blood Request Accepted By Donar 🎉",
    mess: emailTemplate.ReciventEmail({
      name: Donar.name,
      number,
      type: bloodRequest.bloodType,
    }),
  });
  await EmailSender.sendEmail({
    email: Donar.email,
    sub: "Blood Request Accepted By You ❤️",
    mess: emailTemplate.DonarEmail({
      name: recivent.name,
      number: bloodRequest.reciverNumber,
      type: bloodRequest.bloodType,
    }),
  });
  res.redirect("/users/profile");
} catch (e) {
  console.error("Error in donateAccept:", e.message, e.stack);
  res.status(500).redirect("/anithing");
}
}