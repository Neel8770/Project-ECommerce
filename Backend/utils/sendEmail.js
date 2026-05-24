import 'dotenv/config';
import nodemailer from "nodemailer";

let transporter = null; // Start as null

const getTransporter = () => {
  if (!transporter) {
    // Created lazily — only on first call, AFTER dotenv has loaded
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,   // ✅ Now defined
        pass: process.env.EMAIL_PASS,   // ✅ Now defined
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }
  return transporter;
};

export const sendEmail = async (email, otp) => {
  await getTransporter().sendMail({
    from: `"ShopVibe" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};
