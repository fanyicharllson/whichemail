import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeleteAllPasswordsButtonProps {
  onPress: () => void;
  isDeleting: boolean;
  actualTheme: "light" | "dark";
  passwordCount: number;
}

export default function DeleteAllPasswordsButton({
  onPress,
  isDeleting,
  actualTheme,
  passwordCount,
}: DeleteAllPasswordsButtonProps) {
  const isDark = actualTheme === "dark";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDeleting}
      activeOpacity={0.7}
      style={{
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#ef4444",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 2,
        borderColor: isDark ? "#7f1d1d" : "#fee2e2",
      }}
    >
      {/* Icon */}
      <View
        style={{
          backgroundColor: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
          borderRadius: 12,
          padding: 10,
          marginRight: 12,
        }}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#ef4444" />
        ) : (
          <Ionicons name="trash" size={22} color="#ef4444" />
        )}
      </View>

      {/* Text Content */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: isDark ? "#f1f5f9" : "#1e293b",
            fontWeight: "600",
            fontSize: 16,
            marginBottom: 2,
          }}
        >
          Delete All Passwords
        </Text>
        <Text
          style={{
            color: isDark ? "#94a3b8" : "#64748b",
            fontSize: 12,
          }}
        >
          {isDeleting
            ? "Deleting passwords..."
            : `Permanently remove ${passwordCount} saved password(s)`}
        </Text>
      </View>

      {/* Arrow or Warning Icon */}
      {!isDeleting && (
        <View
          style={{
            backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
            borderRadius: 20,
            padding: 8,
          }}
        >
          <Ionicons name="warning" size={20} color="#ef4444" />
        </View>
      )}
    </TouchableOpacity>
  );
}
