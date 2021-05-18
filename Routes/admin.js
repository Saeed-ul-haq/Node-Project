const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/admin");

router.get("/add-product", adminController.getAddProduct);

//  /admin/products  => GET
router.get("/products", adminController.getProducts);
router.post("/product", adminController.postProduct);
router.get("/edit-product/:productId", adminController.getEditProduct);
router.post("/edit-product", adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
