import "../styles/Stats.css";

function Stats() {
  return (
    <section className="stats">
      <div className="stat-card">
        <h1>5000+</h1>
        <p>Orders Delivered</p>
      </div>

      <div className="stat-card">
        <h1>100+</h1>
        <p>Partner Restaurants</p>
      </div>

      <div className="stat-card">
        <h1>10000+</h1>
        <p>Happy Customers</p>
      </div>

      <div className="stat-card">
        <h1>4.9★</h1>
        <p>Average Rating</p>
      </div>
    </section>
  );
}

export default Stats;