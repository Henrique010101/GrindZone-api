import express from "express";
import products from "../routes/productRouter.js"

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send({ titulo: "Curso de node" });
  });

  app.use(
    express.json(),
    products,
  );
};

export default routes;
