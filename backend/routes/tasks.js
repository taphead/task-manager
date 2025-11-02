import express from "express";
import pool from "../db.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all tasks for the logged-in user
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC",
    [userId]
  );
  res.json(result.rows);
});

// Add a new task
router.post("/", authenticateToken, async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  if (!text.trim()) {
    return res.status(400).json({ error: "Task text required" });
  }

  const result = await pool.query(
    "INSERT INTO tasks (text, done, user_id) VALUES ($1, $2, $3) RETURNING *",
    [text, false, userId]
  );

  res.status(201).json(result.rows[0]);
});

// Toggle done
router.put("/:id", authenticateToken, async (req, res) => {
  const { done } = req.body;
  const { id } = req.params;
  const userId = req.user.id;

  const result = await pool.query(
    "UPDATE tasks SET done = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [done, id, userId]
  );
  res.json(result.rows[0]);
});

// Delete task
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
  res.status(204).end();
});

export default router;
