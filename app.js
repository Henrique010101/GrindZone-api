import express from "express";
import connectDB from "./db/conn.js";
import routes from "./routes/Produtos.js";
import { fileURLToPath } from 'url';
import cors from "cors";
import path from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors({
  origin: "*"
}));

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000 🏁");
    });

    app.use("/api", routes);
  })
  .catch((err) => {
    console.error("There was an error while connecting to MongoDB: ", err);
  });