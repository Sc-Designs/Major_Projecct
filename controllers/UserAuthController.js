const userModel = require("../Models/User-Model");
const {validationResult} = require("express-validator");
const userService = require("../Services/user.service");
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
module.exports.loginUser = async (req, res)=>{  
    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password} = req.body;
        const user = await userModel.findOne({email}).select('+password');
        const isMatch = await user.ComparePassword(password);
        let userToken;
        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }
        if(user.googleId){
            delete user._doc._id;
            delete user._doc.__v;
            Object.freeze(user);
            userToken = user.GenerateToken();
            return res.status(200).json({message: "Login successful", token: userToken, user});
        }
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }
        if(isMatch){
        delete user._doc.password;
        delete user._doc._id;
        delete user._doc.__v;
        Object.freeze(user);
        userToken = user.GenerateToken();
        return res.status(200).json({message: "Login successful", token: userToken, user});
        }
        
    }catch(err){
        console.error(err);
        return res.status(500).json({message: "Something went wrong"});
    }
    
}