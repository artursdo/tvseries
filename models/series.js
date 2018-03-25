var mongoose = require("mongoose");
var random = require('mongoose-simple-random');

var seriesSchema = new mongoose.Schema({
  maze_id: Number,
  name: String,
  genres: Array,
  status: String,
  air_days: Array,
  imdb_link: String,
  image: Array,
  description: String,
  rating: Number,
  episodes: [[
    {
    maze_series_id: String,
    name: String,
    season: Number,
    number: Number,
    airdate: Date,
    runtime: Number,
    image: String,
    description: String
  }
]],
users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
]
},
{ 
  usePushEach: true 
});

seriesSchema.plugin(random);

module.exports = mongoose.model("Series", seriesSchema);
