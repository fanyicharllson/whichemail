// components/ContactSupport.tsx
import React from "react";
import { Text, TouchableOpacity, View, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { showToast } from "@/utils/toast";

interface ContactSupportProps {
  actualTheme: "light" | "dark";
}

export default function ContactSupport({ actualTheme }: ContactSupportProps) {
  const phoneNumber = "237670242458";
  const message = "Hi Charllson! I need help with WhichEmail AI 🤖";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const handleContactSupport = async () => {
    try {
      showToast.info("Opening WhatsApp...");
      await Linking.openURL(whatsappLink);
    } catch (error) {
      showToast.error(
        "Error Opening Whatsapp!",
        "Please ensure you have whatsapp installed or try again later."
      );
      console.error("Error opening WhatsApp:", error);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        alignItems: "center",
        backgroundColor:
          actualTheme === "dark"
            ? "rgba(30, 41, 59, 0.5)"
            : "rgba(248, 250, 252, 0.8)",
        margin: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: actualTheme === "dark" ? "#334155" : "#e2e8f0",
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: actualTheme === "dark" ? "#064e3b" : "#d1fae5",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
          borderWidth: 2,
          borderColor: actualTheme === "dark" ? "#065f46" : "#a7f3d0",
        }}
      >
        <Ionicons name="logo-whatsapp" size={28} color="#10b981" />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: actualTheme === "dark" ? "#f1f5f9" : "#1e293b",
          marginBottom: 4,
          textAlign: "center",
        }}
      >
        Need AI Assistance?
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: actualTheme === "dark" ? "#94a3b8" : "#64748b",
          marginBottom: 16,
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        I&apos;m here to help you get the most out of WhichEmail AI
      </Text>

      <TouchableOpacity
        onPress={handleContactSupport}
        activeOpacity={0.7}
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: actualTheme === "dark" ? "#065f46" : "#10b981",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 16,
          gap: 8,
          shadowColor: "#10b981",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Ionicons name="logo-whatsapp" size={20} color="#ffffff" />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          Contact Charllson 😎
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 12,
          color: actualTheme === "dark" ? "#64748b" : "#94a3b8",
          marginTop: 12,
          fontStyle: "italic",
        }}
      >
        Always happy to help! 🚀
      </Text>
    </View>
  );
}
