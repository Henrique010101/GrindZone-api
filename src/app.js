import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js";
import cors from "cors";

const app = express();

app.use(cors());


app.use(express.json());

db.on("error", console.error.bind(console, "Erro de conexão com o MongoDB:"));
db.once("open", () => {
  console.log("Conexão com o banco de dados MongoDB estabelecida com sucesso");
});

routes(app);

app.use(manipuladorDeErros);

export default app;