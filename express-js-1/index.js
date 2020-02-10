const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = [];

const cookieOptions = {
  httpOnly: true,
  secure: false,
  expires: new Date("10-10-2099")
};

// middlewares

app.use("/", (req, res, next) => {
  const { cookies } = req;

  if (!cookies.time) {
    res.cookie("time", new Date(), cookieOptions);
  }

  next();
});

app.use("/posts", (req, res, next) => {
  res.cookie("postInfo", "cookie for post", cookieOptions);
  next();
});

// requests

app.get("/", (req, res) => {
  const { time } = req.cookies;

  const html = `
    <h1>Express.js app</h1>
    <p>Date: ${time}
  `;

  res.send(html);
  res.end();
});

app.get("/posts/:postId", (req, res) => {
  const { postInfo } = req.cookies;
  const serializedHeaders = JSON.stringify(req.headers);

  const html = `
    <h1>Params</h1>
    <ul>
      <li>Params: ${req.params.postId}</li>
      <li>Cookies: ${postInfo}</li>
      <li>Headers: ${serializedHeaders}</li>
    </ul>
  `;

  res.send(html);
  res.end();
});

app.get("/form", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/forms.html"), err => {
    console.log(err);
  });
});

app.post("/form", (req, res) => {
  users.push(req.body);
  res.redirect("/result");
  res.end();
});

app.get("/result", (req, res) => {
  res.send(users);
  res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
