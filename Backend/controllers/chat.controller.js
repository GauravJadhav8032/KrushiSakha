const ChatHistory = require("../models/chat.model");
const userModel = require("../models/user.model");
const geminiService = require("../utils/geminiService");
const mongoose = require("mongoose");

/**
 * Generate chat title from first message
 */
const generateTitle = (message) => {
  if (!message) return "New Chat";
  const title = message.trim().substring(0, 30);
  return title.length < message.trim().length ? `${title}...` : title;
};

/**
 * Migrate old schema to new schema if needed
 */
const migrateOldSchema = async (chatHistory) => {
  // Check if old schema (has messages directly, not in conversations)
  if (
    chatHistory.messages &&
    chatHistory.messages.length > 0 &&
    (!chatHistory.conversations || chatHistory.conversations.length === 0)
  ) {
    console.log("📦 Migrating old chat schema to new format...");

    // Create a conversation from old messages
    const oldMessages = chatHistory.messages;
    const firstUserMessage = oldMessages.find((m) => m.sender === "user");

    const newConversation = {
      _id: new mongoose.Types.ObjectId(),
      title: firstUserMessage
        ? generateTitle(firstUserMessage.text)
        : "Previous Chat",
      messages: oldMessages,
      language: chatHistory.language || "mr",
      createdAt: oldMessages[0]?.timestamp || new Date(),
      updatedAt: oldMessages[oldMessages.length - 1]?.timestamp || new Date(),
    };

    chatHistory.conversations = [newConversation];
    chatHistory.messages = undefined; // Remove old messages field
    chatHistory.activeConversationId = newConversation._id;

    await chatHistory.save();
    console.log("✅ Migration complete!");
  }

  return chatHistory;
};

/**
 * Get or create user's chat history document
 */
const getOrCreateChatHistory = async (userId) => {
  let chatHistory = await ChatHistory.findOne({ userId });

  if (!chatHistory) {
    chatHistory = new ChatHistory({
      userId,
      conversations: [],
      activeConversationId: null,
    });
    await chatHistory.save();
  } else {
    // Migrate old schema if needed
    chatHistory = await migrateOldSchema(chatHistory);
  }

  return chatHistory;
};

/**
 * Main chat endpoint - Send message and get AI response
 */
