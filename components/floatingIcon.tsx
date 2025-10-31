import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const FloatingIcon = ({
  name,
  delay,
  duration,
}: {
  name: keyof typeof Ionicons.glyphMap;
  delay: number;
  duration: number;
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [delay, duration, floatAnim]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity: 0.6,
      }}
      className="absolute"
    >
      <Ionicons name={name} size={40} color="white" />
    </Animated.View>
  );
};
