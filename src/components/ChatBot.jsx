import {
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import "../styles/chatbot.css";
import API_URL from "../api";

function ChatBot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Hello! I'm FoodBot AI.\nAsk me anything about our menu, bookings, delivery or payments.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const { loadCart } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: currentMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const loggedInUser = JSON.parse(
        localStorage.getItem("foodbot-user")
      );

      console.log("Logged In User:", loggedInUser);

      const response = await fetch(
        `${API_URL}/api/chat/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentMessage,
            customer_id: loggedInUser?.id ?? null,
          }),
        }
      );

      const data = await response.json();

      console.log("Chat Response:", data);

      // Refresh cart if chatbot added an item
      if (data.cart) {
        await loadCart();
      }

      // Redirect to Checkout if chatbot requests it
      if (data.action === "GO_TO_CHECKOUT") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.reply,
          },
        ]);

        setTimeout(() => {
          navigate("/checkout");
        }, 1500);

        return;
      }

      // Normal chatbot reply
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            data.reply ||
            "Sorry, I couldn't understand that.",
        },
      ]);
    } catch (error) {
      console.error("ChatBot Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "❌ Unable to connect to FoodBot AI. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <button
        className="chat-button"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaRobot />}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            🤖 FoodBot AI Assistant
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-msg"
                    : "bot-msg"
                }
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="bot-msg">
                🤖 FoodBot AI is typing...
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-footer">
            <input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyPress}
            />

            <button onClick={sendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;