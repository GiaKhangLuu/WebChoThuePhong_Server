require("dotenv").config();

var express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
var bodyParser = require("body-parser");
var session = require("express-session");

var userRouter = require("./routers/user.router");
var homeRouter = require("./routers/phongtro.router");
var homePageRouter = require("./routers/home.router");
var adminNewRouter = require("./routers/Admin/admin.new.router")
const cors = require("cors");
var flash = require("connect-flash");

require("dotenv").config();
var app = express();

mongoose.connect(
  `mongodb+srv://${process.env.DB_MONGO_USERNAME}:${process.env.DB_MONGO_PASSWORD}@cluster0.xaica.mongodb.net/${process.env.DB_MONGO_DATABASENAME}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log(err + "");
    console.log("connect database success");
  }
);

app.use(
  session({
    name: "login",
    secret: "secured_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 15,
    },
  })
);

app.use([
  bodyParser.json({ limit: '50mb' }),
  bodyParser.urlencoded({ limit: '50mb', extended: true }),
]);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.static("public"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.use("/nguoi-dung", userRouter);
app.use("/phong-tro", homeRouter);
app.use("/trang-chu", homePageRouter);
app.use("/admin", adminNewRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Listen port ${PORT}`);
});
