/**
 * Gemini AI Service
 * Handles all communication with Google's Gemini API
 */

// ✅ Configuration from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Log configuration on startup
console.log(`🤖 Gemini AI configured with model: ${GEMINI_MODEL}`);
console.log(`🔑 API Key configured: ${GEMINI_API_KEY ? "Yes" : "No"}`);

// Supported languages
const SUPPORTED_LANGUAGES = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    instruction: "Respond in English only.",
    greeting:
      "Hello! I am KrushiSakha AI. I am ready to help Indian farmers with agricultural advice. Please ask your question!",
  },
  mr: {
    code: "mr",
    name: "Marathi",
    nativeName: "मराठी",
    instruction: "Respond in Marathi (मराठी) only. Use Devanagari script.",
    greeting:
      "नमस्कार! मी KrushiSakha AI आहे. मी भारतीय शेतकऱ्यांना शेतीविषयक सल्ला देण्यासाठी तयार आहे. कृपया तुमचा प्रश्न विचारा!",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिंदी",
    instruction: "Respond in Hindi (हिंदी) only. Use Devanagari script.",
    greeting:
      "नमस्ते! मैं KrushiSakha AI हूं। मैं भारतीय किसानों को कृषि संबंधी सलाह देने के लिए तैयार हूं। कृपया अपना प्रश्न पूछें!",
  },
};

/**
 * Build system prompt based on language and user location
 */
const buildSystemPrompt = (language = "mr", userLocation = null) => {
  const lang = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.mr;

  let locationContext = "";
  if (userLocation) {
    const { village, district, state } = userLocation;
    const locationParts = [village, district, state].filter(Boolean);
    if (locationParts.length > 0) {
      locationContext = `
User's Location Information:
- Village/Town: ${village || "Not specified"}
- District: ${district || "Not specified"}
- State: ${state || "Not specified"}

When the user asks about weather, market prices, local schemes, or any location-specific information:
1. Use their location (${locationParts.join(", ")}) to provide relevant information
2. Mention their specific region when giving advice
3. Consider local climate, soil, and crop patterns of ${state || "their region"}
4. Reference nearby mandis or agricultural centers if relevant`;
    }
  }

  return `You are KrushiSakha AI, a helpful agricultural assistant for Indian farmers.

LANGUAGE INSTRUCTION: ${lang.instruction}

${locationContext}

Your expertise includes:
- Crop management and farming techniques
- Weather information and seasonal advice
- Pest and disease control
- Market prices and selling strategies
- Government schemes and subsidies for farmers
- Soil health and fertilizer recommendations
- Irrigation and water management
- Organic farming practices

Guidelines:
1. Be helpful, friendly, and supportive
2. Give practical, actionable advice
3. Consider Indian farming conditions and local crops
4. Use simple language that farmers can understand
5. For weather queries, provide seasonal advice and recommend checking local weather services or IMD
6. For market prices, mention checking local mandis and provide general price trends
7. ${lang.instruction}
8. Always prioritize farmer safety and sustainable practices
9. Keep responses concise but informative (under 300 words)
10. If location is available, personalize advice for that region

If you don't know something, be honest and suggest consulting local agricultural officers or Krishi Vigyan Kendras (KVKs).`;
};

// Generation config
const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

// Safety settings
const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

/**
 * Check if Gemini service is configured
 */
const isConfigured = () => {
  return !!GEMINI_API_KEY;
};

/**
 * Get language info
 */
const getLanguageInfo = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES.mr;
};

/**
 * Get all supported languages
 */
const getSupportedLanguages = () => {
  return Object.values(SUPPORTED_LANGUAGES).map((lang) => ({
    code: lang.code,
    name: lang.name,
    nativeName: lang.nativeName,
  }));
};

/**
 * Ensure chatHistory is a valid array
 * @param {any} chatHistory - Chat history (could be array, object, or undefined)
 * @returns {Array} - Valid array of chat messages
 */
const ensureArray = (chatHistory) => {
  // If it's already an array, return it
  if (Array.isArray(chatHistory)) {
    return chatHistory;
  }

  // If it's null or undefined, return empty array
  if (!chatHistory) {
    return [];
  }

  // If it's an object with messages property (from MongoDB), extract messages
  if (chatHistory.messages && Array.isArray(chatHistory.messages)) {
    return chatHistory.messages;
  }

  // If it's some other object, return empty array
  console.log("⚠️ Invalid chatHistory format:", typeof chatHistory);
  return [];
};

/**
 * Build conversation contents for API request
 */
