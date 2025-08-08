// config/supabase.js
// AutoFlow Studio Supabase Configuration

// ⚠️ REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS ⚠️
const SUPABASE_CONFIG = {
  // Get these from: Supabase Dashboard > Settings > API
  SUPABASE_URL: 'https://gngpakwohqumvkalnykf.supabase.co',  // ← REPLACE THIS
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZ3Bha3dvaHF1bXZrYWxueWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Mjk4OTksImV4cCI6MjA2ODAwNTg5OX0.fbzmVaX3t_NSIA6dvLLYTTSpP3Z-RV_mXn5PLDe0aPM',  // ← REPLACE THIS
  
  // Table names (don't change these)
  TABLES: {
    LIVE_CHATS: 'live_chats',
    TYPING_STATUS: 'typing_status',
    AGENT_STATUS: 'agent_status'
  },
  
  // Storage configuration
  STORAGE: {
    CHAT_FILES_BUCKET: 'chat-files'
  },
  
  // Real-time channel configuration
  REALTIME: {
    CHANNEL_NAME: 'live_chats',
    EVENT_TYPES: {
      INSERT: 'INSERT',
      UPDATE: 'UPDATE',
      DELETE: 'DELETE'
    }
  }
};

// Telegram Bot Configuration (optional - for human support)
const TELEGRAM_CONFIG = {
  // Replace these if you want Telegram integration
  BOT_TOKEN: '7560235553:AAEFZjJPAaa7-ME30g5AgAOG_WW7UswIvQc',
  SUPPORT_CHAT_ID: '-1002740993419',
  WEBHOOK_URL: 'https://gngpakwohqumvkalnykf.supabase.co/functions/v1/telegram-webhook'
};

// AI Assistant Configuration
const AI_ASSISTANT_CONFIG = {
  ENDPOINT: 'https://gngpakwohqumvkalnykf.supabase.co/functions/v1/telegram-webhook?ai=true',
  FALLBACK_TO_DEFAULT: true  // Fallback to default response on errors
};

// Export configuration for use in your application
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    SUPABASE_CONFIG,
    TELEGRAM_CONFIG,
    AI_ASSISTANT_CONFIG
  };
} else {
  // Browser environment
  window.AUTOFLOW_CONFIG = {
    SUPABASE_CONFIG,
    TELEGRAM_CONFIG,
    AI_ASSISTANT_CONFIG
  };
}

// Function to validate configuration
function validateConfig() {
  const errors = [];
  
  // Check Supabase configuration
  if (!SUPABASE_CONFIG.SUPABASE_URL || SUPABASE_CONFIG.SUPABASE_URL.includes('your-project-id')) {
    errors.push('❌ SUPABASE_URL is not configured - update with your actual project URL');
  }
  
  if (!SUPABASE_CONFIG.SUPABASE_ANON_KEY || SUPABASE_CONFIG.SUPABASE_ANON_KEY.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')) {
    errors.push('❌ SUPABASE_ANON_KEY is not configured - update with your actual anon key');
  }
  
  if (errors.length > 0) {
    console.warn('⚠️ Configuration errors found:');
    errors.forEach(error => console.warn(error));
    console.warn('👉 Update your credentials in config/supabase.js');
    return false;
  }
  
  console.log('✅ Configuration validated successfully');
  return true;
}

// Auto-validate configuration when loaded
if (typeof window !== 'undefined') {
  // Wait a bit for page to load, then validate
  setTimeout(() => {
    validateConfig();
    
    // Show helpful message in console
    console.log(`
🚀 AutoFlow Studio Chatbot Configuration Loaded

📡 Supabase URL: ${SUPABASE_CONFIG.SUPABASE_URL}
🔑 Anon Key: ${SUPABASE_CONFIG.SUPABASE_ANON_KEY.substring(0, 20)}...
💾 Storage Bucket: ${SUPABASE_CONFIG.STORAGE.CHAT_FILES_BUCKET}
🤖 AI Assistant: ${AI_ASSISTANT_CONFIG.ENDPOINT}

🔧 To test your setup:
1. Open your chatbot
2. Try uploading a file
3. Check browser console for any errors
4. Verify files appear in Supabase Storage
5. Run testAIAssistant() to test AI connection

📞 Need help? Check the troubleshooting guide.
    `);
  }, 1000);
}