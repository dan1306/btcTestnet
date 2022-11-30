const fetch = require("node-fetch");
var bitcoin = require("bitcoinjs-lib");
var secp = require("tiny-secp256k1");
var ecfacory = require("ecpair");
const Wallet = require("../models/wallet");
const wallet = require("../models/wallet");

let ECPair = ecfacory.ECPairFactory(secp);



async function sendTransaction(req, res) {

  console.log(req.body)

  const { amntToSend, yourPubAdd, sendingToAddr } = req.body
  
  let youWalAddre = await wallet.findOne({ address: yourPubAdd })

  const keyBuffer = Buffer.from(
    youWalAddre.private,
    "hex"
  );

  let keys = ECPair.fromPrivateKey(keyBuffer);

  let newtx = {
    inputs: [
      {
        addresses: [yourPubAdd],
      },
    ],
    outputs: [
      {
        addresses: [sendingToAddr],
        value: amntToSend,
      },
    ],
  };

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
  