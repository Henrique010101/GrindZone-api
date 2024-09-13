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


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
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