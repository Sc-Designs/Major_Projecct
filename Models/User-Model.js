const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    password: {
      type: String,
      minlength: [5, "Password must be at least 5 characters long"],
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: [5, "Email must be at least 5 characters long"],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    address: {
      type: String,
      select: false,
      minlength: [5, "Address must be at least 5 characters long"],
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    profilepic: {
      type: Buffer,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: null,
    },
    emergencycontact: {
      number: {
        type: String,
        default: null,
        validate: {
          validator: function (v) {
            return !v || /^[0-9]{10}$/.test(v); // ✅ Allows empty values or valid 10-digit numbers
          },
          message: "Phone number is not valid!",
        },
        required: false, // ✅ Make it optional
      },
    },
    bloodgroup: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
      select: false,
    },
    gender: {
      type: String,
      default: null,
      select: false,
    },
    age: {
      type: Number,
      default: null,
      select: false,
    },
    weight: {
      type: Number,
      default: null,
      select: false,
    },
    height: {
      type: Number,
      default: null,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    bloodRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipient",
      },
    ],
    Donate:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipient",
  }]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, +process.env.SALT_NUMBER);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Generate JWT Token with expiration
userSchema.methods.GenerateToken = function () {
    return jwt.sign(
        { 
            email: this.email 
        }, 
        process.env.JWT_KEY, {
            expiresIn: process.env.EXPIRE_DATE,
        });
};

// Compare Password Safely
userSchema.methods.ComparePassword = async function (password) {
    if(!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

// Static Method to Hash Password
userSchema.statics.hashPassword = async function (password) {
    console.log(password);
    return await bcrypt.hash(password, +process.env.SALT_NUMBER);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
