// components/ModeSelector.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Mode = "smart-search" | "recovery" | "chat";

interface ModeSelectorProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  actualTheme: "light" | "dark";
  onModeChange: () => void;
}

export default function ModeSelector({
  mode,
  setMode,
  actualTheme,
  onModeChange,
}: ModeSelectorProps) {
  const modes: {
    key: Mode;
    label: string;
    icon: string;
    description: string;
  }[] = [
    {
      key: "smart-search",
      label: "Search",
      icon: "search",
      description: "Find emails using natural language",
    },
    {
      key: "recovery",
      label: "Recovery",
      icon: "key",
      description: "Recover forgotten email accounts",
    },
    {
      key: "chat",
      label: "Chat",
      icon: "chatbubble-ellipses",
      description: "Chat with AI about your emails",
    },
  ];

  const handleModePress = (newMode: Mode) => {
    setMode(newMode);
    onModeChange();
  };

  const getModeDescription = () => {
    switch (mode) {
      case "smart-search":
        return "Find emails using natural language";
      case "recovery":
        return "Recover forgotten email accounts";
      case "chat":
        return "Chat with AI about your emails";
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingBottom: 8, 
        backgroundColor: actualTheme === "dark" ? "#1e293b" : "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: actualTheme === "dark" ? "#334155" : "#e2e8f0",
      }}
    >
        {/* user infor to select mode */}
       <View style={{ marginBottom: 4, alignItems: "flex-start" }}>
        <Text
          style={{
            fontSize: 12,
            color: actualTheme === "dark" ? "#64748b" : "#94a3b8",
            textAlign: "left",
            fontWeight: "500",
          }}
        >
          Choose a mode below to get started 🔥
        </Text>
      </View>


      {/* Mode Buttons - Slimmed Down */}
      <View style={{ flexDirection: "row", gap: 4 }}>
        {/* Even smaller gap */}
        {modes.map((item) => {
          const isActive = mode === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => handleModePress(item.key)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 6, // Even slimmer
                paddingHorizontal: 4,
                borderRadius: 8, // Tighter corners
                backgroundColor: isActive
                  ? actualTheme === "dark"
                    ? "#3b82f6"
                    : "#3b82f6"
                  : "transparent", // Transparent background for inactive
                borderWidth: isActive ? 0 : 1,
                borderColor: actualTheme === "dark" ? "#475569" : "#cbd5e1",
                shadowColor: isActive ? "#3b82f6" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isActive ? 0.15 : 0,
                shadowRadius: 3,
                elevation: isActive ? 2 : 0,
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={18} 
                color={
                  isActive
                    ? "#ffffff"
                    : actualTheme === "dark"
                    ? "#94a3b8"
                    : "#64748b"
                }
              />
              <Text
                style={{
                  fontSize: 13, 
                  fontWeight: "600", 
                  color: isActive
                    ? "#ffffff"
                    : actualTheme === "dark"
                    ? "#94a3b8"
                    : "#64748b",
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Mode Description - Below the selector */}
      <View style={{ marginTop: 6, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 12,
            color: actualTheme === "dark" ? "#64748b" : "#94a3b8",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          {getModeDescription()}
        </Text>
      </View>
    </View>
  );
}
