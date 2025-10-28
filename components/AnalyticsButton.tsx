// components/AnalyticsButton.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
// import { useTheme } from '@/components/ThemeProvider';

export default function AnalyticsButton() {
//   const { actualTheme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text className='text-slate-900 dark:text-slate-100 font-bold text-lg mb-4'>
        Service Analytics
      </Text>
      
      {/* Analytics Button with Proper Gradient */}
      <TouchableOpacity
        onPress={() => router.push('/service/analitics/analytics')}
        style={styles.buttonContainer}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.buttonContent}>
            <View style={styles.leftSection}>
              <View style={styles.iconContainer}>
                <Ionicons name="stats-chart" size={24} color="#fff" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.buttonTitle}>View Your Service Analytics</Text>
                <Text style={styles.buttonSubtitle}>Insights & statistics</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  buttonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    padding: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  buttonSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});