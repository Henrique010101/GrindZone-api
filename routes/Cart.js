import express from "express";
import authMiddleware from "../middleware/auth.js";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post('/cart', authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    // Validação básica
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Dados inválidos. Verifique o produto e a quantidade." });
    }

    try {
        // Verificar se o carrinho do usuário já existe
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Criar um novo carrinho se não existir
            cart = new Cart({ userId, items: [] });
        }

        // Verificar se o produto já está no carrinho
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex > -1) {
            // Se o produto já está no carrinho, atualizar a quantidade
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Se o produto não está no carrinho, adicionar um novo item
            cart.items.push({ productId, quantity });
        }

        // Salvar o carrinho atualizado
        await cart.save();

        // Popular os detalhes dos produtos (incluindo a imagem)
        const populatedCart = await Cart.findOne({ userId }).populate('items.productId');

        res.status(200).json({ message: "Item adicionado ao carrinho.", cart: populatedCart });
    } catch (error) {
        console.error('Erro ao adicionar item no carrinho:', error);
        res.status(500).json({ message: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
    }
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