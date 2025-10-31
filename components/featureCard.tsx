import {Ionicons} from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {Animated, Text, View} from "react-native";

export const AnimatedFeatureCard = ({ 
    icon, 
    title, 
    description, 
    delay 
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    delay: number;
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay, fadeAnim, slideAnim]);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
            }}
        >
            <View className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 flex-row items-start border border-white/30 shadow-xl">
                <View className="bg-gradient-to-br from-white/30 to-white/10 rounded-2xl p-3 mr-4 shadow-lg">
                    <Ionicons name={icon} size={28} color="white" />
                </View>
                <View className="flex-1 pt-1">
                    <Text className="text-white font-bold text-lg mb-2">
                        {title}
                    </Text>
                    <Text className="text-blue-50 dark:text-slate-200 text-sm leading-6">
                        {description}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};
