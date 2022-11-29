const fetch = require("node-fetch");
const Search = require("../models/search");

async function searchAddress(req, res) {
  let addr = req.body.addrs;

  let findAddr = await Search.findOne({ address: addr });
  console.log(findAddr);

  if (findAddr) {
    console.log(findAddr);
    return res.status(200).json(findAddr);
  } else {
    let fetchResponse = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
    );
    if (fetchResponse.ok) {
      fetchResponse = await fetchResponse.json();

      let searchField = new Search();
      searchField.address = addr;
      searchField.data = fetchResponse;
      searchField.save();
      res.status(200).json(searchField);
    } else {
      fetchResponse = await fetchResponse.json();

      res.status(200).json(fetchResponse);
    }
  }
}

module.exports = {
  searchAddress,
};
