import express from "express";
import authMiddleware from "../middleware/auth.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

const router = express.Router();

router.get('/cart', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId); // Buscando o usuário pelo ID
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
        console.error('Erro ao adicionar item no carrinho (API):', error);
        res.status(500).json({ message: "Erro interno do servidor. Por favor, tente novamente mais tarde." });
    }
});

router.delete('/cart/:productId', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Obtém o ID do usuário
        const { productId } = req.params; // Obtém o ID do produto a ser removido

        console.log("Removendo produto do carrinho. User ID:", userId, "Produto ID:", productId);

        // Encontra o carrinho do usuário
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            console.log("Carrinho não encontrado.");
            return res.status(404).json({ message: 'Carrinho não encontrado.' });
        }

        console.log("Carrinho encontrado:", cart);

        // Remove o item do carrinho
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        console.log("Item removido, salvando o carrinho...");

        // Popula os detalhes do produto antes de enviar a resposta
        cart = await Cart.findOne({ userId }).populate('items.productId');

        console.log("Carrinho atualizado e populado:", cart);

        res.status(200).json({ message: 'Item removido do carrinho.', cart }); // Retorna o carrinho atualizado
    } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        res.status(500).json({ message: 'Erro ao remover item do carrinho.' });
    }
});


// router.put('/cart/:productId', authMiddleware, async (req, res) => {
//     try {
//         const userId = req.userId; // Obtém o ID do usuário
//         const { productId } = req.params; // Obtém o ID do produto
//         const { quantity } = req.body; // Obtém a nova quantidade do corpo da requisição

//         // Encontra o carrinho do usuário
//         const cart = await Cart.findOne({ userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Carrinho não encontrado.' });
//         }

//         // Encontra o item no carrinho
//         const item = cart.items.find(item => item.productId.toString() === productId);
//         if (!item) {
//             return res.status(404).json({ message: 'Item não encontrado no carrinho.' });
//         }

//         // Atualiza a quantidade
//         item.quantity += quantity;

//         // Verifica se a quantidade é maior que 0
//         if (item.quantity <= 0) {
//             // Remove o item do carrinho se a quantidade for 0 ou negativa
//             cart.items = cart.items.filter(i => i.productId.toString() !== productId);
//         }

//         await cart.save();

//         res.status(200).json({ message: 'Quantidade atualizada com sucesso.', cart });
//     } catch (error) {
//         res.status(500).json({ message: 'Erro ao atualizar a quantidade.' });
//     }
// });

export default router;