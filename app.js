var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Series = require("./models/series");
// var eztv = require('eztv');

mongoose.connect("mongodb://localhost/tv_series_db");
mongoose.Promise = require('bluebird');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", ".ejs");


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

app.get("/series/:id", function(req,res){
      Series.find({maze_id: req.params.id}, function (err, series) {
        if(err){
          console.log(err);
        } else {
          res.render("series/show", {show: series[0]});
        }
      });
});


app.get("/search", function(req,res){
  res.render("series");
});

app.get("/series/results", function(req,res){

      if (req.query.search) {
          Series.find({ name: {$regex: req.query.search , $options: "i"}}, function (err, series) {
              if (series == "") {
                console.log("not in DB");
                searchMaze(req.query.search, function(result){
                  console.log("length: "+ (result.constructor === Array) ? "true" : "false");
                  res.render("series/results", {show: result});
                });


              } else{
                console.log("length: "+ (series.constructor === Array) ? "true" : "false");
                console.log("Found in db :" + series[0].name);
                res.render("series/results", {show: series});
              }
          });
      }



//EZTV LATER

  // eztv.getShows({query: 'big bang'}, function(error, results) {
      // eztv.getShowEpisodes(23, function(error, result){
      //   res.send(result);
      // })
  // });


// FIND TV SHOW

});


function searchMaze(query, callback){
  var searchParams = 'http://api.tvmaze.com/singlesearch/shows?q=' + query + '&embed=episodes';
  request(searchParams, function(error, response, body){
        if(!error && response.statusCode == 200){
            buildSeries(JSON.parse(body), callback);
        }
        if(error){
          console.log(error);
        }
  });
}

function buildSeries(series, callback){
  var episodes = series._embedded.episodes;
  var episodesList = [];

  episodes.forEach(function(episode){
    var season = episode.season;
    var item = {
      maze_series_id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
      airdate: episode.airdate,
      runtime: episode.runtime,
      image: (episode.image) ? episode.image.original : "",
      description: episode.summary
    };

    if (!episodesList[season]) {
      episodesList[season] = [];
    }
    episodesList[season].push(item);
  });
      var show = {
        maze_id: series.id,
        name: series.name,
        genres: series.genres,
        status: series.status,
        air_days: series.schedule.days,
        imdb_link: series.externals.imdb,
        image: series.image,
        description: series.summary,
        episodes: episodesList
      };
      Series.create(show, function(err, newlyCreated){
        if (err){
          console.log(err);
        } else{
          callback(newlyCreated);
        }
      });
}


app.listen(3000, function(){
  console.log("yee working");
});
