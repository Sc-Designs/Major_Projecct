// Import Modules
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();
const adminModel = require("./Models/Admin-Model");

logger.token("time", () => {
  return new Date().toLocaleString(); 
});

app.use(logger(":time :method :url :status"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages Setup
app.use(flash());
app.use((req, res, next) => {
  res.locals.error_msg = req.flash("error");
  res.locals.success_msg = req.flash("success");
  next();
});

// Public Files Setup
app.use(express.static(path.join(__dirname, "public")));

// Import Routes
const adminRouter = require("./routes/admin.router");
const bloodRouter = require("./routes/blood.router");
const donarRouter = require("./routes/donar.router");
const indexRouter = require("./routes/index.router");
const usersRouter = require("./routes/users.router");
const googleAuthenticatorRouter = require("./routes/googleAuthenticator.router");
const miantanRouter = require("./routes/maintainers.router");

// Import Database Connection
const connectWithRetry = require("./config/mongoose-connection");
connectWithRetry();


// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// API Routes
app.use(process.env.ADMIN || "/admin", adminRouter);

app.use(async (req, res, next) => {
  const admin = await adminModel.findOne({});
  if(!admin){
    req.flash("error", "Admin account not found.");
    res.redirect("/admin/login");
    return;
  }
  if(admin.serverOnOff === true){
    res.render("Maintanence");
  } else {
    next();
  }
})

app.use(process.env.INDEX || "/", indexRouter);
app.use(process.env.USER || "/users", usersRouter);
app.use(process.env.RECIVER || "/reciver", bloodRouter);
app.use(process.env.DONAR || "/donar", donarRouter);
app.use(process.env.GOOGLE_AUTHENTICATOR || "/google-oth", googleAuthenticatorRouter);
app.use(process.env.MAINTAINERES || "/maintainers", miantanRouter);

// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(err.status || 500).json({ error: err.message });
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
