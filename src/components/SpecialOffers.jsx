import { useEffect, useState } from "react";
import "../styles/SpecialOffers.css";
import API_URL from "../api";
function SpecialOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/promotions/`)
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch((err) => console.error("Error loading promotions:", err));
  }, []);

  const colors = ["#ff6b35", "#4CAF50", "#2196F3", "#9C27B0", "#FF9800"];

  return (
    <section className="offers">
      <h2>Today's Special Offers</h2>

      <div className="offers-grid">
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <div
              className="offer-card"
              key={offer.id}
              style={{
                borderTop: `8px solid ${
                  colors[index % colors.length]
                }`,
              }}
            >
              <h1>{offer.discount}</h1>

              <h3>{offer.title}</h3>

              <p>{offer.description}</p>

              <p>
                <strong>Valid Until:</strong> {offer.valid_until}
              </p>

              <button>Claim Offer</button>
            </div>
          ))
        ) : (
          <p>No promotions available right now.</p>
        )}
      </div>
    </section>
  );
}

export default SpecialOffers;