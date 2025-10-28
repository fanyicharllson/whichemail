import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatHeaderProps {
  actualTheme: "light" | "dark";
}

export default function ChatHeader({ actualTheme }: ChatHeaderProps) {
  return (
    <View
      style={{
        padding: 24,
        paddingTop: 64,
        backgroundColor: actualTheme === "dark" ? "#1e293b" : "#ffffff",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: actualTheme === "dark" ? 0 : 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: actualTheme === "dark" ? "#3b82f6" : "#3b82f6",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Ionicons name="sparkles" size={24} color="#ffffff" />
        </View>
        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: actualTheme === "dark" ? "#f1f5f9" : "#1e293b",
              letterSpacing: -0.5,
            }}
          >
            WhichEmail AI
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: actualTheme === "dark" ? "#94a3b8" : "#64748b",
              marginTop: 2,
              fontWeight: "500",
            }}
          >
            Your intelligent email assistant ✨
          </Text>
        </View>
      </View>
    </View>
  );
}
