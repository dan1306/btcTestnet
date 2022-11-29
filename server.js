const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
var bitcoin = require("bitcoinjs-lib");
var secp = require("tiny-secp256k1");
var ecfacory = require("ecpair");

var ECPair = ecfacory.ECPairFactory(secp);

const keyBuffer = Buffer.from(
  "1dc8983078c5bcc27a87a645820faa7a8261674d9c4a423be39cb819ca38a1e0",
  "hex"
);
var keys = ECPair.fromPrivateKey(keyBuffer);

var newtx = {
  inputs: [
    {
      addresses: ["mzhxo3HtY1Wc2o3w5aFUYFpm3soGVhPZp6"],
      
    },
  ],
  outputs: [
    {
      addresses: ["mig6drj6HusuAFLE7qr5ejR7rCYWKzjB1y"],
      value: 100,
    },
  ],
};

require("dotenv").config();
require("./config/database");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, "build", "favicon.ico")));
app.use(express.static(path.join(__dirname, "build")));


app.use("/api/user", require("./routes/api/user"));
app.use(require("./config/auth"));
app.use("/api/wallet", require("./routes/api/wallet"));
app.use("/api/search", require("./routes/api/search"));

app.use(express.static(path.join(__dirname, "build")));




app.post("/sendTransaction", async (req, res) => {
  let resp = await fetch(
    "https://api.blockcypher.com/v1/btc/test3/txs/new?token=e973117a41414b4fb70ca58fdc51c9e6",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newtx),
    }
  );

  let responses

  if (resp.ok) {
    responses = await resp.json();
    // console.log("dannnnn",resp, responses)

  } else {
    responses = await resp.json();

    console.log(resp.ok, responses)
    return res.status(400).json('bad req')
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


  let obj = {}

  obj['tx'] = responses.tx

  obj["tosign"] = responses.tosign

  obj["signatures"] = responses.signatures

  obj["pubkeys"] = "responses.pubkeys"
    console.log('DAA',obj)


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

    console.log("danielss",sen, out)

    return res.status(200).json("good request");
  } catch (e) {
    console.log(e)
    return res.status(400).json("bad request");

  }






  // let sentBack = await fetch(
  //   "https://api.blockcypher.com/v1/btc/test3/txs/send?token=e973117a41414b4fb70ca58fdc51c9e6",
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(sen),
  //   }
  // ).done(function (finaltx) {
  //     console.log(finaltx);
  //   })
  //   .fail(function (xhr) {
  //     console.log(xhr.responseText);
  //   });


  // console.log(sen)
  // res.status(200).json("good request");


});





app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Express app running on port ${port}`);
});






// app.post("/generateAddress", async (req, res) => {
//   let data = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//   };

//   let url = `https://api.blockcypher.com/v1/btc/test3/addrs?token=${process.env.token}`;

//   let fetchResponse = await fetch(url, data);

//   let data2 = await fetchResponse.json();

//   console.log(fetchResponse.ok, data2);

//   res.status(200).json("crea");
// });

// app.post("/createWallet", async (req, res) => {
//   console.log(req.body);

//   let data = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(req.body),
//   };

//   let fetchResponse = await fetch(
//     `https://api.blockcypher.com/v1/btc/test3/wallets?token=${process.env.token}`,
//     data
//   );

//   let data2 = await fetchResponse.json();

//   console.log(fetchResponse.ok, data2);

//   res.status(200).json("cool");

//   // let data = {
//   //   method: "POST",
//   //   headers: { "Content-Type": "application/json" },
//   //   body: JSON.stringify({

//   //   }),
//   // };
// });

// app.post("/sendTransaction", async (req, res) => {
//   let resp = await fetch(
//     "https://api.blockcypher.com/v1/btc/test3/txs/new?token=e973117a41414b4fb70ca58fdc51c9e6",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newtx),
//     }
//   );

//   let responses

//   if (resp.ok) {
//     responses = await resp.json();
//     // console.log("dannnnn",resp, responses)

//   } else {
//     responses = await resp.json();

//     console.log(resp.ok, responses)
//     return res.status(400).json('bad req')
// }


  




//   responses.pubkeys = [];
//   responses.signatures = responses.tosign.map(function (tosign, n) {
//     responses.pubkeys.push(keys.publicKey.toString("hex"));
//     // console.log("pubkeyy",keys.publicKey.toString("hex"))
//     return bitcoin.script.signature
//       .encode(keys.sign(Buffer.from(tosign, "hex")), 0x01)
//       .toString("hex")
//       .slice(0, -2);
//   });


//   let obj = {}

//   obj['tx'] = responses.tx

//   obj["tosign"] = responses.tosign

//   obj["signatures"] = responses.signatures

//   obj["pubkeys"] = "responses.pubkeys"
//     console.log('DAA',obj)


//   // // https://api.blockcypher.com/v1/btc/main/txs/send?token=e973117a41414b4fb70ca58fdc51c9e6

//   try {
//     // console.log("daniel", obj.tx.inputs, obj.tx.outputs)
//     let sen = await fetch(
//       "https://api.blockcypher.com/v1/btc/test3/txs/send?token=e973117a41414b4fb70ca58fdc51c9e6",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(responses),
//       }
//     );
  
//     let out = await sen.json();

//     console.log("danielss",sen, out)

//     return res.status(200).json("good request");
//   } catch (e) {
//     console.log(e)
//     return res.status(400).json("bad request");

//   }






//   // let sentBack = await fetch(
//   //   "https://api.blockcypher.com/v1/btc/test3/txs/send?token=e973117a41414b4fb70ca58fdc51c9e6",
//   //   {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify(sen),
//   //   }
//   // ).done(function (finaltx) {
//   //     console.log(finaltx);
//   //   })
//   //   .fail(function (xhr) {
//   //     console.log(xhr.responseText);
//   //   });


//   // console.log(sen)
//   // res.status(200).json("good request");


// });
