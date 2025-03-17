const bloodRequestModel = require("../Models/Recivent-Model");

module.exports.createBloodRequest = async ({userId, bloodType }) => {
  try {
    if(!bloodType) throw new Error("The field are required!");
     const newBloodRequest = await bloodRequestModel.create({
       userId,
       bloodType
     });
     return newBloodRequest;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating blood request");
  }
};