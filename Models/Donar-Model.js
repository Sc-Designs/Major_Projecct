const mongoose = require("mongoose");

const donarSchema = new mongoose.Schema({

});

const donarModel = mongoose.model("donar", donarSchema);

module.exports = donarModel;