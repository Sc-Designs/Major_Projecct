const jwt = require("jsonwebtoken");
const adminModel = require("../Models/Admin-Model");
module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(404).redirect("/admin/login");
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        Object.freeze(decoded);
        const admin = await adminModel.findOne({email: decoded.email});
        if (!admin) {
            res.clearCookie("adminToken");
            return res.status(404).redirect("/admin/login");
        }
        req.admin = admin;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).redirect("/admin/login");
    }
}