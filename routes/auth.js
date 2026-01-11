const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { emp_id } = req.body;

  if (!emp_id) {
    return res.status(400).json({ error: "Employee ID required" });
  }

  // 🔓 TEMPORARY LOGIN (UI DEVELOPMENT MODE)
  const role = emp_id.toUpperCase() === "TEST" ? "admin" : "employee";

  res.json({
    emp_id,
    role
  });
});

module.exports = router;
