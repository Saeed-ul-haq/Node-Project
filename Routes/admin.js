const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin");

router.get("/add-product", adminController.getAddProduct);

//  /admin/products  => GET
router.get("/products",adminController.getProducts);
router.post("/product", adminController.postProduct);

module.exports = router;
