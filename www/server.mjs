// This is a framework to handle server-side content

// You have to do an 'npm install express' to get the package
// Documentation in: https://expressjs.com/en/starter/hello-world.html
import express from "express";
import bcrypt from "bcrypt";
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
      return res.status(400).send("Username, email, and password are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.registerUser(username, email, hashedPassword, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error registering new user");
      }
      res.status(201).send("User registered successfully");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    db.loginUser(email, password, async (err, user) => {
      console.log("login");
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error on login" });
      }

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.hashedPassword);
      console.log("match");
      if (isMatch) {
        res.status(200).json({ success: true, username: user.Username });
      } else {
        res.status(401).json({ message: "Password is incorrect" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => console.log("Server is starting on PORT,", port));

process.on("exit", () => {
  db.disconnect();
});
