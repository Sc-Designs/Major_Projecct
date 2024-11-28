const mongoose = require("mongoose");

const reciventSchema = new mongoose.Schema({

});

const reciventModel = mongoose.model("recivent", reciventSchema);

module.exports = reciventModel;