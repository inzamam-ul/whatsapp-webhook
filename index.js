const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const myToken = process.env.MY_TOKEN;
const token = process.env.TOKEN;

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === myToken) {
      res.status(200).json(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
  let bodyParam = req.body;
  console.log(JSON.stringify(bodyParam, null, 2));
  if (
    bodyParam.entry &&
    bodyParam.entry[0].changes[0].value.message &&
    bodyParam.entry[0].changes[0].value.message[0]
  ) {
    let phone_no_id =
      req.body.entry[0].changes[0].value.metadata.phone_number_id;
    let from = req.body.entry[0].changes[0].value.message[0].form;
    let msg_body = req.body.entry[0].changes[0].value.message[0].text.body;

    axios({
      method: "POST",
      url: `https://graph.facebook.com/v13.0/"${phon_no_id}/message?access_token=${token}`,
      data: {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: "I'm Inzamam",
        },
      },
      headers: {
        "Content—Type": "application/json",
      },
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/", (req, res) => {
  res.json({ status: "I'm alive" });
});

app.listen(4000, () => {
  console.log("webhook is listening");
});
