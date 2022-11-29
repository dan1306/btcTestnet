const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema(
  {
    address: { type: String },
    data: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Search", searchSchema);
