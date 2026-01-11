require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ---- ROUTES ----
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/work", require("./routes/work"));

// ---- HEALTH CHECK ----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---- CATCH API 404 (IMPORTANT) ----
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// ---- NEVER SERVE HTML ----
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.get("/api/__debug_db", async (req, res) => {
  try {
    const r = await pool.query("SELECT current_database()");
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
