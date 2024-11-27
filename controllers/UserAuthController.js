const userModel = require("../Models/User-Model");
const {validationResult} = require("express-validator");
const userService = require("../Services/user.service");

module.exports.registerUser = async (req, res, next)=>{
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