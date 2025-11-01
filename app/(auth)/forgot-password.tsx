import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {useForgotPassword} from '@/services/hooks/useAuth';
import {useTheme} from '@/components/ThemeProvider';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const {mutate: sendRecoveryEmail, isPending} = useForgotPassword();
    const {actualTheme} = useTheme();
    const isDark = actualTheme === 'dark';

    const handleSendEmail = () => {
        if (!email.trim()) {
            return;
        }

        sendRecoveryEmail(
            {email: email.trim().toLowerCase()},
            {
                onSuccess: () => {
                    setEmailSent(true);
                },
            }
        );
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (emailSent) {
        return (
            <View className="flex-1 bg-slate-50 dark:bg-slate-900">
                <StatusBar style={isDark ? 'light' : 'dark'}/>

                {/* Header */}
                <View
                    className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700"
                    >
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color={isDark ? '#cbd5e1' : '#374151'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Success State */}
                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                >
                    <View className="items-center mb-8">
                        <View
                            className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full items-center justify-center mb-6">
                            <Ionicons name="mail-open" size={40} color="#10b981"/>
                        </View>

                        <Text className="text-slate-900 dark:text-slate-100 font-bold text-2xl mb-3 text-center">
                            Check Your Email! 📬
                        </Text>

                        <Text className="text-slate-600 dark:text-slate-400 text-center text-base leading-6 mb-6">
                            We&apos;ve sent password reset instructions to{'\n'}
                            <Text className="font-semibold text-blue-500">{email}</Text>
                        </Text>

                        <View
                            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl mb-8 border border-blue-200 dark:border-blue-800">
                            <Text className="text-blue-900 dark:text-blue-100 text-sm leading-6">
                                <Text className="font-semibold">Next steps:{'\n'}</Text>
                                1. Open your email inbox{'\n'}
                                2. Click the reset link(OR click the &quot;Reset password&quot; text) in the email{'\n'}
                                3. Create your new password{'\n'}
                                4. Login with new credentials
                            </Text>
                        </View>

                        <Text className="text-slate-500 dark:text-slate-400 text-xs text-center mb-8">
                            Didn&apos;t receive the email? Check your spam folder or{' '}
                            <Text
                                className="text-blue-500 font-semibold"
                                onPress={() => setEmailSent(false)}
                            >
                                try again
                            </Text>
                        </Text>

                        <TouchableOpacity
                            onPress={() => router.replace('/(auth)/login')}
                            className="bg-blue-500 dark:bg-blue-600 py-4 px-8 rounded-xl"
                        >
                            <Text className="text-white font-semibold text-base">
                                Back to Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-slate-50 dark:bg-slate-900"
        >
            <StatusBar style={isDark ? 'light' : 'dark'}/>

            {/* Header */}
            <View
                className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700"
                >
                    <Ionicons
                        name="chevron-back"
                        size={22}
                        color={isDark ? '#cbd5e1' : '#374151'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                keyboardShouldPersistTaps="handled"
            >
                <View className="py-8">
                    {/* Icon */}
                    <View className="items-center mb-6">
                        <View
                            className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full items-center justify-center mb-4">
                            <Ionicons name="lock-closed" size={40} color="#3b82f6"/>
                        </View>
                    </View>

                    {/* Title */}
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-3xl mb-3 text-center">
                        Forgot Password?
                    </Text>

                    <Text className="text-slate-600 dark:text-slate-400 text-center text-base mb-8 leading-6">
                        No worries! Enter your email and we&apos;ll send you reset instructions.
                    </Text>

                    {/* Email Input */}
                    <View className="mb-6">
                        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                            Email Address
                        </Text>
                        <View
                            className="flex-row items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={isDark ? '#94a3b8' : '#64748b'}
                            />
                            <TextInput
                                className="flex-1 ml-3 text-slate-900 dark:text-slate-100 text-base"
                                placeholder="your@email.com"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isPending}
                            />
                        </View>
                    </View>

                    {/* Send Button */}
                    <TouchableOpacity
                        onPress={handleSendEmail}
                        disabled={!isValidEmail(email) || isPending}
                        className={`py-4 rounded-xl mb-4 ${
                            isValidEmail(email) && !isPending
                                ? 'bg-blue-500 dark:bg-blue-600'
                                : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                    >
                        <Text className="text-white font-bold text-center text-base">
                            {isPending ? 'Sending...' : 'Send Reset Link'}
                        </Text>
                    </TouchableOpacity>

                    {/* Back to Login */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="py-3"
                    >
                        <Text className="text-slate-600 dark:text-slate-400 text-center">
                            Remember your password?{' '}
                            <Text className="text-blue-500 font-semibold">
                                Back to Login
                            </Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Help Text */}
                    <View
                        className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl mt-8 border border-slate-200 dark:border-slate-700">
                        <View className="flex-row items-start">
                            <Ionicons
                                name="information-circle"
                                size={20}
                                color={isDark ? '#94a3b8' : '#64748b'}
                                style={{marginTop: 2, marginRight: 8}}
                            />
                            <Text className="text-slate-600 dark:text-slate-400 text-xs flex-1 leading-5">
                                The reset link will expire in 1 hour. If you don&apos;t receive the email,
                                check your spam folder or contact Charllson support. 😎
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}