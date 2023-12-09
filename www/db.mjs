import { createConnection } from "mysql2";
import bcrypt from "bcrypt";

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

function getCategoryIdByName(name, callback) {
  connection.query(
    "SELECT CategoryID FROM Categories WHERE CategoryName LIKE ?",
    ["%" + name + "%"],
    (error, results) => {
      if (error) throw error;
      const categoryIds = results.map((row) => row.CategoryID);
      callback(categoryIds);
    }
  );
}

function getMechanicIdByName(name, callback) {
  connection.query(
    "SELECT MechanicID FROM Mechanics WHERE MechanicName LIKE ?",
    ["%" + name + "%"],
    (error, results) => {
      if (error) throw error;
      const mechanicIds = results.map((row) => row.MechanicID);
      callback(mechanicIds);
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
      conditions.push(`Games.GameID IN (${resolvedOptions.game.join(", ")})`);
      params.push(resolvedOptions.game);
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

    if (resolvedOptions.category && resolvedOptions.category.length > 0) {
      joins.push("JOIN Categorizes ON Games.GameID = Categorizes.GameID");
      conditions.push(
        `Categorizes.CategoryID IN (${resolvedOptions.category.join(", ")})`
      );
    }

    if (resolvedOptions.mechanic && resolvedOptions.mechanic.length > 0) {
      joins.push("JOIN HaveMechanic ON Games.GameID = HaveMechanic.GameID");
      conditions.push(
        `HaveMechanic.MechanicID IN (${resolvedOptions.mechanic.join(", ")})`
      );
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
async function testRegisterUser() {
  connect();

  try {
    const username = "Jerry";
    const email = "lmyjerry@gmail.com";
    const password = "12345678";
    const hashedPassword = await bcrypt.hash(password, 10);

    registerUser(username, email, hashedPassword, (err, results) => {
      if (err) {
        console.error("Registration error:", err);
      } else {
        console.log("Registration successful:", results);
      }
      disconnect();
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    disconnect();
  }
}

// testRegisterUser();
