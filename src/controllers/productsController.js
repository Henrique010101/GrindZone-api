import products from "../models/Produtos.js"

class ProdutoController {

  static listarProduto = async (req, res) => {
    try {
      const productsResultado = await products.find()
        .populate("autor")
        .exec();

      res.status(200).json(productsResultado);
    } catch (erro) {
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  };

  static listarProdutoPorId = async (req, res) => {
    try {
      const id = req.params.id;

      const ProdutoResultados = await products.findById(id)
        .populate("autor", "nome")
        .exec();

      res.status(200).send(ProdutoResultados);
    } catch (erro) {
      res.status(400).send({message: `${erro.message} - Id do Produto não localizado.`});
    }
  };

  static cadastrarProduto = async (req, res) => {
    try {
      let Produto = new products(req.body);

      const ProdutoResultado = await Produto.save();

      res.status(201).send(ProdutoResultado.toJSON());
    } catch (erro) {
      res.status(500).send({message: `${erro.message} - falha ao cadastrar Produto.`});
    }
  };

  static atualizarProduto = async (req, res) => {
    try {
      const id = req.params.id;

      await products.findByIdAndUpdate(id, {$set: req.body});

      res.status(200).send({message: "Produto atualizado com sucesso"});
    } catch (erro) {
      res.status(500).send({message: erro.message});
    }
  };

  static excluirProduto = async (req, res) => {
    try {
      const id = req.params.id;

      await products.findByIdAndDelete(id);

      res.status(200).send({message: "Produto removido com sucesso"});
    } catch (erro) {
      res.status(500).send({message: erro.message});
    }
  };

  static listarProdutoPorEditora = async (req, res) => {
    try {
      const editora = req.query.editora;

      const productsResultado = await products.find({"editora": editora});

      res.status(200).send(productsResultado);
    } catch (erro) {
      res.status(500).json({ message: "Erro interno no servidor" });
    }
  };
}

export default ProdutoController;