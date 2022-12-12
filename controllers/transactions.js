const fetch = require("node-fetch");
var bitcoin = require("bitcoinjs-lib");
var secp = require("tiny-secp256k1");
var ecfacory = require("ecpair");
const wallet = require("../models/wallet");

let ECPair = ecfacory.ECPairFactory(secp);

async function sendTransaction(req, res) {
  // First a post request is made to the API for required inputs for the transaction
  // Then data is sent back to be signed with owners private key to verify that it's
  // the owner making this demand.

  // Then the signed data is sent with a POST request to be  verified, and make a transaction
  // go through

  console.log(req.body);

  // from the req body we can find the amount a user wants to send
  // the wallet btc-testnet is being sent from, and the wallet being sent to
  const { amntToSend, yourPubAdd, sendingToAddr } = req.body;
  console.log(typeof amntToSend);

  try {
    // we find the wallet btc-testnet is being sent from in our database
    let youWalAddre = await wallet.findOne({ address: yourPubAdd });

    const keyBuffer = Buffer.from(youWalAddre.private, "hex");

    let keys = ECPair.fromPrivateKey(keyBuffer);

    // here we provide transaction info. Amount being sent, where it is being sent from,
    // and where it is going to.
    // we turn the amount being sent to a number. Errors occur when the amount being sent
    // is passed as a string
    let newtx = {
      inputs: [
        {
          addresses: [yourPubAdd],
        },
      ],
      outputs: [
        {
          addresses: [sendingToAddr],
          value: Number(amntToSend),
        },
      ],
    };

    // this is the first call we make, if it is a good response,
    // data is sent back, which has to be signed with the logged in users wallet private key
    // and sent of for validation of a transaction
    let resp = await fetch(
      `https://api.blockcypher.com/v1/btc/test3/txs/new?token=${process.env.token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newtx),
      }
    );

    let responses;

    if (resp.ok) {
      responses = await resp.json();
    } else {

      // if in the process of making a transaction
      // you dont have enough funds or you don't have enough funds
      // to cover fees and send btc-testnet errors are caught here
      // and sent to the front end
      // in this response we are sending back, there is an errors field
      // within the object
      responses = await resp.json();

      console.log(resp.ok, responses);
      return res.status(400).json(responses);
    }

    // here we are signing things that are required to be signed
    // to make a transaction possible
    responses.pubkeys = [];
    responses.signatures = responses.tosign.map(function (tosign, n) {
      responses.pubkeys.push(keys.publicKey.toString("hex"));
      // console.log("pubkeyy",keys.publicKey.toString("hex"))
      return bitcoin.script.signature
        .encode(keys.sign(Buffer.from(tosign, "hex")), 0x01)
        .toString("hex")
        .slice(0, -2);
    });

    let obj = {};

    obj["tx"] = responses.tx;

    obj["tosign"] = responses.tosign;

    obj["signatures"] = responses.signatures;

    obj["pubkeys"] = "responses.pubkeys";

    try {
      // with a signed field of the reponse we recieve from the first call
      // we make another call to the API to validate the signed fields
      // and make a transaction go through
      let sen = await fetch(
        `https://api.blockcypher.com/v1/btc/test3/txs/send?token=${process.env.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(responses),
        }
      );

      let out = await sen.json();

      if (sen.ok) {
        // if the response we get from making the second call is ok
        // we send the response to the front end to be handled
        console.log("transaction accomplishmed", sen.ok);

        return res.status(200).json(out);
      } else {
        // if the response we get from making the second call is not ok
        // we send the response to the front end to be handled
        console.log(sen.ok, out);
        return res.status(400).json(out);
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json("bad request");
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  sendTransaction,
};
