import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/orders.css";
import { CartContext } from "../context/CartContext";
import API_URL from "../api";
console.log("NEW ORDERS PAGE LOADED");

function getOrderStage(status) {
  switch (status) {
    case "Placed":
      return 0;
    case "Preparing":
    case "Delayed":
      return 1;
    case "Out for Delivery":
      return 2;
    case "Delivered":
      return 3;
    default:
      return 0;
  }
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const navigate = useNavigate();
  const { loadCart } = useContext(CartContext);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("foodbot-user")
    );

    if (!loggedInUser) {
      return;
    }

    fetch(
      `${API_URL}/api/orders/list/?customer_id=${loggedInUser.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders:", data);
        setOrders(data);
      })
      .catch((err) => console.error(err));
  }, []);
  const submitReview = async (orderId) => {

    const customer = JSON.parse(
      localStorage.getItem("foodbot-user")
    );

    if (!customer) {
      alert("Please login first.");
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/review/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: customer.id,
            order: orderId,
            rating: ratings[orderId] || 5,
            review: reviews[orderId] || "",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("⭐ Thank you for your review!");

        setRatings({
          ...ratings,
          [orderId]: 0,
        });

        setReviews({
          ...reviews,
          [orderId]: "",
        });

      } else {

        alert(
          data.message ||
          JSON.stringify(data)
        );

      }

    } catch (error) {

      console.error(error);

      alert("Unable to submit review.");

    }

  };
  const handleReorder = async (order) => {
    const customer = JSON.parse(localStorage.getItem("foodbot-user"));

    if (!customer) {
      alert("Please login first.");
      return;
    }

    try {
      for (const item of order.items) {
        console.log("Item:", item);
        console.log("Sending:", {
          customer_id: customer.id,
          menu_item_id: item.menu_item,
          quantity: item.quantity,
          customization: "",
        });

        const response = await fetch(
          `${API_URL}/api/cart/add/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customer.id,
              menu_item_id: item.menu_item,
              quantity: item.quantity,
              customization: "",
            }),
          }
        );

        const result = await response.json();

        console.log("Backend Response:", result);

        if (!response.ok) {
          alert(JSON.stringify(result));
          return;
        }
      }

      await loadCart();
      alert("✅ Items added to cart successfully!");
      navigate("/cart");
    } catch (error) {
      console.error("Reorder Error:", error);
    }
  };

return (
  <>
    <Navbar />

    <div className="orders-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>No Orders Yet 🍽</h2>
          <p>Your placed orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map((order) => {
            const stage = getOrderStage(order.status);

            return (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <div>
                    <h2>Order #{order.id}</h2>

                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div className="order-right">
                    <span className="status">{order.status}</span>

                    <p className="delivery-time">
                      {order.status === "Delayed" ? (
                        <strong style={{ color: "#e65100" }}>
                          ⚠️ Running late -- about 15 more mins
                        </strong>
                      ) : (
                        <>
                          ETA: <strong>25–30 mins</strong>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="items-list">
                  {order.items.map((item) => (
                    <div
                      className="order-item"
                      key={item.id}
                    >
                      <span>
                        {item.menu_item_name} × {item.quantity}
                      </span>

                      <span>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="tracking">
                  <div
                    className={`track ${
                      stage >= 0 ? "active" : ""
                    }`}
                  >
                    ✔ Order Placed
                  </div>

                  <div
                    className={`track ${
                      stage >= 1 ? "active" : ""
                    }`}
                  >
                    👨‍🍳 Preparing
                  </div>

                  <div
                    className={`track ${
                      stage >= 2 ? "active" : ""
                    }`}
                  >
                    🛵 Out for Delivery
                  </div>

                  <div
                    className={`track ${
                      stage >= 3 ? "active" : ""
                    }`}
                  >
                    📦 Delivered
                  </div>
                </div>

                {order.status === "Delivered" && (
                  <div className="review-section">

                    <h3>⭐ Rate Your Order</h3>

                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            (ratings[order.id] || 0) >= star
                              ? "star active-star"
                              : "star"
                          }
                          onClick={() =>
                            setRatings({
                              ...ratings,
                              [order.id]: star,
                            })
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <textarea
                      placeholder="Share your experience..."
                      value={reviews[order.id] || ""}
                      onChange={(e) =>
                        setReviews({
                          ...reviews,
                          [order.id]: e.target.value,
                        })
                      }
                    />

                    <button
                      className="review-btn"
                      onClick={() => submitReview(order.id)}
                    >
                      Submit Review
                    </button>

                  </div>
                )}

                <div className="order-total">
                  <span>Total : ₹{order.total_price}</span>

                  <button
                    className="reorder-btn"
                    onClick={() => handleReorder(order)}
                  >
                    🔄 Reorder
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  </>
);
}

export default Orders;
