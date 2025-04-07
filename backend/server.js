const express = require("express");
// const cors = require("cors");
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
// app.use(cors({
//   origin: ['https://emergency-hub-kxyn.vercel.app', 'http://localhost:3000'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.options('*', cors()); // Enable preflight requests for all routes

app.use("/api/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/roadside-services", roadsideServiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
