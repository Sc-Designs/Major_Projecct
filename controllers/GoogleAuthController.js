const userModel = require("../Models/User-Model");
const EmaliSender = require("../utlis/EmailSender");
const emailTemplate = require("../Email_Template/Emails")
module.exports.tokenSender = async (req, res)=>{
    try{
        let user = req.user;
        if(!user) return res.status(401).send({ message: "Unauthorized" });
        const userinfo = await userModel.findOne({email: user.email});
        if(!userinfo) return res.status(404).send({ message: "User not found" });
        const userToken = userinfo.GenerateToken();
        res.cookie("userToken", userToken);
        EmaliSender.sendEmail({
            email: user.email,
            sub:"Welcome Note",
            mess: emailTemplate.welcomeEmail()
        })
        res.redirect("/users/profile");
    }catch(err){
        res.status(500).send(err.message)
    }
}