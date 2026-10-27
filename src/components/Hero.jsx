import "../styles/Hero.css";
import { Link } from "react-router-dom";

// Free-to-use photos from Unsplash
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1100&q=80&auto=format&fit=crop";
const PIZZA_IMAGE =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80&auto=format&fit=crop";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <span className="hero-badge">🤖 AI-powered food ordering</span>

        <h1>
          Delicious food,
          <br />
          <span>ordered in a chat.</span>
        </h1>

        <p>
          Browse the menu, get dishes picked for your mood, book a table and
          track your order -- just by chatting with FoodBot.
        </p>

        <div className="hero-buttons">
          <Link to="/menu" className="order-btn">
            Order Now →
          </Link>

          <Link to="/booking" className="book-btn">
            Book a Table
          </Link>
        </div>

        <div className="hero-stats">
          <div>
            <strong>4.8★</strong>
            <span>Customer rating</span>
          </div>

          <div>
            <strong>30 min</strong>
            <span>Average delivery</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>FoodBot chat</span>
          </div>
        </div>

      </div>

      <div className="hero-right">

        <div className="hero-image">
          <img src={HERO_IMAGE} alt="A table full of freshly made dishes" />
        </div>

        <img
          className="hero-mini-dish"
          src={PIZZA_IMAGE}
          alt="Cheese pizza"
        />

      </div>

    </section>
  );
}

export default Hero;
