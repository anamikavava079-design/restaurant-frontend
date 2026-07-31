import "../styles/Hero.css";
import burger from "../assets/burger.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <h4>It's not just food</h4>

        <h1>
          It's an <span>Experience</span>
        </h1>

        <p>
          Order delicious food from the best restaurants with fast delivery
          and easy table booking.
        </p>

        <div className="hero-buttons">
          <button className="order-btn">
            Order Now
          </button>

          <button className="book-btn">
            Book Table
          </button>
        </div>

      </div>

      <div className="hero-right">
        <img src={burger} alt="Burger" />
      </div>

    </section>
  );
}

export default Hero;