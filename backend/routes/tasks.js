const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// ➕ CREATE TASK
router.post("/", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    userId: req.userId
  });

  await task.save();
  res.json(task);
});

// 📥 GET TASKS (only user)
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

module.exports = router;
