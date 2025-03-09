const app = require("./app");
const { Server } = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("./Models/User-Model");
const passport = require("passport");
const { OtpGenerator } = require("./utlis/OtpFunction");
const EmailSender = require("./utlis/EmailSender");
const {registerEmail} = require("./Email_Template/Emails");

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try{
          let user = await userModel.findOne({ googleId: profile.id });
          if (!user) {
          const randomPassword = "password";
          const hashedPassword = await userModel.hashPassword(randomPassword);
          const otp = OtpGenerator();
            user = new userModel({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              verified: true,
              password: hashedPassword,
              otp: otp,
              otpExpiry: new Date(Date.now() + 60 * 1000), // 1 minute
            });
            const emailMessage = registerEmail(otp);
            await EmailSender.sendEmail({
              email: profile.emails[0].value,
              sub: "OTP Verification",
              mess: emailMessage
            })
              .then(() => {
                console.log("Email sent successfully");
              })
              .catch((err) => console.error(err));
            await user.save();
          }
        return done(null, user);
      }
      catch (error) {
        return done(error, null);
      }
      }
    )
  );
  
  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

io.use((socket, next) => {
    try{
        const  token = socket.handshake.auth?.userToken || socket.handshake.headers?.authorization?.split(" ")[1];

        if(!token) return next(new Error("Authentication error"));
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if(!decoded) return next(new Error("Authentication error"));

        socket.user = decoded;

        next();
    }catch(error){
        console.error(error);
        return next(new Error("Authentication error"));
    }
  });

const port = process.env.PORT || 4000;

io.on("connection", (socket)=>{
    console.log("a user connected");
    socket.on("disconnect", ()=>{
        console.log("user disconnected");
    });
});

server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});