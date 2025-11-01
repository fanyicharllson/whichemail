import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router";
import {
  account,
  appwriteDbConfig,
  tablesDB,
} from "@/services/appwrite/appwrite";
import { showToast } from "@/utils/toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { appwriteConfig } from "@/utils/expoContants";
import { ID } from "appwrite";

export default function AuthCallbackScreen() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's an active session
        const user = await account.get();

        if (user) {
          // Check if user exists in our custom table
          try {
            const userRows = await tablesDB.listRows({
              databaseId: appwriteDbConfig.databaseId,
              tableId: appwriteConfig.tableUserId,
              queries: [`equal("userId", "${user.$id}")`],
            });

            // If user doesn't exist in our table, create entry
            if (userRows.rows.length === 0) {
              await tablesDB.createRow({
                databaseId: appwriteDbConfig.databaseId,
                tableId: appwriteConfig.tableUserId,
                rowId: ID.unique(),
                data: {
                  name: user.name,
                  email: user.email,
                  userId: user.$id,
                },
              });
            }
          } catch (tableError) {
            console.log("User table check/creation:", tableError);
            // Continue even if table operation fails
          }

          // Save auth state
          await AsyncStorage.setItem("isAuthenticated", "true");

          // Invalidate queries to refetch user data
          queryClient.invalidateQueries({ queryKey: ["user"] });

          showToast.success(
            "Welcome! 🎉",
            `Signed in as ${user.name || user.email}`
          );

          // Navigate to dashboard
          setTimeout(() => {
            router.replace("/(tabs)");
          }, 500);
        } else {
          throw new Error("No user session found");
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);

        showToast.error(
          "Authentication Failed",
          error?.message || "Could not complete sign in"
        );

        // Redirect to login
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 1000);
      }
    };

    handleAuthCallback();
  }, [queryClient]);

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-slate-600 dark:text-slate-400 mt-4">
        Completing sign in...
      </Text>
    </View>
  );
}
