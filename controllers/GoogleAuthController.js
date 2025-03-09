const userModel = require("../Models/User-Model");
const EmailSender = require("../utlis/EmailSender"); // Corrected import statement
const emailTemplate = require("../Email_Template/Emails");
const { OtpGenerator } = require("../utlis/OtpFunction");

module.exports.tokenSender = async (req, res)=>{
    try{
        let user = req.user;
        if(!user) return res.status(401).send({ message: "Unauthorized" });
        const userinfo = await userModel.findOne({email: user.email});
        if(!userinfo) return res.status(404).send({ message: "User not found" });
        delete userinfo._doc.password;
        const userToken = userinfo.GenerateToken();
        res.cookie("userToken", userToken);
        const otp = OtpGenerator();
        await EmailSender.sendEmail({ // Corrected EmailSender
            email: user.email,
            sub:"Login OTP",
            mess: emailTemplate.loginEmail(otp)
        });
        res.redirect(`/users/otp-varification/${userinfo._id}`);
    }catch(err){
        res.status(500).send(err.message)
    }
}