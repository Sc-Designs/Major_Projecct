const jwt = require("jsonwebtoken");
const userModel = require("../Models/User-Model");

module.exports = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        }

        const token = req.cookies.userToken || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).redirect("/users/login");
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            res.clearCookie("userToken");
            return res.status(401).redirect("/users/login");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication Error:", err);
        res.clearCookie("userToken");
        return res.status(401).redirect("/users/login");
    }
};
