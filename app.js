import express from "express";
import connectDB from "./db/conn.js";
import routes from "./routes/router.js";
import { fileURLToPath } from 'url';
import cors from "cors";
import path from 'path';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

export const JWT_SECRET = process.env.JWT_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({
  origin: "https://grindzone-of.netlify.app/",
  credentials: true,
}));

app.use("/api", routes);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port} 🏁`);
    });
  })
  .catch((err) => {
    console.error("There was an error while connecting to MongoDB: ", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "API Funcionando" });
});

app.use((req, res) => { 
  res.status(404).json({ error: "Not Found" });
});

export default app;
