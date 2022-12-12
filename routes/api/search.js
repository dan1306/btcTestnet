const express = require("express");
const router = express.Router();
const searchCtrl = require("../../controllers/search");

// POST /api/search/searchAddre
router.post("/searchAddre", searchCtrl.searchAddress);

// POST /api/search/editAddre
router.put("/editAddre", searchCtrl.editAddress);

// POST /api/search/addressBalance
router.post("/addressBalance", searchCtrl.addressBalance);


module.exports = router;
