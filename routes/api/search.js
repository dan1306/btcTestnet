const express = require("express");
const router = express.Router();
const searchCtrl = require("../../controllers//search");

// POST /api/search/searchAddre
router.post("/searchAddre", searchCtrl.searchAddress);
router.put("/editAddre", searchCtrl.editAddress);

module.exports = router;
