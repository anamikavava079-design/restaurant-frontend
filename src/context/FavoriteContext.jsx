import { createContext, useState } from "react";

export const FavoriteContext = createContext();

function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (food) => {
    const exists = favorites.find((item) => item.id === food.id);

    if (exists) {
      setFavorites(favorites.filter((item) => item.id !== food.id));
    } else {
      setFavorites([...favorites, food]);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export default FavoriteProvider;