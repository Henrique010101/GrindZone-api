import mongoose from "mongoose";

const produtosSchema = new mongoose.Schema(
  {
    id: { type: String },
    titulo: { type: String, required: [true, "O título do livro é obrigatório"]},
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "autores", required: [true, "O(a) autor(a) é obrigatório"]},
    editora: { type: String, required: [true, "A editora é obrigatória"]},
    numeroPaginas: { type: Number },
  },
);

const produtos = mongoose.model("products", produtosSchema);

export default produtos;
