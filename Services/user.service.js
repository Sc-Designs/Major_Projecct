const userModel = require("../Models/User-Model");
module.exports.createUser = async ({
  email,
  password,
  name,
  address,
  gender,
  googleId,
  verified,
  otp,
  otpExpiry,
}) => {
  if (!email || !password || !name) {
    throw new Error("All fields are required!");
  }
  const user = await userModel.create({
    email,
    password,
    name,
    address,
    gender,
    googleId,
    verified,
    otp,
    otpExpiry,
  });
  return user;
};
