const userModel = require("../Models/User-Model");
const {validationResult} = require("express-validator");
const userService = require("../Services/user.service");
const Otp = require("../utlis/OtpFunction");
const EmailSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails");
const {userFinder} = require("../utlis/UserFinder");

module.exports.registerUser = async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password, name, dob} = req.body;
    const userExists = await userFinder({key: "email", query: email});
    delete userExists._doc.password;
    if(userExists){
        return res.status(400).redirect("/users/login");
    }
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
      name,
      email,
      dob,
      password: hashedPassword,
    });
    const token = user.GenerateToken();
    res.cookie("UserToken", token);
    return res.status(201).redirect(`/users/otp-varification/${user._id}`);
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
    res.cookie("UserToken", userToken);

    let otp = Otp.OtpGenerator();
    console.log(Otp.OtpGenerator());
    
    delete user._doc.password;
    delete user._doc.__v;
    
    if (user.googleId) {
      await EmailSender.sendEmail({ // Corrected EmailSender
        email: user.email,
        sub: "OTP Verification",
        mess: emailTemplate.loginEmail(otp),
      });
      return res.redirect(`/users/otp-varification/${user._id}`);
    } else {
      await EmailSender.sendEmail({ // Corrected EmailSender
        email: user.email,
        sub: "OTP Verification",
        mess: emailTemplate.loginEmail(otp),
      });
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
    const user = await userModel.findOne({_id: id});
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
    delete user._doc.password;
      await EmailSender.sendEmail({
        email: user.email,
        sub: "Re-send OTP Verification",
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