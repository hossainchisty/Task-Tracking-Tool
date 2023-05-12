// Basic Lib Imports
var colors = require("colors");
const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require("dotenv").config();
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

// Undefined Route Implement
app.use("*",(req,res)=>{
  res.status(404).json({status:"fail",data:"Not Found"})
})

// Custome error handler
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server started on port http://127.0.0.1:${port}/`)
);
