const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const authMiddleware = require("../middleware/auth.middleware");

// AI Chat route
router.post("/", authMiddleware.authUser, chatController.chat);

// Conversation management
router.get(
  "/conversations",
  authMiddleware.authUser,
  chatController.getConversations,
);
router.post(
  "/conversations",
  authMiddleware.authUser,
  chatController.createConversation,
);
router.get(
  "/conversations/:conversationId",
  authMiddleware.authUser,
  chatController.getConversation,
);
router.delete(
  "/conversations/:conversationId",
  authMiddleware.authUser,
  chatController.deleteConversation,
);
router.patch(
  "/conversations/:conversationId",
  authMiddleware.authUser,
  chatController.renameConversation,
);

// Clear all history
router.delete(
  "/history",
  authMiddleware.authUser,
  chatController.clearAllHistory,
);

// Status and languages
router.get("/status", authMiddleware.authUser, chatController.getStatus);
router.get("/languages", authMiddleware.authUser, chatController.getLanguages);

module.exports = router;
