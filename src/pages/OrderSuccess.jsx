import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/orderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const paymentMethod =
    location.state?.paymentMethod || "Cash on Delivery";

  return (
    <>
      <Navbar />

      <div className="success-page">
        <div className="success-card">

          <div className="success-icon">🎉</div>

          {paymentMethod === "Cash on Delivery" ? (
            <>
              <h1>Order Placed Successfully!</h1>

              <p>
                Thank you for ordering with <strong>FoodBot</strong>.
              </p>

              <p>
                Your delicious food is now being prepared.
              </p>

              <p>
                <strong>Payment Method:</strong> Cash on Delivery
              </p>

              <p>
                <strong>Payment Status:</strong> Pay on Delivery
              </p>
            </>
          ) : (
            <>
              <h1>Payment Successful!</h1>

              <p>
                Thank you for ordering with <strong>FoodBot</strong>.
              </p>

              <p>
                Your payment has been received successfully.
              </p>

              <p>
                Your order is now being prepared.
              </p>

              <p>
                <strong>Payment Method:</strong> {paymentMethod}
              </p>
            </>
          )}

          <div className="success-buttons">

            <button
              className="success-btn"
              onClick={() => navigate("/orders")}
            >
              🛵 Track Order
            </button>

            <button
              className="continue-btn"
              onClick={() => navigate("/menu")}
            >
              🍔 Continue Shopping
            </button>

          </div>

        </div>
      </div>
    </>
  );
}

export default OrderSuccess;