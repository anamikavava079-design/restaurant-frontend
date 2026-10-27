import "../styles/navbar.css";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FaBars,
  FaShoppingCart,
  FaTimes,
  FaUserCircle,
  FaUtensils,
} from "react-icons/fa";
import useCart from "../hooks/useCart";

function Navbar() {
  const { cart } = useCart();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // phones/tablets: the links open from the ☰ button
  const [menuOpen, setMenuOpen] = useState(false);

  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );

  // keep the box in sync when the Menu page clears its search
  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("foodbot-user"));

  // Search goes to the Menu page, which filters by the text
  const handleSearch = (e) => {
    e.preventDefault();

    const text = searchText.trim();

    navigate(
      text ? `/menu?search=${encodeURIComponent(text)}` : "/menu"
    );
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <FaUtensils className="logo-icon" />
        <span>FoodBot</span>
      </div>

      {/* Navigation */}
      <ul
        className={menuOpen ? "nav-links open" : "nav-links"}
        onClick={() => setMenuOpen(false)}
      >
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

        {/* Kitchen display for restaurant staff */}
        {["admin", "support"].includes(user?.role) && (
          <li>
            <Link to="/kitchen">Kitchen</Link>
          </li>
        )}
      </ul>

      {/* Right Side */}
      <div className="nav-right">

        {/* Search only after login */}
        {user && (
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search food..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </form>
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

        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
