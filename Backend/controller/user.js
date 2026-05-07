import User from "../models/user.js";
import jwt from "jsonwebtoken";
import otp from "../models/OTP.js";
import { sendEmail } from "../utils/sendEmail.js";
import OTP from "../models/OTP.js";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if(userExists){
        return res.status(400).json({ message: "User already exists"});
    }
    const user = await User.create({
        name,email,password
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            token: generateToken(user._id)
        });
    }
};

export const deleteUser = async (req,res) => {
    try{
    const user = await User.findById(req.params.id);

    if(user){
        await user.deleteOne();
        res.json({message :"User Deleted!"});
    }else{
        res.status(404).json({message : "User not found!"});
    }
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser =async (req,res,next) => {
    try{
        const user = await User.findById(req.params.id);

        if (user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
        });
    }else{
        res.status(404).json({message: "User not found!"});
    }
    }catch (error) {
        console.error("🚨 UPDATE USER CRASH:", error); 
        res.status(500).json({ message: error.message });
    }
}


// LOGIN LOGIC 
export const authUser = async (req,res) => {
    const { email , password } = req.body;

    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({
            message: 'Invalid email or password'
        });
    }
};

export const sendOTP = async (req,res) => {
    const { email } =req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try{
        await OTP.findOneAndUpdate(
            {email},
            {otp, createdAt: Date.now()},
            {upsert: true, new: true}
        );
        await sendEmail(email, otp);
        res.status(200).json({success:true,message: "OTP sent!"});
    } catch (error) {
        res.status(500).json({success:false,message: "error sending OTP" });
    }
};


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};