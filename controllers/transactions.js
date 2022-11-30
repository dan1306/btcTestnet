const fetch = require("node-fetch");
var bitcoin = require("bitcoinjs-lib");
var secp = require("tiny-secp256k1");
var ecfacory = require("ecpair");
const wallet = require("../models/wallet");

let ECPair = ecfacory.ECPairFactory(secp);

async function sendTransaction(req, res) {
  console.log(req.body);

  const { amntToSend, yourPubAdd, sendingToAddr } = req.body;
  console.log(typeof amntToSend);
  try {
    let youWalAddre = await wallet.findOne({ address: yourPubAdd });

    const keyBuffer = Buffer.from(youWalAddre.private, "hex");

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
          value: Number(amntToSend),
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
      return res.status(400).json(responses);
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
        `https://api.blockcypher.com/v1/btc/test3/txs/send?token=${process.env.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(responses),
        }
      );

      let out = await sen.json();

      if (sen.ok) {
        console.log(sen.ok);

        return res.status(200).json(out);
      } else {
        console.log(sen.ok, out);
        return res.status(200).json(out);
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
