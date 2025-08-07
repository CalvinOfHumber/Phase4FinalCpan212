const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number, required: true },
  genres: { type: String, required: true },
  rating: { type: Number, required: true },
  createdBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
