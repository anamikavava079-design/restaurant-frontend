import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
import API_URL from "../api";

function Profile() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("foodbot-user")
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadOrders();
    loadBookings();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/list/?customer_id=${user.id}`
      );

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/booking/list/?customer_id=${user.id}`
      );

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("foodbot-user");
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-header">
          <FaUserCircle className="profile-avatar" />

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* BOOKINGS */}

        <h2 className="section-title">📅 My Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          bookings.map((booking) => (
            <div className="card" key={booking.id}>

              <h3>🍽 Table Reservation</h3>

              <div className="row">
                <span>
                  <b>Restaurant:</b>{" "}
                  {booking.restaurant_name}
                </span>

                <span>
                  <b>Guests:</b>{" "}
                  {booking.guests}
                </span>
              </div>

              <div className="row">
                <span>
                  <b>Date:</b>{" "}
                  {booking.booking_date}
                </span>

                <span>
                  <b>Time:</b>{" "}
                  {booking.booking_time}
                </span>
              </div>

              <div className="row">
                <span className="status">
                  ✅ {booking.status}
                </span>
              </div>

            </div>
          ))
        )}

        {/* ORDERS */}

        <h2 className="section-title">📦 My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div className="card" key={order.id}>

              <h3>Order #{order.id}</h3>

              <div className="row">
                <span>
                  <b>Total:</b> ₹
                  {order.total_price}
                </span>

                <span className="status">
                  {order.status}
                </span>
              </div>

              <div className="row">
                <span>
                  <b>Restaurant:</b>{" "}
                  {order.restaurant_name}
                </span>
              </div>

              {order.items.map((item) => (
                <p key={item.id}>
                  • {item.menu_item_name} × {item.quantity}
                </p>
              ))}

            </div>
          ))
        )}

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </>
  );
}

export default Profile;