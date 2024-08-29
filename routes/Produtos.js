import Product from '../models/Product.js';
import express from "express";
import upload from '../uploads/multer.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    try {

        const products = await Product.find({});
        if (!products?.length) return res.status(204).send();

        res.status(200).json(products);
    }
    catch (err) {
        console.error('Erro ao buscar produtos:', err);
    }
    if (!res.headersSent) {
        return res.status(500).send('Erro ao buscar produtos');
    }
});

router.get('/products/promocao', async (req, res) => {
    try {
        const products = await Product.find({});
        if (!products?.length) return res.status(204).send();
        const produtosNaPromocao = products.filter(produto => produto.promocao !== null && produto.promocao > 0)
        res.status(200).json(produtosNaPromocao);
    }
    catch (err) {
        console.error('Erro ao buscar produtos:', err);
    }
    if (!res.headersSent) {
        return res.status(500).send('Erro ao buscar produtos');
    }
})

router.post('/carrinho', upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, price, promocao } = req.body;
        const image = req.file ? req.file.path.replace(/\\/g, "/") : null; // Corrige o caminho da imagem

        // Cria um novo produto com os dados fornecidos
        const newProduct = new Product({
            name,
            description,
            category,
            price,
            promocao,
            img: image // Armazena o caminho da imagem
        });

        await newProduct.save(); // Salva o produto no banco de dados

        res.status(200).json(newProduct); // Retorna o produto criado
    } catch (err) {
        console.error("Error POST /carrinho: ", err);
        res.status(500).json({ message: err.message || err });
    }
});

export default router;