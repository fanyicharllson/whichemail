import React from 'react';
import {BackHandler, Modal, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

type Props = {
  visible: boolean;
  error?: Error | null;
  onRetry?: () => Promise<void> | void;
};

export default function NetworkErrorModal({visible, error, onRetry}: Props) {

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={() => {}}
    >
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <View className="bg-white dark:bg-slate-800 rounded-3xl px-8 py-10 w-full max-w-sm items-center shadow-2xl">
          <View className="bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full items-center justify-center mb-6">
            <Ionicons name="cloud-offline" size={40} color="#ef4444" />
          </View>

          <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl mb-2 text-center">
            Connection Error
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 text-center text-sm mb-8 leading-6">
            Unable to reach the internet. Check your connection and try again.
          </Text>

          {error && (
            <View className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mb-6 w-full">
              <Text className="text-red-700 dark:text-red-400 text-xs text-center">
                {error.message || 'Network error'}
              </Text>
            </View>
          )}

          <View className="flex-col gap-3 w-full">
            <TouchableOpacity
              onPress={async () => {
                if (onRetry) await onRetry();
              }}
              className="bg-blue-600 dark:bg-blue-500 py-4 rounded-xl flex-row items-center justify-center"
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">Retry Connection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => BackHandler.exitApp()}
              className="bg-slate-200 dark:bg-slate-700 py-4 rounded-xl"
            >
              <Text className="text-slate-700 dark:text-slate-300 font-semibold text-center">Close App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
