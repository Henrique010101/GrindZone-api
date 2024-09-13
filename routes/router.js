import express from "express";
import routerProducts from "./Produtos.js";
import routerUsers from './User.js'
import routerCart from './Cart.js'

const router = express.Router();

router.use("", routerProducts);
router.use("", routerUsers);
router.use("", routerCart);

export default router;