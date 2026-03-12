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
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  sendMessageToAI,
  getConversations,
  getConversation,
  deleteConversation,
  clearAllHistory,
  getLanguagePreference,
  saveLanguagePreference,
} from "../services/chatService";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.82;

// ✅ Professional Color Palette
const COLORS = {
  // Primary Brand Colors
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  primaryLight: "#4CAF50",
  primarySoft: "#81C784",

  // Background Colors
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F8FAF8",
  bgTertiary: "#F1F8E9",
  bgAccent: "#E8F5E9",

  // Text Colors
  textPrimary: "#1A1A1A",
  textSecondary: "#4A4A4A",
  textTertiary: "#757575",
  textMuted: "#9E9E9E",
  textWhite: "#FFFFFF",

  // UI Colors
  border: "#E8E8E8",
  borderLight: "#F0F0F0",
  divider: "#EEEEEE",
  shadow: "rgba(0, 0, 0, 0.08)",
  overlay: "rgba(0, 0, 0, 0.4)",

  // Accent Colors
  accent: "#A5D6A7",
  accentLight: "#C8E6C9",

  // Status Colors
  error: "#E53935",
  errorLight: "#FFEBEE",
  success: "#43A047",
  warning: "#FB8C00",

  // Sidebar Colors
  sidebarBg: "#FFFFFF",
  sidebarHeader: "#FAFAFA",
  sidebarActive: "#E8F5E9",
};

// ✅ Languages with text labels
const LANGUAGES = [
  { code: "en", name: "English", shortName: "EN" },
  { code: "mr", name: "मराठी", shortName: "MR" },
  { code: "hi", name: "हिंदी", shortName: "HI" },
];

// ✅ Quick action suggestions
const getQuickActions = (lang) => {
  const actions = {
    en: [
      { id: "1", text: "What's the weather forecast?", icon: "sunny-outline" },
      { id: "2", text: "Today's market prices", icon: "trending-up-outline" },
      { id: "3", text: "How to control pests?", icon: "bug-outline" },
      {
        id: "4",
        text: "Government schemes for farmers",
        icon: "document-text-outline",
      },
      { id: "5", text: "Best fertilizer for wheat", icon: "leaf-outline" },
    ],
    mr: [
      { id: "1", text: "हवामानाचा अंदाज काय आहे?", icon: "sunny-outline" },
      { id: "2", text: "आजचे बाजारभाव सांगा", icon: "trending-up-outline" },
      { id: "3", text: "कीटक नियंत्रण कसे करावे?", icon: "bug-outline" },
      {
        id: "4",
        text: "शेतकऱ्यांसाठी सरकारी योजना",
        icon: "document-text-outline",
      },
      { id: "5", text: "गव्हासाठी सर्वोत्तम खत", icon: "leaf-outline" },
    ],
    hi: [
      { id: "1", text: "मौसम का पूर्वानुमान क्या है?", icon: "sunny-outline" },
      { id: "2", text: "आज के बाजार भाव बताएं", icon: "trending-up-outline" },
      { id: "3", text: "कीट नियंत्रण कैसे करें?", icon: "bug-outline" },
      {
        id: "4",
        text: "किसानों के लिए सरकारी योजनाएं",
        icon: "document-text-outline",
      },
      { id: "5", text: "गेहूं के लिए सबसे अच्छा उर्वरक", icon: "leaf-outline" },
    ],
  };
  return actions[lang] || actions.mr;
};

// ✅ Welcome message
const getWelcomeMessage = (lang) => ({
  id: "welcome",
  text:
    lang === "en"
      ? "Hello! I'm KrushiSakha AI 🌾\n\nYour personal farming assistant. Ask me anything about:\n\n🌤️ Weather & Climate\n💰 Market Prices\n🌱 Crop Management\n🐛 Pest Control\n📋 Government Schemes"
      : lang === "mr"
        ? "नमस्कार! मी KrushiSakha AI आहे 🌾\n\nतुमचा वैयक्तिक शेती सहाय्यक. मला विचारा:\n\n🌤️ हवामान माहिती\n💰 बाजारभाव\n🌱 पीक व्यवस्थापन\n🐛 कीटक नियंत्रण\n📋 सरकारी योजना"
        : "नमस्ते! मैं KrushiSakha AI हूं 🌾\n\nआपका व्यक्तिगत कृषि सहायक। मुझसे पूछें:\n\n🌤️ मौसम जानकारी\n💰 बाजार भाव\n🌱 फसल प्रबंधन\n🐛 कीट नियंत्रण\n📋 सरकारी यो���नाएं",
  sender: "bot",
  timestamp: new Date(),
});

