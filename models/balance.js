const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const balanceSchema = new Schema(
  {
    address: { type: String },
    balance: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Balance", balanceSchema);
