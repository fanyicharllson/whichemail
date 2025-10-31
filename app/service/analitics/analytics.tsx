// app/service/analitics/analytics.tsx
import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { categories } from '@/constants/categories';
import { BarChart } from 'react-native-chart-kit';
import { useServices } from '@/services/queries/serviceQueries';
import { useTheme } from '@/components/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ErrorBoundary from '@/components/ErrorBoundary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


export default function AnalyticsScreen() {
  return (
    <ErrorBoundary>
      <ActualAnalyticsContent />
    </ErrorBoundary>
  );
}

function ActualAnalyticsContent() {
  const { data: services = [], isLoading } = useServices();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const insets = useSafeAreaInsets();
  

  // Calculate analytics (same logic)
  const analytics = useMemo(() => {
    const totalServices = services.length;
    const uniqueEmails = new Set(services.map(s => s.email)).size;
    const servicesWithPassword = services.filter(s => s.hasPassword).length;
    const servicesWithoutPassword = totalServices - servicesWithPassword;

    // Category distribution
    const categoryStats = categories.map(cat => ({
      category: cat.name,
      count: services.filter(s => s.categoryId === cat.id).length,
      color: cat.color,
    })).filter(c => c.count > 0);

    // Services created over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentServices = services.filter(
      s => new Date(s.createdAt) >= thirtyDaysAgo
    );

    // Group by week
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (3 - i) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      return {
        week: `W${i + 1}`,
        count: services.filter(s => {
          const date = new Date(s.createdAt);
          return date >= weekStart && date < weekEnd;
        }).length,
      };
    });

    // Most used emails
    const emailCounts = services.reduce((acc, service) => {
      acc[service.email] = (acc[service.email] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEmails = Object.entries(emailCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([email, count]) => ({ email, count }));

    // Security score
    const securityScore = Math.round(
      (servicesWithPassword / Math.max(totalServices, 1)) * 100
    );

    return {
      totalServices,
      uniqueEmails,
      servicesWithPassword,
      servicesWithoutPassword,
      categoryStats,
      weeklyData,
      topEmails,
      securityScore,
      recentServices: recentServices.length,
    };
  }, [services]);

  const chartConfig = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    backgroundGradientFrom: isDark ? '#1e293b' : '#f8fafc',
    backgroundGradientTo: isDark ? '#1e293b' : '#f8fafc',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => 
      isDark ? `rgba(226, 232, 240, ${opacity})` : `rgba(71, 85, 105, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={[styles.loadingText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          Loading analytics...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderBottomColor: isDark ? '#334155' : '#e2e8f0'
      }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, {
              backgroundColor: isDark ? '#334155' : '#f1f5f9'
            }]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={isDark ? '#cbd5e1' : '#374151'}
            />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text className='"text-slate-900 dark:text-slate-100 font-bold text-2xl'>
              Analytics 📊
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              Your insights at a glance
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
                        paddingBottom: Math.max(insets.bottom + 70, 80),
                        paddingHorizontal: 20,
                        paddingTop: 20,
                    }}
      >
        {/* Security Score Card */}
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.securityCard}
        >
          <View style={styles.securityHeader}>
            <View>
              <Text style={styles.securityLabel}>Security Score</Text>
              <Text style={styles.securityScore}>{analytics.securityScore}</Text>
            </View>
            <View style={styles.securityIcon}>
              <Ionicons name="shield-checkmark" size={40} color="#fff" />
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${analytics.securityScore}%` }]}
            />
          </View>
          <Text style={styles.securityText}>
            {analytics.servicesWithPassword} of {analytics.totalServices} services have passwords
          </Text>
        </LinearGradient>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }]}>
              <Ionicons name="apps" size={20} color="#3b82f6" />
            </View>
            <Text style={[styles.statNumber, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              {analytics.totalServices}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              Total Services
            </Text>
          </View>

          <View style={[styles.statCard, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5' }]}>
              <Ionicons name="mail" size={20} color="#10b981" />
            </View>
            <Text style={[styles.statNumber, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              {analytics.uniqueEmails}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              Unique Emails
            </Text>
          </View>

          <View style={[styles.statCard, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7' }]}>
              <Ionicons name="lock-closed" size={20} color="#f59e0b" />
            </View>
            <Text style={[styles.statNumber, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              {analytics.servicesWithPassword}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              With Passwords
            </Text>
          </View>

          <View style={[styles.statCard, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#e9d5ff' }]}>
              <Ionicons name="time" size={20} color="#8b5cf6" />
            </View>
            <Text style={[styles.statNumber, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              {analytics.recentServices}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              Added This Month
            </Text>
          </View>
        </View>

        {/* Activity Chart */}
        {analytics.weeklyData.some(w => w.count > 0) && (
          <View style={[styles.chartCard, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              📈 Activity (Last 4 Weeks)
            </Text>
            <BarChart
              data={{
                labels: analytics.weeklyData.map(w => w.week),
                datasets: [{
                  data: analytics.weeklyData.map(w => w.count),
                }],
              }}
              width={SCREEN_WIDTH - 80}
              height={200}
              chartConfig={chartConfig}
              yAxisLabel=""
              yAxisSuffix=""
              style={styles.chart}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        )}

        {/* Category Distribution */}
        {analytics.categoryStats.length > 0 && (
          <View style={[styles.chartCard, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              📁 Category Breakdown
            </Text>
            {analytics.categoryStats.map((stat, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryName, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                    {stat.category}
                  </Text>
                  <Text style={[styles.categoryCount, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
                    {stat.count}
                  </Text>
                </View>
                <View style={[styles.categoryBar, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
                  <View
                    style={[styles.categoryFill, { 
                      backgroundColor: stat.color,
                      width: `${(stat.count / analytics.totalServices) * 100}%`,
                    }]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Top Emails */}
        {analytics.topEmails.length > 0 && (
          <View style={[styles.chartCard, { 
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
          }]}>
            <Text style={[styles.cardTitle, { color: isDark ? '#f1f5f9' : '#1e293b' }]}>
              🏆 Most Used Emails
            </Text>
            {analytics.topEmails.map((item, index) => (
              <View
                key={index}
                style={[styles.emailItem, { 
                  borderBottomColor: isDark ? '#334155' : '#f1f5f9',
                }]}
              >
                <View style={styles.emailLeft}>
                  <View style={[styles.emailRank, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe' }]}>
                    <Text style={[styles.rankText, { color: isDark ? '#60a5fa' : '#3b82f6' }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[styles.emailText, { color: isDark ? '#cbd5e1' : '#475569' }]}
                    numberOfLines={1}
                  >
                    {item.email}
                  </Text>
                </View>
                <View style={[styles.emailCount, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
                  <Text style={[styles.countText, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                    {item.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Insights Card */}
        <View style={[styles.insightsCard, { 
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#dbeafe',
          borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe'
        }]}>
          <View style={styles.insightsContent}>
            <Ionicons name="bulb" size={24} color="#3b82f6" />
            <View style={styles.insightsText}>
              <Text style={[styles.insightsTitle, { color: isDark ? '#dbeafe' : '#1e40af' }]}>
                💡 Insights
              </Text>
              {analytics.servicesWithoutPassword > 0 && (
                <Text style={[styles.insightItem, { color: isDark ? '#93c5fd' : '#1e40af' }]}>
                  • You have {analytics.servicesWithoutPassword} service{analytics.servicesWithoutPassword !== 1 ? 's' : ''} without passwords saved
                </Text>
              )}
              {analytics.uniqueEmails > 5 && (
                <Text style={[styles.insightItem, { color: isDark ? '#93c5fd' : '#1e40af' }]}>
                  • You&apos;re managing {analytics.uniqueEmails} different email accounts
                </Text>
              )}
              <Text style={[styles.insightItem, { color: isDark ? '#93c5fd' : '#1e40af' }]}>
                • Keep adding services to build your digital vault!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
//   headerTitle: {
//     fontSize: 24,
//     lineHeight: 32,
//     fontWeight: '800',
//     marginBottom: 4,
//   },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
//   scrollContent: {
//     paddingHorizontal: 24,
//     paddingVertical: 24,
//   },
  securityCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  securityLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  securityScore: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
  },
  securityIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  securityText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (SCREEN_WIDTH - 72) / 2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  chartCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: 4,
  },
  emailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  emailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emailRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emailText: {
    flex: 1,
    fontSize: 14,
  },
  emailCount: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  insightsCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  insightsContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightsText: {
    flex: 1,
    marginLeft: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  insightItem: {
    fontSize: 13,
    marginBottom: 4,
    lineHeight: 18,
  },
});