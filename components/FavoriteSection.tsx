import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getCategoryById } from "@/constants/categories";
import * as Clipboard from "expo-clipboard";
import { showToast } from "@/utils/toast";
import { useToggleFavorite } from "@/services/queries/serviceQueries";
import { useTheme } from "./ThemeProvider";

interface FavoritesSectionProps {
  services: Service[];
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  services,
}) => {
  const { mutate: toggleFavorite, isPending: isTogglingFav } =
    useToggleFavorite();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";

  const favoriteServices = services?.filter((s) => s.isFavorite) || [];

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      showToast.success(`${label} Copied!`, "Copied to clipboard");
    } catch (error) {
      console.error(`Error copying text: ${error}`);
      showToast.error("Copy Failed", "Unable to copy. Please try again");
    }
  };

  // Don't render if no favorites
  if (favoriteServices.length === 0) {
    return null;
  }

  return (
    <View className="px-6 mb-6">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <View className="bg-yellow-100 dark:bg-yellow-900/30 w-8 h-8 rounded-full items-center justify-center">
            <Ionicons name="star" size={18} color="#f59e0b" />
          </View>
          <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg">
            Favorites
          </Text>
        </View>
        <View className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
          <Text className="text-yellow-700 dark:text-yellow-400 text-xs font-semibold">
            {favoriteServices.length}
          </Text>
        </View>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
        className="-mx-6 px-6"
      >
        {favoriteServices.map((service) => {
          const category = getCategoryById(service.categoryId);

          return (
            <TouchableOpacity
              key={service.id}
              onPress={() => router.push(`/service/detail/${service.id}`)}
              activeOpacity={0.7}
              className="bg-white dark:bg-slate-800 rounded-2xl p-4 mr-3 border border-slate-200 dark:border-slate-700 shadow-sm"
              style={{ width: 280 }}
            >
              {/* Header with Star */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center gap-3 flex-1">
                  {/* Category Icon */}
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={category.color}
                    />
                  </View>

                  {/* Service Name */}
                  <View className="flex-1">
                    <Text
                      className="text-slate-900 dark:text-slate-100 font-bold text-base mb-1"
                      numberOfLines={1}
                    >
                      {service.serviceName}
                    </Text>
                    <View className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded self-start">
                      <Text className="text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                        {category.name}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Star Button */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite({
                      serviceId: service.id,
                      isFavorite: !service.isFavorite,
                    });
                  }}
                  className="ml-2"
                  disabled={isTogglingFav}
                  accessibilityLabel={
                    service.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {isTogglingFav ? (
                    <ActivityIndicator size="small" color="#f59e0b" />
                  ) : (
                    <Ionicons
                      name={service.isFavorite ? "star" : "star-outline"}
                      size={20}
                      color="#f59e0b"
                    />
                  )}
                </TouchableOpacity>
              </View>

              {/* Email */}
              <View className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 mb-3">
                <Text className="text-slate-500 dark:text-slate-400 text-[10px] mb-1 uppercase tracking-wide">
                  Email
                </Text>
                <Text
                  className="text-slate-900 dark:text-slate-100 font-semibold text-sm"
                  numberOfLines={1}
                >
                  {service.email}
                </Text>
              </View>

              {/* Actions Row */}
              <View className="flex-row gap-2">
                {/* Copy Email */}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    copyToClipboard(service.email, "Email");
                  }}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/20 py-2.5 rounded-lg flex-row items-center justify-center gap-1.5"
                >
                  <Ionicons name="copy-outline" size={14} color="#3b82f6" />
                  <Text className="text-blue-600 dark:text-blue-400 font-semibold text-xs">
                    Copy
                  </Text>
                </TouchableOpacity>

                {/* Password Status */}
                {service.hasPassword ? (
                  <View className="flex-1 bg-green-50 dark:bg-green-900/20 py-2.5 rounded-lg flex-row items-center justify-center gap-1.5">
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color="#10b981"
                    />
                    <Text className="text-green-600 dark:text-green-400 font-semibold text-xs">
                      Secured
                    </Text>
                  </View>
                ) : (
                  <View className="flex-1 bg-slate-100 dark:bg-slate-700 py-2.5 rounded-lg flex-row items-center justify-center gap-1.5">
                    <Ionicons
                      name="lock-open-outline"
                      size={14}
                      color={isDark ? "#94a3b8" : "#64748b"}
                    />
                    <Text className="text-slate-500 dark:text-slate-400 font-semibold text-xs">
                      No Pass
                    </Text>
                  </View>
                )}
              </View>

              {/* Website (if exists) */}
              {service.website && (
                <View className="mt-2 flex-row items-center gap-1.5">
                  <Ionicons
                    name="globe-outline"
                    size={12}
                    color={isDark ? "#94a3b8" : "#64748b"}
                  />
                  <Text
                    className="text-slate-500 dark:text-slate-400 text-xs"
                    numberOfLines={1}
                  >
                    {service.website}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Add More Card */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/services")}
          className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 items-center justify-center"
          style={{ width: 160 }}
        >
          <View className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full items-center justify-center mb-3">
            <Ionicons name="add" size={28} color="#3b82f6" />
          </View>
          <Text className="text-slate-600 dark:text-slate-400 font-semibold text-sm text-center">
            Add More{"\n"}Favorites
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Quick Tip */}
      <View className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mt-4 flex-row items-start gap-2 border border-amber-200 dark:border-amber-800">
        <Ionicons
          name="star-outline"
          size={16}
          color="#f59e0b"
          style={{ marginTop: 2 }}
        />
        <Text className="text-amber-700 dark:text-amber-300 text-xs flex-1 leading-5">
          Star your most-used services for quick access! Tap the ⭐ on any
          service.
        </Text>
      </View>
    </View>
  );
};
