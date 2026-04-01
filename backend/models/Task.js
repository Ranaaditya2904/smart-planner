const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  time: String,
  priority: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Task", TaskSchema);
