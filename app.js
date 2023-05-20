// Basic Lib Imports
const express = require("express");
const bodyParser = require('body-parser');
require("dotenv").config();
var cors = require('cors')
const { errorHandler } = require("./middleware/errorMiddleware");
// Database connection with mongoose
const connectDB = require("./config/db");
connectDB();
const port = process.env.PORT || 8000;

// Express app initialization
const app = express();
app.use(bodyParser.json());
app.use(express.json());
// This is CORS-enabled for all origins!
app.use(cors())

app.use(
  express.urlencoded({
    extended: false,
  })
);

// Routing Implement
app.use("/api/v1/users", require("./routes/userRouters"));
app.use("/api/v2/tasks", require("./routes/taskRouters"));
app.use("/api/v2/tasks/history", require("./routes/historyRouters"));
app.use("/api/v2/subscription", require("./routes/subscriptionRouters"));

// Undefined Route Implement
app.use("*",(req,res)=>{
  res.status(404).json({status:"fail",data:"Not Found"})
})

// Custome error handler
app.use(errorHandler);

module.exports = app;