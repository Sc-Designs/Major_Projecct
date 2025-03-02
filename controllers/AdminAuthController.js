const adminModel = require("../Models/Admin-Model");
const adminService = require("../Services/admin.service");
const {validationResult} = require("express-validator");
module.exports.adminRegister = async( req, res ) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const adminNumber = await adminModel.find();
        if(adminNumber.length >= 1) return res.status(406).send('Admin already exists');
        const {fullname, email, password} = req.body;
        const hashedPassword = await adminModel.hashPassword(password);
        const admin = await adminService.createAdmin({
            fullname,
            email,
            password: hashedPassword
        });
        const token = admin.GenerateToken();
        delete admin._doc.password;
        res.status(201).send({admin, token});
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
}
module.exports.adminLogin = async( req, res ) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const {email, password} = req.body;
        const admin = await adminModel.findOne({email});
        if(!admin) return res.status(401).send('Invalid email or password');
        const isMatch = await admin.ComparePassword(password);
        if(!isMatch) return res.status(401).send('Invalid email or password');
        const token = admin.GenerateToken();
        delete admin._doc.password;
        Object.freeze(admin);
        res.cookie('adminToken', token);
        res.status(200).redirect('/admin/admin-profile');
    }
    catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }   
}
module.exports.adminProfile = async( req, res ) => {
    try{
        const admin = await adminModel.findOne({email : req.admin.email});
        delete admin._doc.password;
        if(!admin) return res.status(401).send('Unauthorized');
        Object.freeze(admin);
        res.status(302).render('adminProfile', {admin : admin});
    }
    catch(err){
        console.error(err);
        res.status(500).redirect('/admin/login');
    }   
}