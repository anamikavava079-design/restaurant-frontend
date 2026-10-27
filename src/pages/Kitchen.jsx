import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API_URL from "../api";

// Kitchen display for restaurant staff (users with role admin/support).
// PDF: "Order sent to POS/kitchen system" + "notify on delays" -- marking
// an order Delayed here makes the customer's chat show a delay alert.

const STAFF_ROLES = ["admin", "support"];
const REFRESH_MS = 15000;

const ACTIONS = [
  { status: "Preparing", label: "👨‍🍳 Preparing", color: "#2196F3" },
  { status: "Delayed", label: "⚠️ Delayed", color: "#FF9800" },
  { status: "Out for Delivery", label: "🛵 Out for delivery", color: "#9C27B0" },
  { status: "Delivered", label: "✅ Delivered", color: "#4CAF50" },
  { status: "Cancelled", label: "✖ Cancel", color: "#e53935" },
];

const STATUS_COLOR = {
  Placed: "#607D8B",
  Preparing: "#2196F3",
  Delayed: "#FF9800",
  "Out for Delivery": "#9C27B0",
  Delivered: "#4CAF50",
  Cancelled: "#e53935",
};

function Kitchen() {
  const user = JSON.parse(localStorage.getItem("foodbot-user"));
  const isStaff = STAFF_ROLES.includes(user?.role);

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Active");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/kitchen/orders/?staff_id=${user.id}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Could not load orders.");

      setOrders(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!isStaff) return;

    loadOrders();
    const timer = setInterval(loadOrders, REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/kitchen/orders/status/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: user.id,
          order_id: orderId,
          status,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Update failed.");

      await loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const visible = orders.filter((order) =>
    filter === "Active"
      ? !["Delivered", "Cancelled"].includes(order.status)
      : true
  );

  return (
    <>
      <Navbar />

      <div style={{ padding: "110px 6% 60px", minHeight: "100vh" }}>
        <h1 style={{ marginBottom: "6px" }}>👨‍🍳 Kitchen Orders</h1>

        {!isStaff ? (
          <p style={{ color: "#c62828", marginTop: "20px" }}>
            This page is only for restaurant staff. Log in with a staff
            (admin) account to see incoming orders.
          </p>
        ) : (
          <>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Refreshes every 15 seconds. Marking an order{" "}
              <strong>Delayed</strong> sends the customer a delay alert in
              their chat.
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
              {["Active", "All"].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "20px",
                    border: "2px solid #ff6b35",
                    background: filter === option ? "#ff6b35" : "white",
                    color: filter === option ? "white" : "#ff6b35",
                    fontWeight: 600,
                  }}
                >
                  {option === "Active" ? "Active orders" : "All orders"}
                </button>
              ))}
            </div>

            {error && <p style={{ color: "#c62828" }}>⚠️ {error}</p>}

            {visible.length === 0 ? (
              <p style={{ color: "#777" }}>No orders here right now. 🎉</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                {visible.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "18px",
                      boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                      borderTop: `6px solid ${STATUS_COLOR[order.status] || "#999"}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3>Order #{order.id}</h3>
                      <span
                        style={{
                          background: STATUS_COLOR[order.status] || "#999",
                          color: "white",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p style={{ color: "#777", fontSize: "13px", margin: "4px 0 10px" }}>
                      {new Date(order.created_at).toLocaleString("en-IN")}
                    </p>

                    <p style={{ fontSize: "14px" }}>
                      👤 {order.customer_name} · 📞 {order.customer_phone}
                    </p>
                    {order.delivery_address && (
                      <p style={{ fontSize: "14px", color: "#555" }}>
                        📍 {order.delivery_address}
                      </p>
                    )}

                    <ul style={{ margin: "12px 0", paddingLeft: "18px" }}>
                      {order.items.map((item) => (
                        <li key={item.id} style={{ fontSize: "15px" }}>
                          {item.quantity} × {item.menu_item_name}
                          {item.customization && (
                            <small style={{ display: "block", color: "#888" }}>
                              {item.customization}
                            </small>
                          )}
                        </li>
                      ))}
                    </ul>

                    <p style={{ fontWeight: 700, marginBottom: "12px" }}>
                      Total: ₹{order.total_price}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {ACTIONS.filter((a) => a.status !== order.status).map((action) => (
                        <button
                          key={action.status}
                          onClick={() => updateStatus(order.id, action.status)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "none",
                            background: action.color,
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Kitchen;
