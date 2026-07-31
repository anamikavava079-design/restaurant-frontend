import "../styles/navbar.css";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaUtensils,
} from "react-icons/fa";
import useCart from "../hooks/useCart";

function Navbar() {
  const { cart } = useCart();

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("foodbot-user"));

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <FaUtensils className="logo-icon" />
        <span>FoodBot</span>
      </div>

      {/* Navigation */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/menu">Menu</Link>
        </li>

        {/* Show Booking only after login */}
        {user && (
          <li>
            <Link to="/booking">Booking</Link>
          </li>
        )}

        {/* Show Orders only after login */}
        {user && (
          <li>
            <Link to="/orders">Orders</Link>
          </li>
        )}

        <li>
          <a href="#footer">About</a>
        </li>
      </ul>

      {/* Right Side */}
      <div className="nav-right">

        {/* Search only after login */}
        {user && (
          <input type="text" placeholder="Search food..." />
        )}

        {/* Before Login */}
        {!user ? (
          <>
            <Link className="login-btn" to="/login">
              Login
            </Link>

            <Link className="register-btn" to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart className="icon" />
              <span className="cart-count">{cart.length}</span>
            </Link>

            <Link to="/profile">
              <FaUserCircle className="icon" />
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;