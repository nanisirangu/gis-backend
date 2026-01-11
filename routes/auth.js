const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * GET /api/admin/daily-summary?date=YYYY-MM-DD
 */
router.get("/daily-summary", async (req, res) => {
  try {
    const date = req.query.date;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const query = `
      SELECT
        emp_id,
        COUNT(*) AS grids,
        COALESCE(SUM(sqkm), 0) AS total_sqkm,
        COALESCE(SUM(features), 0) AS total_features,
        COALESCE(SUM(EXTRACT(EPOCH FROM (end_time - start_time))) / 3600, 0) AS total_hours
      FROM work_grids
      WHERE DATE(start_time) = $1
      GROUP BY emp_id
      ORDER BY emp_id
    `;

    const result = await pool.query(query, [date]);

    res.json(result.rows);

  } catch (err) {
    console.error("ADMIN SUMMARY ERROR:", err.message);
    res.status(500).json({ error: "Failed to load admin summary" });
  }
});

module.exports = router;
