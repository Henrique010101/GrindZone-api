import express from "express";
import authMiddleware from "../middleware/auth.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

const router = express.Router();

router.get('/cart', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.status(404).json({ message: `Seu carrinho está vazio` });
        }

        res.status(200).json({ cart, userName: user.name });
    } catch(error) {

        res.status(500).json({ message: 'Erro ao buscar carrinho.' });
    }
})

router.post('/cart', authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Dados inválidos. Verifique o produto e a quantidade." });
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex > -1) {

            cart.items[existingItemIndex].quantity += quantity;
        } else {

            cart.items.push({ productId, quantity });
        }

        await cart.save();
        const populatedCart = await Cart.findOne({ userId }).populate('items.productId');

        res.status(200).json({ message: "Item adicionado ao carrinho.", cart: populatedCart });
    } catch (error) {
        console.error('Erro ao adicionar item no carrinho (API):', error);
        res.status(500).json({ message: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
    }
});

router.delete('/cart/:productId', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;

        console.log("Removendo produto do carrinho. User ID:", userId, "Produto ID:", productId);

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            console.log("Carrinho não encontrado.");
            return res.status(404).json({ message: 'Carrinho não encontrado.' });
        }

        console.log("Carrinho encontrado:", cart);

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        console.log("Item removido, salvando o carrinho...");

        cart = await Cart.findOne({ userId }).populate('items.productId');

        console.log("Carrinho atualizado e populado:", cart);

        res.status(200).json({ message: 'Item removido do carrinho.', cart });
    } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        res.status(500).json({ message: 'Erro ao remover item do carrinho.' });
    }
});


router.put('/cart/:productId', authMiddleware, async (req, res) => {
    const productId = req.params.productId; 
    const userId = req.userId; 
    const { quantity } = req.body; 

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Carrinho não encontrado.' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Produto não encontrado no carrinho.' });
        }

        cart.items[itemIndex].quantity += quantity;

        if (cart.items[itemIndex].quantity < 1) {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();

        cart = await Cart.findOne({ userId }).populate('items.productId');

        return res.status(200).json(cart);
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        return res.status(500).json({ message: 'Erro no servidor.' });
    }
});

export default router;