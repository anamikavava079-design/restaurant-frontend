import Navbar from "../components/Navbar";
import "../styles/cart.css";
import useCart from "../hooks/useCart";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

function Cart() {
  const {
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  totalItems,
  itemsTotal,
  gst,
  deliveryFee,
  grandTotal,
  claimedOffer,
  removeOffer,
  offerDiscount,
  offerMessage,
} = useCart();

return (
  <>
    <Navbar />

    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart is Empty 🛒</h2>
          <p>Add some delicious food from our menu.</p>

          <Link to="/menu">
            <button className="checkout-btn">
              Browse Menu
            </button>
          </Link>
        </div>
      ) : (
        <div className="cart-container">

          {/* Left Side */}
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-card" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h2>{item.name}</h2>

                  <p>{item.category}</p>

                  {item.customization && (
                    <div className="customization-box">
                      <strong>Customization</strong>
                      <p>{item.customization}</p>
                    </div>
                  )}

                  <h3>
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </h3>

                  <div className="quantity">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <FaMinus />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Items Total</span>
              <span>₹{itemsTotal.toFixed(2)}</span>
            </div>

            {claimedOffer && (
              <>
                {offerDiscount > 0 && (
                  <div
                    className="summary-row"
                    style={{ color: "#2e7d32", fontWeight: 600 }}
                  >
                    <span>Offer: {claimedOffer.title}</span>
                    <span>-₹{offerDiscount.toFixed(2)}</span>
                  </div>
                )}

                <p
                  style={{
                    fontSize: "13px",
                    color: offerDiscount > 0 ? "#2e7d32" : "#c62828",
                    margin: "4px 0 10px",
                  }}
                >
                  {offerDiscount > 0 ? "🎉 " : "⚠️ "}
                  {offerMessage}{" "}
                  <button
                    onClick={removeOffer}
                    style={{
                      border: "none",
                      background: "none",
                      color: "#888",
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "12px",
                    }}
                  >
                    Remove
                  </button>
                </p>
              </>
            )}

            <div className="summary-row">
              <span>GST (5%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>

            <hr />

            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout">
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </Link>
          </div>

        </div>
      )}
    </div>
  </>
);
}
export default Cart;
