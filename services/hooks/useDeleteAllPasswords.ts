import { useState } from "react";
import { Alert } from "react-native";
import { showToast } from "@/utils/toast";
import { useServices } from "@/services/queries/serviceQueries";
import { secureStorage } from "../secureStorage";
import { authenticateUser } from "@/utils/authUtils";

/**
 * Hook to delete all passwords from SecureStore
 */
export const useDeleteAllPasswords = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: services = [] } = useServices();

  const deleteAllPasswords = async () => {
    setIsDeleting(true);

    try {
      // Delete password for each service
      const deletePromises = services.map((service) =>
        secureStorage.deletePassword(service.id)
      );

      await Promise.all(deletePromises);

      showToast.success(
        "All Passwords Deleted ✓",
        `Successfully deleted ${services.length} password(s)`
      );

      return true;
    } catch (error) {
      console.error("Error deleting all passwords:", error);
      showToast.error(
        "Delete Failed",
        "Failed to delete some passwords. Please try again."
      );
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteAllPasswords, isDeleting };
};

/**
 * Complete handler with biometric auth + confirmation alert
 */
export const handleDeleteAllPasswords = async (
  services: Service[],
  deleteAllPasswords: () => Promise<boolean>
) => {
  // Step 1: Show confirmation alert
  Alert.alert(
    "⚠️ Delete All Passwords?",
    `This will permanently delete ${services.length} saved password(s). This action cannot be undone.`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete All",
        style: "destructive",
        onPress: async () => {
          // Step 2: Require biometric authentication
          const authResult = await authenticateUser({
            purpose: "delete-password",
            customMessage: "Authenticate to delete all passwords",
          });

          if (!authResult.success) {
            // Authentication failed or cancelled
            showToast.error(
              "Authentication Required",
              "You must authenticate to delete passwords"
            );
            return;
          }

          // Step 3: Delete all passwords after successful auth
          await deleteAllPasswords();
        },
      },
    ],
    { cancelable: true }
  );
};
