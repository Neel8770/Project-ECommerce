import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    index: { expires: 300 } // This is the "Magic": it auto-deletes after 5 mins
  }
  });

export default mongoose.model("OTP", otpSchema);