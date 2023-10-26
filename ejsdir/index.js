const express = require("express");
const app = express();
const path = require("path");
const port = 8000;
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("hello", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log("listening at port 8000 ");
});

// app.get("/rolldice", (req, res) => {
//   let diceVal = Math.floor(Math.random() * 6) + 1;
//   res.render("rolldice.ejs", { diceVal });
// });

// app.get("/ig/:username", (req, res) => {
//   let followrs = ["adam", "bob", "steve", "john"];
//   let { username } = req.params;
//   res.render("instagram.ejs", { username, followers });
// });

app.get("/ig/:username", (req, res) => {
  let { username } = req.params;
  const instaData = require("./data.json");
  const data = instaData[username];
  res.render("instagram.ejs", { data });
});
