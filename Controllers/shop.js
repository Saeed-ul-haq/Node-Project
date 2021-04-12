const Product = require("../models/products");

exports.getProducts = (req, res, next) => {
  const product = new Product();
  product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Shop",
      path: "/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getIndex = (req, res, next) => {
  const product = new Product();
  product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};

exports.getCart = (req, res, next) => {
  const product = new Product();
  product.fetchAll((products) => {
    res.render("shop/cart", {
      prods: products,
      pageTitle: "Cart",
      path: "/cart",
      hasProducts: products.length > 0,
      cart: true,
      productCSS: true,
    });
  });
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Cart",
    path: "/orders",
    orders: true,
    productCSS: true,
  });
};

exports.getCheckout = (req, res, next) => {
  product.fetchAll((products) => {
    res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
      hasProducts: products.length > 0,
      cart: true,
      productCSS: true,
    });
  });
};
