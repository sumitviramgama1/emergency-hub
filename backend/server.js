const express = require("express");
const cors = require("cors");
require("dotenv").config();
const geminiRoutes = require("./routes/geminiRoute");
const locationRoutes = require("./routes/locationRoute");
const roadsideServiceRoutes = require("./routes/roadsideServiceRoute");
// const reviewRoutes = require("./routes/reviewRoutes");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
connectDB();
app.use(bodyParser.json());
app.use(express.json());
const corsOptions = {
  origin: [
    "https://emergency-hub-kxyn.vercel.app",
    "https://emergency-hub.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-Requested-With"],
};

app.use(cors(corsOptions)); // Apply CORS middleware
// filepath: e:\emergency hub\backend\server.js
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-Requested-With");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});
app.use("/api/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/roadside-services", roadsideServiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
