import express from "express";
import routerProducts from "./Produtos";

const router = express.Router();

router.use("/products", routerProducts);

export default router;