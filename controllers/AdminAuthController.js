const adminModel = require("../Models/Admin-Model");
const adminService = require("../Services/admin.service");
const {validationResult} = require("express-validator");
const bloodbloodRequestModel  = require("../Models/Recivent-Model");
const userModel = require("../Models/User-Model");
const jwt = require("jsonwebtoken");
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
        let allRequests = await bloodbloodRequestModel.find();
        let numberofRequests = allRequests.length;
        let users = await userModel.find();
        let usersCount = users.length;
        res.status(302).render("adminProfile", {
          admin: admin,
          numberofRequests,
          usersCount,
          profilepic: admin.profileImage || null,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).redirect('/admin/login');
    }   
}

module.exports.serverOnOffSettings = async (req, res) => {
    try {
        let token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
        return res.status(401).redirect("/admin/login");
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const Admin = await adminModel.findOne({ email: decoded.email });
        if (!Admin) {
        return res.status(404).send("Admin not found.");
        }
        console.log("Admin server", Admin.serverOnOff);
        Admin.serverOnOff = !Admin.serverOnOff;
        await Admin.save();
        res.status(200).redirect("/admin/admin-profile");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).redirect("/anithing"); 
    }
};

module.exports.adminLogOut = (req, res) => {
  try {
    res.clearCookie("adminToken");
    res.status(200).redirect("/admin/login");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/admin/admin-profile");
  }
};

module.exports.uploadProfilePic = async (req,res) => {
    try{
         if(!req.file) return res.status(400).json({message: "Please upload a file"});
              const { email } = req.body;
              const admin = await adminModel.findOne({ email: email });
              if(!admin) return res.status(404).json({message: "User not found"});
                admin.profileImage = req.file.buffer.toString("base64");
                await admin.save();
              return res.status(200).redirect("/admin/admin-profile");
    }catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
};

module.exports.adminAllUsers = (req,res) => {
    try{
        res.status(302).render("AllUsers");
    }catch(error){
        console.error(error);
        res.status(500).send('Server error');
    }
};

module.exports.AllUser = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); // Exclude passwords

    const filterData = users.map((user) => {
      let profilepic = null;
      if (user.profilepic) {
        profilepic = `data:image/jpeg;base64,${user.profilepic}`;
      }
      return {
        email: user.email,
        name: user.name,
        profilepic,
        id: user._id
      };
    });

    res.status(200).json(filterData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};