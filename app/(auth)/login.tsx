import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useState} from 'react';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import Input from "@/components/forms/Input";
import Button from "@/components/common/Button";
import {showToast} from "@/utils/toast";
import {useLogin} from "@/services/hooks/useAuth";
import {useTheme} from "@/components/ThemeProvider";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useGoogleAuth} from '@/services/hooks/useGoogleAuth';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({email: '', password: ''});
    const {mutate: loginUser, isPending} = useLogin();
    const insets = useSafeAreaInsets();
    const {actualTheme} = useTheme();
    const {signInWithGoogle, isAuthenticating} = useGoogleAuth();

    const validateForm = () => {
        let valid = true;
        const newErrors = {email: '', password: ''};

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
            valid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            loginUser(
                {email, password},
                {
                    onSuccess: () => router.replace('/(tabs)'),
                }
            )
        } catch (error) {
            console.error('Login error:', error);
            showToast.error(
                'Login Failed',
                'Invalid email or password. Please try again.'
            );
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-slate-900"
        >
            <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'}/>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: Math.max(insets.bottom + 40, 50),

                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}

            >
                {/* Header */}
                <View className="px-6 pt-16 pb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full mb-6"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={actualTheme === 'dark' ? '#f1f5f9' : '#374151'}
                        />
                    </TouchableOpacity>

                    <View className="mb-2">
                        <Text className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Welcome Back! 👋
                        </Text>
                        <Text className="text-slate-600 dark:text-slate-400 text-base">
                            Sign in to continue managing your emails
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View className="px-6 flex-1">
                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({...errors, email: ''});
                        }}
                        placeholder="example@email.com"
                        icon="mail"
                        keyboardType="email-address"
                        error={errors.email}

                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors({...errors, password: ''});
                        }}
                        placeholder="Enter your password"
                        icon="lock-closed"
                        secureTextEntry
                        error={errors.password}
                    />

                    <TouchableOpacity
                        className="mb-6"
                        onPress={() => router.push('/(auth)/forgot-password')}
                        disabled={isPending}
                    >
                        <Text className="text-blue-600 dark:text-blue-400 font-semibold text-right">
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={isPending}
                    />


                </View>

            </ScrollView>
            <View
                className={`p-4 border-t border-slate-200 dark:border-slate-700`}
                style={{paddingBottom: Math.max(insets.bottom + 30, 40)}}
            >
                {/* Divider */}
                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-slate-300 dark:bg-slate-700"/>
                    <Text className="mx-4 text-slate-500 dark:text-slate-400">or</Text>
                    <View className="flex-1 h-px bg-slate-300 dark:bg-slate-700"/>
                </View>

                {/* Social Login */}
                <TouchableOpacity
                    className="flex-row items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-4"
                    onPress={signInWithGoogle}
                    disabled={true}
                >
                    {isAuthenticating ? (
                        <ActivityIndicator size="small" color="#4285F4"/>
                    ) : (
                        <>
                            <Ionicons name="logo-google" size={20} color="#4285F4"/>
                            <Text className="ml-2 font-semibold text-slate-700 dark:text-slate-300">
                                Continue with Google
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
                <View
                    className="mb-6 mt-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl flex-row items-center space-x-2">
                    <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color={actualTheme === 'dark' ? '#60a5fa' : '#2563eb'}
                    />
                    <Text className="flex-1 text-slate-700 dark:text-slate-300 text-sm leading-5">
                        <Text className="font-semibold">Heads up!</Text> Google sign-in is
                        temporarily unavailable 😥. Please use your email and password instead.
                    </Text>
                </View>
                {/* Footer */}
                <View className="px-6 pb-12">
                    <View className="flex-row items-center justify-center">
                        <Text className="text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/register')}
                            disabled={isPending}
                        >
                            <Text className="text-blue-600 dark:text-blue-400 font-bold">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}