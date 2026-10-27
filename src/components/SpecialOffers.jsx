import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SpecialOffers.css";
import API_URL from "../api";
import useCart from "../hooks/useCart";

function SpecialOffers() {
  const [offers, setOffers] = useState([]);

  const { claimedOffer, claimOffer, removeOffer } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/promotions/`)
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch((err) => console.error("Error loading promotions:", err));
  }, []);

  const colors = ["#ff6b35", "#4CAF50", "#2196F3", "#9C27B0", "#FF9800"];

  const handleClaim = (offer) => {
    if (!localStorage.getItem("foodbot-user")) {
      alert("Please login to claim this offer.");
      navigate("/login");
      return;
    }

    claimOffer(offer);
    alert(
      `🎉 "${offer.title}" claimed! The discount is applied automatically in your cart and at checkout.`
    );
  };

  return (
    <section className="offers">
      <h2>Today's Special Offers</h2>

      <div className="offers-grid">
        {offers.length > 0 ? (
          offers.map((offer, index) => {
            const isClaimed = claimedOffer?.id === offer.id;

            return (
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

                {isClaimed ? (
                  <>
                    <button
                      onClick={() => navigate("/cart")}
                      style={{ background: "#4CAF50" }}
                    >
                      ✓ Claimed -- View Cart
                    </button>

                    <p>
                      <button
                        onClick={removeOffer}
                        style={{
                          background: "none",
                          color: "#888",
                          padding: 0,
                          marginTop: "8px",
                          fontSize: "13px",
                        }}
                      >
                        Remove offer
                      </button>
                    </p>
                  </>
                ) : (
                  <button onClick={() => handleClaim(offer)}>
                    Claim Offer
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>No promotions available right now.</p>
        )}
      </div>
    </section>
  );
}

export default SpecialOffers;
