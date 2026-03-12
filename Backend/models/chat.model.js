const mongoose = require("mongoose");

// Individual message schema
const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Individual conversation schema
const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Chat",
  },
  messages: [messageSchema],
  language: {
    type: String,
    enum: ["en", "mr", "hi"],
    default: "mr",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// User's chat history schema
const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    // New schema: multiple conversations
    conversations: [conversationSchema],
    activeConversationId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    // Old schema fields (for backward compatibility)
    messages: [messageSchema],
    language: {
      type: String,
      enum: ["en", "mr", "hi"],
      default: "mr",
    },
  },
  { timestamps: true },
);

// Keep only last 50 conversations per user
chatHistorySchema.pre("save", function (next) {
  if (this.conversations && this.conversations.length > 50) {
    this.conversations = this.conversations.slice(-50);
  }
  next();
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
