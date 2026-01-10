const express = require("express");
const router = express.Router();
const pool = require("../db");

// Save completed grid
router.post("/grid", async (req, res) => {
  const {
    emp_id,
    project,
    grid,
    start_time,
    end_time,
    elapsed_seconds,
    sqkm,
    features
  } = req.body;

  if (!emp_id || !grid || !sqkm || !features) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query(
      `INSERT INTO work_grids
       (emp_id, project, grid, start_time, end_time, elapsed_seconds, sqkm, features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        emp_id,
        project,
        grid,
        start_time,
        end_time,
        elapsed_seconds,
        sqkm,
        features
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("WORK GRID INSERT ERROR:", err.message);
    res.status(500).json({ error: "Insert failed" });
  }
});

module.exports = router;
