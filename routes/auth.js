const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/login", async (req, res) => {
  try {
    const { emp_id, password } = req.body;

    if (!emp_id) {
      return res.status(400).json({ error: "Employee ID required" });
    }

    // 🔍 Find employee
    const result = await pool.query(
      "SELECT emp_id, role FROM employees WHERE emp_id = $1",
      [emp_id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid Employee ID" });
    }

    const user = result.rows[0];

    // ⚠️ Password check skipped for now (as per your earlier setup)
    // Later we will add hashing

    res.json({
      emp_id: user.emp_id,
      role: user.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
