// Basic Lib Imports
const express = require("express"); // Importing the Express framework for building web applications
const helmet = require("helmet"); // Importing Helmet middleware for securing HTTP headers
const bodyParser = require('body-parser'); // Importing Body Parser middleware for parsing request bodies
require("dotenv").config(); // Loading environment variables from .env file
const cors = require('cors'); // Importing CORS middleware for enabling Cross-Origin Resource Sharing
const { errorHandler } = require("./middleware/errorMiddleware"); // Importing custom error handling middleware

// Database connection with mongoose
const connectDB = require("./config/db"); // Importing database connection function using Mongoose
connectDB(); // Establishing the database connection



const app = express(); // Creating an instance of the Express application
app.use(helmet()); // Setting up Helmet middleware for securing HTTP headers
app.use(bodyParser.json()); // Parsing JSON bodies
app.use(express.json()); // Parsing JSON bodies
app.use(cors(
  {
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  }
)); // Enabling CORS for all origins
app.use(
  express.urlencoded({
    extended: false,
  })
);

// Routing Implement
app.use("/api/v1/users", require("./routes/userRouters")); // Mounting userRouters for handling user-related routes
app.use("/api/v2/tasks", require("./routes/taskRouters")); // Mounting taskRouters for handling task-related routes
app.use("/api/v2/tasks/history", require("./routes/historyRouters")); // Mounting historyRouters for handling history-related routes
app.use("/api/v2/subscription", require("./routes/subscriptionRouters")); // Mounting subscriptionRouters for handling subscription-related routes

// Undefined Route Implement
app.use("*", (req, res) => {
  res.status(404).json({ status: "fail", data: "Not Found" });
});

// Custom error handler
app.use(errorHandler);

module.exports = app; // Exporting the Express app for external use