require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Basic health check; no authentication required.
app.get("/", (req, res) => {
  res.json({
    message: "Syntechxhub User Management API is running",
    endpoints: "/api/users"
  });
});

app.use("/api/users", userRoutes);

// JSON error handler for malformed JSON and unexpected errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI. Copy .env.example to .env and configure it.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

start();
