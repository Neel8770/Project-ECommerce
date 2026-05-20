import nodemailer from "nodemailer";

export const sendEmail = async (email, otp) => {
  // Use explicit host and port instead of 'service: gmail'
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // MUST be the 16-digit App Password
    },
    connectionTimeout: 10000, // 10 seconds - stops the 120s loop
  });

  await transporter.sendMail({
    from: `"ShopVibe" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });
};