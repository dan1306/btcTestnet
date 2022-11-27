const express = require("express");
const router = express.Router();
const wallet = require("../../controllers/wallet");

// POST /api/wallet/createWallet
router.post("/createWallet", wallet.createWallet);

// GET /api/wallet/yourWallets
router.get("/yourWallets", wallet.yourWallets);
module.exports = router;
