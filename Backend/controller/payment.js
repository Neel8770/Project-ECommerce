import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js"; 

const razorpay = new Razorpay({
    key_id:process.env.RAZOR_PAY_API_KEY,
    key_secret:process.env.RAZOR_PAY_SECRET_KEY,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, idempotencyKey } = req.body;

    // Check if user already clicked "Pay" to prevent double-charges
    const existingOrder = await Order.findOne({ idempotencyKey });
    if (existingOrder) {
      return res.status(200).json({ 
        success: true, 
        razorpayOrderId: existingOrder.razorpayOrderId 
      });
    }
    const razorpayOptions = {
      amount: Math.round(totalAmount * 100), // Convert ₹ to Paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };
    const razorpayOrder = await razorpay.orders.create(razorpayOptions);
    await Order.create({
      user: req.user._id, // Requires user to be logged in
      items,
      shippingAddress,
      totalAmount,
      idempotencyKey,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "Pending"
    });
    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOptions.amount
    });
    } catch (error) {
    console.error("Razorpay Create Error:", error);
    res.status(500).json({ success: false, message: "Failed to initiate payment." });
  }
};

export const verifyPayment = async (req,res) => {
    try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_SECRET_KEY)
      .update(sign.toString())
      .digest("hex");

      if (razorpay_signature === expectedSign) {
      // WHAT: Update the Database.
      // WHY: The money is secure. We change the status from "Pending" to "Success".
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: "Success",
        }
      );

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
      // If the signatures don't match, someone is trying to steal from you!
         await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "Failed" }
      );
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
    } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ success: false, message: "Verification failed." });
  }
};
