///////////////////////////////////THIS IS MAIN FILE IT RUN THE FULL WEBSITE///////////////////////////

// Import the HTTP ERROR
var createError = require("http-errors");

// Import the Express
var express = require("express");

// Import the Path
var path = require("path");

// Import the Cookie_Parser
var cookieParser = require("cookie-parser");

// Import the Morgan Module
var logger = require("morgan");

// Import the Express_Session
var session = require("express-session");

// Import the flash module
const flash = require("connect-flash");

// Import the HTTP module
const http = require("http");

// Import the Body_Parser module
var bodyParser = require("body-parser");

// require the dotenv module and config it
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// Create a server
const Server = http.createServer(app);

// Include the MongoDB connection
require("./config/mongoose-connection.js");

// Import APIS
var adminRouter = require("./routes/adminRouter.js");
var bloodRouter = require("./routes/bloodRouter.js");
var donarRouter = require("./routes/donarRouter.js");
var indexRouter = require("./routes/indexRouter.js");
var usersRouter = require("./routes/userRouter.js");


// Middleware setup
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);

// Public files Setup
app.use(express.static(path.join(__dirname, "public")));

// Flash Setup
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// API Calling Setup
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/reciver", bloodRouter);
app.use("/donar", donarRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Server Listener
Server.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Export the App file to the Node.JS
module.exports = app;