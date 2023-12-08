// This is a framework to handle server-side content

// You have to do an 'npm install express' to get the package
// Documentation in: https://expressjs.com/en/starter/hello-world.html
import express from "express";

import * as db from "./db.mjs";

var app = express();
let port = 3001;

db.connect();

app.use(express.static("."));

app.get("/games", function (request, response) {
  db.queryGames(request.query, (results) => {
    response.json(results);
  });
});

app.listen(port, () => console.log("Server is starting on PORT,", port));

process.on("exit", () => {
  db.disconnect();
});
