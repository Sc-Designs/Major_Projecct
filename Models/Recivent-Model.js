const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bloodType: {
    type: String,
    required: true,
    default: null,
  },
  bloodReceived: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "pending",
  },
});

const bloodRequestModel = mongoose.model("recipient", recipientSchema);

module.exports = bloodRequestModel;