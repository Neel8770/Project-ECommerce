import User from "../models/user.js";
import jwt from "jsonwebtoken";

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


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};