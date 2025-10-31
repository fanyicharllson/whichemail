import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getCategoryById } from "@/constants/categories";
import { useTheme } from "@/components/ThemeProvider";
import { useToggleFavorite } from "@/services/queries/serviceQueries";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const category = getCategoryById(service.categoryId);
  const { mutate: toggleFavorite, isPending: isTogglingFav } =
    useToggleFavorite();
  const { actualTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/service/detail/${service.id}`)}
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-98"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {/* Category Icon */}
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <Ionicons
            name={category.icon as any}
            size={24}
            color={category.color}
          />
        </View>

        {/* Service Info */}
        <View className="flex-1">
          <Text className="text-slate-900 dark:text-slate-100 font-bold text-base mb-1">
            {service.serviceName}
          </Text>
          <Text
            className="text-slate-500 dark:text-slate-400 text-sm"
            numberOfLines={1}
          >
            {service.email}
          </Text>
        </View>

        {/* Password Indicator & Arrow */}
        <View className="flex-row items-center">
          {/* Star Button */}
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite({
                serviceId: service.id,
                isFavorite: !service.isFavorite,
              });
            }}
            className="mr-2"
            disabled={isTogglingFav}
            accessibilityLabel={
              service.isFavorite ? "Remove from favorites" : "Add to favorites"
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
          {service.hasPassword && (
            <View className="bg-blue-100 dark:bg-blue-200/20 rounded-full p-1.5 mr-2">
              <Ionicons name="lock-closed" size={14} color="#3b82f6" />
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={actualTheme === "dark" ? "#94a3b8" : "#9ca3af"}
          />
        </View>
      </View>

      {/* Notes Preview */}
      {service.notes && (
        <View className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <Text
            className="text-slate-600 dark:text-slate-400 text-xs"
            numberOfLines={1}
          >
            {service.notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
