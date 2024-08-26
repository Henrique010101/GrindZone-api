import mongoose from "mongoose";

const { Schema } = mongoose;

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Products", // Refere-se à coleção de produtos
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
},
{ timestamps: true });

const Cart = mongoose.model("cart", cartSchema);

export default { Cart };
