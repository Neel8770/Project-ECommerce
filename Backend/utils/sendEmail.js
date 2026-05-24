import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,                          // ← Changed from 465
      secure: false,                      // ← Changed from true (587 uses STARTTLS, not implicit TLS)
      tls: { rejectUnauthorized: false }, // ← Added (Render's SSL certs can cause verification issues)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 15000,           // ← Increased for cloud latency
      greetingTimeout: 15000,
      socketTimeout: 15000,
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
