import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUpdateUserName } from "@/services/hooks/useUpdateUser";
import { authenticateUser } from "@/utils/authUtils";

interface ProfileSectionProps {
  user: {
    name: string;
    email: string;
  } | null;
  actualTheme: "light" | "dark";
}

export default function ProfileSection({
  user,
  actualTheme,
}: ProfileSectionProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const updateUserName = useUpdateUserName();
  const isDark = actualTheme === "dark";

  const handleEditProfile = async () => {
    // Step 1: Authenticate user with biometrics
    setIsAuthenticating(true);
    const authResult = await authenticateUser({
      purpose: "edit-password",
      customMessage: "Authenticate to edit your profile",
    });
    setIsAuthenticating(false);

    if (!authResult.success) {
      // Authentication failed - don't open modal
      return;
    }

    // Step 2: Open edit modal after successful authentication
    setNewName(user?.name || "");
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    if (!newName.trim()) {
      return;
    }

    // Update the name
    updateUserName.mutate(newName.trim(), {
      onSuccess: () => {
        setShowEditModal(false);
      },
    });
  };

  return (
    <>
      {/* Profile Section */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 24 }}>
        <View
          style={{
            backgroundColor: isDark ? "#1e40af" : "#3b82f6",
            borderRadius: 20,
            padding: 24,
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Avatar */}
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: isDark
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(255, 255, 255, 0.3)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
                borderWidth: 3,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Ionicons name="person" size={36} color="#ffffff" />
            </View>

            {/* User Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  fontSize: 22,
                  marginBottom: 4,
                }}
              >
                {user?.name || "User"}
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: 14,
                }}
              >
                {user?.email || "No email"}
              </Text>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
              onPress={handleEditProfile}
              disabled={isAuthenticating}
              activeOpacity={0.7}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isAuthenticating ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="pencil" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: "rgba(255, 255, 255, 0.2)",
              justifyContent: "space-around",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons name="shield-checkmark" size={24} color="#ffffff" />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Secure
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Ionicons name="finger-print" size={24} color="#ffffff" />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Biometric
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Ionicons name="cloud-done" size={24} color="#ffffff" />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Synced
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderRadius: 20,
              padding: 24,
              width: "100%",
              maxWidth: 400,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: isDark ? "#1e40af" : "#dbeafe",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="person-circle"
                  size={28}
                  color={isDark ? "#60a5fa" : "#3b82f6"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: isDark ? "#f1f5f9" : "#1e293b",
                  }}
                >
                  Edit Profile
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: isDark ? "#94a3b8" : "#64748b",
                  }}
                >
                  Update your display name
                </Text>
              </View>
            </View>

            {/* Name Input */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: isDark ? "#cbd5e1" : "#475569",
                  marginBottom: 8,
                }}
              >
                Display Name
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#334155" : "#f1f5f9",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  borderWidth: 2,
                  borderColor: isDark ? "#475569" : "#e2e8f0",
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={isDark ? "#94a3b8" : "#64748b"}
                />
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: isDark ? "#f1f5f9" : "#1e293b",
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                  }}
                  maxLength={50}
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: isDark ? "#64748b" : "#94a3b8",
                  marginTop: 6,
                }}
              >
                {newName.length}/50 characters
              </Text>
            </View>

            {/* Email (Read-only for now) */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: isDark ? "#cbd5e1" : "#475569",
                  marginBottom: 8,
                }}
              >
                Email Address
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: isDark ? "#1e293b" : "#f8fafc",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={isDark ? "#94a3b8" : "#64748b"}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: isDark ? "#64748b" : "#94a3b8",
                    paddingHorizontal: 12,
                  }}
                >
                  {user?.email}
                </Text>
                <Ionicons
                  name="lock-closed"
                  size={16}
                  color={isDark ? "#64748b" : "#94a3b8"}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: isDark ? "#64748b" : "#94a3b8",
                  marginTop: 6,
                  fontStyle: "italic",
                }}
              >
                Email cannot be changed at this time
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: isDark ? "#334155" : "#f1f5f9",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDark ? "#cbd5e1" : "#475569",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveChanges}
                disabled={!newName.trim() || updateUserName.isPending}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor:
                    !newName.trim() || updateUserName.isPending
                      ? isDark
                        ? "#334155"
                        : "#cbd5e1"
                      : "#3b82f6",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {updateUserName.isPending ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  {updateUserName.isPending ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
