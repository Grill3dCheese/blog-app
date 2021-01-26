require("dotenv").config();

var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  bodyParser = require("body-parser"),
  Post = require("./models/post"),
  Comment = require("./models/comment"),
  User = require("./models/user");

//requiring routes
var commentRoutes = require("./routes/comments"),
  postRoutes = require("./routes/posts"),
  indexRoutes = require("./routes/index");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DATABASEUSER +
      ":" +
      process.env.DATABASEPW +
      "@blog-app-gsto2.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
  )
  .then(() => console.log(`Database connected`))
  .catch((err) => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require("moment");

// Passport Configuration
app.use(
  require("express-session")({
    secret: "Coding is simply the best!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(indexRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("*DING* Now Serving Your Blog App!");
});
