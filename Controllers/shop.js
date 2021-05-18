const Product = require("../models/products");
const Cart = require("../models/cart");
const OrderItem = require("../models/order-item");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
        hasProducts: products.length > 0,
        activeProduct: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne({ id: prodId })
    .then(({ dataValues }) => {
      res.render("shop/product-detail", {
        product: dataValues,
        pageTitle: dataValues.title,
        path: "/",
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        IndexShop: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      cart.getProducts().then((products) => {
        console.log("products in cart", products);
        res.render("shop/cart", {
          pageTitle: "Cart",
          path: "/cart",
          hasProducts: products.length > 0,
          cartCSS: true,
          products: products,
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.dataValues.cartItem.dataValues.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  const cart = new Cart();
  const product = new Product();

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

exports.cartDeleteItem = (req, res, next) => {
  const prodId = req.body.prodId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ id: prodId });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => res.redirect("/cart"))
    .catch((err) => console.log(err));
};
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      console.log("product in cart ", products);
      return req.user.createOrder().then((order) => {
        return order.addProducts(
          products.map((product) => {
            product.orderItem = {
              quantity: product.cartItem.quantity,
            };

            return product;
          })
        );
      });
      console.log(products);
    })
    .then((result) => {
      fetchedCart.setProducts(null);
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log("first order ", orders.length);
      res.render("shop/orders", {
        pageTitle: "Cart",
        path: "/orders",
        orders: orders,
        cartCSS: true,
        hasOrder: orders.length > 0,
      });
    })
    .catch((err) => console.log(err));
};
