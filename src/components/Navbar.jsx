import "../styles/navbar.css";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaUtensils,
} from "react-icons/fa";
import useCart from "../hooks/useCart";

function Navbar() {
  const { cart } = useCart();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );

  // keep the box in sync when the Menu page clears its search
  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("foodbot-user"));

  // "About" = the footer on the Home page (description + contact details)
  const goToAbout = (e) => {
    e.preventDefault();

    // one direct jump (smooth scrolling is unreliable in some browsers);
    // 80px = the fixed navbar's height, so it doesn't cover the footer
    const scrollToFooter = (footer) => {
      window.scrollTo(
        0,
        footer.getBoundingClientRect().top + window.scrollY - 80
      );
    };

    if (location.pathname !== "/") navigate("/");

    // wait until the Home page has rendered its footer
    let tries = 0;
    const waitForFooter = setInterval(() => {
      const footer = document.getElementById("footer");
      tries += 1;

      if (footer || tries > 30) {
        clearInterval(waitForFooter);
        if (footer) scrollToFooter(footer);
      }
    }, 100);
  };

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
          <a href="/#footer" onClick={goToAbout}>About</a>
        </li>
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

      </div>
    </nav>
  );
}

export default Navbar;
