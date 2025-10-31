import {Animated, ColorValue, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from '@/components/ThemeProvider';
import { AnimatedFeatureCard } from '@/components/featureCard';
import { FloatingIcon } from '@/components/floatingIcon';
import { useRef, useEffect } from 'react';

export default function Welcome() {
    const { actualTheme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Logo entrance animation
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    const handleGetStarted = () => {
        router.push('/(auth)/register');
    };

    const gradientColors = actualTheme === 'dark'
        ? ['#0f172a', '#1e293b', '#334155'] as [ColorValue, ColorValue, ...ColorValue[]]
        : ['#1e40af', '#3b82f6', '#60a5fa'] as [ColorValue, ColorValue, ...ColorValue[]];

    return (
        <LinearGradient colors={gradientColors} className="flex-1">
            <StatusBar style="light" />

            {/* Floating Background Icons - Better Positioning */}
            <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
                {/* Top Right */}
                <View style={{ position: 'absolute', top: 120, right: 30 }}>
                    <FloatingIcon name="mail-outline" delay={0} duration={3000} />
                </View>
                
                {/* Middle Left */}
                <View style={{ position: 'absolute', top: 300, left: 20 }}>
                    <FloatingIcon name="shield-checkmark-outline" delay={500} duration={3500} />
                </View>
                
                {/* Bottom Right */}
                <View style={{ position: 'absolute', bottom: 200, right: 40 }}>
                    <FloatingIcon name="lock-closed-outline" delay={1000} duration={4000} />
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View className="flex-1 justify-center items-center px-6 pt-20 pb-8">
                    {/* Animated Logo */}
                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }],
                            opacity: fadeAnim,
                        }}
                    >
                        <View className="relative mb-8">
                            {/* Glow Effect */}
                            <View className="absolute inset-0 bg-white/30 rounded-full blur-3xl" />
                            
                            {/* Logo Container */}
                            <View className="bg-white/20 rounded-full p-8 border-4 border-white/40 shadow-2xl">
                                <Ionicons name="mail" size={100} color="white" />
                            </View>

                            {/* Sparkle Badge */}
                            <View className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                                <Ionicons name="sparkles" size={20} color="#1e40af" />
                            </View>
                        </View>
                    </Animated.View>

                    {/* App Title with Gradient */}
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text className="text-6xl font-black text-white mb-3 tracking-tight text-center">
                            WhichEmail
                        </Text>
                        <View className="bg-white/20 px-4 py-2 rounded-full mb-6">
                            <Text className="text-white font-semibold text-sm">
                                ✨ AI-Powered • Secure • Smart
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Tagline */}
                    <Text className="text-blue-100 dark:text-slate-300 text-xl text-center mb-12 px-4 leading-7 font-medium">
                        Never forget which email you used{'\n'}
                        <Text className="font-bold text-white">ever again!</Text>
                    </Text>

                    {/* Feature Cards with Animation */}
                    <View className="w-full space-y-4 mb-8 gap-y-4">
                        <AnimatedFeatureCard
                            icon="checkmark-circle"
                            title="Track Your Emails"
                            description="Organize all your login emails in one secure place with smart categories"
                            delay={200}
                        />

                        <AnimatedFeatureCard
                            icon="sparkles"
                            title="AI Assistant"
                            description="Ask in natural language: 'Which email for Netflix?' and get instant answers"
                            delay={400}
                        />

                        <AnimatedFeatureCard
                            icon="shield-checkmark"
                            title="Biometric Security"
                            description="Military-grade encryption with fingerprint & Face ID protection"
                            delay={600}
                        />

                        <AnimatedFeatureCard
                            icon="stats-chart"
                            title="Smart Analytics"
                            description="Track your digital footprint with beautiful insights and stats"
                            delay={800}
                        />
                    </View>
                </View>

                {/* Bottom Section */}
                <View className="px-6 pb-8">
                    {/* Stats Row */}
                    <View className="flex-row justify-around mb-6">
                        <View className="items-center">
                            <Text className="text-white font-black text-3xl">∞</Text>
                            <Text className="text-blue-100 text-xs mt-1">Services</Text>
                        </View>
                        <View className="w-px h-10 bg-white/20" />
                        <View className="items-center">
                            <Text className="text-white font-black text-3xl">🔐</Text>
                            <Text className="text-blue-100 text-xs mt-1">Secure</Text>
                        </View>
                        <View className="w-px h-10 bg-white/20" />
                        <View className="items-center">
                            <Text className="text-white font-black text-3xl">⚡</Text>
                            <Text className="text-blue-100 text-xs mt-1">Fast</Text>
                        </View>
                    </View>

                    {/* Creator Card */}
                    <View className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-white/30 shadow-xl">
                        <View className="flex-row items-center mb-3">
                            <View className="bg-red-500/20 rounded-full p-2 mr-3">
                                <Ionicons name="heart" size={20} color="#ef4444" />
                            </View>
                            <Text className="text-white/90 text-base">
                                Crafted with passion by
                            </Text>
                        </View>
                        <Text className="text-white font-black text-2xl mb-3">
                            Fanyi Charllson
                        </Text>
                        <Text className="text-blue-50 dark:text-slate-200 text-sm leading-6 mb-3">
                            Born from a real struggle: forgetting which email I used everywhere. 
                            Now it&apos;s your superpower! 🚀
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <View className="bg-white/20 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-semibold">🎓 Student Project</Text>
                            </View>
                            <View className="bg-white/20 px-3 py-1 rounded-full">
                                <Text className="text-white text-xs font-semibold">💙 Open Source</Text>
                            </View>
                        </View>
                    </View>

                    {/* CTA Buttons */}
                    <TouchableOpacity
                        onPress={handleGetStarted}
                        className="bg-white rounded-2xl py-5 px-8 shadow-2xl active:scale-95 mb-4"
                        activeOpacity={0.8}
                    >
                        <View className="flex-row items-center justify-center">
                            <Text className="text-center text-xl font-black mr-3 text-blue-600">
                                Get Started Free
                            </Text>
                            <View className="bg-blue-600 rounded-full p-2">
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </View>
                        </View>
                        <Text className="text-center text-blue-600/60 text-xs mt-2">
                            No credit card required • Forever free
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        className="py-4 bg-white/10 rounded-2xl border border-white/20"
                    >
                        <Text className="text-white text-center text-base font-semibold">
                            Already have an account? <Text className="font-black">Sign In 🔥</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Trust Badges */}
                    <View className="flex-row justify-center items-center gap-4 mt-6 opacity-60">
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="shield-checkmark" size={14} color="white" />
                            <Text className="text-white text-xs">Encrypted</Text>
                        </View>
                        <Text className="text-white">•</Text>
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="lock-closed" size={14} color="white" />
                            <Text className="text-white text-xs">Private</Text>
                        </View>
                        <Text className="text-white">•</Text>
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="shield" size={14} color="white" />
                            <Text className="text-white text-xs">Secure</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}