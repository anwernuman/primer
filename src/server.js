// This example is built using express
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const PRIMER_API_URL = process.env.PRIMER_API_URL;

const app = express();

const staticDir = path.join(__dirname, "static");
const checkoutPage = path.join(__dirname, "static", "checkout.html");

app.use(bodyParser.json());
app.use("/static", express.static(staticDir));

app.get("/", (req, res) => {
  return res.sendFile(checkoutPage);
});

app.post("/client-token", async (req, res) => {
  const url = `https://api.sandbox.primer.io/auth/client-token`;

  try{
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": '3a6f583a-7392-498a-b79e-0fd69ffb7aee',
    },
  });

  const json = await response.json();
  console.log(json);
  return res.send(json);
}catch(e){
  console.log(e);
}
});

app.post("/authorize", async (req, res) => {
  const { token } = req.body;
  const url = `https://api.sandbox.primer.io/payments`;

  const orderId = "order-123." + Math.random();
try{
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key":"3a6f583a-7392-498a-b79e-0fd69ffb7aee",
      "Idempotency-Key": orderId, // Optionally add an idempotency key
    },
    body: JSON.stringify({
      amount: 700,
      currencyCode: "GBP",
      orderId: orderId,
      paymentInstrument: {
        token: token,
      },
    }),
  });

  const json = await response.json();
  console.log(json);
  return res.send(json);

}catch(e){
  console.log(e);
}
});

console.log(`Checkout server listening on port ${PORT}.\n\nYou can now view the Checkout in a web browser at http://localhost:${PORT}`);
app.listen(PORT);
