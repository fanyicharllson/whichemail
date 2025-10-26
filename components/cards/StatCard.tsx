import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from "@/components/ThemeProvider";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
    gradientColors?: [string, string];
    onPress?: () => void;
    subtitle?: string;
}

export default function StatCard({
                                     title,
                                     value,
                                     icon,
                                     color,
                                     bgColor,
                                     gradientColors,
                                     onPress,
                                     subtitle
                                 }: StatCardProps) {
    const {actualTheme} = useTheme();
    const isDark = actualTheme === 'dark';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
            className="flex-1"
        >
            <View
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Subtle gradient background */}
                {gradientColors && (
                    <View className="absolute inset-0 opacity-5">
                        <LinearGradient
                            colors={gradientColors}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={{flex: 1}}
                        />
                    </View>
                )}

                {/* Icon with animated glow effect */}
                <View className="flex-row items-center justify-between mb-3">
                    <View
                        className="rounded-xl p-2.5 shadow-sm"
                        style={{backgroundColor: isDark ? `${color}20` : bgColor}}
                    >
                        <Ionicons name={icon} size={22} color={color}/>
                    </View>

                    {/* Action indicator */}
                    {onPress && (
                        <View className="bg-slate-100 dark:bg-slate-700 rounded-full p-1.5">
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={isDark ? '#94a3b8' : '#64748b'}
                            />
                        </View>
                    )}
                </View>

                {/* Value with scale effect */}
                <View className="mb-1">
                    <Text
                        className="text-3xl font-black text-slate-900 dark:text-slate-100"
                        style={{letterSpacing: -1}}
                    >
                        {value}
                    </Text>
                </View>

                {/* Title */}
                <Text className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide">
                    {title}
                </Text>

                {/* Optional subtitle */}
                {subtitle && (
                    <Text className="text-slate-500 dark:text-slate-500 text-[10px] mt-1">
                        {subtitle}
                    </Text>
                )}

                {/* Interactive hint */}
                {onPress && (
                    <View className="absolute top-2 right-2">
                        <View className="bg-blue-500 w-2 h-2 rounded-full"/>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}