import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { account } from "../appwrite/appwrite";

interface UpdateUserParams {
  name?: string;
  email?: string;
}

/**
 * Hook to update user profile (name and/or email)
 * Requires biometric authentication before updating
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateUserParams) => {
      const { name, email } = params;

      // Update name if provided
      if (name) {
        await account.updateName({
          name: name,
        });
      }

      // Update email if provided (requires verification)
      if (email) {
        // TODO: Email update requires verification in Appwrite
        await account.updateEmail({
          email: email,
          password: "current_password_here",
        });
        showToast.info(
          "Verification Required",
          "Check your new email to verify the change"
        );
      }

      return { name, email };
    },
    onSuccess: (data) => {
      // Invalidate user query to refresh data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      if (data.name) {
        showToast.success(
          "Profile Updated ✓",
          "Your name has been updated successfully"
        );
      }
    },
    onError: (error: any) => {
      console.error("Update user error:", error);
      showToast.error(
        "Update Failed",
        error?.message || "Failed to update profile"
      );
    },
  });
};

/**
 * Update only name (simpler, no password required)
 */
export const useUpdateUserName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      await account.updateName({
        name: name,
      });
      return name;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      showToast.success(
        "Name Updated ✓",
        "Your name has been updated successfully"
      );
    },
    onError: (error: any) => {
      console.error("Update name error:", error);
      showToast.error(
        "Update Failed",
        error?.message || "Failed to update name"
      );
    },
  });
};
