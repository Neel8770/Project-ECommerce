export const sendEmail = async (email, otp) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { 
        name: "ShopVibe", 
        email: process.env.EMAIL_USER 
      },
      to: [{ email: email }],
      subject: "OTP Verification - ShopVibe",
      textContent: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send email via Brevo");
  }

  console.log("✅ Email sent successfully to:", email);
};


