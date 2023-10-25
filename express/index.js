const express = require("express");
const app = express();

console.dir(app);

let port = 8080;

app.listen(port, () => {
  console.log("app is listning on port 8080");
});

// app.use((req, res) => {
//   //console.log(req);
//   console.log("req received");
//   res.send({
//     name: "apple",
//     color: "red",
//   });
// });

// routing
app.get("/", (req, res) => {
  res.send("root path");
});

// app.get("/second", (req, res) => {
//   res.send("u contected second path");
// });

// app.get("/next", (req, res) => {
//   res.send("u contected next path");
// });
// app.get("*", (req, res) => {
//   res.send("not exit path");
// });

// app.post("/", (req, res) => {
//   res.send("you sent a post request to root");
// });

//path params
app.get("/:username/:id", (req, res) => {
  let { username, id } = req.params;
  let htmlstr = `<h1> welcome to the page of @${username}!<h1>`;
  res.send(htmlstr);
});
