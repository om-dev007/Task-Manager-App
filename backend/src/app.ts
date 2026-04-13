import express from "express";
import morgan from "morgan";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Task Manager API!");
});

export default app;