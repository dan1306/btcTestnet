const fetch = require("node-fetch");
const Search = require("../models/search");



let getTimeDiff = (n1, n2, m="m") => {
    let splitted1 = n1.split(":");
    let splitted2 = n2.split(":");
    let time1 = splitted1[0] + splitted1[1];
    let time2 = splitted2[0] + splitted2[1];
  
    if (time1 < time2) {
      let diff = getTimeDiff(n2, n1, "m");
      return diff;
    } else {
      let diff1 = getTimeDiff("24:00", n1, "m");
      let diff2 = getTimeDiff(n2, "00:00", "m");
      let totalDiff = diff1 + diff2;
      return totalDiff;
    }
  };

async function searchAddress(req, res) {
  let addr = req.body.addrs;

  let findAddr = await Search.findOne({ address: addr });
  console.log(findAddr);

  if (findAddr) {
    let tim1;
    if (findAddr.createdAt.toLocaleTimeString().length === 13) {
      tim1 = findAddr.createdAt.toLocaleTimeString().slice(0, 5);
    } else {
      tim1 = findAddr.createdAt.toLocaleTimeString().slice(0, 4);
    }
    let tim2;
    if (new Date().toLocaleTimeString().length === 13) {
        tim2 = new Date().toLocaleTimeString().slice(0, 5);
    } else {
        tim2 = new Date().toLocaleTimeString().slice(0, 4);
      }
      
    console.log(tim1, tim2);
    return res.status(200).json("cool");
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
