// Basic Lib Imports
const nodeMailer = require("nodemailer");

// Send email for reset password
const sendRestPasswordEmail = async (full_name, email, token) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<p>Hi, ${full_name}, We have received a password change request for your account ${email}, please click this link blow to change it
      <a href="http://localhost:8000/api/users/reset-password?token=${token}">Reset password</a> 
        
        if you did not ask to change your password. then you can ignore this email and your password will not be changed. </p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error ${error}`);
      } else {
        console.log(`Mail has been send ${info.response}`);
      }
    });
  } catch (error) {
    res.status(400);
    throw new Error("Somethings wents wrong!");
  }
};

module.exports = { sendRestPasswordEmail };
