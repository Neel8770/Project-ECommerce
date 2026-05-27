import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import 'dotenv/config';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/payment.js";

// Initialize Database Connection
connectDB();

const app = express();

// --- MIDDLEWARE CONFIGURATION ---

// 1. Body Parser
app.use(express.json());

// 2. CORS Configuration
// WHAT: Explicitly whitelists your Vercel frontend domain.
// WHY: To stop the "403 Forbidden" error by telling Render to trust your Vercel site.
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(",") 
        : ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));




// 3. Helmet Configuration
// WHAT: Sets security headers.
// WHY: The 'crossOriginResourcePolicy' setting ensures the browser doesn't block the API responses.
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 4. Logger
app.use(morgan("dev"));

// --- API ROUTES ---
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// --- BASE ROUTE ---
app.get("/", (req, res) => {
    res.send("Welcome to the ShopVibe API - Server is Live");
});

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message,
    });
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});