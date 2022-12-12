const fetch = require("node-fetch");
const Search = require("../models/search");
const Wallet = require("../models/wallet");
const Balance = require("../models/balance");

async function addressBalance(req, res) {
  // from the request body we place the address we want to retrieve a
  // balance for in a variable
  let addr = req.body.addrs;

  // in our database we search if that particular address
  // and its balance already exist, and has been previously
  // searched for
  let findBal = await Balance.findOne({ address: addr });

  if (findBal) {
    // if that address exist in our databse
    // we calculate the min passed since it was last updated
    let tim1 = new Date(findBal.updatedAt);

    let tim2 = new Date();

    let minPassed = (Math.abs(tim2 - tim1) / 36e5) * 60;

    if (minPassed > 1) {
      // if min passed is greater than one we would want
      // to make an API call to retrieve the latest data
      // of this public address to retrieve its most recent balance
      let fetchResponse = await fetch(
        `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
      );

      if (fetchResponse.ok) {
        // if fetchResponse is ok, we turn the response we get
        // into info a dev can put to use, update our databse
        // and send it to the front end

        fetchResponse = await fetchResponse.json();

        // turning btc testnet into btc equivalanet amount
        findBal.balance = Number(fetchResponse.balance) / Math.pow(10, 8);

        findBal.updatedAt = new Date();

        findBal = await findBal.save()

        let obj = findBal;

        res.status(200).json(obj);
      } else  {
        // this block of code is probably never hit.
        // if an address exist in the databse it is a valid public address
        fetchResponse = await fetchResponse.json();

        return res.status(400).json(fetchResponse);
      }
    } else {
      // if a minute has not passed since address balance was last uodated
      // we send address detail to the front end
      let obj = findBal
      

      return res.status(200).json(obj);
    }
  } else {
    // if searched address does not exist in our database
    // a call is made to retieve latest data of that certain address

    let fetchResponse = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
    );

    if (fetchResponse.ok) {
      // On a good resposne to the API
      fetchResponse = await fetchResponse.json();

      // A new balance and address is added to the database and saved
      let newBalance = new Balance();
      newBalance.address = fetchResponse.address;
      newBalance.balance = Number(fetchResponse.balance) / Math.pow(10, 8);
      newBalance.save();

      // An object is sent to the front end with info on data on searched
      // for address
      let obj = newBalance;

      return res.status(200).json(obj);
    } else {
      // if address don't exist we return the fetchResponse to the front end
      // in this response there exist an err which can be put to use
      fetchResponse = await fetchResponse.json();

      console.log("it is daniel", fetchResponse);

      return res.status(400).json(fetchResponse);
    }
  }
}

async function searchAddress(req, res) {
  console.log(req.user);

  // Here we make a call to retrieve all wallets
  // associated with a users id and store it in a variable
  let userWallets = await Wallet.find({ userID: req.user._id });

  // Public address serched for which can be found in req body
  let addr = req.body.addrs;

  // Trying to find out if a given searched public address
  // has been preiviously searched for and exist in the database
  let findAddr = await Search.findOne({ address: addr });

  if (findAddr) {
    // if searched for public address exist in our database of searched
    //addresses

    // With this code we find out minutes passed from the time it was last updated
    // and the current time.
    let tim1 = new Date(findAddr.updatedAt);

    let tim2 = new Date();

    let minPassed = (Math.abs(tim2 - tim1) / 36e5) * 60;

    if (minPassed > 30) {
      // if 30 min has passed since searched pub address was last updated

      // we make a get call to retrive all latest data of a searched public address
      // to the blockcypher API
      let fetchResponse = await fetch(
        `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
      );

      if (fetchResponse.ok) {
        // if we get a good response while making the API call

        fetchResponse = await fetchResponse.json();

        // we replace the data in our database with retrived data from the API
        findAddr.data = fetchResponse;

        // we replace the updatedAt time to the current time
        findAddr.updatedAt = new Date();

        // we save the latest Data
        findAddr = await findAddr.save();

        // This is an object we return to the front end
        // With info on if this is a new searched for address
        // in the database, if info has been updated, data in a given searched address
        // and All wallets associated with a given user to make a transaction
        let obj = {
          newData: false,

          updated: true,
          minutesPassed: 0,
          adressObj: findAddr,
          userWallets: userWallets,
        };

        res.status(200).json(obj);
      } else {
        // this block of code is probably never hit.
        // if an address exist in the databse it is a valid public address
        fetchResponse = await fetchResponse.json();

        return res.status(400).json(fetchResponse);
      }
    } else {
      // if 30 min has not passed a similar object like the one we sent when 30 min passed is sent to the front end
      // but in this case updated is false and min passed is the calculated amount of time passed from time data was last
      // updated and the current time
      let obj = {
        newData: false,
        updated: false,
        minutesPassed: minPassed,
        adressObj: findAddr,
        userWallets: userWallets,
      };

      return res.status(200).json(obj);
    }
  } else {
    // if searched address does not exist in our database
    // a call is made to retieve latest data about that certain address

    let fetchResponse = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
    );

    if (fetchResponse.ok) {
      // On a good resposne to the API
      fetchResponse = await fetchResponse.json();

      // A new address is added to the database with its data and saved
      let searchField = new Search();
      searchField.address = addr;
      searchField.data = fetchResponse;
      searchField.save();

      // An object is sent to the front end with info on if the data is new info in the database
      // the data regarding that giving address, and wallets associated with a given user
      let obj = {
        newData: true,
        updated: true,
        minutesPassed: 0,
        adressObj: searchField,
        userWallets: userWallets,
      };

      return res.status(200).json(obj);
    } else {
      // if address don't exist we return the fetchResponse to the front end
      // in this response there exist an err which can be put to use
      fetchResponse = await fetchResponse.json();

      console.log("it is daniel", fetchResponse);

      return res.status(400).json(fetchResponse);
    }
  }
}

async function editAddress(req, res) {
  // Typicall an address data is updated every 30 min on search
  // but for those who don't want to wait, this is the block of code
  // that is hit when you click Update data in the details below the search field

  console.log("zzzz", req.body.addrs, req.user);

  // We store the searched for pub address in a variable
  let addr = req.body.addrs;

  // here we search for public address in our database
  let findAddr = await Search.findOne({ address: addr });

  // here we are making a call to the API to retrieve data for a searched
  // public address
  let fetchResponse = await fetch(
    `https://api.blockcypher.com/v1/btc/test3/addrs/${addr}/full?limit=50`
  );
  if (fetchResponse.ok) {
    fetchResponse = await fetchResponse.json();

    // if response is ok data in the databse of a a particular address
    // is changed to the data we recieve while making an API call, updatedAt is change to the current time
    // data is saved
    findAddr.data = fetchResponse;
    findAddr.updatedAt = new Date();
    findAddr = await findAddr.save();

    // this is an object sent to the front end with info on the searched for address
    let obj = {
      newData: false,
      updated: true,
      minutesPassed: 0,
      adressObj: findAddr,
    };

    res.status(200).json(obj);
  } else {
    // There hasn't been an instannce where this code is ever hit
    fetchResponse = await fetchResponse.json();

    return res.status(400).json(fetchResponse);
  }
}

module.exports = {
  searchAddress,
  editAddress,
  addressBalance
};
