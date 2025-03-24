const app = require("./app");
const http = require("http");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("./Models/User-Model");
const passport = require("passport");
const { OtpGenerator } = require("./utlis/OtpFunction");
const EmailSender = require("./utlis/EmailSender");
const { registerEmail } = require("./Email_Template/Emails");
const {createUser} = require("./Services/user.service");
const bloodRequestModel = require("./Models/Recivent-Model");
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4000", // Update with your frontend URL
    methods: ["GET", "POST"],
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
      try {
        let user = await userModel.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });
        if (!user) {
          const randomPassword = "password";
          const hashedPassword = await userModel.hashPassword(randomPassword);
          const otp = OtpGenerator();
          user = await createUser({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            verified: true,
            password: hashedPassword,
            otp: otp,
            otpExpiry: new Date(Date.now() + 60 * 1000),
          });
          const emailMessage = registerEmail(otp);
          await EmailSender.sendEmail({
            email: profile.emails[0].value,
            sub: "OTP Verification",
            mess: emailMessage,
          })
            .then(() => {
              console.log("Email sent successfully");
            })
            .catch((err) => console.error(err));
        }
        return done(null, user);
      } catch (error) {
        console.error(error);
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
function extractTokenFromCookies(cookieString) {
  if (!cookieString) return null;

  const cookies = Object.fromEntries(
    cookieString.split("; ").map((c) => c.split("="))
  );

  return cookies.userToken || null;
}
io.use( async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.userToken ||
      socket.handshake.headers?.authorization?.split(" ")[1] ||
      extractTokenFromCookies(socket.handshake.headers?.cookie);
    if (!token) return next(new Error("Authentication error"));
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) return next(new Error("Authentication error"));

    socket.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return next(new Error("Authentication error"));
  }
});
io.on("connection", (socket) => {
  
  socket.on("connect",()=>{
    console.log("User connected", socket.id);
  })
  socket.on("project-id", async ({ projectId }) => {
    let projectDets = await bloodRequestModel.findOne({ _id: projectId });
    if (projectDets) {
      socket.roomId = projectDets._id.toString();
      socket.join(socket.roomId);

      socket.emit("room-joined", { roomId: socket.roomId });

      socket.on("user-location", (data) => {
        if(data) socket.emit("received-location",{location: {...data},id: socket.id});
      });
      socket.on("disconnect", () => {
        socket.leave(socket.roomId);
        console.log("User disconnected", socket.id);
        socket.emit("disconnected-user",{id: socket.id});
      });

    } else {
      console.log("Invalid project ID");
    }
  });

});
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
