var request = require("request");
var Series = require("./series");

module.exports = {

  search: function(query, callback){
     var searchParams = 'http://api.tvmaze.com/search/shows?q=' + query;
     request(searchParams, function(error, response, body){
           if(!error && response.statusCode == 200){
               callback(JSON.parse(body));
           }
           if(error){
             console.log(error);
           }
     });
   },

   create: function(query, callback){
          console.log(module.exports);
          this.findOne(query, function(show){
            console.log("1");
            Series.create(show, function(err, newlyCreated){
              if (err){
                console.log(err);
              } else{

                callback(newlyCreated);
              }
            });

          });
   },

   findOne: function(query, callback){
    var searchParams = 'http://api.tvmaze.com/shows/' + query + '?embed=episodes';
    request(searchParams, function(error, response, body){
          if(!error && response.statusCode == 200){
            console.log("2");
            module.exports.createStructure(JSON.parse(body), function(series){
              callback(series);
            });
          }
          if(error){
            console.log(error);
          }
    });
  },

   createStructure: function(series, callback){
    var episodes = series._embedded.episodes;
    var episodesList = [];

    episodes.forEach(function(episode){
      if(episode.airdate){
        var date = new Date(episode.airdate);
        date.setDate(date.getDate()+1);
      }
      var season = episode.season;
      var item = {
        maze_series_id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number,
        airdate: date,
        runtime: episode.runtime,
        image: (episode.image) ? episode.image.original : "",
        description: episode.summary
      };

      if (!episodesList[season]) {
        episodesList[season] = [];
      }
      episodesList[season].push(item);
    });
        callback({
          maze_id: series.id,
          name: series.name,
          genres: series.genres,
          status: series.status,
          air_days: series.schedule.days,
          imdb_link: series.externals.imdb,
          image: series.image,
          description: series.summary,
          rating: series.rating.average,
          episodes: episodesList
        });

  }
};
