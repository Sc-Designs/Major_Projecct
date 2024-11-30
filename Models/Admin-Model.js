const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "Name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minlength: [3, "Name must be at least 3 characters long"],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: [5, "Email must be at least 5 characters long"],
    },
    password: {
        type: String,
        required: true,
        minlength: [5, "Password must be at least 5 characters long"],
        selected: false
    },
    profileImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photo",
        default: null
    },
    GSTN: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        unique: true,
        min: [1000000000, "Phone number is not valid!"],
        max: [9999999999, "Phone number is not valid!"]
    },
    gender: {
        type: String,
        default: null,
        selected: false
    },
    age: {
        type: Number,
        default: null,
        selected: false
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    otpCode: {
        type: String,
        default: null
    }
});

adminSchema.methods.GenerateToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
};

adminSchema.methods.ComparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

adminSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const adminModel = mongoose.model("admin", adminSchema);

module.exports = adminModel;