var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Series = require("../models/series");
var Helpers = require("../models/helpers");

router.get("/", function(req,res){

  Series.findRandom({}, {}, {limit: 8}, function(err, allSeries){
  if(err){
    console.log(err);
  } else {
    res.render("landing", {series: allSeries});
  }
});
});

router.post("/register", function(req,res){
  var newUser = new User({username: req.body.username, email: req.body.email});
  User.register(newUser, req.body.password, function(err, user){
      if(err){
        // req.flash("error", err.message);
        console.log(err.message);
        return res.render("landing");
      }
      Helpers.getUserAvatar(user._id, function(path){
        user.update({avatar_path: path}, function(user){
          passport.authenticate("local")(req, res, function(){
            // req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/series");
        });
      });
    });
  });
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/"
    }), function(req,res){
});

router.get("/logout", function(req,res){
  req.logout();
  // req.flash("success", "Logged you out!");
  res.redirect("/");
});

router.post("/favorite", function(req,res){
      User.findById(req.user._id, function(err, user){
        if(err){
          console.log(err);
        } else {
          Series.findById(req.body.show_id, function(err,series){
            series.users.push(user);
            series.save();
            res.redirect("back");

        });
      }
  });
});

router.post("/remove-favorite", function(req,res){
      User.findById(req.user._id, function(err, user){
        if(err){
          console.log(err);
        } else {
            Series.findById(req.body.show_id, function(err,series){
            series.users.pull(user);
            series.save();
            res.redirect("back");

        });
      }
  });

});

module.exports = router;
