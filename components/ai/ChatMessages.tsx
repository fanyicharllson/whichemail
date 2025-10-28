// components/ChatMessages.tsx
import React, { forwardRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatMessagesProps {
  chatHistory: { role: "user" | "ai"; text: string }[];
  actualTheme: "light" | "dark";
  isLoading: boolean;
  smartSearch: any;
  emailRecovery: any;
  handleServiceClick: (id: string) => void;
  hasContent: boolean;
  mode: string;
  getPlaceholder: () => string;
  keyboardHeight: number;
}

const ChatMessages = forwardRef<ScrollView, ChatMessagesProps>(
  (
    {
      chatHistory,
      actualTheme,
      isLoading,
      smartSearch,
      emailRecovery,
      handleServiceClick,
      hasContent,
      mode,
      getPlaceholder,
      keyboardHeight,
    },
    ref
  ) => {
    const renderResults = () => {
      if (smartSearch.data?.results && smartSearch.data.results.length > 0) {
        return (
          <View style={{ marginTop: 12, marginBottom: 8 }}>
                {/* Reduced margins */}
            <Text
              style={{
                fontSize: 15, // Slightly smaller
                fontWeight: "700",
                color: actualTheme === "dark" ? "#f1f5f9" : "#1e293b",
                marginBottom: 10, // Reduced margin
              }}
            >
              📧 Found {smartSearch?.data?.results.length} Match(es)
            </Text>
            {smartSearch?.data?.results.map((service: any) => (
              <TouchableOpacity
                key={service.id}
                style={{
                  backgroundColor:
                    actualTheme === "dark" ? "#1e293b" : "#ffffff",
                  padding: 14, // Reduced padding
                  borderRadius: 14, // Slightly smaller
                  marginBottom: 6, // Reduced margin
                  borderLeftWidth: 4,
                  borderLeftColor: "#3b82f6",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: actualTheme === "dark" ? 0.1 : 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
                onPress={() => handleServiceClick(service.id)}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: actualTheme === "dark" ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    {service.serviceName}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#3b82f6" />
                  {/* Smaller icon */}
                </View>
                <Text style={{ fontSize: 13, color: "#3b82f6", marginTop: 3 }}>
                  {/* Smaller font */}
                  {service.email}
                </Text>
                {service.notes && (
                  <Text
                    style={{
                      fontSize: 11, // Smaller font
                      color: actualTheme === "dark" ? "#94a3b8" : "#64748b",
                      marginTop: 3, // Reduced margin
                      fontStyle: "italic",
                    }}
                    numberOfLines={1}
                  >
                    {service.notes}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
      }

      if (
        emailRecovery.data?.matchedServices &&
        emailRecovery.data.matchedServices.length > 0
      ) {
        return (
      <View style={{ marginTop: 12, marginBottom: 8 }}>
        {/* Reduced margins */}
            <Text
              style={{
                fontSize: 15, // Slightly smaller
                fontWeight: "700",
                color: actualTheme === "dark" ? "#f1f5f9" : "#1e293b",
                marginBottom: 10, // Reduced margin
              }}
            >
              💡 Suggestions
            </Text>
            {emailRecovery.data.matchedServices.map((service: any) => (
              <TouchableOpacity
                key={service.id}
                style={{
                  backgroundColor:
                    actualTheme === "dark" ? "#1e293b" : "#ffffff",
                  padding: 14, // Reduced padding
                  borderRadius: 14, // Slightly smaller
                  marginBottom: 6, // Reduced margin
                  borderLeftWidth: 4,
                  borderLeftColor: "#10b981",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: actualTheme === "dark" ? 0.1 : 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
                onPress={() => handleServiceClick(service.id)}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: actualTheme === "dark" ? "#f1f5f9" : "#1e293b",
                    }}
                  >
                    {service.serviceName}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#10b981" />
                  {/* Smaller icon */}
                </View>
                <Text style={{ fontSize: 13, color: "#10b981", marginTop: 3 }}>
                  {/* Smaller font */}
                  {service.email}
                </Text>
                <Text
                  style={{
                    fontSize: 11, // Smaller font
                    color: actualTheme === "dark" ? "#94a3b8" : "#64748b",
                    marginTop: 3, // Reduced margin
                  }}
                >
                  Created: {new Date(service.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      }

      return null;
    };

    if (!hasContent && !isLoading) {
      return (
        <ScrollView
          ref={ref}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20, // Reduced padding
            paddingVertical: 30, // Reduced padding
            paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 30, // Adjust for keyboard
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 100, // Reduced size
                height: 100, // Reduced size
                borderRadius: 50, // Reduced border radius
                backgroundColor:
                  actualTheme === "dark"
                    ? "rgba(59, 130, 246, 0.1)"
                    : "#dbeafe",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20, // Reduced margin
                borderWidth: 2,
                borderColor:
                  actualTheme === "dark"
                    ? "rgba(59, 130, 246, 0.3)"
                    : "#bfdbfe",
              }}
            >
              <Ionicons
                name="sparkles"
                size={42} // Reduced icon size
                color={actualTheme === "dark" ? "#60a5fa" : "#3b82f6"}
              />
            </View>
            <Text
              style={{
                fontSize: 22, // Slightly smaller
                fontWeight: "800",
                color: actualTheme === "dark" ? "#f1f5f9" : "#1e293b",
                textAlign: "center",
                marginBottom: 6, // Reduced margin
              }}
            >
              Welcome to AI Assistant
            </Text>
            <Text
              style={{
                fontSize: 15, // Slightly smaller
                color: actualTheme === "dark" ? "#94a3b8" : "#64748b",
                textAlign: "center",
                marginBottom: 20, // Reduced margin
                lineHeight: 20, // Reduced line height
              }}
            >
              I&apos;m here to help you find and manage your emails with AI magic! ✨
            </Text>
            <View
              style={{
                backgroundColor:
                  actualTheme === "dark"
                    ? "rgba(59, 130, 246, 0.1)"
                    : "#eff6ff",
                padding: 14, // Reduced padding
                borderRadius: 14, // Slightly smaller
                borderWidth: 1,
                borderColor: actualTheme === "dark" ? "#1e40af" : "#bfdbfe",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 13, // Slightly smaller
                  color: actualTheme === "dark" ? "#cbd5e1" : "#475569",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                💡 {getPlaceholder()}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        ref={ref}
        contentContainerStyle={{
          paddingHorizontal: 16, // Reduced padding
          paddingVertical: 12, // Reduced padding
          flexGrow: 1,
          paddingBottom: keyboardHeight > 0 ? keyboardHeight + 80 : 12, // Add space for keyboard
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {chatHistory.map((msg, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              marginBottom: 12, // Reduced margin
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "ai" && (
              <View
                style={{
                  width: 32, // Reduced size
                  height: 32, // Reduced size
                  borderRadius: 16, // Reduced border radius
                  backgroundColor: "#3b82f6",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10, // Reduced margin
                  shadowColor: "#3b82f6",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons name="sparkles" size={16} color="#fff" />
                {/* Smaller icon */}
              </View>
            )}
            <View
              style={{
                maxWidth: "80%",
                padding: 12, // Reduced padding
                borderRadius: 18, // Slightly smaller
                backgroundColor:
                  msg.role === "user"
                    ? actualTheme === "dark"
                      ? "#3b82f6"
                      : "#3b82f6"
                    : actualTheme === "dark"
                    ? "#1e293b"
                    : "#ffffff",
                borderTopRightRadius: msg.role === "user" ? 6 : 18,
                borderTopLeftRadius: msg.role === "ai" ? 6 : 18,
                borderWidth: msg.role === "ai" ? 1 : 0,
                borderColor: actualTheme === "dark" ? "#334155" : "#e2e8f0",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: msg.role === "user" ? 0.2 : 0.1,
                shadowRadius: 3,
                elevation: msg.role === "user" ? 3 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 15, // Slightly smaller
                  lineHeight: 20, // Reduced line height
                  color:
                    msg.role === "user"
                      ? "#ffffff"
                      : actualTheme === "dark"
                      ? "#e2e8f0"
                      : "#1e293b",
                }}
              >
                {msg.text}
              </Text>
            </View>
            {msg.role === "user" && (
              <View
                style={{
                  width: 32, // Reduced size
                  height: 32, // Reduced size
                  borderRadius: 16, // Reduced border radius
                  backgroundColor:
                    actualTheme === "dark" ? "#475569" : "#cbd5e1",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10, // Reduced margin
                }}
              >
                <Ionicons
                  name="person"
                  size={16} // Smaller icon
                  color={actualTheme === "dark" ? "#cbd5e1" : "#475569"}
                />
              </View>
            )}
          </View>
        ))}

        {renderResults()}

        {isLoading && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10, // Reduced gap
            }}
          >
            <View
              style={{
                width: 32, // Reduced size
                height: 32, // Reduced size
                borderRadius: 16, // Reduced border radius
                backgroundColor: "#3b82f6",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Ionicons name="sparkles" size={16} color="#fff" />
              {/* Smaller icon */}
            </View>
            <View
              style={{
                backgroundColor: actualTheme === "dark" ? "#1e293b" : "#ffffff",
                borderRadius: 18, // Slightly smaller
                padding: 12, // Reduced padding
                borderWidth: 1,
                borderColor: actualTheme === "dark" ? "#334155" : "#e2e8f0",
                flexDirection: "row",
                alignItems: "center",
                gap: 10, // Reduced gap
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text
                style={{
                  color: actualTheme === "dark" ? "#94a3b8" : "#64748b",
                  fontSize: 14, // Slightly smaller
                  fontWeight: "500",
                }}
              >
                AI is thinking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
);
ChatMessages.displayName = "ChatMessages";
export default ChatMessages;
