const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (email, subject, html) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };
  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
