import { createConnection } from "mysql2";

var connection = createConnection({
  host: '127.0.0.1',
  user: "root",
  password: '',
  database: "BoardgameData",
});

function connect() {
  connection.connect();
}

function getGameIdByName(name, callback) {
  connection.query(
    "SELECT GameID FROM Games WHERE GameName = ?",
    [name],
    (error, results) => {
      if (error) throw error;
      callback(results.length > 0 ? results[0].GameID : null);
    }
  );
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

function getArtistIdByName(name, callback) {
  connection.query(
    "SELECT ArtistID FROM Artists WHERE ArtistName = ?",
    [name],
    (error, results) => {
      if (error) throw error;
      callback(results.length > 0 ? results[0].ArtistID : null);
    }
  );
}

function getPublisherIdByName(name, callback) {
  connection.query(
    "SELECT PublisherID FROM Publishers WHERE PublisherName = ?",
    [name],
    (error, results) => {
      if (error) throw error;
      callback(results.length > 0 ? results[0].PublisherID : null);
    }
  );
}

function getCategoryIdByName(name, callback) {
  connection.query(
    "SELECT CategoryID FROM Categories WHERE CategoryName = ?",
    [name],
    (error, results) => {
      if (error) throw error;
      callback(results.length > 0 ? results[0].CategoryID : null);
    }
  );
}

function getMechanicIdByName(name, callback) {
  connection.query(
    "SELECT MechanicID FROM Mechanics WHERE MechanicName = ?",
    [name],
    (error, results) => {
      if (error) throw error;
      callback(results.length > 0 ? results[0].MechanicID : null);
    }
  );
}

function resolveNamesToIds(options, callback) {
  let tasks = 0; // To keep track of asynchronous tasks

  function decrementTasksAndCallCallback() {
    tasks--;
    if (tasks === 0) {
      callback(options);
    }
  }

  if (options.gameName) {
    tasks++;
    getGameIdByName(options.gameName, (gameId) => {
      options.game = gameId;
      delete options.gameName;
      decrementTasksAndCallCallback();
    });
  }

  if (options.designerName) {
    tasks++;
    getDesignerIdByName(options.designerName, (designerId) => {
      options.designer = designerId;
      delete options.designerName;
      decrementTasksAndCallCallback();
    });
  }

  if (options.artistName) {
    tasks++;
    getArtistIdByName(options.artistName, (artistId) => {
      options.artist = artistId;
      delete options.artistName;
      decrementTasksAndCallCallback();
    });
  }

  if (options.publisherName) {
    tasks++;
    getPublisherIdByName(options.publisherName, (publisherId) => {
      options.publisher = publisherId;
      delete options.publisherName;
      decrementTasksAndCallCallback();
    });
  }

  if (options.categoryName) {
    tasks++;
    getCategoryIdByName(options.categoryName, (categoryId) => {
      options.category = categoryId;
      delete options.categoryName;
      decrementTasksAndCallCallback();
    });
  }

  if (options.mechanicName) {
    tasks++;
    getMechanicIdByName(options.mechanicName, (mechanicId) => {
      options.mechanic = mechanicId;
      delete options.mechanicName;
      decrementTasksAndCallCallback();
    });
  }

  // If no asynchronous tasks were added, immediately call the callback
  if (tasks === 0) {
    callback(options);
  }
}

function queryGames(options, callback) {
  resolveNamesToIds(options, (resolvedOptions) => {
    let baseQuery = "SELECT * FROM Games ";
    let joins = [];
    let conditions = [];
    let params = [];

    if (resolvedOptions.game) {
      conditions.push("Games.GameID = ?");
      params.push(resolvedOptions.game);
    }

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
      joins.push("JOIN HaveMechanic ON Games.GameID = HaveMechanic.GameID");
      conditions.push("HaveMechanic.MechanicID = ?");
      params.push(resolvedOptions.publisher);
    }
    // console.log(conditions);
    let query =
      baseQuery +
      joins.join(" ") +
      (conditions.length ? " WHERE " + conditions.join(" AND ") : "");

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
// connect();
// queryGames(
//   {
//     gameName: "Dune",
//   },
//   (results) => {
//     console.log(results);
//     disconnect();
//   }
// );

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
