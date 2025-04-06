import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useLocationContext } from "../contexts/LocationContext";
import { MessageCircle, X } from "lucide-react";

function ChatBot() {
  const { location, locationName, lodings, locationError, retryLocation } =
    useLocationContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your emergency assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loding, setloding] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Get the API URL from Vite environment variable or use default
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, isBot: false },
    ]);

    // Add user message to chat history
    const userHistoryItem = { role: "user", parts: [{ text: input }] };
    setChatHistory((prev) => [...prev, userHistoryItem]);

    const userMessage = input;
    setInput("");
    setloding(true);

    try {
      // Send message and history to backend
      const response = await axios.post(
        `${API_URL}/api/gemini/chat?latitude=${location.latitude}&longitude=${location.longitude}`,
        {
          message: userMessage,
          history: chatHistory,
        },
        { timeout: 20000 } // 20-second timeout
      );

      // Check if response has the expected structure
      if (response.data && response.data.response) {
        const botReply = response.data.response;

        // Add bot response to messages
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botReply, isBot: true },
        ]);

        // Add bot response to chat history
        if (response.data.newMessage) {
          setChatHistory((prev) => [...prev, response.data.newMessage]);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching response:", error);

      // Show more detailed error message
      let errorMessage = "Sorry, I couldn't process your request.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.details
      ) {
        errorMessage += ` (${error.response.data.details})`;
      } else if (error.message) {
        errorMessage += ` (${error.message})`;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: errorMessage, isBot: true },
      ]);
    } finally {
      setloding(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-80 mb-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Emergency Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.isBot ? "text-left" : "text-right"}`}
              >
                <div
                  className={`inline-block p-3 rounded-xl max-w-[80%] break-words ${
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
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loding && (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
                Typing...
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
              disabled={loding}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
              disabled={loding || !input.trim()}
            >
              {loding ? "..." : "Send"}
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
