const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/daily-summary", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        emp_id,
        COUNT(*)::int AS grids,
        COALESCE(SUM(sqkm),0) AS total_sqkm,
        COALESCE(SUM(features),0)::int AS total_features,
        0 AS total_hours
      FROM public.work_grids
      GROUP BY emp_id
      ORDER BY emp_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN REPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
