const fs = require('fs');
const path = require('path');
var request = require("request");

module.exports = {

  sortSchedule: function(series, callback){
    var episodesList = {};
    series.forEach(function(show){
      var date = show.episodes.airdate;
      if (!episodesList[date]) {
        episodesList[date] = [];
      }
      episodesList[date].push(show);
    });
    callback(episodesList);
  },

  getUserAvatar: function(user_id, callback){
    var url = "https://robohash.org/" + user_id + ".png?size=100x100&set=set2";
    var localPath = "./public/images/user_avatars/" + user_id + ".png";

            request.head(url, function(err, res, body){
              console.log('content-type:', res.headers['content-type']);
              console.log('content-length:', res.headers['content-length']);

              request(url).pipe(fs.createWriteStream(localPath)).on('close', function(){
                console.log('file saved');
                callback("/images/user_avatars/" + user_id + ".png");
              });
            });
            }



}
