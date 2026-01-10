require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db"); // ✅ FIX: import pool

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/work", require("./routes/work"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 3000;
app.get("/api/test-db", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json({ db_time: r.rows[0].now });
  } catch (err) {
    console.error("DB ERROR:", err.message);
    res.status(500).json({ error: "DB connection failed" });
  }
});
app.get("/", (req, res) => {
  res.send("GIS Backend is running");
});

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
