const userModel = require("../Models/User-Model");
const {validationResult} = require("express-validator");
const userService = require("../Services/user.service");
const Otp = require("../utlis/OtpFunction");
const EmailSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails");
const {userFinder} = require("../utlis/UserFinder");
const bloodRequestModel = require("../Models/Recivent-Model");
const jwt = require("jsonwebtoken");
const dbgr = require("debug")("development:dev");

module.exports.registerUser = async (req, res) => {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password, name, dob} = req.body;
    const userExists = await userFinder({key: "email", query: email});
    if(userExists){
        delete userExists._doc?.password;
        return res.status(400).redirect("/users/login");
    }
    const hashedPassword = await userModel.hashPassword(password);
    const otp = Otp.OtpGenerator();
    const user = await userService.createUser({
      name: name,
      email:email,
      dob: dob,
      password: hashedPassword,
      otp: otp,
      otpExpiry: new Date(Date.now() + 60 * 1000),
    });
    const token = user.GenerateToken();
    res.cookie("UserToken", token);
    await EmailSender.sendEmail({
      email: user.email,
      sub: "OTP Verification 📫",
      mess: emailTemplate.registerEmail(otp),
    });
    await user.save();
    return res.status(201).redirect(`/users/otp-varification/${user._id}`);
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Something went wrong"});
  }
}

module.exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email , password } = req.body;

    const user = await userFinder({ key: "email", query: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.ComparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "not match!" });
    }

    let userToken = user.GenerateToken();
    res.cookie("userToken", userToken);

    let otp = Otp.OtpGenerator();
    
    delete user._doc.password;
    delete user._doc.__v;
    
    if (user.googleId) {
      await EmailSender.sendEmail({ // Corrected EmailSender
        email: user.email,
        sub: "OTP Verification 📫",
        mess: emailTemplate.loginEmail(otp),
      });
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 60 * 1000);
      await user.save();
      return res.redirect(`/users/otp-varification/${user._id}`);
    } else {
      await EmailSender.sendEmail({ // Corrected EmailSender
        email: user.email,
        sub: "OTP Verification 📫",
        mess: emailTemplate.loginEmail(otp),
      });
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 60 * 1000);
      await user.save();
      return res.redirect(`/users/otp-varification/${user._id}`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.uploadProfilePic = async (req, res) => {
  try{
      if(!req.file) return res.status(400).json({message: "Please upload a file"});
      const { email } = req.body;
      const user = await userFinder({ key: "email", query: email });
      delete user._doc.password;
      if(!user) return res.status(404).json({message: "User not found"});
        user.profilepic = req.file.buffer.toString("base64");
        await user.save();
      return res.status(200).redirect("/users/profile");
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Something went wrong"});
  }
};

module.exports.otpVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { otp } = req.body;
    const { id } = req.params;
    const user = await userFinder({key: "_id", query: id});
    if (!user) return res.status(404).json({ message: "User not found" });
    delete user._doc?.password;
    if (!user.otp) return res.status(400).json({ message: "OTP not found" });
    if (!user.otpExpiry)
      return res.status(400).json({ message: "OTP expiry not found" });
    if (user.otp != otp)
      return res.status(401).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now())
      return res.status(401).json({ message: "OTP Expired" });
    user.otp = null;
    user.otpExpiry = null;
    user.verified = true;
    await user.save();
    await EmailSender.sendEmail({
      email: user.email,
      sub: "WellCome Note!",
      mess: emailTemplate.welcomeEmail(),
    });
    return res.status(200).redirect("/users/profile");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.ResendOtp = async (req, res) => {
  try {
    const Newotp = OtpGenerator();
    const user = await userFinder({ key: "_id", query: req.params.id })
    console.log(user);
    delete user._doc.password;
      await EmailSender.sendEmail({
        email: user.email,
        sub: "Re-send OTP Verification 🫡",
        mess: emailTemplate.ReSendOtp(Newotp),
        });
      user.otp = Newotp;
      user.otpExpiry = Date.now() + 60 * 1000;
      await user.save();
      return res.status(200).redirect(`/users/otp-varification/${user._id}`);
      } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.DeletePost = async ( req,res ) => {
  try{
    const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
    if(!token) return res.redirect("/users/login");
    const {id} = req.body;
    await bloodRequestModel.findOneAndDelete({_id: id})
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userFinder({key: "email", query: decoded.email})
    if(user.bloodRequest.includes(id)) user.bloodRequest.pop(id);
    if (user.Donate.includes(id)) user.Donate.pop(id);
    await user.save();
    res.status(201).redirect("/users/profile")
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Something went wrong"});
  }
};

module.exports.GetProfile = async ( req,res ) => {
  try {
    if (!req.user || !req.user.email)
      return res.status(401).send("Unauthorized access");
    const user = await userFinder({ key: "email", query: req.user.email });
    const posts = await userModel
      .findOne({ email: req.user.email })
      .populate({
        path: "bloodRequest",
        model: "recipient",
        select: "-password -__v",
      })
      .sort({ date: -1 })
      .lean();
    const pendingPosts = posts.bloodRequest.filter((post) => {
      return post.status == "pending" || post.status == "Accepted";
    });
    const Donates = await userModel
      .findOne({ email: req.user.email })
      .populate({
        path: "Donate",
        model: "recipient",
        select: "-password -__v",
      })
      .sort({ date: -1 })
      .lean();
    const DonatePosts = Donates.Donate.filter((post) => {
      return post.status == "Accepted";
    });
    if (!user) return res.status(404).send("User not found");
    res.render("Profile", {
      user,
      profilepic: user.profilepic || null,
      pendingPosts,
      DonatePosts
    });
  } catch (err) {
    res.redirect("/:anithing");
  }
};

module.exports.IdWithOtpPage = async ( req,res ) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.render("Otp", { user: user });
  } catch (err) {
    res.redirect("/:anithing");
  }
}

