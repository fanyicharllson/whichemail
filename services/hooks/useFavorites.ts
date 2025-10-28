import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "@/utils/toast";

const FAVORITES_KEY = "whichemail_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const toggleFavorite = async (serviceId: string) => {
    try {
      const newFavorites = favorites.includes(serviceId)
        ? favorites.filter((id) => id !== serviceId)
        : [...favorites, serviceId];

      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

      showToast.success(
        favorites.includes(serviceId)
          ? "Removed from Favorites"
          : "Added to Favorites ⭐",
        favorites.includes(serviceId) ? "" : "Quick access from home"
      );
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      showToast.error("Failed to update favorites");
    }
  };

  const isFavorite = (serviceId: string) => favorites.includes(serviceId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
