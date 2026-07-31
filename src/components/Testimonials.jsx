import "../styles/Testimonials.css";

const reviews = [
  {
    name: "Ananya",
    review: "Amazing food and super fast delivery! Highly recommended.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rahul",
    review: "The burgers were delicious and the app is easy to use.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sneha",
    review: "Loved the desserts! Booking a table was very smooth.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

function Testimonials() {
  return (
    <section className="testimonials">
      <h2>What Our Customers Say</h2>

      <div className="review-container">
        {reviews.map((user, index) => (
          <div className="review-card" key={index}>
            <img src={user.image} alt={user.name} />

            <h3>{user.name}</h3>

            <p>"{user.review}"</p>

            <div className="stars">⭐⭐⭐⭐⭐</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;