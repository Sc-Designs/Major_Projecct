const mongoose = require("mongoose");

const donarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  proof: {
    addhar_No: {
      type: Number,
      default: null,
      select: false,
      min: [100000000000, "Addhar number is not valid!"],
      max: [999999999999, "Addhar number is not valid!"],
    },
    pan_No: {
      type: String,
      default: null,
      select: false,
      min: [10000, "Pan number is not valid!"],
      max: [99999, "Pan number is not valid!"],
    },
  },
  bloodDonated: {    
    type: Number,
    default: 0,
  },
});

const donarModel = mongoose.model("donar", donarSchema);

module.exports = donarModel;