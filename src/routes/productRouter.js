import express from "express";
import ProdutoController from "../controllers/productsController.js";

const router = express.Router();

router
  .get("/products", ProdutoController.listarProduto)
  .get("/products/busca", ProdutoController.listarProdutoPorEditora)
  .get("/products/:id", ProdutoController.listarProdutoPorId)
  .post("/products", ProdutoController.cadastrarProduto)
  .put("/products/:id", ProdutoController.atualizarProduto)
  .delete("/products/:id", ProdutoController.excluirProduto);

export default router;