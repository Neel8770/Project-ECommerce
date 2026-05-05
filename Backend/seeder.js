import mongoose from "mongoose";
import  dotenv  from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/product.js";

dotenv.config();
connectDB();

const products = [
    {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 299.99,
    originalPrice: 399.99,
    category: "Electronics",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978072/pexels-ron-lach-7858743_wu991v.jpg",
    rating: 4.8,
    reviews: 2341,
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.",
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "MacBook Pro 16-inch",
    price: 2499.00,
    originalPrice: 2699.00,
    category: "Electronics",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978071/macbook_emlloa.jpg",
    rating: 4.9,
    reviews: 1876,
    description: "Supercharged by M3 Max. 16-inch Liquid Retina XDR display, up to 22 hours of battery life.",
    badge: "New"
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    price: 1199.99,
    originalPrice: 1299.99,
    category: "Electronics",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978071/Iphone_cybclm.jpg",
    rating: 4.7,
    reviews: 3215,
    description: "Forged in titanium. A17 Pro chip. 48MP Main camera. USB-C with 10Gbps speeds.",
    badge: null
  },
  {
    id: 4,
    name: "Premium Running Sneakers",
    price: 159.00,
    originalPrice: null,
    category: "Fashion",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978099/Sneaker_tiyyml.jpg",
    rating: 4.7,
    reviews: 4523,
    description: "Ultra-lightweight running shoes with responsive cushioning, breathable mesh upper.",
    badge: "Trending"
  },
  {
    id: 5,
    name: "Classic Leather Belt",
    price: 49.99,
    originalPrice: 69.99,
    category: "Fashion",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978096/Belt_bzk7qm.jpg",
    rating: 4.6,
    reviews: 987,
    description: "Genuine full-grain leather belt with a brushed metal buckle. Durable and timeless.",
    badge: "Top Rated"
  },
  {
    id: 6,
    name: "Luxury Designer Purse",
    price: 489.00,
    originalPrice: 550.00,
    category: "Fashion",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978098/Purse_guv8xu.jpg",
    rating: 4.8,
    reviews: 2156,
    description: "Elegant structured purse in premium Saffiano leather with gold-tone hardware.",
    badge: null
  },
  {
    id: 7,
    name: "Official Match Football",
    price: 34.99,
    originalPrice: 44.99,
    category: "Sports",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978103/Football_req5qa.jpg",
    rating: 4.5,
    reviews: 1543,
    description: "FIFA quality pro certified match ball with textured surface for better control.",
    badge: "Sale"
  },
  {
    id: 8,
    name: "Professional Rugby Ball",
    price: 48.00,
    originalPrice: null,
    category: "Sports",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978104/RugbyBall_c1a5et.jpg",
    rating: 4.8,
    reviews: 3421,
    description: "High grip rubber surface with 4-panel construction for excellent passing accuracy.",
    badge: null
  },
  {
    id: 9,
    name: "Premium Non-Slip Yoga Mat",
    price: 68.00,
    originalPrice: 85.00,
    category: "Sports",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978102/pexels-manoj-poosam-3217664-7743320_l8n541.jpg",
    rating: 4.9,
    reviews: 876,
    description: "Extra-thick 6mm mat with non-slip surface and alignment guides. Eco-friendly.",
    badge: "New"
  },
  {
    id: 10,
    name: "Wooden Kitchen Utensil Set",
    price: 54.99,
    originalPrice: null,
    category: "Kitchen",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978102/pexels-serenakoi-5667226_xvsw8k.jpg",
    rating: 4.8,
    reviews: 2789,
    description: "Handcrafted natural wood kitchen utensils set, perfect for non-stick cookware.",
    badge: null
  },
  {
    id: 11,
    name: "Scandinavian Tea Set",
    price: 89.99,
    originalPrice: 119.99,
    category: "Kitchen",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978102/pexels-sarah-chai-7262891_ezpjom.jpg",
    rating: 4.7,
    reviews: 5678,
    description: "Minimalist ceramic tea pot with two matching stoneware cups. Lead-free glaze.",
    badge: null
  },
  {
    id: 12,
    name: "Premium Chef Knife Set",
    price: 195.00,
    originalPrice: 250.00,
    category: "Kitchen",
    image: "https://res.cloudinary.com/dj4h4abdg/image/upload/v1774978101/pexels-keeganjchecks-10117710_enku5u.jpg",
    rating: 4.9,
    reviews: 1234,
    description: "High-carbon stainless steel knife set with an ergonomic handle and magnetic block.",
    badge: "Best Seller"
  },
];
 const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log(' Data Imported Successfully!');
        process.exit();
    }catch (error) {
        console.error(`Error : ${error.message}`);
        process.exit(1);
    }
 };

 importData();