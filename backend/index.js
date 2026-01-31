const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const auth = require("./router/auth");
const reportRouter = require("./router/reportRouter");



const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.use('/api' ,auth)
app.use('/api', reportRouter)

// define PORT 
const PORT = process.env.PORT || 5000;

// connect DB first, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT} 🔥`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
