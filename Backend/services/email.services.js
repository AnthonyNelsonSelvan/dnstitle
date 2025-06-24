  import nodemailer from "nodemailer";
  import dotenv from "dotenv";

  dotenv.config();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  function sendEmail(to, subject, text) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: `"Domain Services" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
      };
      console.log("email sending")

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error)
          return resolve(info)
      });
      console.log("sent")
    });
  }

  export default sendEmail;
