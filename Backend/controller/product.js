import Product from "../models/product.js";
import cloudinary from "cloudinary";



export const addProduct = async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        // Joi already checked all text fields (name, price, brand, etc.)
        // We only need to check if Multer successfully grabbed the image file
        if (!req.file) {
            return res.status(400).json({ message: "Please upload Product Image" });
        }

        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "mern_ecommerce_products",
        });

        // Create the product using the safe, Joi-validated data from req.body
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            brand: req.body.brand,
            category: req.body.category,
            countInStock: req.body.countInStock,
            image: result.secure_url,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Could not add product' });
    }
}

export const getProducts = async (req,res) => {
    const products = await Product.find({});
    res.json(products);
};


export const getProductById = async (req,res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};


export const deleteProduct = async (req,res) => {
    const product = await Product.findById(req.params.id);
    if(product){
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
}

export const updateProduct = async (req,res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if(product){
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct)
    }else {
        res.status(404).json({message: 'Product not found'});
    }
};