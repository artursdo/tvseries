var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var moment = require('moment');
var striptags = require('striptags');
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var Series = require("./models/series");
var User = require("./models/user");
var Maze = require("./models/maze");
var Helpers = require("./models/helpers");
// var eztv = require('eztv');

// Define Route Variables
var seriesRoutes = require("./routes/series");
var userRoutes = require("./routes/user");
var indexRoutes = require("./routes/index");

mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/tv_series_db",
  {
    useMongoClient: true,
    promiseLibrary: global.Promise
  });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", ".ejs");

//Passport configuration
app.use(require("express-session")({
  secret: "Last Friday in three week’s time I saw a spotted striped blue worm shake hands with a legless lizard.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Local Variables
app.use(function(req,res,next){
  app.locals.moment = moment;
  app.locals.striptags = striptags;
  res.locals.currentUser = req.user;
  // res.locals.error = req.flash("error");
  // res.locals.success = req.flash("success");
  next();
});


// Routes
app.use(indexRoutes);
app.use("/series", seriesRoutes);
app.use("/user", userRoutes);





app.listen(3000, function(){
  console.log("yee working");
});
