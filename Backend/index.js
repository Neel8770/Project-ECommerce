import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import 'dotenv/config';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/payment.js"


connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment",paymentRoutes)

app.get("/", (req,res) => {
    res.send("Welcome to the Website")
});



const PORT = process.env.PORT || 5000;
app.listen(PORT ,() => {
    console.log(`Server is running on port ${PORT}`);
});