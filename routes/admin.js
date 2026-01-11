const express = require("express");
const router = express.Router();
const pool = require("../db");

/**
 * GET /api/admin/daily-summary
 * Query params:
 *   ?date=YYYY-MM-DD (optional)
 */
router.get("/daily-summary", async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);

  try {
    const result = await pool.query(
      `
      SELECT
        emp_id,
        COUNT(*) AS grids_completed,
        SUM(sqkm) AS total_sqkm,
        SUM(features) AS total_features,
        SUM(elapsed_seconds) / 3600.0 AS total_hours
      FROM public.work_grids
      WHERE work_date = $1
      GROUP BY emp_id
      ORDER BY emp_id
      `,
      [date]
    );

    res.json({
      date,
      data: result.rows
    });
  } catch (err) {
    console.error("ADMIN REPORT ERROR:", err.message);
    res.status(500).json({ error: "Report fetch failed" });
  }
});

module.exports = router;
