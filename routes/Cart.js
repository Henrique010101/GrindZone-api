import express from "express";
import authMiddleware from "../middleware/auth.js";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post('/cart', authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        let cart = await Cart.findOne({ userId });

        if(!cart) {
            cart = new Cart({ userId, items: [] })
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if(existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();

        res.status(200).json({ message: "Item adicionado ao carrinho." });
    } catch(error) {
        console.error('Erro ao adicionar um item no carrinho:', error);
        res.status(500).json({ message: "Error interno do servidor."})
    };
});

router.delete('/cart:productId', authMiddleware, async (req,res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId });

        if(!cart) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)

        await cart.save();

        res.status(200).json({ message: "Item removido do carrinho" });
    } catch(error) {
        console.error('Erro ao remover item do carrinho:', error);
        res.status(500).json({ message: "Erro interno do servidor." })
    }
})

router.get('/cart', authMiddleware, async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if(!cart) {
            return res.status(404).json({ message: "Carrinho nõ encontrado." });
        }

        res.status(200).json(cart);
    } catch(error) {
        console.error('Erroao obter itens do carrinho:', error);
        res.status(500).json({ message: "Erro interno do servidor." })
    }
})

export default router;