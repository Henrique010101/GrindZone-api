import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
    id: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    promocao: {
        type: Number,
        required: false,
        value: 0,
    },
    img: {
        type: String,
        required: false,
    },
}, 
{ timestamps: true });

const Product = mongoose.model('products', productSchema);

export default Product;
