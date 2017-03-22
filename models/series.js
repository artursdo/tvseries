var mongoose = require("mongoose");

var seriesSchema = new mongoose.Schema({
  maze_id: Number,
  name: String,
  genres: Array,
  status: String,
  air_days: Array,
  imdb_link: String,
  image: Array,
  description: String,
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
  ]]
});

module.exports = mongoose.model("Series", seriesSchema);
