import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useLocationContext } from "../contexts/LocationContext";
import { MessageCircle, X, MapPin } from "lucide-react";

function ChatBot() {
  const { location, locationName, loading: locationLoading, locationError, retryLocation } =
    useLocationContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your emergency assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const [showLocationError, setShowLocationError] = useState(false);

  // Get the API URL from Vite environment variable or use default
  const API_URL = import.meta.env.VITE_BACKEND_URL || "";

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show location error when chat opens if location is not available
  useEffect(() => {
    if (isOpen && locationError && !showLocationError) {
      setShowLocationError(true);
      setMessages(prev => [
        ...prev,
        { 
          text: "⚠️ I can't determine your location. Some emergency assistance features may be limited. Please enable location services for better help.",
          isBot: true 
        }
      ]);
    }
  }, [isOpen, locationError, showLocationError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, isBot: false },
    ]);

    // Save user input before clearing it
    const userMessage = input;
    setInput("");
    setLoading(true);

    // Check if location is available
    if (!location || !location.latitude || !location.longitude) {
      setMessages(prev => [
        ...prev,
        { 
          text: "I need your location to provide accurate emergency assistance. Please enable location services and retry.",
          isBot: true 
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      // Send message and history to backend
      const response = await axios.post(
        `${API_URL}/api/gemini/chat?latitude=${location.latitude}&longitude=${location.longitude}`,
        {
          message: userMessage,
          history: chatHistory,
        },
        { timeout: 30000 } // 30-second timeout
      );

      // Check if response has the expected structure
      if (response.data && response.data.response) {
        const botReply = response.data.response;

        // Add bot response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botReply, isBot: true },
        ]);

        // Update the chat history with the new complete history from the server
        if (response.data.history) {
          setChatHistory(response.data.history);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching response:", error);

      // Show more detailed error message
      let errorMessage = "Sorry, I couldn't process your request. Please try again.";
      if (error.response?.data?.details) {
        errorMessage = `Error: ${error.response.data.details}`;
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. The server is taking too long to respond.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: errorMessage, isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-80 sm:w-96 mb-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-semibold">Emergency Assistant</h3>
              {locationName && (
                <div className="ml-2 flex items-center text-xs bg-blue-700 dark:bg-blue-900 px-2 py-1 rounded-full">
                  <MapPin size={12} className="mr-1" />
                  {locationName}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
            {locationLoading && (
              <div className="text-center p-2 mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                <div className="flex items-center justify-center">
                  <span className="animate-pulse mr-2">
                    <MapPin size={16} />
                  </span>
                  <span>Getting your location...</span>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.isBot ? "text-left" : "text-right"}`}
              >
                <div
                  className={`inline-block p-3 rounded-xl max-w-[85%] break-words ${
                    message.isBot
                      ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 dark:text-blue-400 underline"
                        >
                          {children}
                        </a>
                      ),
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 mb-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 mb-2">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
                <div className="flex justify-center items-center space-x-1">
                  <div className="animate-bounce h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                  <div className="animate-bounce h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full" style={{ animationDelay: "0.2s" }}></div>
                  <div className="animate-bounce h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transform transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

export default ChatBot;