// core modules
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");
const connectSession = require("connect-mongodb-session")(session);
const User = require("./models/user");
const { isLoggedIn, isAdmin } = require("./middlewares/is-auth");
const homeRoutes = require("./routes/home");

// intializing the app
const app = express();

// routes

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join("public")));
app.set("views", "template");
app.set("view engine", "ejs");

const store = new connectSession({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const csrfProtection = csrf();

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let successMessage = req.flash("success");
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }

  // res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.errorMessage = errorMessage;
  res.locals.successMessage = successMessage;
  next();
});
app.use(csrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(homeRoutes);

app.use(authRoutes);
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  res.render("404");
});

// db related settings
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((err) => {
    // server related settings
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log("Server is started on the port " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
