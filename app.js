var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var moment = require('moment');

var Series = require("./models/series");
var Maze = require("./models/maze");
// var eztv = require('eztv');

mongoose.connect("mongodb://localhost/tv_series_db");
mongoose.Promise = require('bluebird');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", ".ejs");

app.locals.moment = moment;

app.get("/", function(req,res){
  res.render("landing");
});


app.get("/series", function(req,res){

  Series.find().limit(20).exec(function(err, allSeries){
  if(err){
    console.log(err);
  } else {
    res.render("series/index", {series: allSeries});
  }
});
});

app.get("/series/schedule", function(req,res){
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
      sortSchedule(series, function(series){
         console.log(series);
        res.render("series/schedule", {series: series});
      });
    }
  })
});

function sortSchedule(series, callback){
  var episodesList = {};
  series.forEach(function(show){
    var date = show.episodes.airdate;
    if (!episodesList[date]) {
      episodesList[date] = [];
    }
    episodesList[date].push(show);
  });
  callback(episodesList);
}


app.get("/series/results", function(req,res){
  var result = Maze.search(req.query.search, function(result){
    res.render("series/results", {series: result});
  });
});


app.get("/series/:id", function(req,res){
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







app.listen(3000, function(){
  console.log("yee working");
});
