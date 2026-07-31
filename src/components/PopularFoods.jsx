import "../styles/PopularFoods.css";

const foods = [
  {
    name: "Classic Burger",
    price: "₹249",
    rating: "⭐⭐⭐⭐⭐",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
  },
  {
    name: "Cheese Pizza",
    price: "₹399",
    rating: "⭐⭐⭐⭐⭐",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
  },
  {
    name: "Italian Pasta",
    price: "₹299",
    rating: "⭐⭐⭐⭐",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500"
  },
  {
    name: "Cold Coffee",
    price: "₹149",
    rating: "⭐⭐⭐⭐⭐",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"
  }
];

function PopularFoods() {
  return (
    <section className="popular-foods">
      <h2>Popular Dishes</h2>

      <div className="food-grid">
        {foods.map((food, index) => (
          <div className="food-card" key={index}>
            <img src={food.image} alt={food.name} />

            <div className="food-info">
              <h3>{food.name}</h3>

              <p>{food.rating}</p>

              <h4>{food.price}</h4>

              <button>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularFoods;