import React, {useState} from 'react';
import {Modal, Share, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from './ThemeProvider';
import {router} from 'expo-router';
import {showToast} from '@/utils/toast';

interface QuickActionsMenuProps {
    userName?: string;
    totalServices: number;
    uniqueEmails: number;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
                                                                      userName,
                                                                      totalServices,
                                                                      uniqueEmails,
                                                                  }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const {actualTheme} = useTheme();
    const isDark = actualTheme === 'dark';

    const menuItems = [
        {
            icon: 'add-circle',
            label: 'Add Service',
            subtitle: 'Quick add',
            color: '#3b82f6',
            bgColor: isDark ? '#1e3a8a20' : '#dbeafe',
            action: () => {
                setMenuVisible(false);
                router.push('/service/add/add');
            },
        },
        {
            icon: 'search',
            label: 'Search Services',
            subtitle: 'Find quickly',
            color: '#10b981',
            bgColor: isDark ? '#06402820' : '#d1fae5',
            action: () => {
                setMenuVisible(false);
                router.push('/(tabs)/services');
                //  could add auto-focus to search input here
            },
        },
        {
            icon: 'sparkles',
            label: 'AI Assistant',
            subtitle: 'Ask anything',
            color: '#8b5cf6',
            bgColor: isDark ? '#4c1d9520' : '#ede9fe',
            action: () => {
                setMenuVisible(false);
                router.push('/(tabs)/ai-assistant');
            },
        },
        {
            icon: 'stats-chart',
            label: 'View Stats',
            subtitle: 'Your insights',
            color: '#f59e0b',
            bgColor: isDark ? '#78350f20' : '#fef3c7',
            action: () => {
                setMenuVisible(false);
                showStatsToast();
            },
        },
        {
            icon: 'share-social',
            label: 'Share App',
            subtitle: 'Tell friends',
            color: '#06b6d4',
            bgColor: isDark ? '#08405820' : '#cffafe',
            action: () => {
                setMenuVisible(false);
                shareApp();
            },
        },
        {
            icon: 'refresh',
            label: 'Sync Data',
            subtitle: 'Refresh now',
            color: '#ec4899',
            bgColor: isDark ? '#83134720' : '#fce7f3',
            action: () => {
                setMenuVisible(false);
                syncData();
            },
        },
    ];

    const showStatsToast = () => {
        showToast.success(
            'Quick Stats 📊',
            `${totalServices} services • ${uniqueEmails} emails`
        );
    };

    const shareApp = async () => {
        try {
            const ANDROID_DOWNLOAD_LINK = 'https://expo.dev/artifacts/eas/nCoggtk89jCDZX6mG18Cyc.apk';

            const message = `Hey! 👋 I'm using WhichEmail to manage all my login credentials. It's super helpful! 🚀

📱 Download for Android:
${ANDROID_DOWNLOAD_LINK}

🍎 iOS version coming soon! (We're working on it 😅)

✨ Features:
• AI-powered smart search
• Biometric security
• Never forget which email you used!

Built with ❤️ by ${userName || 'Fanyi Charllson'} 😎`;

            await Share.share({
                message: message,
                title: 'Check out WhichEmail! 🚀',
            });
        } catch (error) {
            console.error('Share failed:', error);
        }
    };


    const syncData = () => {
        showToast.success('Synced! ✓', 'Your data is up to date');
        // Add actual  logic here if needed
    };

    return (
        <>
            {/* Three Dots Button */}
            <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center ml-2"
            >
                <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color={isDark ? '#cbd5e1' : '#374151'}
                />
            </TouchableOpacity>

            {/* Dropdown Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                    className="flex-1 bg-black/30"
                >
                    {/* Menu Container - Positioned top right */}
                    <View className="absolute top-20 right-4 w-64">
                        <View
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            {/* Header */}
                            <View
                                className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                <Text className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                                    Quick Actions
                                </Text>
                                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                                    {totalServices} services saved
                                </Text>
                            </View>

                            {/* Menu Items */}
                            <View className="py-2">
                                {menuItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={item.action}
                                        className="px-4 py-3 flex-row items-center active:bg-slate-50 dark:active:bg-slate-700/50"
                                    >
                                        <View
                                            className="w-9 h-9 rounded-xl items-center justify-center mr-3"
                                            style={{backgroundColor: item.bgColor}}
                                        >
                                            <Ionicons name={item.icon as any} size={18} color={item.color}/>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
                                                {item.label}
                                            </Text>
                                            <Text className="text-slate-500 dark:text-slate-400 text-xs">
                                                {item.subtitle}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name="chevron-forward"
                                            size={16}
                                            color={isDark ? '#64748b' : '#94a3b8'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Footer */}
                            <View
                                className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                <Text className="text-slate-400 dark:text-slate-500 text-[10px] text-center">
                                    Made with 💙 by {userName || 'Fanyi Charllson'}
                                </Text>
                            </View>
                        </View>

                        {/* Little arrow/triangle pointer */}
                        <View
                            className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-slate-800 border-l border-t border-slate-200 dark:border-slate-700 rotate-45"/>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};