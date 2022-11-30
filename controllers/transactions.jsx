const fetch = require("node-fetch");
var bitcoin = require("bitcoinjs-lib");
var secp = require("tiny-secp256k1");
var ecfacory = require("ecpair");
const Wallet = require("../models/wallet");

let ECPair = ecfacory.ECPairFactory(secp);



async function sendTransaction(req, res) {


    return res.status(200).json(req.body)



    const keyBuffer = Buffer.from(
        "8de0598c0bde20de97b9324960d20f4388290a496a82b420e9c6d826bf68d33c",
        "hex"
      );
      let keys = ECPair.fromPrivateKey(keyBuffer);
      
      let newtx = {
        inputs: [
          {
            addresses: ["mig6drj6HusuAFLE7qr5ejR7rCYWKzjB1y"],
          },
        ],
        outputs: [
          {
            addresses: ["mzhxo3HtY1Wc2o3w5aFUYFpm3soGVhPZp6"],
            value: 1,
          },
        ],
      };


  let resp = await fetch(
    "https://api.blockcypher.com/v1/btc/test3/txs/new?token=e973117a41414b4fb70ca58fdc51c9e6",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newtx),
    }
  );

  let responses;

  if (resp.ok) {
    responses = await resp.json();
    // console.log("dannnnn",resp, responses)
  } else {
    responses = await resp.json();

    console.log(resp.ok, responses);
    return res.status(400).json("bad req");
  }

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
  console.log("DAA", obj);

  // // https://api.blockcypher.com/v1/btc/main/txs/send?token=e973117a41414b4fb70ca58fdc51c9e6

  try {
    // console.log("daniel", obj.tx.inputs, obj.tx.outputs)
    let sen = await fetch(
      "https://api.blockcypher.com/v1/btc/test3/txs/send?token=e973117a41414b4fb70ca58fdc51c9e6",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses),
      }
    );

    let out = await sen.json();

    console.log("danielss", sen, out);

    return res.status(200).json("good request");
  } catch (e) {
    console.log(e);
    return res.status(400).json("bad request");
  }

}

module.exports = {
    sendTransaction
  };
  