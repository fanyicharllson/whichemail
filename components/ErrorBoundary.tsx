// components/ErrorBoundary.tsx (Debug Version)
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  showDetails: boolean;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, showDetails: __DEV__ };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 ERROR BOUNDARY CAUGHT:', error);
    console.error('📋 ERROR INFO:', errorInfo);
    
    // Show alert in production for debugging
    if (!__DEV__) {
      Alert.alert(
        'Debug: Error Caught', 
        `Message: ${error.message}\n\nCheck console for details.`
      );
    }
    
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ 
          flex: 1, 
          padding: 20, 
          backgroundColor: '#f8fafc',
          paddingTop: 60 
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            marginBottom: 16, 
            color: '#dc2626',
            textAlign: 'center'
          }}>
            ⚠️ Debug Mode - Error Caught
          </Text>
          
          <Text style={{ 
            fontSize: 16, 
            color: '#475569', 
            marginBottom: 16,
            textAlign: 'center'
          }}>
            {this.state.error?.message}
          </Text>

          {/* Show/Hide Details Button */}
          <TouchableOpacity 
            onPress={this.toggleDetails}
            style={{ 
              padding: 12, 
              backgroundColor: '#d1d5db', 
              borderRadius: 8,
              marginBottom: 16
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: '600' }}>
              {this.state.showDetails ? 'Hide' : 'Show'} Error Details
            </Text>
          </TouchableOpacity>

          {/* Error Details */}
          {this.state.showDetails && (
            <ScrollView style={{ 
              maxHeight: 300, 
              marginBottom: 20,
              backgroundColor: '#f1f5f9',
              padding: 12,
              borderRadius: 8
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Error:</Text> {this.state.error?.toString()}
              </Text>
              <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>Stack:</Text> 
              </Text>
              <Text style={{ fontSize: 10, color: '#94a3b8' }}>
                {this.state.error?.stack}
              </Text>
              {this.state.errorInfo && (
                <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>Component Stack:</Text> 
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
          )}

          <TouchableOpacity 
            onPress={this.handleReset}
            style={{ 
              paddingHorizontal: 20, 
              paddingVertical: 12, 
              backgroundColor: '#3b82f6', 
              borderRadius: 8 
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;