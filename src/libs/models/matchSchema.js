const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  current_status: { type: String, default: 0 },
  overs: { type: Number, default: 0 },
  balls: { type: Number, default: 0 },
  overs_to_play: { type: Number, default: 0 },
  bowler: { type: [String], default: [] },
  batsmen: { type: [String], default: [] },
  battingTeam: { type: mongoose.Schema.Types.Mixed, default: [] },
  bowlingTeam: { type: [mongoose.Schema.Types.Mixed], default: [] },
  all_batsmen: { type: [mongoose.Schema.Types.Mixed], default: [] },
  all_bowlers: { type: [mongoose.Schema.Types.Mixed], default: [] },
  prev_all_batsmen: { type: [mongoose.Schema.Types.Mixed], default: [] },
  prev_all_bowlers: { type: [mongoose.Schema.Types.Mixed], default: [] },
  prev_wickets: { type: Number, default: null },
  target: { type: Number, default: null },
  winner: { type: String, default: null },
  secondInning: {type: Boolean, default: false},
  current_over: {type: [mongoose.Schema.Types.Mixed], default:[]}
}, { timestamps: true });

const Score = mongoose.models?.Score || mongoose.model("Score", matchSchema);

module.exports = Score;
