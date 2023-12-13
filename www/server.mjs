// This is a framework to handle server-side content

// You have to do an 'npm install express' to get the package
// Documentation in: https://expressjs.com/en/starter/hello-world.html
import express from "express";
import bcryptjs from "bcryptjs";
import bodyParser from "body-parser";
import * as db from "./db.mjs";

var app = express();
let port = 3001;

db.connect();
app.use(express.static("."));
app.use(bodyParser.json());

app.get("/games", function (request, response) {
  db.queryGames(request.query, (results) => {
    response.json(results);
  });
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: true,
        message: "Username, email, and password are required",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    db.registerUser(username, email, hashedPassword, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: true,
          message: "Error registering new user",
        });
      }
      res
        .status(200)
        .json({ success: true, message: "User registered successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    db.loginUser(email, password, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: err.message });
      }
      // Login successful
      res
        .status(200)
        .json({ success: true, userId: user.UserID, username: user.Username });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/saveGame", async (req, res) => {
  const { userId, gameId } = req.body;

  try {
    db.saveGame(userId, gameId, (err, results) => {
      if (err) {
        return res.status(500).send("Error saving game");
      }

      res.status(201).send("Game saved successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/unsaveGame", async (req, res) => {
  const { userId, gameId } = req.body;

  try {
    db.unsaveGame(userId, gameId, (err, results) => {
      if (err) {
        return res.status(500).send("Error saving game");
      }

      res.status(201).send("Game unsaved successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/userGames", async (request, response) => {
  db.queryUserGames(request.query, (results) => {
    response.json(results);
  });
});

app.listen(port, () => console.log("Server is starting on PORT,", port));

process.on("exit", () => {
  db.disconnect();
});