module.exports.loginPage = (req, res) => {
  try {
    res.render("Login", { error: req.flash("error") });
  } catch (err) {
    res.redirect("/:anithing");
  }
};

module.exports.registerPage = (req, res) => {
  try {
    res.render("Register");
  } catch (err) {
    res.redirect("/:anithing");
  }
};

module.exports.logOutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/users/profile");
    }
    req.session.destroy();
    res.clearCookie("userToken");
    res.redirect("/users/login");
  });
};

module.exports.AddBloodGroup = async ( req,res )=>{
  try{
    const { blood_Name } = req.body;
    const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: "Unauthorized access"});
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userFinder({key: "email", query: decoded.email})
    user.bloodgroup = blood_Name;
    await user.save();
    res.status(200).redirect("/users/profile")
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Something went wrong"});
  }
};

module.exports.frogerPassword = (req,res) =>{
  try{
    res.status(200).render("AskEmail", { error: req.flash("error") });
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Something went wrong"});
  }
};

module.exports.SendOtp = async (req,res) => {
  try{
    const { email } = req.body;
    const user = await userFinder({ key: "email", query: email });
    if(user === null) {
      req.flash("error", "Accout Not Found")  
      res.status(404).redirect("/users/changePassword");
    }
    const otp = Otp.OtpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 60 * 1000;
    await user.save();
    const name = user.name;
    await EmailSender.sendEmail({
      email: user.email,
      sub: "📧 Password Reset Request - OTP Verification",
      mess: emailTemplate.ForgetPassword({ name, otp })
    });
    res.status(200).redirect(`/users/otpCenter/${user._id}`);
  }
  catch(error){
    console.error(error);
    res.json({messge: "Something went wrong"});
  }
};

module.exports.OtpCenter = async (req, res) => {
  try{
    const {id} = req.params;
    const user = await userFinder({key: "_id", query: id});
    res.status(200).render("OtpCenter",{user});
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Something went wrong"});
  }
}

module.exports.OtpCenterVerification = async (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { otp } = req.body;
    const { id } = req.params;
    const user = await userFinder({key: "_id", query: id});
    if (!user) return res.status(404).json({ message: "User not found" });
    delete user._doc?.password;
    if (!user.otp) return res.status(400).json({ message: "OTP not found" });
    if (!user.otpExpiry) return res.status(400).json({ message: "OTP expiry not found" });
    if (user.otp != otp) return res.status(401).json({ message: "Invalid OTP" });
    if (user.otpExpiry < Date.now()) return res.status(401).json({ message: "OTP Expired" });
    res.status(200).redirect(`/users/reEnterPassword/${id}`);
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Something went wrong"});
  }
}

module.exports.ReEnterPasswordPage = async (req, res)=>{
  try{
    const { id } = req.params;
    res.render("EnterPassword",{error:  req.flash("error"), id});
  }catch(error){
    console.error(error);
    res.status(500).json({message: "Something went wrong"});
  }
}

module.exports.rePassword = async (req,res)=>{
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { updatedpassword } = req.body;
    const { id } = req.params;
    const user = await userFinder({key: "_id", query: id});
    if (!user) return res.status(404).json({ message: "User not found" });
    dbgr("User Details",user);
    const hashedPassword = await userModel.hashPassword(updatedpassword);
    dbgr("Hashed Password",hashedPassword);
    user.password = hashedPassword;
    await user.save();
    console.log("password Changed");
    req.flash("success", "Password Updated Successfully");
    res.redirect("/users/login");
  }catch(error){
    console.error(error);
    req.flash("error", "Something went wrong");
    res.redirect("/users/reEnterPassword");
  }
}