const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    fullname: {
      firstname:{
            type: String,
            required: true,
            minlength: [3, "Name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minlength: [3, "Name must be at least 3 characters long"],
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [5, "Password must be at least 5 characters long"],
        selected: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: [5, "Email must be at least 5 characters long"],
    },
    phone: {
        type: Number,
        unique: true,
        minlength: [10, "Phone number is not valid!"],
        maxlength: [10, "Phone number is not valid!"]
    },
    address: {
        type: String,
        selected: false,
        minlength: [5, "Address must be at least 5 characters long"],
    },
    otp: {
        type:Number,
        default: null
    },
    profilepic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photo",
        default: null
    },
    varified: {
        type: Boolean,
        default: false
    },
    socketId:{
        type: String,
        default: null
    },
    emergencycontact: {
        name: {
            type: String,
            default: null,
            minlength: [3, "Name must be at least 3 characters long"],
        },
        number: {
            type: Number,
            default: null,
            minlength: [10, "Phone number is not valid!"],
            maxlength: [10, "Phone number is not valid!"]
        }
    },
    bloodgroup: {
        type: String,
        default: null
    },
    dateOfBirth: {
        type: Date,
        default: null,
        selected: false
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
    weight: {
        type: Number,
        default: null,
        selected: false
    },
    height: {
        type: Number,
        default: null,
        selected: false
    },
    addhar_No: {
        type: Number,
        default: null,
        selected: false,
        minlength: [12, "Addhar number is not valid!"],
        maxlength: [12, "Addhar number is not valid!"]
    },
    cardType: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "card"
    },
    card: {
        type: String,
        enum: ["recivent", "Donar"],
        required: true,
        validate: {
            validator: function (value) {
                return ["recivent", "Donar"].includes(value);
            },
            message: '{VALUE} is not supported'
        }
    }
});

userSchema.methods.GenerateToken = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_KEY);
}

userSchema.methods.ComparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;