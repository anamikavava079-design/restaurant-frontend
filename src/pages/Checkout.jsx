import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/checkout.css";
import useCart from "../hooks/useCart";

function Checkout() {
  const {
    cart,
    itemsTotal,
    gst,
    deliveryFee,
    grandTotal,
  } = useCart();

  const navigate = useNavigate();

  const proceedToPayment = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/payment");
  };

  return (
    <>
      <Navbar />

      <div className="checkout-page">
        <h1>Checkout</h1>

        <div className="checkout-container">

          {/* Left Side */}
          <div className="checkout-form">
            <h2>Delivery Details</h2>

            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="tel"
              placeholder="Phone Number"
            />

            <textarea
              rows="5"
              placeholder="Delivery Address"
            ></textarea>

            <select>
              <option>Cash on Delivery</option>
              <option>UPI</option>
              <option>Credit / Debit Card</option>
            </select>

            <button
              className="place-order-btn"
              onClick={proceedToPayment}
            >
              Continue to Payment
            </button>
          </div>

          {/* Right Side */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    className="checkout-item"
                    key={item.id}
                  >
                    <div>
                      <strong>
                        {item.name} × {item.quantity}
                      </strong>

                      {item.customization && (
                        <small
                          style={{
                            display: "block",
                            color: "#666",
                            marginTop: "4px",
                          }}
                        >
                          {item.customization}
                        </small>
                      )}
                    </div>

                    <span>
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}

                <hr />

                <div className="checkout-item">
                  <span>Items Total</span>
                  <span>₹{Number(itemsTotal).toFixed(2)}</span>
                </div>

                <div className="checkout-item">
                  <span>GST (5%)</span>
                  <span>₹{Number(gst).toFixed(2)}</span>
                </div>

                <div className="checkout-item">
                  <span>Delivery Fee</span>
                  <span>₹{Number(deliveryFee).toFixed(2)}</span>
                </div>

                <hr />

                <div className="checkout-total">
                  <span>Grand Total</span>
                  <span>₹{Number(grandTotal).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default Checkout;