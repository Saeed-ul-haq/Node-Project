const express = require("express");
const path = require("path");
const errorController = require("./Controllers/error");
const sequelize = require("./utils/database");

const bodyParser = require("body-parser");
const adminRoutes = require("./Routes/admin");
const shopRoutes = require("./Routes/shop");
var expressHbs = require("express-handlebars");
const Product = require("./models/products");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();
// app.set("views", "views");

// app.engine("hbs", expressHbs());
app.engine(
  "hbs",
  expressHbs({
    extname: "hbs",
    defaultLayout: "main-layout",
    layoutsDir: "views/layouts/",
  })
);
app.set("view engine", "hbs");
app.set("views", "views");

// app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findOne({ id: 1 });
    // app.listen(3000);
  })
  .then((user) => {
    if (!user) {
      return User.create({ Name: "Test", Email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
