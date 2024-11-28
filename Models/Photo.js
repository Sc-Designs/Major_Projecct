const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
    image: {
        data: Buffer,   
        contentType: String
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "profileType"
    },
    profileType: {
        type: String,
        enum: ["user", "admin"],
        required: true,
        validate: {
            validator: function(value) {
                return ["user", "admin"].includes(value);
            },
            message: '{VALUE} is not supported'
        }
    }
});

const photoModel = mongoose.model("photo", photoSchema);

module.exports = photoModel;