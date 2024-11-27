const userModel = require("../Models/User-Model");

module.exports.createUser = async ({
    email,
    password,
    fullname: { firstname, lastname },
    phone,
    address,
    gender
})=> {
        if(!email || !password || !firstname || !phone || !address || !gender){
            throw new Error("All fields are required!");
        }

        const user = await userModel.create({
            email,
            password,
            fullname: { firstname, lastname },
            phone,
            address,
            gender
        });

        return user;
    
}
