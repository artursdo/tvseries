var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Series = require("../models/series");
var Helpers = require("../models/helpers");


router.get("/series", function(req,res){

  Series.find({users: req.user._id}).limit(20).exec(function(err, allSeries){
  if(err){
    console.log(err);
  } else {
    res.render("series/index", {series: allSeries});
  }
});
});

router.get("/schedule", function(req,res){
  date = new Date();
  date.setDate(date.getDate()-1);
  Series.aggregate([{ $match: {users: req.user._id}},
                    { $match: {episodes: {$elemMatch: {$elemMatch:  {airdate: {$gt: new Date() }}}}}},
                    { "$unwind": "$episodes" },
                    {"$unwind": "$episodes"},
                    {$match:{"episodes.airdate": {$gt: new Date()}}},
                    {$sort: { "episodes.airdate": +1 }}]).exec(
  function(err, series){
    if(err){
      console.log(err);
    } else {
      Helpers.sortSchedule(series, function(series){
        res.render("series/schedule", {series: series});
      });
    }
  })
});


module.exports = router;
