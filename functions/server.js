require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");

const bodyParser = require("body-parser");
const Pusher = require("pusher");

const app = express();
const router = express.Router();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

router.post("/ping", (req, res) => {
  const { lat, lng, userId, username, info } = req.body;
  const data = {
    lat,
    lng,
    userId,
    username,
    info,
  };
  pusher.trigger("location", "ping", data);
  res.json(data);
});
router.post("/remove", (req, res) => {
  const { userId } = req.body;
  const data = { userId };
  pusher.trigger("location", "remove", data);
  res.json(data);
});
router.post("/hello", (req, res) => {
  const { userId } = req.body;
  const data = { userId };
  pusher.trigger("location", "hello", data);
  res.json(data);
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
