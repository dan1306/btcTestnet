const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
  private: { type: String },
  public: { type: String },
  address: { type: String },
  wif: { type: String },
  name: { type: String },
  userID: { type: String },
});

module.exports = mongoose.model("Wallet", walletSchema);
