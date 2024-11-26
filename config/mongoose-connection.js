//////////////////////////////////////////IMPORT THE REQIREMENT////////////////////////////////////////

// Import the Mongoose
const mongoose = require("mongoose");

// Import The Config Module
const config = require("config");

// Custom Mongoose Link
const link = `${config.get("MONGODB_URI")}/BloodWeb`;

// Import The Debug Module and set it for only development Environment
const dbgr = require("debug")("development:mongoose");

// Mongoose Connection_Retry
const connectWithRetry = () => {
  mongoose
    .connect(link, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
    })
    .then(function () {
      dbgr("connect");
    })
    .catch(function (err) {
      dbgr(err);
      setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
    });
};

// Call the Connection_retry function
connectWithRetry();

// Connect Debug Message
mongoose.connection.on("connected", () => {
  dbgr("Mongoose connected to MongoDB");
});

// Error Debug Message
mongoose.connection.on("error", (err) => {
  dbgr("Mongoose connection error:", err);
});

// Disconnect Debug Message
mongoose.connection.on("disconnected", () => {
  dbgr("Mongoose disconnected from MongoDB");
});

// Ensure the connection is established before performing database operations
mongoose.connection.once("open", () => {
  dbgr("Mongoose connection open");
});

// Export the Mongoose Connection
module.exports = mongoose.connection;

///////////////////////////////////////////////////END/////////////////////////////////////////////////