const AIChatScreen = () => {
  // ==================== STATE ====================
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("mr");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // ==================== REFS ====================
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;

  // ==================== EFFECTS ====================
  useEffect(() => {
    loadInitialData();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Typing animation
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      typingAnim.setValue(0);
    }
  }, [isTyping]);

  // Auto scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  // Status bar
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "android") {
        StatusBar.setBackgroundColor(COLORS.bgPrimary);
        StatusBar.setBarStyle("dark-content");
      }
    }, []),
  );

  // ==================== DATA LOADING ====================
  const loadInitialData = async () => {
    const lang = await getLanguagePreference();
    setSelectedLanguage(lang);
    setMessages([getWelcomeMessage(lang)]);
    await loadConversations();
  };

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const data = await getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.log("Error loading conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // ==================== SIDEBAR ====================
  const openSidebar = () => {
    setSidebarOpen(true);
    loadConversations();
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSidebarOpen(false);
    });
  };

  // ==================== CONVERSATION HANDLERS ====================
  const loadConversation = async (convId) => {
    setLoadingMessages(true);
    closeSidebar();

    try {
      const data = await getConversation(convId);
      if (data.conversation) {
        setCurrentConversationId(convId);
        setSelectedLanguage(data.conversation.language || "mr");

        const formattedMessages = data.conversation.messages.map(
          (msg, index) => ({
            id: msg._id || `msg-${index}-${Date.now()}`,
            text: msg.text,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
          }),
        );

        setMessages(
          formattedMessages.length > 0
            ? formattedMessages
            : [getWelcomeMessage(selectedLanguage)],
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load conversation");
    } finally {
      setLoadingMessages(false);
    }
  };

  const startNewChat = () => {
    closeSidebar();
    setCurrentConversationId(null);
    setMessages([getWelcomeMessage(selectedLanguage)]);
  };

  const handleDeleteConversation = (convId, title) => {
    Alert.alert(
      "Delete Conversation",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteConversation(convId);
              await loadConversations();
              if (currentConversationId === convId) {
                startNewChat();
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete conversation");
            }
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All History",
      "This will permanently delete all your conversations. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllHistory();
              setConversations([]);
              startNewChat();
            } catch (error) {
              Alert.alert("Error", "Failed to clear history");
            }
          },
        },
      ],
    );
  };

  // ==================== LANGUAGE ====================
  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);
    await saveLanguagePreference(langCode);
    setShowLanguageModal(false);
    if (messages.length <= 1 || messages[0]?.id === "welcome") {
      setMessages([getWelcomeMessage(langCode)]);
    }
  };

  const getCurrentLanguage = () =>
    LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[1];

  // ==================== MESSAGING ====================
  const sendMessage = async (text = inputText) => {
    if (!text.trim() || isTyping) return;

    Keyboard.dismiss();

    const userMsg = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev.filter((m) => m.id !== "welcome"), userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await sendMessageToAI(
        text,
        currentConversationId,
        selectedLanguage,
      );

      const botMsg = {
        id: `bot-${Date.now()}`,
        text: response.reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.conversationId && response.isNewConversation) {
        setCurrentConversationId(response.conversationId);
        loadConversations();
      }
    } catch (error) {
      const errorMsg = {
        id: `error-${Date.now()}`,
        text: error.message || "Something went wrong. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // ==================== HELPERS ====================
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderMessage = ({ item, index }) => {
    const isUser = item.sender === "user";
    const isFirstBotMessage =
      !isUser && (index === 0 || messages[index - 1]?.sender === "user");

    return (
      <View
        style={[styles.messageWrapper, isUser && styles.messageWrapperUser]}
      >
        {/* Bot Avatar */}
        {!isUser && isFirstBotMessage && (
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary]}
              style={styles.botAvatarGradient}
            >
              <Image
                source={require("../assets/krushisakha_logo.png")}
                style={styles.botAvatarImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>
        )}
        {!isUser && !isFirstBotMessage && (
          <View style={styles.avatarPlaceholder} />
        )}

        {/* Message Bubble */}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
            item.isError && styles.errorBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser && styles.userMessageText,
              item.isError && styles.errorText,
            ]}
          >
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>

        {/* User Avatar */}
        {isUser && (
          <View style={styles.userAvatarContainer}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.userAvatarGradient}
            >
              <Ionicons name="person" size={14} color={COLORS.textWhite} />
            </LinearGradient>
          </View>
        )}
      </View>
    );
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        currentConversationId === item._id && styles.conversationItemActive,
      ]}
      onPress={() => loadConversation(item._id)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.conversationIcon,
          currentConversationId === item._id && styles.conversationIconActive,
        ]}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={18}
          color={
            currentConversationId === item._id
              ? COLORS.primary
              : COLORS.textTertiary
          }
        />
      </View>
      <View style={styles.conversationContent}>
        <Text
          style={[
            styles.conversationTitle,
            currentConversationId === item._id &&
              styles.conversationTitleActive,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={styles.conversationMeta}>
          {item.messageCount} messages • {formatDate(item.updatedAt)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteConversation(item._id, item.title)}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={16} color={COLORS.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity
      style={styles.quickActionChip}
      onPress={() => sendMessage(item.text)}
      activeOpacity={0.7}
    >
      <Ionicons name={item.icon} size={16} color={COLORS.primary} />
      <Text style={styles.quickActionText} numberOfLines={1}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  // ==================== MAIN RENDER ====================
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bgPrimary} barStyle="dark-content" />

      {/* Background */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={[COLORS.bgAccent, COLORS.bgSecondary, COLORS.bgPrimary]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.3 }}
        />
      </View>

      {/* ==================== SIDEBAR OVERLAY ==================== */}
      {sidebarOpen && (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={closeSidebar}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
        </Animated.View>
      )}

      {/* ==================== SIDEBAR ==================== */}
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* Sidebar Header */}
        <View style={styles.sidebarHeader}>
          <View style={styles.sidebarHeaderContent}>
            <Image
              source={require("../assets/krushisakha_logo.png")}
              style={styles.sidebarLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.sidebarTitle}>KrushiSakha</Text>
              <Text style={styles.sidebarSubtitle}>Chat History</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={closeSidebar}
            style={styles.sidebarCloseBtn}
          >
            <Ionicons name="close" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* New Chat Button */}
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={startNewChat}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.newChatGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={COLORS.textWhite}
            />
            <Text style={styles.newChatText}>Start New Chat</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Conversations */}
        <View style={styles.conversationsSection}>
          <Text style={styles.sectionLabel}>RECENT CONVERSATIONS</Text>

          {loadingConversations ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingStateText}>Loading...</Text>
            </View>
          ) : conversations.length > 0 ? (
            <FlatList
              data={conversations}
              keyExtractor={(item) => item._id}
              renderItem={renderConversationItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.conversationsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={36}
                  color={COLORS.accent}
                />
              </View>
              <Text style={styles.emptyTitle}>No Conversations</Text>
              <Text style={styles.emptySubtitle}>
                Start chatting to see history here
              </Text>
            </View>
          )}
        </View>

        {/* Clear All */}
        {conversations.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAll}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
            <Text style={styles.clearAllText}>Clear All History</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* ==================== MAIN CONTENT ==================== */}
      <KeyboardAvoidingView
        style={styles.mainContent}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={openSidebar}>
            <Ionicons
              name="menu-outline"
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>KrushiSakha AI</Text>
            <View style={styles.headerStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>

          {/* ✅ Language Button with Text */}
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageButtonText}>
              {getCurrentLanguage().shortName}
            </Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Messages Area */}
        {loadingMessages ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading conversation...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={[
              styles.messagesList,
              messages.length <= 1 && styles.messagesListEmpty,
            ]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              isTyping ? (
                <View style={styles.typingIndicator}>
                  <View style={styles.avatarContainer}>
                    <LinearGradient
                      colors={[COLORS.primaryLight, COLORS.primary]}
                      style={styles.botAvatarGradient}
                    >
                      <Image
                        source={require("../assets/krushisakha_logo.png")}
                        style={styles.botAvatarImage}
                        resizeMode="contain"
                      />
                    </LinearGradient>
                  </View>
                  <View style={styles.typingBubble}>
                    <View style={styles.typingDots}>
                      <Animated.View
                        style={[
                          styles.typingDot,
                          {
                            opacity: typingAnim.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [0.3, 1, 0.3],
                            }),
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.typingDot,
                          {
                            opacity: typingAnim.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [0.5, 0.3, 1],
                            }),
                          },
                        ]}
                      />
                      <Animated.View
                        style={[
                          styles.typingDot,
                          {
                            opacity: typingAnim.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [1, 0.5, 0.3],
                            }),
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.typingText}>Thinking...</Text>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Quick Actions - Show only for new chat */}
        {messages.length <= 1 && !loadingMessages && !keyboardVisible && (
          <View style={styles.quickActionsSection}>
            <Text style={styles.quickActionsTitle}>
              {selectedLanguage === "en"
                ? "Try asking:"
                : selectedLanguage === "mr"
                  ? "हे विचारून पहा:"
                  : "यह पूछकर देखें:"}
            </Text>
            <FlatList
              horizontal
              data={getQuickActions(selectedLanguage)}
              keyExtractor={(item) => item.id}
              renderItem={renderQuickAction}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsList}
            />
          </View>
        )}

        {/* ✅ Input Area - Fixed keyboard issue */}
        <View style={styles.inputSection}>
          <View
            style={[
              styles.inputContainer,
              inputFocused && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              ref={inputRef}
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                selectedLanguage === "en"
                  ? "Type your message..."
                  : selectedLanguage === "mr"
                    ? "तुमचा संदेश टाइप करा..."
                    : "अपना संदेश टाइप करें..."
              }
              placeholderTextColor={COLORS.textMuted}
              style={styles.textInput}
              multiline
              maxLength={1000}
              editable={!isTyping}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() && !isTyping
                  ? styles.sendButtonActive
                  : styles.sendButtonInactive,
              ]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || isTyping}
              activeOpacity={0.7}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color={COLORS.textWhite} />
              ) : (
                <Ionicons
                  name="send"
                  size={18}
                  color={
                    inputText.trim() && !isTyping
                      ? COLORS.textWhite
                      : COLORS.textMuted
                  }
                />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>
            {selectedLanguage === "en"
              ? "Powered by AI • Responses may vary"
              : selectedLanguage === "mr"
                ? "AI द्वारे संचालित • प्रतिसाद बदलू शकतात"
                : "AI द्वारा संचालित • प्रतिक्रियाएं भिन्न हो सकती हैं"}
          </Text>
        </View>
      </KeyboardAvoidingView>

      {/* ==================== LANGUAGE MODAL ==================== */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.languageModal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Language</Text>
                  <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                    <Ionicons
                      name="close"
                      size={22}
                      color={COLORS.textTertiary}
                    />
                  </TouchableOpacity>
                </View>

                {LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageOption,
                      selectedLanguage === lang.code &&
                        styles.languageOptionSelected,
                    ]}
                    onPress={() => handleLanguageChange(lang.code)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.languageIndicator,
                        selectedLanguage === lang.code &&
                          styles.languageIndicatorSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.languageCode,
                          selectedLanguage === lang.code &&
                            styles.languageCodeSelected,
                        ]}
                      >
                        {lang.shortName}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.languageName,
                        selectedLanguage === lang.code &&
                          styles.languageNameSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                    {selectedLanguage === lang.code && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default AIChatScreen;

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  // ==================== OVERLAY ====================
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    zIndex: 100,
  },

  // ==================== SIDEBAR ====================
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: COLORS.sidebarBg,
    zIndex: 200,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.sidebarHeader,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sidebarHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sidebarLogo: {
    width: 40,
    height: 40,
  },
  sidebarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  sidebarSubtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  sidebarCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newChatButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  newChatGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  newChatText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textWhite,
  },
  conversationsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  conversationsList: {
    paddingBottom: 16,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  conversationItemActive: {
    backgroundColor: COLORS.sidebarActive,
    borderColor: COLORS.primary,
  },
  conversationIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.bgTertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  conversationIconActive: {
    backgroundColor: COLORS.accentLight,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  conversationTitleActive: {
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
  conversationMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  deleteButton: {
    padding: 8,
  },
  loadingState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  loadingStateText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.bgAccent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 34 : 24,
    borderRadius: 12,
    backgroundColor: COLORS.errorLight,
    gap: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.error,
  },

  // ==================== MAIN CONTENT ====================
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 56 : 46,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.bgSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 14,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: "500",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.bgAccent,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 4,
  },
  languageButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },

  // ==================== MESSAGES ====================
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messagesListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageWrapperUser: {
    justifyContent: "flex-end",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 34,
    marginRight: 10,
  },
  botAvatarGradient: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  botAvatarImage: {
    width: 22,
    height: 22,
    tintColor: COLORS.textWhite,
  },
  userAvatarContainer: {
    marginLeft: 10,
  },
  userAvatarGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 6,
  },
  errorBubble: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  userMessageText: {
    color: COLORS.textWhite,
  },
  errorText: {
    color: COLORS.error,
  },
  messageTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: "right",
  },
  userMessageTime: {
    color: "rgba(255,255,255,0.7)",
  },

  // ==================== TYPING ====================
  typingIndicator: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 8,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  typingText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },

  // ==================== QUICK ACTIONS ====================
  quickActionsSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.bgPrimary,
  },
  quickActionsTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textTertiary,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  quickActionsList: {
    paddingHorizontal: 16,
  },
  quickActionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgAccent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: 8,
    maxWidth: 220,
  },
  quickActionText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "500",
    flexShrink: 1,
  },

  // ==================== INPUT ====================
  inputSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: COLORS.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.bgPrimary,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sendButtonInactive: {
    backgroundColor: COLORS.bgTertiary,
  },
  inputHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 8,
  },

  // ==================== MODAL ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  languageModal: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  languageOptionSelected: {
    backgroundColor: COLORS.bgAccent,
    borderColor: COLORS.primary,
  },
  languageIndicator: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.bgTertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  languageIndicatorSelected: {
    backgroundColor: COLORS.primary,
  },
  languageCode: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textTertiary,
  },
  languageCodeSelected: {
    color: COLORS.textWhite,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  languageNameSelected: {
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
});
