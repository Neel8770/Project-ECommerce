import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{ type: String, required:true},
    price:{ type: Number, required: true },
    Originalprice:{type: Number, default:null},
    category:{ type: String, required:true},
    image: { type:String , required:true},
    rating: {type: Number, default:0},
    reviews: {type: Number, default:0},
    description:{ type: String, required:true},
    badge:{ type: String, default:null},
},{
    timestamps:true
});

const Product = mongoose.model('Product', productSchema);

export default Product;