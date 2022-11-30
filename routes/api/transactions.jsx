const express = require("express");
const router = express.Router();
const transactionCtrl = require("../../controllers/transactions");

// POST /api/transactions/sendTransaction
router.post("/sendTransaction", transactionCtrl.sendTransaction);

module.exports = router;