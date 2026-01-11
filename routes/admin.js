const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/daily-summary", async (req, res) => {
  try {
    const date = req.query.date;
    if (!date) {
      return res.status(400).json({ error: "Date required" });
    }

    const result = await pool.query(
  `
  SELECT
    emp_id,
    COUNT(*)::int AS grids,
    COALESCE(SUM(sqkm),0) AS total_sqkm,
    COALESCE(SUM(features),0)::int AS total_features,
    COALESCE(
      SUM(
        EXTRACT(
          EPOCH FROM (
            COALESCE(end_time, start_time) - start_time
          )
        )
      ) / 3600,
      0
    ) AS total_hours
  FROM public.work_grids
  WHERE start_time >= $1::date
    AND start_time < ($1::date + INTERVAL '1 day')
  GROUP BY emp_id
  ORDER BY emp_id
  `,
  [date]
);


    res.json(result.rows);
  } catch (err) {
    console.error("ADMIN REPORT ERROR:", err.message);
    res.status(500).json({ error: "Admin summary failed" });
  }
});

module.exports = router;
