const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const adminData = require("./Routes/admin");
const shopRoutes = require("./Routes/shop");
var expressHbs = require("express-handlebars");

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

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not found" });
});

app.listen(3000);
