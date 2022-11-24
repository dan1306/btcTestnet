const express = require("express");
// const path = require("path");
// const favicon = require("serve-favicon");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");


require("dotenv").config();
require("./config/database");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());


app.post("/generateAddress", async (req, res) => {

  let data = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }

  let url =`https://api.blockcypher.com/v1/btc/test3/addrs?token=${process.env.token}&bech32=true`

  let fetchResponse = await fetch(url, data)

  let data2 = await fetchResponse.json()

  console.log(fetchResponse.ok ,data2)

  res.status(200).json("crea")
  
})


app.post('/createWallet', async (req, res) => {
  
  console.log(req.body)

  let data = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(req.body)
  };

  let fetchResponse =  await fetch(`https://api.blockcypher.com/v1/btc/test3/wallets?token=${process.env.token}`, data);

  let data2 = await fetchResponse.json()

  console.log(fetchResponse.ok ,data2)

  res.status(200).json("cool")

  // let data = {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
      
  //   }),
  // };

  
})


const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Express app running on port ${port}`);
});