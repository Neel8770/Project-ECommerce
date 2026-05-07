import nodemailer from 'nodemailer';

export const sendEmail = async (email,otp) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from : `"ShopVibe Support" <${process.env.EMAIL_USER}>`,
        to : email,
        subject : "Verify your email - ShopVibe",
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Welcome to ShopVibe!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #4A90E2; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>
      `,
    };
    await transporter.sendMail(mailOptions);
}