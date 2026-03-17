const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// serve frontend files
app.use(express.static(path.join(__dirname)));

// ===============================
// DATABASE CONNECTION (TiDB)
// ===============================

const db = mysql.createConnection({
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "3f3frUZXasJmZqU.root",
  password: "C6cUHk8rB2LzeWcI",
  database: "boxing_tournament",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to TiDB Cloud database");
  }
});

// ===============================
// ROUTES
// ===============================

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// registration API
app.post("/register", (req, res) => {

  const { name, age, weight, experience, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).send("Missing required fields");
  }

  const sql =
    "INSERT INTO registrations (name, age, weight, experience, email) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [name, age, weight, experience, email], (err, result) => {

    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send("Database Error");
    }

    res.json({
      message: "Registration Successful",
      id: result.insertId
    });

  });

});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🥊 Boxing Server running on http://localhost:${PORT}`);
});