module.exports.chat = async (req, res) => {
  try {
    const { message, language = "mr", conversationId } = req.body;
    const userId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!geminiService.isConfigured()) {
      return res.status(500).json({
        message: "AI service not configured",
        reply: geminiService.getErrorMessage(
          { message: "not configured" },
          language,
        ),
      });
    }

    // Get user's location
    let userLocation = null;
    try {
      const user = await userModel.findById(userId).select("location");
      if (user?.location) {
        userLocation = {
          village: user.location.village || "",
          district: user.location.district || "",
          state: user.location.state || "",
        };
      }
    } catch (err) {
      console.log("Error fetching user location:", err.message);
    }

    // Get or create chat history
    let chatHistory = await getOrCreateChatHistory(userId);
    let conversation;
    let isNewConversation = false;

    // Find existing conversation or create new one
    if (conversationId) {
      conversation = chatHistory.conversations.id(conversationId);
    }

    if (!conversation) {
      isNewConversation = true;
      const newConv = {
        _id: new mongoose.Types.ObjectId(),
        title: generateTitle(message),
        messages: [],
        language: language,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      chatHistory.conversations.push(newConv);
      await chatHistory.save();

      // Refetch to get the proper subdocument
      chatHistory = await ChatHistory.findOne({ userId });
      conversation =
        chatHistory.conversations[chatHistory.conversations.length - 1];
    }

    // Get chat messages for context
    const chatMessages = (conversation.messages || []).map((m) => ({
      text: m.text,
      sender: m.sender,
    }));

    // Generate AI response
    const reply = await geminiService.generateResponse(message, {
      chatHistory: chatMessages,
      language,
      userLocation,
    });

    // Add messages to conversation
    conversation.messages.push(
      { text: message, sender: "user", timestamp: new Date() },
      { text: reply, sender: "bot", timestamp: new Date() },
    );
    conversation.updatedAt = new Date();
    conversation.language = language;

    // Update title if first message
    if (conversation.messages.length === 2) {
      conversation.title = generateTitle(message);
    }

    chatHistory.activeConversationId = conversation._id;
    await chatHistory.save();

    res.status(200).json({
      reply,
      success: true,
      language,
      hasLocation: !!userLocation,
      conversationId: conversation._id,
      isNewConversation,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    const language = req.body.language || "en";

    res.status(500).json({
      message: error.message || "Failed to get AI response",
      reply: geminiService.getErrorMessage(error, language),
    });
  }
};

/**
 * Get all conversations (for sidebar)
 */
module.exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    let chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      return res.status(200).json({
        conversations: [],
        activeConversationId: null,
        success: true,
      });
    }

    // Migrate old schema if needed
    chatHistory = await migrateOldSchema(chatHistory);

    // Ensure conversations exists
    if (
      !chatHistory.conversations ||
      !Array.isArray(chatHistory.conversations)
    ) {
      return res.status(200).json({
        conversations: [],
        activeConversationId: null,
        success: true,
      });
    }

    // Return conversations sorted by updatedAt (newest first)
    const conversations = chatHistory.conversations
      .filter((conv) => conv && conv.messages && conv.messages.length > 0)
      .map((conv) => ({
        _id: conv._id,
        title: conv.title || "Untitled Chat",
        language: conv.language || "mr",
        messageCount: conv.messages?.length || 0,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessage:
          conv.messages && conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1].text?.substring(0, 50) ||
              ""
            : "",
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    console.log(`📋 Found ${conversations.length} conversations for user`);

    res.status(200).json({
      conversations,
      activeConversationId: chatHistory.activeConversationId,
      success: true,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to get conversations" });
  }
};

/**
 * Get single conversation with messages
 */
module.exports.getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    let chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      return res.status(404).json({ message: "No chat history found" });
    }

    // Migrate old schema if needed
    chatHistory = await migrateOldSchema(chatHistory);

    const conversation = chatHistory.conversations.id(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    chatHistory.activeConversationId = conversation._id;
    await chatHistory.save();

    res.status(200).json({
      conversation: {
        _id: conversation._id,
        title: conversation.title,
        language: conversation.language,
        messages: conversation.messages || [],
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
      success: true,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Failed to get conversation" });
  }
};

/**
 * Delete a conversation
 */
module.exports.deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      return res.status(404).json({ message: "No chat history found" });
    }

    const conversationIndex = chatHistory.conversations.findIndex(
      (conv) => conv._id.toString() === conversationId,
    );

    if (conversationIndex === -1) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    chatHistory.conversations.splice(conversationIndex, 1);

    if (chatHistory.activeConversationId?.toString() === conversationId) {
      chatHistory.activeConversationId = null;
    }

    await chatHistory.save();

    res.status(200).json({
      message: "Conversation deleted",
      success: true,
    });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};

/**
 * Clear all chat history
 */
module.exports.clearAllHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await ChatHistory.findOneAndDelete({ userId });

    res.status(200).json({
      message: "All chat history cleared",
      success: true,
    });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({ message: "Failed to clear chat history" });
  }
};

/**
 * Create new conversation
 */
module.exports.createConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { language = "mr" } = req.body;

    let chatHistory = await getOrCreateChatHistory(userId);

    const newConversation = {
      _id: new mongoose.Types.ObjectId(),
      title: "New Chat",
      messages: [],
      language: language,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chatHistory.conversations.push(newConversation);
    chatHistory.activeConversationId = newConversation._id;
    await chatHistory.save();

    res.status(201).json({
      conversation: newConversation,
      success: true,
    });
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

/**
 * Rename conversation
 */
module.exports.renameConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      return res.status(404).json({ message: "No chat history found" });
    }

    const conversation = chatHistory.conversations.id(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    conversation.title = title.trim().substring(0, 50);
    await chatHistory.save();

    res.status(200).json({
      message: "Conversation renamed",
      title: conversation.title,
      success: true,
    });
  } catch (error) {
    console.error("Rename conversation error:", error);
    res.status(500).json({ message: "Failed to rename conversation" });
  }
};

/**
 * Get AI service status
 */
module.exports.getStatus = async (req, res) => {
  try {
    const modelInfo = geminiService.getModelInfo();

    res.status(200).json({
      status: modelInfo.configured ? "active" : "not_configured",
      model: modelInfo.model,
      supportedLanguages: modelInfo.supportedLanguages,
      success: true,
    });
  } catch (error) {
    console.error("Status error:", error);
    res.status(500).json({ message: "Failed to get status" });
  }
};

/**
 * Get supported languages
 */
module.exports.getLanguages = async (req, res) => {
  try {
    const languages = geminiService.getSupportedLanguages();

    res.status(200).json({
      languages,
      success: true,
    });
  } catch (error) {
    console.error("Get languages error:", error);
    res.status(500).json({ message: "Failed to get languages" });
  }
};
