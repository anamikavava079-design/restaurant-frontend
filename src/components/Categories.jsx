import "../styles/Categories.css";

const categories = [
  { icon: "🍔", name: "Burger" },
  { icon: "🍕", name: "Pizza" },
  { icon: "🍝", name: "Pasta" },
  { icon: "🥤", name: "Drinks" },
  { icon: "🍰", name: "Dessert" },
  { icon: "🥗", name: "Salad" },
];

function Categories() {
  return (
    <section className="categories">
      <h2>Popular Categories</h2>

      <div className="category-grid">
        {categories.map((item, index) => (
          <div className="category-card" key={index}>
            <div className="category-icon">{item.icon}</div>
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;