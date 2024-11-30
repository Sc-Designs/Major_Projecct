const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: {
            type: String, // MIME type of the image (e.g., image/jpeg, image/png)
            required: true,
            validate: {
                validator: function (value) {
                    return ["image/jpeg", "image/png", "image/gif"].includes(value);
                },
                message: "{VALUE} is not a supported image format",
            },
        },
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "profileType",
        required: true,
        index: true,
    },
    profileType: {
        type: String,
        enum: ["user", "admin"],
        required: true,
        validate: {
            validator: function (value) {
                return ["user", "admin"].includes(value);
            },
            message: "{VALUE} is not supported",
        },
    },
});

const photoModel = mongoose.model("photo", photoSchema);

module.exports = photoModel;
