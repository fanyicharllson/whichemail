/* eslint-disable @typescript-eslint/no-unused-vars */
// components/AIChatScreen.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useServices } from "@/services/queries/serviceQueries";
import {
  useAIChat,
  useEmailRecovery,
  useSmartSearch,
} from "@/services/hooks/geminiQueries";
import { router } from "expo-router";
import { useTheme } from "@/components/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import ChatHeader from "@/components/ai/ChatHeader";
import ChatMessages from "@/components/ai/ChatMessages";
import ContactSupport from "@/components/ai/ContactSupport";
import ElegantChatInput from "@/components/ai/ElegantChatInput";
import ModeSelector from "@/components/ai/ModeSelector";

type Mode = "smart-search" | "recovery" | "chat";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AIChatScreen() {
  const [mode, setMode] = useState<Mode>("smart-search");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { data: services = [] } = useServices();
  const smartSearch = useSmartSearch();
  const emailRecovery = useEmailRecovery();
  const aiChat = useAIChat();
  const { actualTheme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<any>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to bottom when keyboard appears
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 150);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleServiceClick = useCallback((serviceId: string) => {
    try {
      router.push(`/service/detail/${serviceId}` as any);
    } catch (error) {
      console.log("Navigation temporarily unavailable");
    }
  }, []);

  const handleSmartSearch = () => {
    if (!input.trim()) return;
    smartSearch.mutate(
      { query: input, services },
      {
        onSuccess: (data) => {
          setChatHistory((prev) => [
            ...prev,
            { role: "user", text: input },
            {
              role: "ai",
              text:
                data.results.length > 0
                  ? `Found ${data.results.length} match(es)! 🎯`
                  : "No matches found. Try rephrasing your query. 🤔",
            },
          ]);
          setInput("");
          scrollToBottom();
        },
      }
    );
  };

  const handleRecovery = () => {
    if (!input.trim()) return;
    emailRecovery.mutate(
      { context: input, services },
      {
        onSuccess: (data) => {
          setChatHistory((prev) => [
            ...prev,
            { role: "user", text: input },
            {
              role: "ai",
              text: `${data.reasoning}\n\n${
                data.matchedServices.length > 0
                  ? `Suggested: ${data.matchedServices
                      .map((s) => s.serviceName)
                      .join(", ")}`
                  : "No matches found based on your description."
              }`,
            },
          ]);
          setInput("");
          scrollToBottom();
        },
      }
    );
  };

  const handleChat = () => {
    if (!input.trim()) return;
    const userMessage = input;
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    scrollToBottom();

    aiChat.mutate(
      { message: userMessage, services },
      {
        onSuccess: (response) => {
          setChatHistory((prev) => [...prev, { role: "ai", text: response }]);
          scrollToBottom();
        },
      }
    );
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSubmit = () => {
    if (mode === "smart-search") handleSmartSearch();
    else if (mode === "recovery") handleRecovery();
    else handleChat();
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    // Focus the input after setting the prompt
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const isLoading =
    smartSearch.isPending || emailRecovery.isPending || aiChat.isPending;

  const getPlaceholder = () => {
    switch (mode) {
      case "smart-search":
        return 'Try: "which email for shopping apps?"';
      case "recovery":
        return 'e.g., "I made this account in 2019 for gaming"';
      case "chat":
        return "Ask me anything about your emails...";
    }
  };

  const hasContent =
    chatHistory.length > 0 ||
    (smartSearch.data?.results?.length ?? 0) > 0 ||
    (emailRecovery.data?.matchedServices?.length ?? 0) > 0;

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: actualTheme === "dark" ? "#0f172a" : "#f8fafc",
        opacity: fadeAnim,
      }}
    >
      <StatusBar style={actualTheme === "dark" ? "light" : "dark"} />

      {/* Header */}
      <ChatHeader actualTheme={actualTheme} />

      {/* Mode Selector */}
      <ModeSelector
        mode={mode}
        setMode={setMode}
        actualTheme={actualTheme}
        onModeChange={() => {
          setChatHistory([]);
          smartSearch.reset();
          emailRecovery.reset();
        }}
      />

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={{ flex: 1 }}>
          {/* Chat Messages Area */}
          <ChatMessages
            ref={scrollViewRef}
            chatHistory={chatHistory}
            actualTheme={actualTheme}
            isLoading={isLoading}
            smartSearch={smartSearch}
            emailRecovery={emailRecovery}
            handleServiceClick={handleServiceClick}
            hasContent={hasContent}
            mode={mode}
            getPlaceholder={getPlaceholder}
            keyboardHeight={keyboardHeight}
          />
         
        </View>

        {/* Input Area */}
        {services.length > 0 && (
          <ElegantChatInput
            ref={inputRef}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            actualTheme={actualTheme}
            getPlaceholder={getPlaceholder}
            isLoading={isLoading}
            services={services}
            mode={mode}
            onQuickPrompt={handleQuickPrompt}
            keyboardVisible={keyboardVisible}
          />
        )}
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
