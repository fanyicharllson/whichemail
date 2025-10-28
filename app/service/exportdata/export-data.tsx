import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { showToast } from "@/utils/toast";
// Use the legacy filesystem API to avoid deprecation warnings on SDK v54
// (Alternatively migrate to the new File/Directory API per Expo docs)
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useServices } from "@/services/queries/serviceQueries";
import { useTheme } from "@/components/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExportDataScreen() {
  const { data: services = [] } = useServices();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === "dark";
  const [exporting, setExporting] = useState(false);
  const insets = useSafeAreaInsets();

  const exportToJSON = async () => {
    try {
      setExporting(true);

      // Prepare export data (without sensitive passwords)
      const exportData = {
        app: "WhichEmail",
        version: "1.1.4",
        exportDate: new Date().toISOString(),
        totalServices: services.length,
        services: services.map((s) => ({
          serviceName: s.serviceName,
          email: s.email,
          categoryId: s.categoryId,
          website: s.website,
          notes: s.notes,
          hasPassword: s.hasPassword,
          createdAt: s.createdAt,
        })),
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `whichemail_backup_${Date.now()}.json`;
      const baseDir =
        (FileSystem as any).documentDirectory ??
        (FileSystem as any).cacheDirectory ??
        "";
      const fileUri = `${baseDir}${fileName}`;

      // Write to file
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export WhichEmail Data",
        });
        showToast.success(
          "Export Successful! 📤",
          "Your data has been exported"
        );
      } else {
        showToast.error(
          "Sharing not available",
          "Cannot share files on this device"
        );
      }
    } catch (error: any) {
      console.error("Export error:", error);
      showToast.error("Export Failed", error?.message || "Please try again");
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);

      // CSV header
      let csv =
        "Service Name,Email,Category,Website,Has Password,Created Date\n";

      // CSV data
      services.forEach((s) => {
        csv += `"${s.serviceName}","${s.email}","${s.categoryId || "N/A"}","${
          s.website || "N/A"
        }","${s.hasPassword ? "Yes" : "No"}","${new Date(
          s.createdAt
        ).toLocaleDateString()}"\n`;
      });
      const fileName = `whichemail_export_${Date.now()}.csv`;
      const baseDir =
        (FileSystem as any).documentDirectory ??
        (FileSystem as any).cacheDirectory ??
        "";
      const fileUri = `${baseDir}${fileName}`;

      // Write CSV once
      await FileSystem.writeAsStringAsync(fileUri, csv);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export WhichEmail Data",
        });
        showToast.success(
          "CSV Export Successful! 📊",
          "Your data has been exported"
        );
      }
    } catch (error: any) {
      console.error("CSV export error:", error);
      showToast.error("Export Failed", error?.message || "Please try again");
    } finally {
      setExporting(false);
    }
  };

  const shareAsText = async () => {
    try {
      let text = `📧 WhichEmail Data Export\n`;
      text += `Date: ${new Date().toLocaleDateString()}\n`;
      text += `Total Services: ${services.length}\n\n`;

      services.forEach((s, idx) => {
        text += `${idx + 1}. ${s.serviceName}\n`;
        text += `   Email: ${s.email}\n`;
        if (s.website) text += `   Website: ${s.website}\n`;
        text += `   Password Saved: ${s.hasPassword ? "Yes ✓" : "No"}\n\n`;
      });

      text += `\n---\nExported from WhichEmail by Fanyi Charllson`;

      await Share.share({
        message: text,
        title: "WhichEmail Data",
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <View className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700"
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={isDark ? "#cbd5e1" : "#374151"}
            />
          </TouchableOpacity>
          <View>
            <Text className="text-slate-900 dark:text-slate-100 font-bold text-2xl">
              Export Data 📤
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-sm">
              Backup your information
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 py-6"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 70, 80),
        }}
      >
        {/* Info Card */}
        <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
          <View className="flex-row items-start gap-3">
            <Ionicons name="information-circle" size={24} color="#3b82f6" />
            <View className="flex-1">
              <Text className="text-blue-900 dark:text-blue-100 font-bold mb-1">
                About Exports
              </Text>
              <Text className="text-blue-700 dark:text-blue-300 text-sm leading-5">
                Export your data for backup or transfer. Passwords are NOT
                included for security reasons. They remain encrypted on your
                device only.
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
          <Text className="text-slate-900 dark:text-slate-100 font-bold mb-3">
            📊 What will be exported:
          </Text>
          <View className="space-y-2">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-slate-600 dark:text-slate-400">
                Total Services
              </Text>
              <Text className="text-slate-900 dark:text-slate-100 font-bold">
                {services.length}
              </Text>
            </View>
            <View className="flex-row items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
              <Text className="text-slate-600 dark:text-slate-400">
                Service Names
              </Text>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <View className="flex-row items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
              <Text className="text-slate-600 dark:text-slate-400">
                Email Addresses
              </Text>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <View className="flex-row items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
              <Text className="text-slate-600 dark:text-slate-400">
                Categories
              </Text>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            </View>
            <View className="flex-row items-center justify-between py-2 border-t border-slate-100 dark:border-slate-700">
              <Text className="text-slate-600 dark:text-slate-400">
                Passwords
              </Text>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </View>
          </View>
        </View>

        {/* Export Options */}
        <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-4">
          Choose Export Format:
        </Text>

        {/* JSON Export */}
        <TouchableOpacity
          onPress={exportToJSON}
          disabled={exporting || services.length === 0}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-200 dark:border-slate-700"
        >
          <View className="flex-row items-center gap-4">
            <View className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl items-center justify-center">
              <Ionicons name="code-slash" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-1">
                JSON Format
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                Best for re-importing or technical use
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
          </View>
        </TouchableOpacity>

        {/* CSV Export */}
        <TouchableOpacity
          onPress={exportToCSV}
          disabled={exporting || services.length === 0}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-200 dark:border-slate-700"
        >
          <View className="flex-row items-center gap-4">
            <View className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl items-center justify-center">
              <Ionicons name="grid" size={24} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-1">
                CSV Format
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                Open in Excel, Google Sheets, etc.
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
          </View>
        </TouchableOpacity>

        {/* Text Share */}
        <TouchableOpacity
          onPress={shareAsText}
          disabled={services.length === 0}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-200 dark:border-slate-700"
        >
          <View className="flex-row items-center gap-4">
            <View className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl items-center justify-center">
              <Ionicons name="share-social" size={24} color="#8b5cf6" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-1">
                Share as Text
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs">
                Quick share via any app
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
          </View>
        </TouchableOpacity>

        {services.length === 0 && (
          <View className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mt-4 border border-amber-200 dark:border-amber-800">
            <Text className="text-amber-800 dark:text-amber-200 text-sm text-center">
              No services to export. Add some services first!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
