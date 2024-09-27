import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', // Referência à coleção de usuários
        required: true 
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products', // Referência à coleção de produtos
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1 // Garante que a quantidade mínima de um produto seja 1
            }
        }
    ],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware para atualizar a data de modificação sempre que o carrinho for alterado
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model('cart', cartSchema);

export default Cart;