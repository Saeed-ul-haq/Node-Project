const express = require("express");
const path = require("path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
    formCSS: true,
  });
});

router.post("/product", (req, res, next) => {
  console.log("title : ", req.body.title);
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