const buildConversationContents = (
  message,
  chatHistory = [],
  language = "mr",
  userLocation = null,
) => {
  const contents = [];
  const lang = getLanguageInfo(language);
  const systemPrompt = buildSystemPrompt(language, userLocation);

  // Add system instruction as first exchange
  contents.push({
    role: "user",
    parts: [{ text: systemPrompt }],
  });
  contents.push({
    role: "model",
    parts: [{ text: lang.greeting }],
  });

  // ✅ FIX: Ensure chatHistory is an array before using slice
  const validHistory = ensureArray(chatHistory);

  // Add previous chat history for context (last 6 messages)
  const recentHistory = validHistory.slice(-6);
  for (const msg of recentHistory) {
    if (msg && msg.text) {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }
  }

  // Add current message
  contents.push({
    role: "user",
    parts: [{ text: message }],
  });

  return contents;
};

/**
 * Send message to Gemini AI and get response
 */
const generateResponse = async (message, options = {}) => {
  const { chatHistory = [], language = "mr", userLocation = null } = options;

  if (!isConfigured()) {
    throw new Error("Gemini API key not configured");
  }

  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  // ✅ FIX: Ensure chatHistory is array
  const validChatHistory = ensureArray(chatHistory);

  // Build conversation contents with language and location
  const contents = buildConversationContents(
    message,
    validChatHistory,
    language,
    userLocation,
  );

  // Make API request
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    }),
  });

  const data = await response.json();

  // Check for API errors
  if (!response.ok) {
    console.error("Gemini API Error:", data);
    const errorMessage = data.error?.message || "API request failed";
    throw new Error(errorMessage);
  }

  // Check for blocked content
  if (data.candidates?.[0]?.finishReason === "SAFETY") {
    throw new Error("Content blocked by safety filters");
  }

  // Extract reply text
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    console.error("No reply in response:", data);
    throw new Error("No response from AI");
  }

  return reply;
};

/**
 * Get user-friendly error message in specified language
 */
const getErrorMessage = (error, language = "en") => {
  const message = error.message || "";

  const errorMessages = {
    en: {
      apiKey: "❌ AI service configuration error. Please contact support.",
      quota: "❌ Too many requests. Please wait a moment and try again.",
      blocked: "❌ Your message could not be processed. Please try rephrasing.",
      notConfigured: "❌ AI service is not configured. Please contact support.",
      default: "❌ Sorry, I encountered an error. Please try again.",
    },
    mr: {
      apiKey: "❌ AI सेवा कॉन्फिगरेशन त्रुटी. कृपया सपोर्टशी संपर्क साधा.",
      quota:
        "❌ खूप जास्त विनंत्या. कृपया थोडा वेळ थांबा आणि पुन्हा प्रयत्न करा.",
      blocked:
        "❌ तुमचा संदेश प्रक्रिया करता आला नाही. कृपया वेगळ्या शब्दात विचारा.",
      notConfigured:
        "❌ AI सेवा कॉन्फिगर केलेली नाही. कृपया सपोर्टशी संपर्क साधा.",
      default: "❌ माफ करा, एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",
    },
    hi: {
      apiKey: "❌ AI सेवा कॉन्फ़िगरेशन त्रुटि। कृपया सपोर्ट से संपर्क करें।",
      quota:
        "❌ बहुत अधिक अनुरोध। कृपया कुछ देर प्रतीक्षा करें और पुनः प्रयास करें।",
      blocked:
        "❌ आपका संदेश प्रोसेस नहीं हो सका। कृपया दूसरे शब्दों में पूछें।",
      notConfigured:
        "❌ AI सेवा कॉन्फ़िगर नहीं है। कृपया सपोर्ट से संपर्क करें।",
      default: "❌ क्षमा करें, एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
    },
  };

  const msgs = errorMessages[language] || errorMessages.en;

  if (message.includes("API key")) return msgs.apiKey;
  if (
    message.includes("quota") ||
    message.includes("rate") ||
    message.includes("429")
  )
    return msgs.quota;
  if (
    message.includes("blocked") ||
    message.includes("safety") ||
    message.includes("SAFETY")
  )
    return msgs.blocked;
  if (message.includes("not configured")) return msgs.notConfigured;

  return msgs.default;
};

/**
 * Get current model info
 */
const getModelInfo = () => {
  return {
    model: GEMINI_MODEL,
    configured: isConfigured(),
    supportedLanguages: getSupportedLanguages(),
  };
};

module.exports = {
  generateResponse,
  getErrorMessage,
  isConfigured,
  getModelInfo,
  getSupportedLanguages,
  getLanguageInfo,
  SUPPORTED_LANGUAGES,
};
