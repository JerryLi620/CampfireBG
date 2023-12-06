import { createConnection } from "mysql2";

var connection = createConnection({
  host: "localhost",
  user: "root",
  password: "lmy20030620",
  database: "BoardgameData",
});

function connect() {
  connection.connect();
}

function getDesignerIdByName(name, callback) {
  connection.query(
    "SELECT DesignerID FROM Designers WHERE DesignerName = ?",
    [name],
    (error, results) => {
      if (error) throw error;
      callback(results.length > 0 ? results[0].DesignerID : null);
    }
  );
}

function resolveNamesToIds(options, callback) {
  if (options.designerName) {
    getDesignerIdByName(options.designerName, (designerId) => {
      console.log("id:", designerId);
      options.designer = designerId;
      delete options.designerName;
      // Continue for other fields like artistName, publisherName, etc.
      callback(options);
    });
  } else {
    callback(options);
  }
}

function queryGames(options, callback) {
  resolveNamesToIds(options, (resolvedOptions) => {
    let baseQuery = "SELECT * FROM Games ";
    let joins = [];
    let conditions = [];
    let params = [];

    if (resolvedOptions.publisher) {
      joins.push("JOIN Publishes ON Games.GameID = Publishes.GameID");
      conditions.push("Publishes.PublisherID = ?");
      params.push(resolvedOptions.publisher);
    }

    if (resolvedOptions.artist) {
      joins.push("JOIN Paints ON Games.GameID = Paints.GameID");
      conditions.push("Paints.ArtistID = ?");
      params.push(resolvedOptions.artist);
    }

    if (resolvedOptions.designer) {
      joins.push("JOIN Designs ON Games.GameID = Designs.GameID");
      conditions.push("Designs.DesignerID = ?");
      params.push(resolvedOptions.designer);
    }

    if (resolvedOptions.category) {
      joins.push("JOIN Categorizes ON Games.GameID = Categorizes.GameID");
      conditions.push("Categorizes.CategoryID = ?");
      params.push(resolvedOptions.publisher);
    }

    if (resolvedOptions.mechanic) {
      joins.push("JOIN Mechanics ON Games.GameID = HaveMechanic.GameID");
      conditions.push("Mechanics.MechanicID = ?");
      params.push(resolvedOptions.publisher);
    }

    let query =
      baseQuery +
      joins.join(" ") +
      (conditions.length ? " WHERE " + conditions.join(" AND ") : "");

    console.log(joins);
    console.log(conditions);
    console.log(params);
    console.log(query);
    connection.query(query, params, (error, results) => {
      if (error) throw error;
      callback(results);
    });
  });
}

function disconnect() {
  connection.end();
}

export { connection, connect, queryGames, disconnect };

// For testing:
connect();
queryGames({ designerName: "Karl-Heinz Schmiel" }, (results) => {
  console.log(results);
  disconnect();
});

// const testCases = [
//   { publisher: 1, artist: null, designer: null },
//   { publisher: null, artist: 2, designer: null },
//   { publisher: null, artist: null, designer: 3 },
//   { publisher: 1, artist: 2, designer: null },
//   { publisher: null, artist: 2, designer: 3 },
//   { publisher: 1, artist: null, designer: 3 },
//   { publisher: 1, artist: 2, designer: 3 },
// ];

// testCases.forEach((testCase, index) => {
//   console.log(`\nRunning Test Case ${index + 1}:`, testCase);
//   db.queryGames(testCase, (results) => {
//     console.log(`Results for Test Case ${index + 1}:`, results);
//   });
// });
