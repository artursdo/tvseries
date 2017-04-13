var express = require("express");
var router = express.Router();
var Series = require("../models/series");
var Maze = require("../models/maze");
var Helpers = require("../models/helpers");


// SERIES SCHEDULE
router.get("/schedule", function(req,res){
  date = new Date();
  date.setDate(date.getDate()-1);
  Series.aggregate([{ $match: {episodes: {$elemMatch: {$elemMatch:  {airdate: {$gt: date}}}}}},
                    { "$unwind": "$episodes" },
                    {"$unwind": "$episodes"},
                    {$match:{"episodes.airdate": {$gt: date}}},
                    {$sort: { "episodes.airdate": +1 }}]).exec(
  function(err, series){
    if(err){
      console.log(err);
    } else {
      Helpers.sortSchedule(series, function(series){
         console.log(series);
        res.render("series/schedule", {series: series});
      });
    }
  })
});


// SEARCH RESULTS
router.get("/results", function(req,res){
  var result = Maze.search(req.query.search, function(result){
    res.render("series/results", {series: result});
  });
});

// SHOW SERIES
router.get("/:id", function(req,res){
      Series.findOne({maze_id: req.params.id}, function (err, series) {
        if(err){
          console.log(err);
        } else {
          if (series) {
              console.log("Found in DB: " + series.name);
              res.render("series/show", {show: series});
          } else {
              console.log("not in DB");
              Maze.create(req.params.id, function(series){
                res.render("series/show", {show: series});
              })
          }
        }
      });
});


//EZTV LATER

  // eztv.getShows({query: 'big bang'}, function(error, results) {
      // eztv.getShowEpisodes(23, function(error, result){
      //   res.send(result);
      // })
  // });

module.exports = router;
