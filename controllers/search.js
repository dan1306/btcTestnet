const fetch = require("node-fetch");
const Search = require("../models/search");
const Wallet = require("../models/wallet");

async function searchAddress(req, res) {
  console.log(req.user);

  let userWallets = await Wallet.find({ userID: req.user._id });

  let addr = req.body.addrs;

  let findAddr = await Search.findOne({ address: addr });

  if (findAddr) {
    let tim1 = new Date(findAddr.updatedAt);

    let tim2 = new Date();

    let minPassed = (Math.abs(tim2 - tim1) / 36e5) * 60;

    if (minPassed > 30) {
      let fetchResponse = await fetch(
        `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
      );
      if (fetchResponse.ok) {
        fetchResponse = await fetchResponse.json();

        findAddr.data = fetchResponse;
        findAddr.updatedAt = new Date();
        findAddr = await findAddr.save();
        // console.log(fetchResponse);
        let obj = {
          newData: false,

          updated: true,
          minutesPassed: 0,
          adressObj: findAddr,
          userWallets: userWallets
        };

        res.status(200).json(obj);
      } else {
        fetchResponse = await fetchResponse.json();

        return res.status(400).json(fetchResponse);
      }
    } else {
      let obj = {
        newData: false,
        updated: false,
        minutesPassed: minPassed,
        adressObj: findAddr,
        userWallets: userWallets
      };

      return res.status(200).json(obj);
    }
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
      let obj = {
        newData: true,
        updated: true,
        minutesPassed: 0,
        adressObj: searchField,
        userWallets: userWallets
      };

      return res.status(200).json(obj);
    } else {
      fetchResponse = await fetchResponse.json();

      return res.status(400).json(fetchResponse);
    }
  }
}

async function editAddress(req, res) {
  console.log("zzzz", req.body.addrs, req.user);
  let addr = req.body.addrs;

  let findAddr = await Search.findOne({ address: addr });

  let fetchResponse = await fetch(
    `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
  );
  if (fetchResponse.ok) {
    fetchResponse = await fetchResponse.json();

    findAddr.data = fetchResponse;
    findAddr.updatedAt = new Date();
    findAddr = await findAddr.save();
    // console.log(fetchResponse);
    let obj = {
      newData: false,

      updated: true,
      minutesPassed: 0,
      adressObj: findAddr,
    };

    res.status(200).json(obj);
  } else {
    fetchResponse = await fetchResponse.json();

    return res.status(400).json(fetchResponse);
  }
}

module.exports = {
  searchAddress,
  editAddress,
};
