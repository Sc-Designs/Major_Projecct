const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.HOSTER_CLR,
  port: +process.env.PORT_CLR,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 10000, // 10 seconds
});


module.exports.sendEmail = async ({ email, sub, mess }) => {
    try {
      return await transporter.sendMail({
        from: process.env.SENDER_CLR,
        to: email,
        subject: sub,
        html: mess,
      });
    } catch (error) {
      console.error("Error sending email: ", error.message);
    }
};