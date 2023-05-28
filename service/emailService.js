var nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: `${process.env.HOST}`,
  port: 25,
  secure: false,
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.PASS}`,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendConfirmationEmail = async (email, reservationDetails) => {
  await transporter.sendMail({
    from: `Reservation ${process.env.FROM}`,
    to: email,
    subject: "Reservation Confirmation",
    text: `Dear ${reservationDetails.full_name}, 

    Thank you for choosing Brasa at ${reservationDetails.branch} for your reservation on ${reservationDetails.date} at ${reservationDetails.time}.
    We are pleased to confirm your reservation for ${reservationDetails.guests} guests.

    Your ${reservationDetails.promoCode} promo code has been successfully applied and your discount of [discount amount] has been deducted from your total bill.

    If you need to make any changes to your reservation, please contact us at least 24 hours in advance. We look forward to serving you soon.
  
    Sincerely,
    Brasa
    `,
  });
};

module.exports = sendConfirmationEmail;
