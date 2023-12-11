import { createConnection } from "mysql2";
import bcrypt from "bcrypt";

var connection = createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "lmy20030620",
  database: "BoardgameData",
});

function connect() {
  connection.connect();
}

function getGameIdByName(name, callback) {
  connection.query(
    "SELECT GameID FROM Games WHERE GameName LIKE ?",
    ["%" + name + "%"],
    (error, results) => {
      if (error) throw error;
      const gameIds = results.map((row) => row.GameID);
      callback(gameIds);
    }
  );
}

function getDesignerIdByName(name, callback) {
  connection.query(
    "SELECT DesignerID FROM Designers WHERE DesignerName LIKE ?",
    ["%" + name + "%"],
    (error, results) => {
      if (error) throw error;
      const designerIds = results.map((row) => row.DesignerID);
      callback(designerIds);
    }
  );
}

function getArtistIdByName(name, callback) {
  connection.query(
    "SELECT ArtistID FROM Artists WHERE ArtistName LIKE ?",
    ["%" + name + "%"],
    (error, results) => {
      if (error) throw error;
      const artistIds = results.map((row) => row.ArtistID);
      callback(artistIds);
    }
  );
}

function getPublisherIdByName(name, callback) {
  connection.query(
    "SELECT PublisherID FROM Publishers WHERE PublisherName LIKE ?",
    ["%" + name + "%"],
    (error, results) => {
      if (error) throw error;
      const publisherIds = results.map((row) => row.PublisherID);
      callback(publisherIds);
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

  // If no asynchronous tasks were added, immediately call the callback
  if (tasks === 0) {
    callback(options);
  }
}

function queryGames(options, callback) {
  // Initialize the base query and join clauses
  let baseQuery = `
    SELECT 
      Games.GameID, 
      Games.GameName, 
      Games.GameType, 
      Games.Rating, 
      Games.Complexity, 
      Games.YearPub, 
      Games.MinPlayer, 
      Games.MaxPlayer, 
      Games.MinTime, 
      Games.MaxTime,
      GROUP_CONCAT(DISTINCT Categories.CategoryName) AS Categories, 
      GROUP_CONCAT(DISTINCT Mechanics.MechanicName) AS Mechanics
    FROM Games
  `;

  let joins = [
    "LEFT JOIN Categorizes ON Games.GameID = Categorizes.GameID",
    "LEFT JOIN Categories ON Categorizes.CategoryID = Categories.CategoryID",
    "LEFT JOIN HaveMechanic ON Games.GameID = HaveMechanic.GameID",
    "LEFT JOIN Mechanics ON HaveMechanic.MechanicID = Mechanics.MechanicID",
  ];

  // Resolve names to IDs
  resolveNamesToIds(options, (resolvedOptions) => {
    let conditions = [];
    let params = [];

    // Add conditions for resolvedOptions
    if (resolvedOptions.game && resolvedOptions.game.length > 0) {
      conditions.push(`Games.GameID IN (${resolvedOptions.game.join(", ")})`);
    }

    if (resolvedOptions.publisher && resolvedOptions.publisher.length > 0) {
      joins.push("JOIN Publishes ON Games.GameID = Publishes.GameID");
      conditions.push(
        `Publishes.PublisherID IN (${resolvedOptions.publisher.join(", ")})`
      );
    }

    if (resolvedOptions.artist && resolvedOptions.artist.length > 0) {
      joins.push("JOIN Paints ON Games.GameID = Paints.GameID");
      conditions.push(
        `Paints.ArtistID IN (${resolvedOptions.artist.join(", ")})`
      );
    }

    if (resolvedOptions.designer && resolvedOptions.designer.length > 0) {
      joins.push("JOIN Designs ON Games.GameID = Designs.GameID");
      conditions.push(
        `Designs.DesignerID IN (${resolvedOptions.designer.join(", ")})`
      );
    }

    // Add conditions for rating and complexity
    if (options.rating) {
      conditions.push("Games.Rating >= ?");
      params.push(options.rating);
    }
    if (options.complexity) {
      conditions.push("Games.Complexity >= ?");
      params.push(options.complexity);
    }

    if (options.minPlayer) {
      conditions.push("Games.MinPlayer >= ?");
      params.push(options.minPlayer);
    }

    if (options.maxPlayer) {
      conditions.push("Games.MaxPlayer <= ?");
      params.push(options.maxPlayer);
    }

    if (options.minTime) {
      conditions.push("Games.MinTime >= ?");
      params.push(options.minTime);
    }

    if (options.maxTime) {
      conditions.push("Games.MaxTime <= ?");
      params.push(options.maxTime);
    }

    // Construct the final query
    let query =
      baseQuery +
      joins.join(" ") +
      (conditions.length ? " WHERE " + conditions.join(" AND ") : "") +
      " GROUP BY Games.GameID";

    connection.query(query, params, (error, results) => {
      if (error) {
        console.error(error);
        throw error;
      }
      callback(results);
    });
  });
}

function registerUser(username, email, hashedPassword, callback) {
  const query =
    "INSERT INTO Users (Username, Email, UserPassword) VALUES (?, ?, ?)";
  connection.query(query, [username, email, hashedPassword], (err, results) => {
    callback(err, results);
  });
}

function disconnect() {
  connection.end();
}

export { connection, connect, queryGames, registerUser, disconnect };

//For testing:
// connect();
// const searchOptions = {
//   rating: 9.0,
//   minPlayer: 1,
//   maxTime: 20,
// };

// queryGames(searchOptions, (results) => {
//   console.log("Test Results for queryGames:");
//   console.log(results);
//   disconnect();
// });

// async function testRegisterUser() {
//   connect();

//   try {
//     const username = "Jerry";
//     const email = "lmyjerry@gmail.com";
//     const password = "12345678";
//     const hashedPassword = await bcrypt.hash(password, 10);

//     registerUser(username, email, hashedPassword, (err, results) => {
//       if (err) {
//         console.error("Registration error:", err);
//       } else {
//         console.log("Registration successful:", results);
//       }
//       disconnect();
//     });
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     disconnect();
//   }
// }

// testRegisterUser();
