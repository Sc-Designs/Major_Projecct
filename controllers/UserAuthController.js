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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({message: "Invalid email or password"});
    }

    const isMatch = await user.ComparePassword(password);
    if(!isMatch){
        return res.status(401).json({message: "Invalid email or password"});
    }

    const token = user.GenerateToken();

    return res.status(200).json({message: "Login successful", token, user});
    
}