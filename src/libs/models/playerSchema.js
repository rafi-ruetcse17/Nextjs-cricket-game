const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  pos: Number,
  name: String,
  players: [String],
});

const Players = mongoose.model("Players", playerSchema);

module.exports = Players;
