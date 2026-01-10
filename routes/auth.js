const express = require("express");
const router = express.Router();
const pool = require("../db");

// Login
router.post("/login", async (req, res) => {
  const { emp_id, password } = req.body;

  // TEMP: no password validation yet
  if (!emp_id) {
    return res.status(400).json({ error: "Employee ID required" });
  }

  try {
    const result = await pool.query(
      "SELECT emp_id, role FROM employees WHERE emp_id = $1",
      [emp_id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid employee ID" });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      emp_id: user.emp_id,
      role: user.role
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
