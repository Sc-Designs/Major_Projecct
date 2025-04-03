const EmailSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails");
const { OtpGenerator } = require("../utlis/OtpFunction");
const { userFinder } = require("../utlis/UserFinder");

module.exports.tokenSender = async (req, res)=>{
    try{
        let user = req.user;
        if(!user) return res.status(401).send({ message: "Unauthorized" });
        const userinfo = await userFinder({ key: "email", query: user.email });
        if(!userinfo) return res.status(404).send({ message: "User not found" });
        delete userinfo._doc.password;
        const userToken = userinfo.GenerateToken();
        res.cookie("userToken", userToken);
        const otp = OtpGenerator();
        userinfo.otp = otp;
        userinfo.otpExpiry = new Date(Date.now() + 60 * 1000);
        await EmailSender.sendEmail({
            email: user.email,
            sub:"Login OTP 🛅",
            mess: emailTemplate.loginEmail(otp)
        });
        await userinfo.save();
        res.redirect(`/users/otp-varification/${userinfo._id}`);
    }catch(err){
        res.status(500).send(err.message)
    }
}