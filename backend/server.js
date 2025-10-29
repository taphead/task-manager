import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER By id ASC");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks/", async (req, res) => {
  const { text } = req.body;
  if (!text.trim()) {
    return res.status(400).json({ error: "Task test required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (text) VALUES ($1) RETURNING *",
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { done } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE tasks SET done = $1 where id = $2 RETURNING *",
      [done, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
