// This is a framework to handle server-side content

// You have to do an 'npm install express' to get the package
// Documentation in: https://expressjs.com/en/starter/hello-world.html
import express from "express";

import * as db from "./db.mjs";

var app = express();
let port = 3001;

db.connect();

app.use(express.static("."));

app.get("/player", function (request, response) {
  db.queryPlayerByName(request.query.name, (results) => {
    response.json(results);
  });
});

app.get("/tournaments", function (request, response) {
  db.queryTournamentsByYear(request.query.year, (results) => {
    response.json(results);
  });
});

app.get("/playerStatistics", function (request, response) {
  db.showAggregateStatistics(
    request.query.name,
    request.query.start,
    request.query.finish,
    (results) => {
      response.json(results[0]);
    }
  );
});

app.listen(port, () => console.log("Server is starting on PORT,", port));

process.on("exit", () => {
  db.disconnect();
});
