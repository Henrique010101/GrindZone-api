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
  origin: "*",
  credentials: true,
}));
app.use(helmet());
const helmet = require("helmet");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'"],
      imgSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
    reportOnly: true, // Set to 'true' to enable report-only mode
  })
);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port} 🏁`);
    });

    app.use("/api", routes);
  })
  .catch((err) => {
    console.error("There was an error while connecting to MongoDB: ", err);
  });

export default app;