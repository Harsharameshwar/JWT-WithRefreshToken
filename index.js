const express = require("express");
const dotenv = require("dotenv");
const app = express();
const jwt = require("jsonwebtoken");

dotenv.config();

app.use(express.json());

const posts = [
  {
    username: "Harsha",
    title: "Post 1",
  },
  {
    username: "Vidhya",
    title: "Post 2",
  },
];

app.get("/posts", authenticationToken, (req, res) => {
    console.log(req.user);
  res.status(200).json(posts.filter((post) => post.username === req?.user?.name));
});

function authenticationToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
        res.status(403).json("Token Invalid");
    }
    req.user = user;
    next();
  });
}

app.listen(5000, (req, res) => {
  console.log("Server is up and running!");
});
