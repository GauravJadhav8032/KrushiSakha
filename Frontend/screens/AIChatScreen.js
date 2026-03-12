// // import { View, Text } from "react-native";
// // import React from "react";

// // const AIChatScreen = () => {
// //   return (
// //     <View
// //       style={{
// //         flex: 1,
// //         justifyContent: "center", // centers content vertically in the container
// //         alignItems: "center", // centers content horizontally in the container
// //         backgroundColor: "#fff",
// //       }}
// //     >
// //       <Text
// //         style={{
// //           fontSize: 20, // Optional: styling for the text
// //           textAlign: "center",
// //         }}
// //       >
// //         AIChatScreen
// //       </Text>
// //     </View>
// //   );
// // };

// // export default AIChatScreen;

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const COLORS = {
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  primaryLight: "#4CAF50",
  secondary: "#558B2F",
  secondaryLight: "#8BC34A",
  backgroundLight: "#E8F5E9",
  backgroundCream: "#F1F8E9",
  backgroundWhite: "#FFFFFF",
  accent: "#A5D6A7",
  accentLight: "#C8E6C9",
  textPrimary: "#1B5E20",
  textSecondary: "#558B2F",
  textMuted: "#757575",
  textWhite: "#FFFFFF",
  border: "#E0E0E0",
  shadow: "#00000015",
};

const QUICK_ACTIONS = [
  { id: "1", label: "Weather", icon: "partly-sunny-outline" },
  { id: "2", label: "Market Rates", icon: "cash-outline" },
  { id: "3", label: "Pest Control", icon: "bug-outline" },
];

const AIChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "नमस्ते! मी KrushiSakha AI आहे 🌾\n\nHow can I help you today? Feel free to ask me about:\n• Weather forecasts\n• Market prices\n• Crop management\n• Pest control\n• Government schemes",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // Fix status bar color on screen focus
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor(COLORS.backgroundWhite);
      StatusBar.setBarStyle("dark-content");

      return () => {
        // Reset when leaving
        StatusBar.setBackgroundColor(COLORS.backgroundWhite);
      };
    }, []),
  );

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("http://YOUR_IP:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      setIsTyping(false);

      const botMsg = {
        id: Date.now().toString(),
        text: data.reply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "❌ Sorry, I'm having trouble connecting. Please check your internet connection and try again.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        {/* Bot Avatar */}
        {!isUser && (
          <View style={styles.botAvatar}>
            <Image
              source={require("../assets/krushisakha_logo.png")}
              style={styles.botAvatarImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Message Bubble */}
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
        >
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>
            {item.text}
          </Text>
          {item.timestamp && (
            <Text style={[styles.time, isUser && styles.userTime]}>
              {item.timestamp}
            </Text>
          )}
        </View>

        {/* User Avatar */}
        {isUser && (
          <View style={styles.userAvatar}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.userAvatarGradient}
            >
              <Ionicons name="person" size={16} color={COLORS.textWhite} />
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.backgroundWhite}
        barStyle="dark-content"
      />

      {/* Gradient Background */}
      <LinearGradient
        colors={[
          COLORS.backgroundLight,
          COLORS.backgroundCream,
          COLORS.backgroundWhite,
        ]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      />

      {/* Decorative Circle */}
      <View style={styles.decorativeCircle} />

      {/* HEADER - Matching Home Screen Style */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/krushisakha_logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerText}>KrushiSakha AI</Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Always Online</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* CHAT */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.botAvatar}>
            <Image
              source={require("../assets/krushisakha_logo.png")}
              style={styles.botAvatarImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      )}

      {/* INPUT SECTION */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <FlatList
            horizontal
            data={QUICK_ACTIONS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => sendMessage(item.label)}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                <Text style={styles.chipText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsList}
          />
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons
                name="add-circle-outline"
                size={28}
                color={COLORS.accent}
              />
            </TouchableOpacity>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask something..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.input}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => sendMessage()}
              disabled={!inputText.trim()}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.sendButtonCircle,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={inputText.trim() ? COLORS.textWhite : COLORS.accent}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AIChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundWhite,
  },
  decorativeCircle: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accentLight,
    opacity: 0.3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.backgroundWhite,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  logo: {
    width: 32,
    height: 32,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#4CAF50",
  },
  onlineText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundWhite,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundWhite,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  botAvatarImage: {
    width: 24,
    height: 24,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
    overflow: "hidden",
  },
  userAvatarGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: COLORS.backgroundWhite,
    borderBottomLeftRadius: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.backgroundLight,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontWeight: "400",
  },
  userMessageText: {
    color: COLORS.textWhite,
  },
  time: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 6,
    fontWeight: "500",
  },
  userTime: {
    color: COLORS.accentLight,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  typingBubble: {
    backgroundColor: COLORS.backgroundWhite,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.backgroundLight,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typingDots: {
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  quickActionsContainer: {
    backgroundColor: COLORS.backgroundWhite,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.backgroundLight,
  },
  quickActionsList: {
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 8,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  inputContainer: {
    backgroundColor: COLORS.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.backgroundLight,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: COLORS.backgroundCream,
    borderRadius: 28,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    gap: 6,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.backgroundLight,
  },
});
