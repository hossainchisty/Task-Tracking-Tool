// Basic Lib Imports
var colors = require("colors");
const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
// Database connection with mongoose
const connectDB = require("./config/db");
connectDB();
const port = process.env.PORT || 5000;

// Express app initialization
const app = express();
app.use(express.json());


app.use(
  express.urlencoded({
    extended: false,
  })
);

// Application routes
app.use("/api/goals", require("./routes/goalRouters"));

app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server started on port http://127.0.0.1:${port}/`.red)
);
