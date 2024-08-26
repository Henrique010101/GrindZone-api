import Product from '../models/Product.js';
import express from "express";
import upload from '../uploads/multer.js';

const router = express.Router();

router.get('/products', async (req, res) => {
    let html = ''
    try {

        const products = await Product.find({});
        if (!products?.length) return res.status(204).send();
        
        products.forEach(produto => {
            const valorTotal = produto.price * (1 - produto.promocao / 100)
            html += `
            <div class="col-5 col-xl-3 col-xxl-2 btn text-start p-0">
                <div class="card p-0 align-items-center">
                    <img class="card-img-produtos" data-bs-toggle="modal" data-bs-target="#modal-5"
                        alt="${produto.name}" src="http://localhost:3000/${produto.img}">
                    <div class="card-body card-header ps-2 pt-2 px-1 w-100">
                        <h5 class="fs-6 titulo-produto fw-bold">${produto.name}</h5>
                        <ul class="ul-produtos">
                        <li class="mb-2">Categoria: ${produto.category}</li>
                        <li class="">${produto.description}</li>
                        </ul>
                        <div class="mt-auto d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="preco-parcelado text-black-50">
                            10x de ${ valorTotal / 10 }
                            </span>
                            <span class="preco-total">
                            </br>
                            ${produto.promocao > 0 ? 
                                `<strong class="preco-promo m fw-light text-decoration-line-through text-black-50">
                                    R$ ${produto.price.toFixed(2)}
                                </strong>
                                </br>` : 
                                ''}
                            <strong>
                                R$
                            </strong>
                            ${valorTotal}
                            </span>
                        </div>
                        <a href="#" type="button" class="btn btn-roxo btn-custom">+ <i class="bi bi-cart2"></i></a>
                        </div>
                    </div>
                </div>
            </div>`
        });
        res.status(200).send(html);
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