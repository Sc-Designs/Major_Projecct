module.exports.OtpGenerator = ()=>{
    return Math.trunc(Math.random() * Number(process.env.Multiplier) + Number(process.env.Adder));
};