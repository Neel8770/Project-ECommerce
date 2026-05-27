import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "ShopVibe <onboarding@resend.dev>",
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is: ${otp}`,
  });

  if (error) {
    throw new Error(error.message);
  }

  console.log("✅ Email sent successfully to:", email, "MessageID:", data.id);
};

