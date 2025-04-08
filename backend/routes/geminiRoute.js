const express = require("express");
const { getGeminiResponse } = require("../controllers/geminiController");
const cors = require("cors");

const corsOptions = {
  origin: ["https://emergency-hub-kxyn.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const router = express.Router();

router.post("/chat", cors(corsOptions), getGeminiResponse);

module.exports = router;
