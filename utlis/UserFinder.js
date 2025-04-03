const userModel = require("../Models/User-Model");

module.exports.userFinder = async ({ key, query }) => {
  try {
    const user = await userModel
      .findOne({ [key]: query })
      .select("+password")
      
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    console.error("Error in userFinder:", err);
    return null;
  }
};
