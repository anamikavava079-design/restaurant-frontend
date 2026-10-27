import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/menu.css";
import useCart from "../hooks/useCart";
import { FaHeart } from "react-icons/fa";
import API_URL from "../api";

function Menu() {
  const { addToCart } = useCart();

  const [menuItems, setMenuItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [previousRecommendations, setPreviousRecommendations] = useState([]);
  // the navbar search box sends people here as /menu?search=pizza
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMood, setSelectedMood] = useState("All");

  const [favorites, setFavorites] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [notes, setNotes] = useState({});
  const [totalPrices, setTotalPrices] = useState({});

  useEffect(() => {
  const customer = JSON.parse(
    localStorage.getItem("foodbot-user")
  );

  // Load menu
  fetch(`${API_URL}/api/menu/`)
    .then((res) => res.json())
    .then((data) => setMenuItems(data))
    .catch((err) =>
      console.error("Error loading menu:", err)
    );

  if (customer) {
    // Dietary recommendations
    fetch(
      `${API_URL}/api/menu/recommendations/?customer_id=${customer.id}`
    )
      .then((res) => res.json())
      .then((data) => setRecommendedItems(data))
      .catch((err) =>
        console.error(
          "Recommendation error:",
          err
        )
      );

    // Previous order recommendations
    fetch(
      `${API_URL}/api/menu/previous-recommendations/?customer_id=${customer.id}`
    )
      .then((res) => res.json())
      .then((data) =>
        setPreviousRecommendations(data)
      )
      .catch((err) =>
        console.error(
          "Previous recommendation error:",
          err
        )
      );
  }
}, []);

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const moods = [
    "All",
    "😊 Happy",
    "🌶️ Spicy",
    "🍰 Sweet",
    "🥗 Healthy",
    "🍔 Hungry",
    "⚡ Quick Bite",
  ];

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const searchMatch = [item.name, item.category, item.description]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const categoryMatch =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    let moodMatch = true;

    switch (selectedMood) {
      case "🌶️ Spicy":
        moodMatch = item.is_spicy;
        break;

      case "🥗 Healthy":
        // Salads, or light (≤ 350 kcal) veg mains -- never pizza,
        // burgers, desserts or sugary drinks just because they're veg.
        moodMatch =
          item.category === "Salad" ||
          ((item.is_veg || item.is_vegan) &&
            Number(item.calories) > 0 &&
            Number(item.calories) <= 350 &&
            !["Pizza", "Burger", "Dessert", "Drink"].includes(
              item.category
            ));
        break;

      case "😊 Happy":
        // comfort favourites
        moodMatch = [
          "Pizza",
          "Burger",
          "Pasta",
          "Dessert",
        ].includes(item.category);
        break;

      case "🍰 Sweet":
        moodMatch = item.category === "Dessert";
        break;

      case "🍔 Hungry":
        moodMatch = [
          "Pizza",
          "Burger",
          "Pasta",
          "Biryani",
        ].includes(item.category);
        break;

      case "⚡ Quick Bite":
        moodMatch = [
          "Burger",
          "Drink",
          "Salad",
        ].includes(item.category);
        break;

      default:
        moodMatch = true;
    }

    return (
      searchMatch &&
      categoryMatch &&
      moodMatch
    );
  });

  // While a filter or search is active, show the filtered dishes right
  // under the filter buttons instead of the (unfiltered) recommendations.
  const isFiltering =
    selectedMood !== "All" ||
    selectedCategory !== "All" ||
    search.trim() !== "";

  const filterLabel = [
    selectedCategory !== "All" ? selectedCategory : null,
    selectedMood !== "All" ? selectedMood : null,
    search.trim() ? `"${search.trim()}"` : null,
  ]
    .filter(Boolean)
    .join(" + ");

  const resetFilters = () => {
    setSelectedMood("All");
    setSelectedCategory("All");
    setSearch("");
    setSearchParams({});
  };

  const handleOptionChange = (
  itemId,
  category,
  option,
  type
) => {
  setSelectedOptions((prev) => {
    const updated = { ...prev };

    if (!updated[itemId]) updated[itemId] = {};

    if (type === "multiple") {
      const current = updated[itemId][category] || [];

      updated[itemId][category] = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
    } else {
      updated[itemId][category] = option;
    }

    // Find the current menu item
    const item = menuItems.find((m) => m.id === itemId);

    if (item) {
      let total = Number(item.price);

      item.customizations?.forEach((custom) => {
        const selected = updated[itemId][custom.category];

        if (
          Array.isArray(selected) &&
          selected.includes(custom.option)
        ) {
          total += Number(custom.extra_price);
        }

        if (selected === custom.option) {
          total += Number(custom.extra_price);
        }
      });

      setTotalPrices((prevPrices) => ({
        ...prevPrices,
        [itemId]: total,
      }));
    }

    return updated;
  });
};

  const getSelectedOptions = (item) => {
    const selected =
      selectedOptions[item.id] || {};

    return (
      item.customizations?.filter((option) => {
        const value =
          selected[option.category];

        if (Array.isArray(value))
          return value.includes(option.option);

        return value === option.option;
      }) || []
    );
  };

  const handleAdd = (item) => {
    addToCart({
      ...item,
      selectedOptions:
        getSelectedOptions(item),
      notes: notes[item.id] || "",
      price:
        totalPrices[item.id] ?? Number(item.price),
    });
};
return (
  <>
    <Navbar />

    <div className="menu-page">
      <h1>Our Menu</h1>

      <p className="menu-subtitle">
        Freshly prepared dishes made with love.
      </p>

      <input
        className="menu-search"
        type="text"
        placeholder="🔍 Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "active-category"
                : ""
            }
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mood Filter */}
      <div className="mood-filter">
        {moods.map((mood) => (
          <button
            key={mood}
            className={
              selectedMood === mood
                ? "active-mood"
                : ""
            }
            onClick={() =>
              setSelectedMood(mood)
            }
          >
            {mood}
          </button>
        ))}
      </div>

      {isFiltering && (
        <p
          style={{
            textAlign: "center",
            margin: "10px 0 20px",
            color: "#555",
          }}
        >
          Showing {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "dish" : "dishes"} for{" "}
          <strong>{filterLabel}</strong>{" "}
          <button
            onClick={resetFilters}
            style={{
              marginLeft: "8px",
              border: "none",
              background: "none",
              color: "#ff6b35",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ✕ Clear filters
          </button>
        </p>
      )}

      {isFiltering && filteredItems.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#777",
          }}
        >
          <p style={{ fontSize: "40px" }}>🍽️</p>
          <p>No dishes match this filter right now.</p>
          <button
            onClick={resetFilters}
            style={{
              marginTop: "12px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "20px",
              background: "#ff6b35",
              color: "white",
              cursor: "pointer",
            }}
          >
            Show all dishes
          </button>
        </div>
      )}

      {/* Dietary Recommendations */}
      {!isFiltering && recommendedItems.length > 0 && (
        <>
          <h2 className="recommend-title">
            ⭐ Recommended For You
          </h2>

          <div className="recommend-grid">
            {recommendedItems.map((item) => (
              <div
                className="recommend-card"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <h4>{item.name}</h4>

                <p>{item.category}</p>

                <strong>₹{item.price}</strong>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Previous Order Recommendations */}
      {!isFiltering && previousRecommendations.length > 0 && (
        <>
          <h2 className="recommend-title">
            🍽️ Based On Your Previous Orders
          </h2>

          <div className="recommend-grid">
            {previousRecommendations.map((item) => (
              <div
                className="recommend-card"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <h4>{item.name}</h4>

                <p>{item.category}</p>

                <strong>₹{item.price}</strong>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="menu-grid">
        {filteredItems.map((item) => (
          <div
            className="menu-card"
            key={item.id}
          >
            <div className="image-box">
              <img
                src={item.image}
                alt={item.name}
              />

              <span className="best-seller">
                🔥 Best Seller
              </span>

              <FaHeart
                className={
                  favorites.includes(item.id)
                    ? "heart active-heart"
                    : "heart"
                }
                onClick={() =>
                  toggleFavorite(item.id)
                }
              />
            </div>

            <div className="menu-info">
              <h3>{item.name}</h3>

              <p>{item.category}</p>
                            <div className="food-tags">
                {item.is_veg ? (
                  <span className="tag veg">
                    🟢 Veg
                  </span>
                ) : (
                  <span className="tag nonveg">
                    🔴 Non-Veg
                  </span>
                )}

                {item.is_vegan && (
                  <span className="tag vegan">
                    🌱 Vegan
                  </span>
                )}

                {item.is_spicy && (
                  <span className="tag spicy">
                    🌶️ Spicy
                  </span>
                )}

                <span className="tag calories">
                  🔥 {item.calories} kcal
                </span>

                {item.allergens?.length > 0 && (
                  <span className="tag allergen">
                    ⚠️ {item.allergens.join(", ")}
                  </span>
                )}
              </div>

              <div className="rating">
                ⭐⭐⭐⭐⭐
              </div>

              <h4>
                ₹
                {totalPrices[item.id] ??
                  Number(item.price)}
              </h4>

              {item.customizations &&
                item.customizations.length > 0 && (
                  <div className="customization-section">
                    {[...new Set(
                      item.customizations.map(
                        (c) => c.category
                      )
                    )].map((category) => {
                      const options =
                        item.customizations.filter(
                          (c) =>
                            c.category === category
                        );

                      const type =
                        options[0]?.selection_type ||
                        "single";

                      return (
                        <div
                          key={category}
                          className="custom-group"
                        >
                          <strong>{category}</strong>

                          {options.map((option) => (
                            <label
                              key={option.id}
                              className="custom-option"
                            >
                              <input
                                type={
                                  type === "multiple"
                                    ? "checkbox"
                                    : "radio"
                                }
                                name={`${item.id}-${category}`}
                                checked={
                                  type === "multiple"
                                    ? (
                                        selectedOptions[
                                          item.id
                                        ]?.[
                                          category
                                        ] || []
                                      ).includes(
                                        option.option
                                      )
                                    : selectedOptions[
                                        item.id
                                      ]?.[
                                        category
                                      ] ===
                                      option.option
                                }
                                onChange={() =>
                                  handleOptionChange(
                                    item.id,
                                    category,
                                    option.option,
                                    type
                                  )
                                }
                              />

                              <span>
                                {option.option}

                                {Number(
                                  option.extra_price
                                ) > 0 &&
                                  ` (+₹${option.extra_price})`}
                              </span>
                            </label>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}

              {getSelectedOptions(item).length > 0 && (
                <div className="price-breakdown">
                  <h4 className="breakdown-title">
                    Price Breakdown
                  </h4>

                  <div className="breakdown-row">
                    <span>Base Price</span>
                    <span>₹{item.price}</span>
                  </div>

                  {getSelectedOptions(item).map((option) => (
                    <div
                      key={option.id}
                      className="breakdown-row"
                    >
                      <span>{option.option}</span>

                      <span>
                        {Number(option.extra_price) > 0
                          ? `+₹${Number(
                              option.extra_price
                            ).toFixed(2)}`
                          : "Included"}
                      </span>
                    </div>
                  ))}

                  <hr />

                  <div className="breakdown-total">
                    <strong>Total</strong>

                    <strong>
                      ₹
                      {totalPrices[item.id] ??
                        Number(item.price)}
                    </strong>
                  </div>
                </div>
              )}
                            <textarea
                className="customization-box"
                placeholder="Special Instructions..."
                rows="2"
                value={notes[item.id] || ""}
                onChange={(e) =>
                  setNotes({
                    ...notes,
                    [item.id]: e.target.value,
                  })
                }
              />

              <button
                onClick={() => handleAdd(item)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

}
export default Menu;
