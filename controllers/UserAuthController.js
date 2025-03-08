const userModel = require("../Models/User-Model");
const {validationResult} = require("express-validator");
const userService = require("../Services/user.service");
const {OtpGenerator} = require("../utlis/OtpFunction");
const EmaliSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails");

module.exports.registerUser = async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password, fullname, phone, address, gender} = req.body;
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
        email,
        password: hashedPassword,
        fullname,
        phone,
        address,
        gender
    });
    const token = user.GenerateToken();
    return res.status(201).json({message: "User created successfully", token , user});
}

module.exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userModel.findOne({email : req.body.email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.ComparePassword(req.body.password);

    if (!isMatch) {
      return res.status(401).json({ message: "not match!" });
    }

    let userToken = user.GenerateToken();
    res.cookie("UserToken", userToken);

    const otp = OtpGenerator();
    EmaliSender.sendEmail({
      email: user.email,
      sub: "OTP Verification",
      mess: emailTemplate.loginEmail(otp),
    });

    if (user.googleId) {
        delete user._doc.password;
        delete user._doc.__v;
        Object.freeze(user);
        return res.redirect(`/users/otp-varification/${user._id}`); // Ensure return here
    }
    delete user._doc.password;
    delete user._doc.__v;
    Object.freeze(user);
    return res.redirect(`/users/otp-varification/${user._id}`); // Ensure return here
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.ResendOtp = (req, res)=>{
    try{
        const otp = OtpGenerator();


    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Something went wrong"});
    }
}

module.exports.uploadProfilePic = async (req, res) => {
  try{
      if(!req.file) return res.status(400).json({message: "Please upload a file"});
      const { email } = req.body;
      let user = await userModel.findOne({email: email});
      if(!user) return res.status(404).json({message: "User not found"});
        user.profilepic = req.file.buffer.toString("base64");
        await user.save();
      return res.status(200).redirect("/users/profile");
  }catch(err){
    console.error(err);
    return res.status(500).json({message: "Something went wrong"});
  }
};