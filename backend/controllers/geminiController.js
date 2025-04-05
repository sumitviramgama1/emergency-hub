const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGeminiResponse = async (req, res) => {
  const userMessage = req.body.message;
  const chatHistory = req.body.history || [];

  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment variables");
      return res.status(500).json({ error: "API key configuration error" });
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const { latitude, longitude } = req.query;
    systemPrompt = `my current location is latitude:${latitude}, longitude:${longitude}. answer questions related to vehicle breakdowns, medical emergencies,hospital emergency. fuel shortages, emergency contacts, and GPS-based assistance and if user want link then don't give dynamic link only give original and valid link . Decline anything else politely.`;
    // Build history for the Gemini chat
    const initialHistory = [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}` }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hello! I'm your emergency assistant. How can I help you today?",
          },
        ],
      },
    ];

    // Add the user's conversation history to the initial history
    const fullHistory = [...initialHistory, ...chatHistory];

    // Create a chat session with the full history
    const chat = model.startChat({
      history: fullHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    // Send the message
    const result = await chat.sendMessage(`${userMessage}`);
    const answer = result.response.text() || "No response available";

    // Return the response and the updated history
    res.json({
      response: answer,
      newMessage: { role: "model", parts: [{ text: answer }] },
    });
  } catch (error) {
    // Log detailed error information
    console.error("Gemini API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    res.status(500).json({
      error: "Error processing request",
      details: error.message,
    });
  }
};

module.exports = { getGeminiResponse };
