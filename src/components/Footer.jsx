import "../styles/Footer.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div>
          <h2>🍴 FoodBot</h2>
          <p>
            Delicious food delivered to your doorstep with
            fast delivery and secure payments.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>

          <p>Home</p>
          <p>Menu</p>
          <p>Booking</p>
          <p>Cart</p>
        </div>

        <div>
          <h3>Contact</h3>

          <p>📞 +91 9876543210</p>
          <p>✉ support@foodbot.com</p>
          <p>Bangalore, India</p>
        </div>

        <div>
          <h3>Follow Us</h3>

          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>

        </div>

      </div>

      <hr />

      <p className="copyright">
        © 2026 FoodBot. All Rights Reserved.
      </p>

    </footer>
  );
}

export default Footer;