import { useContext } from "react";
import { FavoriteContext } from "../context/FavoriteContext";

function useFavorite() {
  return useContext(FavoriteContext);
}

export default useFavorite;