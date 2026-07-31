import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import useCart from "../hooks/useCart";
import "../styles/payment.css";
import API_URL from "../api";

function Payment() {
  const navigate = useNavigate();

  const {
    cart,
    itemsTotal,
    gst,
    deliveryFee,
    grandTotal,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [upiId, setUpiId] = useState("");

  const [processing, setProcessing] = useState(false);

  const placeOrder = async () => {
    // -----------------------------
    // UPI Validation
    // -----------------------------
    if (paymentMethod === "UPI") {
      if (!upiId.trim()) {
        alert("Please enter your UPI ID.");
        return;
      }

      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

      if (!upiRegex.test(upiId)) {
        alert("Please enter a valid UPI ID.");
        return;
      }
    }

    // -----------------------------
    // Card Validation
    // -----------------------------
    if (paymentMethod === "Card") {
      if (
        !cardNumber.trim() ||
        !cardName.trim() ||
        !expiry.trim() ||
        !cvv.trim()
      ) {
        alert("Please fill all card details.");
        return;
      }
    }

    setProcessing(true);

    try {
      const loggedInUser = JSON.parse(
        localStorage.getItem("foodbot-user")
      );

      if (!loggedInUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      // Fake payment delay (2 seconds)
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      const response = await fetch(
        `${API_URL}/api/orders/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: loggedInUser.id,
            restaurant_id: 1,
            items: cart.map((item) => ({
              menu_item: item.menu_item_id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Order failed");
      }

      await clearCart();

      navigate("/order-success", {
         state: {
           paymentMethod,
         },
      });
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

return (
  <>
    <Navbar />

    <div className="payment-page">
      <h1>Payment</h1>

      <div className="payment-container">

        {/* Left Side */}

        <div className="payment-left">

          <h2>Payment Method</h2>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={() => setPaymentMethod("Cash on Delivery")}
            />
            Cash on Delivery
          </label>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "UPI"}
              onChange={() => setPaymentMethod("UPI")}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              checked={paymentMethod === "Card"}
              onChange={() => setPaymentMethod("Card")}
            />
            Credit / Debit Card
          </label>

          {paymentMethod === "UPI" && (
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          )}

          {paymentMethod === "Card" && (
            <>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />

              <input
                type="text"
                placeholder="Card Holder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />

              <div className="card-row">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </>
          )}

          <button
            className="pay-btn"
            onClick={placeOrder}
            disabled={processing}
          >
            {processing ? (
              paymentMethod === "Cash on Delivery" ? (
                "Placing Order..."
              ) : (
                "Processing Payment..."
              )
            ) : paymentMethod === "Cash on Delivery" ? (
              "Place Order"
            ) : (
              `Pay ₹${grandTotal}`
            )}
          </button>

        </div>

        {/* Right Side */}

        <div className="payment-right">

          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div
              className="payment-item"
              key={item.id}
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ₹{(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr />

          <div className="payment-item">
            <span>Items Total</span>
            <span>₹{itemsTotal.toFixed(2)}</span>
          </div>

          <div className="payment-item">
            <span>GST</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <div className="payment-item">
            <span>Delivery</span>
            <span>₹{deliveryFee.toFixed(2)}</span>
          </div>

          <hr />

          <div className="payment-total">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>

        </div>

      </div>
    </div>
  </>
);
}

export default Payment;