import React from 'react';
import {Modal, ScrollView, Share, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import {showToast} from '@/utils/toast';
import {useTheme} from './ThemeProvider';
import {router} from 'expo-router';
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
}

// ============================================
// UNIQUE EMAILS MODAL
// ============================================

interface UniqueEmailsModalProps extends BaseModalProps {
    services: Service[];
}

export const UniqueEmailsModal: React.FC<UniqueEmailsModalProps> = ({
                                                                        visible,
                                                                        onClose,
                                                                        services,
                                                                    }) => {
    const {actualTheme} = useTheme();
    const isDark = actualTheme === 'dark';

    const insets = useSafeAreaInsets();


    // Get unique emails with service counts
    const emailStats = services.reduce((acc, service) => {
        const email = service.email;
        if (!acc[email]) {
            acc[email] = {email, count: 0, services: []};
        }
        acc[email].count++;
        acc[email].services.push(service.serviceName);
        return acc;
    }, {} as Record<string, { email: string; count: number; services: string[] }>);

    const uniqueEmailsList = Object.values(emailStats).sort((a, b) => b.count - a.count);

    const copyToClipboard = async (text: string) => {
        try {
            await Clipboard.setStringAsync(text);
            showToast.success('Email Copied!', 'Copied to clipboard');
        } catch (error) {
            console.error("Error in start modal: ", error)
            showToast.error('Copy Failed', 'Unable to copy');
        }
    };

    const shareEmail = async (email: string) => {
        try {
            await Share.share({
                message: email,
            });
        } catch (error) {
            console.error('Share failed:', error);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[80%]">
                    {/* Header */}
                    <View className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center gap-3">
                                <View className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-xl">
                                    <Ionicons name="mail" size={24} color="#10b981"/>
                                </View>
                                <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl">
                                    Your Emails
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-2">
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={isDark ? '#cbd5e1' : '#64748b'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-slate-500 dark:text-slate-400 text-sm">
                            {uniqueEmailsList.length} unique email{uniqueEmailsList.length !== 1 ? 's' : ''} found
                        </Text>
                    </View>

                    {/* Email List */}
                    <ScrollView
                        className="px-6 py-4"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: Math.max(insets.bottom + 100, 120),
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {uniqueEmailsList.map((item, index) => (
                            <View
                                key={item.email}
                                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-200 dark:border-slate-700"
                            >
                                <View className="flex-row items-start justify-between mb-2">
                                    <View className="flex-1 mr-2">
                                        <Text
                                            className="text-slate-900 dark:text-slate-100 font-semibold text-base mb-1">
                                            {item.email}
                                        </Text>
                                        <Text className="text-slate-500 dark:text-slate-400 text-xs">
                                            Used in {item.count} service{item.count !== 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                    <View className="bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                                        <Text className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                                            {item.count}
                                        </Text>
                                    </View>
                                </View>

                                {/* Services using this email */}
                                <View className="flex-row flex-wrap gap-1.5 mb-3">
                                    {item.services.slice(0, 3).map((service, idx) => (
                                        <View
                                            key={idx}
                                            className="bg-white dark:bg-slate-700 px-2 py-1 rounded-lg"
                                        >
                                            <Text className="text-slate-600 dark:text-slate-300 text-[10px]">
                                                {service}
                                            </Text>
                                        </View>
                                    ))}
                                    {item.services.length > 3 && (
                                        <View className="bg-white dark:bg-slate-700 px-2 py-1 rounded-lg">
                                            <Text className="text-slate-600 dark:text-slate-300 text-[10px]">
                                                +{item.services.length - 3} more
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Actions */}
                                <View className="flex-row gap-2">
                                    <TouchableOpacity
                                        onPress={() => copyToClipboard(item.email)}
                                        className="flex-1 bg-blue-500 dark:bg-blue-600 py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                                    >
                                        <Ionicons name="copy-outline" size={16} color="#fff"/>
                                        <Text className="text-white font-semibold text-sm">Copy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => shareEmail(item.email)}
                                        className="bg-slate-200 dark:bg-slate-700 py-2.5 px-4 rounded-xl"
                                    >
                                        <Ionicons
                                            name="share-outline"
                                            size={16}
                                            color={isDark ? '#cbd5e1' : '#475569'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// ============================================
// PASSWORDS MODAL
// ============================================

interface PasswordsModalProps extends BaseModalProps {
    services: Service[];
}

export const PasswordsModal: React.FC<PasswordsModalProps> = ({
                                                                  visible,
                                                                  onClose,
                                                                  services,
                                                              }) => {
    const {actualTheme} = useTheme();
    const isDark = actualTheme === 'dark';

    const insets = useSafeAreaInsets();


    const servicesWithPassword = services.filter(s => s.hasPassword);
    const servicesWithoutPassword = services.filter(s => !s.hasPassword);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[80%]">
                    {/* Header */}
                    <View className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center gap-3">
                                <View className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-xl">
                                    <Ionicons name="lock-closed" size={24} color="#f59e0b"/>
                                </View>
                                <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl">
                                    Password Status
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-2">
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={isDark ? '#cbd5e1' : '#64748b'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView
                        className="px-6 py-4"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: Math.max(insets.bottom + 100, 120),
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Stats */}
                        <View className="flex-row gap-3 mb-4">
                            <View
                                className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                                <Text className="text-green-600 dark:text-green-400 font-bold text-2xl mb-1">
                                    {servicesWithPassword.length}
                                </Text>
                                <Text className="text-green-700 dark:text-green-500 text-xs">
                                    With Password
                                </Text>
                            </View>
                            <View
                                className="flex-1 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                <Text className="text-red-600 dark:text-red-400 font-bold text-2xl mb-1">
                                    {servicesWithoutPassword.length}
                                </Text>
                                <Text className="text-red-700 dark:text-red-500 text-xs">
                                    No Password
                                </Text>
                            </View>
                        </View>

                        {/* Secured Services */}
                        {servicesWithPassword.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-slate-900 dark:text-slate-100 font-semibold mb-2">
                                    🔒 Secured Services
                                </Text>
                                {servicesWithPassword.map((service) => (
                                    <TouchableOpacity
                                        key={service.id}
                                        onPress={() => {
                                            onClose();
                                            router.push(`/service/detail/${service.id}`);
                                        }}
                                        className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl mb-2 flex-row items-center justify-between"
                                    >
                                        <View className="flex-1">
                                            <Text className="text-slate-900 dark:text-slate-100 font-medium">
                                                {service.serviceName}
                                            </Text>
                                            <Text className="text-slate-500 dark:text-slate-400 text-xs">
                                                {service.email}
                                            </Text>
                                        </View>
                                        <Ionicons name="shield-checkmark" size={20} color="#10b981"/>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Unsecured Services */}
                        {servicesWithoutPassword.length > 0 && (
                            <View className="mb-4">
                                <Text className="text-slate-900 dark:text-slate-100 font-semibold mb-2">
                                    ⚠️ No Password Saved
                                </Text>
                                {servicesWithoutPassword.slice(0, 5).map((service) => (
                                    <View
                                        key={service.id}
                                        className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl mb-2 flex-row items-center justify-between"
                                    >
                                        <View className="flex-1">
                                            <Text className="text-slate-900 dark:text-slate-100 font-medium">
                                                {service.serviceName}
                                            </Text>
                                            <Text className="text-slate-500 dark:text-slate-400 text-xs">
                                                {service.email}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name="alert-circle"
                                            size={20}
                                            color={isDark ? '#94a3b8' : '#64748b'}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

// ============================================
// CATEGORIES MODAL
// ============================================

interface CategoriesModalProps extends BaseModalProps {
    services: Service[];
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
                                                                    visible,
                                                                    onClose,
                                                                    services,
                                                                }) => {
    const {actualTheme} = useTheme();
    const isDark = actualTheme === 'dark';
    const insets = useSafeAreaInsets();


    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[70%]">
                    {/* Header */}
                    <View className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center gap-3">
                                <View className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl">
                                    <Ionicons name="folder" size={24} color="#8b5cf6"/>
                                </View>
                                <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl">
                                    Categories
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-2">
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={isDark ? '#cbd5e1' : '#64748b'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-slate-500 dark:text-slate-400 text-sm">
                            WhichEmail automatically organizes your services ✨
                        </Text>
                    </View>

                    <ScrollView
                        className="px-6 py-4"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: Math.max(insets.bottom + 100, 120),
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Info Card */}
                        <View
                            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-4 border border-blue-200 dark:border-blue-800">
                            <View className="flex-row items-start gap-3">
                                <Ionicons name="information-circle" size={20} color="#3b82f6"/>
                                <View className="flex-1">
                                    <Text className="text-blue-900 dark:text-blue-100 font-semibold text-sm mb-1">
                                        Smart Organization
                                    </Text>
                                    <Text className="text-blue-700 dark:text-blue-300 text-xs leading-5">
                                        We manage categories for you! Your services are automatically sorted into 8
                                        categories for easy access. 🎯
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text className="text-slate-600 dark:text-slate-400 text-xs text-center mb-4">
                            8 categories keeping your {services.length} services organized
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};