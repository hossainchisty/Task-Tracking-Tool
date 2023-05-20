// Basic Lib Imports
const nodeMailer = require("nodemailer");

const sendResetPasswordEmail = async (email, token) => {
  try {
    const resetLink = `http://example.com/reset-password?token=${token}`;
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
      from: "your_email@example.com", // Replace with your email address
      to: email,
      subject: "Reset Password",
      html: `You can reset your password by clicking on the following link: <a href="${resetLink}">${resetLink}</a><br/><br/>Best regards,<br/>Team Task Tracking Tool`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};



module.exports = { sendResetPasswordEmail };
