const express = require("express");
const router = express.Router();
const wallet = require("../../controllers/wallet");

// POST /api/users/signup
router.post("/createWallet", wallet.createWallet);

module.exports = router;
