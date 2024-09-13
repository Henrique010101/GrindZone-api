import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items: [cartItemSchema]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
