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

const QUICK_REPLIES = [
  "Show menu",
  "Today's offers",
  "Recommend something for me",
  "Book a table",
  "Show cart",
  "Where is my order?",
];

// How often the chat checks for order / waitlist updates
const POLL_INTERVAL = 15000;

const ORDER_STATUS_TEXT = {
  Placed: "has been received ✅",
  Preparing: "is being prepared 👨‍🍳",
  "Out for Delivery": "is on the way 🛵",
  Delivered:
    "has been delivered 🎉 Enjoy your meal!\nTell me how it was, e.g. 'feedback 5 stars, loved it'.",
  Cancelled: "was cancelled ❌",
};

function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem("foodbot-user"));
  } catch {
    return null;
  }
}

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
  const [unread, setUnread] = useState(0);

  const chatEndRef = useRef(null);
  const openRef = useRef(open);
  const orderStatusRef = useRef(null);
  const tableReadyRef = useRef(false);

  const { loadCart } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    openRef.current = open;
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, open]);

  const addBotMessage = (message) => {
    setMessages((prev) => [...prev, { sender: "bot", ...message }]);
  };

  // Live updates: order status changes and "your table is ready"
  // are pushed into the chat without the customer asking.
  useEffect(() => {
    const pushUpdate = (text) => {
      addBotMessage({ text });
      if (!openRef.current) setUnread((count) => count + 1);
    };

    const checkUpdates = async () => {
      const user = getLoggedInUser();
      if (!user) return;

      try {
        const ordersRes = await fetch(
          `${API_URL}/api/orders/list/?customer_id=${user.id}`
        );
        const orders = await ordersRes.json();

        if (Array.isArray(orders)) {
          const previous = orderStatusRef.current;
          const current = {};

          orders.forEach((order) => {
            current[order.id] = order.status;

            if (
              previous &&
              previous[order.id] &&
              previous[order.id] !== order.status
            ) {
              pushUpdate(
                `📦 Order #${order.id} ${
                  ORDER_STATUS_TEXT[order.status] || `is now ${order.status}`
                }`
              );
            }
          });

          orderStatusRef.current = current;
        }

        const waitRes = await fetch(
          `${API_URL}/api/waitlist/status/?customer_id=${user.id}`
        );
        const waitlist = await waitRes.json();

        if (waitlist.table_ready && !tableReadyRef.current) {
          pushUpdate(
            "🔔 Good news -- your table is ready! Please come to the host stand."
          );
        }

        tableReadyRef.current = Boolean(waitlist.table_ready);
      } catch (error) {
        console.error("Live update error:", error);
      }
    };

    checkUpdates();
    const timer = setInterval(checkUpdates, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const sendMessage = async (textOverride) => {
    const currentMessage = (
      typeof textOverride === "string" ? textOverride : input
    ).trim();

    if (!currentMessage || loading) return;

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
      const loggedInUser = getLoggedInUser();

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

      // Refresh the cart badge if the chatbot changed the cart
      if (data.cart || data.action === "ORDER_PLACED") {
        await loadCart();
      }

      addBotMessage({
        text:
          data.reply ||
          "Sorry, I couldn't understand that.",
        items: data.menu_items || [],
        action: data.action,
      });
    } catch (error) {
      console.error("ChatBot Error:", error);

      addBotMessage({
        text:
          "❌ Unable to connect to FoodBot AI. Please try again.",
      });
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

        {!open && unread > 0 && (
          <span className="chat-badge">{unread}</span>
        )}
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

                {/* Dish cards with images */}
                {msg.items?.length > 0 && (
                  <div className="chat-items">
                    {msg.items.map((item) => (
                      <div className="chat-item" key={item.id}>
                        {item.image && (
                          <img src={item.image} alt={item.name} />
                        )}

                        <span className="chat-item-name">
                          {item.name}
                        </span>

                        <span className="chat-item-price">
                          ₹{item.price}
                        </span>

                        <button
                          onClick={() =>
                            sendMessage(`add ${item.name}`)
                          }
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {msg.action === "GO_TO_CHECKOUT" && (
                  <button
                    className="chat-action"
                    onClick={() => navigate("/checkout")}
                  >
                    Go to checkout page →
                  </button>
                )}

                {msg.action === "ORDER_PLACED" && (
                  <button
                    className="chat-action"
                    onClick={() => navigate("/orders")}
                  >
                    View my orders →
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="bot-msg">
                🤖 FoodBot AI is typing...
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-quick-replies">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                disabled={loading}
              >
                {reply}
              </button>
            ))}
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
