import {useEffect} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {router, useLocalSearchParams} from 'expo-router';
import {showToast} from '@/utils/toast';
import {useTheme} from '@/components/ThemeProvider';

export default function AuthErrorScreen() {
    const params = useLocalSearchParams();
    const {actualTheme} = useTheme();
    const isDark = actualTheme === 'dark';

    useEffect(() => {
        // Show error toast
        showToast.error(
            'Sign In Cancelled',
            'You cancelled the Google sign in process'
        );

        // Auto redirect after 3 seconds
        const timeout = setTimeout(() => {
            router.replace('/(auth)/login');
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center px-6">
            <View className="bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full items-center justify-center mb-6">
                <Ionicons name="close-circle" size={48} color="#ef4444"/>
            </View>

            <Text className="text-slate-900 dark:text-slate-100 font-bold text-2xl mb-3 text-center">
                Sign In Cancelled
            </Text>

            <Text className="text-slate-600 dark:text-slate-400 text-center mb-8">
                You cancelled the Google sign in process.{'\n'}
                Redirecting you back to login...
            </Text>

            <TouchableOpacity
                onPress={() => router.replace('/(auth)/login')}
                className="bg-blue-500 dark:bg-blue-600 py-4 px-8 rounded-xl"
            >
                <Text className="text-white font-semibold">
                    Back to Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}