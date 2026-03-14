import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BASE_URL = `${Constants.expoConfig.extra.BASE_URL}/chat`;
const LANGUAGE_KEY = "chat_language";

/**
 * Get auth token
 */
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) throw new Error("Please login to use AI chat");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Send message to AI
 */
export const sendMessageToAI = async (
  message,
  conversationId = null,
  language = "mr",
) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, conversationId, language }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to get AI response");
    return data;
  } catch (error) {
    if (error.message === "Network request failed") {
      throw new Error("Cannot connect to server. Check your network.");
    }
    throw error;
  }
};

/**
 * Get all conversations
 */
export const getConversations = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/conversations`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to get conversations");
    return data;
  } catch (error) {
    console.log("Error getting conversations:", error);
    return { conversations: [], activeConversationId: null };
  }
};

/**
 * Get single conversation
 */
export const getConversation = async (conversationId) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${BASE_URL}/conversations/${conversationId}`,
      {
        method: "GET",
        headers,
      },
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to get conversation");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new conversation
 */
export const createConversation = async (language = "mr") => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/conversations`, {
      method: "POST",
      headers,
      body: JSON.stringify({ language }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to create conversation");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete conversation
 */
export const deleteConversation = async (conversationId) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${BASE_URL}/conversations/${conversationId}`,
      {
        method: "DELETE",
        headers,
      },
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to delete conversation");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Rename conversation
 */
export const renameConversation = async (conversationId, title) => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${BASE_URL}/conversations/${conversationId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ title }),
      },
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to rename conversation");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Clear all history
 */
export const clearAllHistory = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${BASE_URL}/history`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Failed to clear history");
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Save language preference
 */
export const saveLanguagePreference = async (langCode) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, langCode);
};

/**
 * Get language preference
 */
export const getLanguagePreference = async () => {
  const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
  return lang || "mr";
};
