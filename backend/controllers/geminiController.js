const { GoogleGenerativeAI } = require("@google/generative-ai");

const getGeminiResponse = async (req, res) => {
  const userMessage = req.body.message;
  const chatHistory = req.body.history || [];
  
  try {
    // Extract location data with validation
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: "Missing location data", 
        details: "Location coordinates are required" 
      });
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment variables");
      return res.status(500).json({ error: "API key configuration error" });
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create the system instructions
    const systemPrompt = `You are an emergency assistance chatbot for a user at coordinates latitude:${latitude}, longitude:${longitude}.
    
Your primary purpose is to:
1. Provide helpful information about vehicle breakdowns and roadside assistance
2. Offer guidance during medical emergencies and locate nearby hospitals
3. Help with fuel shortages and locate gas stations
4. Provide relevant emergency contacts based on the user's location
5. Assist with GPS-based navigation during emergencies

Always provide concise, practical advice that can be immediately acted upon in emergency situations.
Only provide verified, factual information, especially for emergency contacts and locations.
When sharing links, only include official websites for emergency services, hospitals, or roadside assistance.
Politely decline to assist with topics outside the emergency assistance scope.

Format your responses in clear, easy-to-read language appropriate for someone who may be in distress.`;

    // Build history for the Gemini chat
    // The first message in history will be the system prompt
    const initialHistory = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I understand my role as an emergency assistant. I'll provide practical guidance for vehicle breakdowns, medical emergencies, fuel shortages, emergency contacts, and GPS navigation based on your location. How can I help you today?",
          },
        ],
      },
    ];

    // Determine if we need to include the initial history
    let fullHistory;
    if (chatHistory.length === 0) {
      // First message in the conversation, include the system prompt
      fullHistory = initialHistory;
    } else {
      // Continuing conversation, use the existing history
      fullHistory = chatHistory;
    }

    // Create a chat session with the history
    const chat = model.startChat({
      history: fullHistory,
      generationConfig: {
        temperature: 0.2, // Lower temperature for more factual, reliable responses
        maxOutputTokens: 800,
      },
    });

    // Send the message
    const result = await chat.sendMessage(userMessage);
    const answer = result.response.text() || "I'm sorry, I couldn't generate a response. Please try again.";

    // Add the user message and bot response to history for next time
    const updatedHistory = [...fullHistory,
      { role: "user", parts: [{ text: userMessage }] },
      { role: "model", parts: [{ text: answer }] }
    ];

    // Return the response and the updated history
    res.json({
      response: answer,
      history: updatedHistory
    });
  } catch (error) {
    // Log detailed error information
    console.error("Gemini API Error:", error);
    
    let errorMessage = "An error occurred while processing your request.";
    if (error.message) {
      errorMessage = error.message;
    }

    // Provide a more user-friendly error response
    res.status(500).json({
      error: "Error processing request",
      details: errorMessage,
    });
  }
};

module.exports = { getGeminiResponse };