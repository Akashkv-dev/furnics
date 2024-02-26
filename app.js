const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv").config();
const connect = require("./config/mongoConnect");
const multer = require("multer");
const MongoDBStore = require("connect-mongodb-session")(session);
const helpers = require('handlebars-helpers')();
const timeformat = require("./hbsHelper/handlebarHelpers")
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
// *************partials setup*******************
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
    eq: function (arg1, arg2) {
      return arg1 === arg2;
    },
    gt: function (arg1, arg2) {
      return arg1 > arg2;
    },
    
    includes: function (array, value) {
      return array.includes(value);
    }
  }
});


app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", express.static(path.join(__dirname, "public")));
app.use("/admin", express.static(path.join(__dirname, "public")));
app.use("/admin/editproduct", express.static(path.join(__dirname, "public/admin")));
app.use("/admin/filter", express.static(path.join(__dirname, "public/admin")));
app.use("/admin/filterstatus", express.static(path.join(__dirname, "public/admin")));

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Handle the error or log it as needed
});

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "privite, no-cache, no-store, must-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  console.log("clear cache");
  next();
});
// ****************session*******************

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    // store: new MongoDBStore({ mongooseConnection: connect }),
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
