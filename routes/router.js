import express from "express";
import routerProducts from "./Produtos.js";
import routerUsers from './User.js'

const router = express.Router();

router.use("", routerProducts);
router.use("", routerUsers);

export default router;