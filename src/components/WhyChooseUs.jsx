import "../styles/WhyChooseUs.css";
import { FaShippingFast, FaUtensils, FaHeadset, FaStar } from "react-icons/fa";

function WhyChooseUs() {
  return (
    <section className="why">
      <h2>Why Choose FoodBot?</h2>

      <div className="why-grid">

        <div className="why-card">
          <FaShippingFast className="why-icon"/>
          <h3>Fast Delivery</h3>
          <p>Hot and fresh food delivered in under 30 minutes.</p>
        </div>

        <div className="why-card">
          <FaUtensils className="why-icon"/>
          <h3>100+ Restaurants</h3>
          <p>Choose from hundreds of restaurants and cuisines.</p>
        </div>

        <div className="why-card">
          <FaStar className="why-icon"/>
          <h3>Top Rated</h3>
          <p>Only highly rated restaurants are featured.</p>
        </div>

        <div className="why-card">
          <FaHeadset className="why-icon"/>
          <h3>24×7 Support</h3>
          <p>Our support team is always available for you.</p>
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;