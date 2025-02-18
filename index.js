const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 7000;

///middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.izqajim.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const db = client.db("taskManager");

    // Add a new task
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await db.collection("tasks").insertOne(task);
      res.status(201).json({
        message: "Task added successfully",
        task: result.ops[0],
      });
    });

    // Get all tasks by email
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const tasks = await db.collection("tasks").find(query).toArray();
      res.status(200).json(tasks);
    });

    // Update task status
    app.patch("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      const result = await db
        .collection("tasks")
        .updateOne({ _id: ObjectId(id) }, { $set: { status } });
      if (result.modifiedCount > 0) {
        const updatedTask = await db
          .collection("tasks")
          .findOne({ _id: ObjectId(id) });
        res.status(200).json({
          message: "Task updated successfully",
          task: updatedTask,
        });
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    });

    // Delete a task
    app.delete("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const result = await db
        .collection("tasks")
        .deleteOne({ _id: ObjectId(id) });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Task deleted successfully" });
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    });
  } finally {
    // Close the MongoDB client
  }
}

run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
