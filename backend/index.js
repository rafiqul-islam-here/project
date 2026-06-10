const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "admin",
  host: "postgres",
  database: "school",
  password: "1234",
  port: 5432,
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error:", err));

// -------------------- ROUTES -------------------- //


app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
app.get("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new student
app.post("/students", async (req, res) => {
  try {
    const { name, age, department } = req.body;

    const result = await pool.query(
      "INSERT INTO students (name, age, department) VALUES ($1, $2, $3) RETURNING *",
      [name, age, department]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, department } = req.body;

    const result = await pool.query(
      "UPDATE students SET name=$1, age=$2, department=$3 WHERE id=$4 RETURNING *",
      [name, age, department, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM students WHERE id=$1", [id]);

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});