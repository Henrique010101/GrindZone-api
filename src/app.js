import express from "express";
import conectaNaDatabase from "./config/dbConnect.js";
import livro from "./models/Livro.js";

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
    console.error("erro de conexão", erro);
});

conexao.once("open", () => {
    console.log("Coneão com o banco feita om sucesso!");
});

const app = express();
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send("Curso de node.js");
});

app.get("/livros", async (req, res) => {
    const listaLivros = await livro.find({});
    res.status(200).json(listaLivros);
});

app.post("/livros", (req, res) => {
    livros.push(req.body);
    res.status(201).send("livro cadastrado com sucesso")
});

app.get("/livros/:id", (req, res) => {
    const index = buscaLivro(req.params.id);
    res.status(200).json(livros[index]);
});

app.put("/livros/:id", (req, res) => {
    const index = buscaLivro(req.params.id);

    // Verifica se o livro foi encontrado
    if (index === -1) {
        return res.status(404).json({ message: 'Livro não encontrado' });
    }

    // Verifica se o título foi fornecido
    if (!req.body.titulo) {
        return res.status(400).json({ message: 'Título não fornecido' });
    }

    livros[index].titulo = req.body.titulo;
    res.status(200).json(livros);
});

app.delete("/livros/:id",  (req, res) => {
    const index = buscaLivro(req.params.id);
    livros.splice(index, 1);
    res.status(204).send("livro remosvido com sucesso");
});

export default app;

