import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true }, // <--- The name for the shipping label
      mobile: { type: String, required: true },
      pincode: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      address: { type: String, required: true },
      landmark: { type: String },
    },
    totalAmount: { type: Number, required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending", 
    },
}, {timestamps: true});

export default mongoose.model("Order", orderSchema);