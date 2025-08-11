// AutoFlow Studio - Tools JavaScript
// Handles FAB tools menu and pricing calculator + Enhanced Chatbot
// CLEANED VERSION: Removed online indicator and duplicate attachment functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeToolsFAB();
    initializePricingCalculator();
    initializeEnhancedChatbot(); // Only this function is enhanced
});

/**
 * Initialize the floating action button (FAB) tools menu
 * PRESERVED EXACTLY AS YOUR ORIGINAL
 */
function initializeToolsFAB() {
    // DOM Elements
    const toolsContainer = document.getElementById('tools-fab-container');
    const mainFab = document.getElementById('main-fab');
    const openCalculatorBtn = document.getElementById('open-calculator-btn');
    const openChatbotBtn = document.getElementById('open-chatbot-btn');
    
    if (!toolsContainer || !mainFab) return;
    
    // State
    let isMenuOpen = false;
    
    /**
     * Toggle the tools menu
     */
    function toggleToolsMenu() {
        isMenuOpen = !isMenuOpen;
        toolsContainer.classList.toggle('menu-open', isMenuOpen);
        
        // Update ARIA attributes
        mainFab.setAttribute('aria-expanded', isMenuOpen);
        mainFab.setAttribute('aria-label', isMenuOpen ? 'Close tools menu' : 'Open tools menu');
        
        // Announce to screen readers
        const announcement = isMenuOpen ? 'Tools menu opened' : 'Tools menu closed';
        announceToScreenReader(announcement);
    }
    
    /**
     * Close the tools menu
     */
    function closeToolsMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            toolsContainer.classList.remove('menu-open');
            mainFab.setAttribute('aria-expanded', 'false');
            mainFab.setAttribute('aria-label', 'Open tools menu');
        }
    }
    
    // Event Listeners
    mainFab.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleToolsMenu();
    });
    
    // Keyboard support for main FAB
    mainFab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleToolsMenu();
        } else if (e.key === 'Escape' && isMenuOpen) {
            closeToolsMenu();
        }
    });
    
    // Tool item clicks
    if (openCalculatorBtn) {
        openCalculatorBtn.addEventListener('click', () => {
            showModal('calculator-modal-overlay');
            closeToolsMenu();
        });
        
        openCalculatorBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showModal('calculator-modal-overlay');
                closeToolsMenu();
            }
        });
    }
    
    if (openChatbotBtn) {
        openChatbotBtn.addEventListener('click', () => {
            showModal('chatbot-modal-overlay');
            closeToolsMenu();
        });
        
        openChatbotBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showModal('chatbot-modal-overlay');
                closeToolsMenu();
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toolsContainer.contains(e.target)) {
            closeToolsMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeToolsMenu();
            mainFab.focus();
        }
    });
    
    // Set initial ARIA attributes
    mainFab.setAttribute('aria-expanded', 'false');
    mainFab.setAttribute('aria-label', 'Open tools menu');
    mainFab.setAttribute('role', 'button');
    mainFab.setAttribute('tabindex', '0');
    
    // Set tool item attributes
    const toolItems = toolsContainer.querySelectorAll('.tool-item');
    toolItems.forEach((item, index) => {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', item.querySelector('.tool-label').textContent);
    });
}

/**
 * Initialize the pricing calculator (Latest Logic + Exact Design)
 * PRESERVED EXACTLY AS YOUR ORIGINAL
 */
function initializePricingCalculator() {
    // DOM Elements
    const calculatorModalOverlay = document.getElementById('calculator-modal-overlay');
    const closeCalculatorBtn = document.getElementById('close-calculator-modal-btn');
    const proceedButton = document.getElementById('proceed-button');
    const form = document.getElementById('pricing-calculator-form');
    
    // Form elements (Latest Logic Structure)
    const teamSizeEl = document.getElementById('team-size');
    const numTasksEl = document.getElementById('num-tasks');
    const taskComplexityEl = document.getElementById('task-complexity');
    const managementOptionEl = document.getElementById('management-option');
    const supportPlanEl = document.getElementById('support-plan');
    
    // Display elements
    const oneTimePriceEl = document.getElementById('one-time-price');
    const monthlyPriceContainerEl = document.getElementById('monthly-price-container');
    const monthlyPriceEl = document.getElementById('monthly-price');
    
    if (!form) return;
    
    // LATEST PRICING STRUCTURE
    const pricing = {
        // Team size multipliers
        teamMultipliers: {
            'solo': 1,        // 1-5 People
            'growing': 1.25,  // 6-25 People  
            'established': 1.75 // 26-99 People
        },
        
        // Task complexity pricing (per task)
        taskPricing: {
            'simple': 100,    // Simple Syncs
            'smart': 250,     // Smart Workflows
            'advanced': 400   // Advanced Solutions
        },
        
        // One-time add-ons
        addons: {
            sheetsControls: 150,      // Google Sheets Controls
            customDashboard: 350      // Custom Dashboard/UI
        },
        
        // Monthly costs
        monthly: {
            supportPlan: 50  // Optional Support Plan (reduced from 109 to 50)
        }
    };
    
    /**
     * Calculate and update the price with latest logic
     */
    function calculatePrice() {
        if (!teamSizeEl || !numTasksEl || !taskComplexityEl || !managementOptionEl) return;
        
        const teamSize = teamSizeEl.value;
        const numTasks = parseInt(numTasksEl.value || '1', 10);
        const taskComplexity = taskComplexityEl.value;
        const managementOption = managementOptionEl.value;
        const hasSupportPlan = supportPlanEl?.checked || false;
        
        // Calculate base task cost
        const taskPrice = pricing.taskPricing[taskComplexity];
        const teamMultiplier = pricing.teamMultipliers[teamSize];
        
        // Core cost: (tasks × task price) × team multiplier
        const coreCost = (numTasks * taskPrice) * teamMultiplier;
        
        // One-time total
        let oneTimeTotal = coreCost;
        if (managementOption === 'sheets-controls') {
            oneTimeTotal += pricing.addons.sheetsControls;
        } else if (managementOption === 'custom-dashboard') {
            oneTimeTotal += pricing.addons.customDashboard;
        }
        
        // Monthly total
        let monthlyTotal = 0;
        if (hasSupportPlan) {
            monthlyTotal += pricing.monthly.supportPlan;
        }
        
        // Update display
        if (oneTimePriceEl) {
            oneTimePriceEl.textContent = `€${oneTimeTotal.toLocaleString('en-US')}`;
        }
        
        // Show/hide monthly price
        if (monthlyPriceContainerEl) {
            if (monthlyTotal > 0) {
                monthlyPriceContainerEl.style.display = 'block';
                if (monthlyPriceEl) {
                    monthlyPriceEl.textContent = `€${monthlyTotal} / month`;
                }
            } else {
                monthlyPriceContainerEl.style.display = 'none';
            }
        }
        
        // Announce price change to screen readers
        announceToScreenReader(`Price updated to ${oneTimeTotal} euros one-time${monthlyTotal > 0 ? ` plus ${monthlyTotal} euros monthly` : ''}`);
        
        return { oneTime: oneTimeTotal, monthly: monthlyTotal };
    }
    
    // Event Listeners
    if (form) {
        form.addEventListener('input', calculatePrice);
        form.addEventListener('change', calculatePrice);
    }
    
    // Add input validation for task number
    if (numTasksEl) {
        numTasksEl.addEventListener('input', (e) => {
            let value = parseInt(e.target.value, 10);
            
            if (isNaN(value) || value < 1) {
                e.target.value = 1;
            } else if (value > 10) {
                e.target.value = 10;
                if (window.AutoFlowStudio?.showNotification) {
                    window.AutoFlowStudio.showNotification(
                        'Maximum 10 tasks allowed for instant quote', 
                        'info'
                    );
                }
            }
            calculatePrice(); // Recalculate when tasks change
        });
    }
    
    if (closeCalculatorBtn) {
        closeCalculatorBtn.addEventListener('click', () => {
            hideModal('calculator-modal-overlay');
        });
    }
    
    if (calculatorModalOverlay) {
        calculatorModalOverlay.addEventListener('click', (e) => {
            if (e.target === calculatorModalOverlay) {
                hideModal('calculator-modal-overlay');
            }
        });
    }
    
    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            hideModal('calculator-modal-overlay');
            // The Calendly link will open automatically
        });
    }
    
    // Initialize with default calculation
    calculatePrice();
}

/**
 * ENHANCED Initialize the chatbot with professional features
 * CLEANED VERSION: Removed online indicator and duplicate attachment functionality
 */
/**
 * MINIMAL FIXES to your existing chatbot - ONLY addressing ghost users
 * KEEPING: All your working real-time logic, message deduplication, subscription handling
 * ADDING: Simple session cleanup to prevent ghost users in Telegram
 */
function initializeEnhancedChatbot() {
    const chatbotModalOverlay = document.getElementById('chatbot-modal-overlay');
    const closeChatbotBtn = document.getElementById('close-chatbot-modal-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input-area input');
    const chatSendBtn = document.querySelector('.chat-send-btn');
    
    if (!chatbotModalOverlay) return;
    
    // UNCHANGED: Keep your existing instance prevention logic
    if (window.AUTOFLOW_CHATBOT_INSTANCE) {
        console.log('🔄 Chatbot instance already exists, destroying and recreating...');
        if (window.AUTOFLOW_CHATBOT_INSTANCE.cleanup) {
            try {
                window.AUTOFLOW_CHATBOT_INSTANCE.cleanup().catch(e => 
                    console.log('⚠️ Async cleanup error:', e)
                );
            } catch (e) {
                console.log('⚠️ Cleanup error:', e);
            }
        }
        delete window.AUTOFLOW_CHATBOT_INSTANCE;
        console.log('✅ Previous instance destroyed');
    }
    
    console.log('🚀 Initializing NEW chatbot instance...');
    
    // UNCHANGED: Keep your existing state variables
    let userId = null;
    let supabaseClient = null;
    let isHumanMode = false;
    let currentStep = 'welcome';
    let typingTimeout = null;
    let isUserTyping = false;
    let lastActivity = Date.now();
    
    // MINIMAL ADDITION: Just add session tracking
    let sessionActive = false;
    let heartbeatInterval = null;
    
    // UNCHANGED: Keep your existing chatbot instance structure, just add minimal cleanup
    const chatbotInstance = {
        activeSubscription: null,
        messageSet: new Set(),
        isInitialized: false,
        lastMessageTime: 0, // Keep your existing rate limiting
        cleanup: async function() {
            console.log('🧹 AGGRESSIVE CLEANUP: Destroying all subscriptions...');
            
            // MINIMAL ADDITION: Stop heartbeat and mark session inactive
            if (heartbeatInterval) {
                clearInterval(heartbeatInterval);
                heartbeatInterval = null;
            }
            
            // MINIMAL ADDITION: Mark session as inactive to prevent ghost users
            if (sessionActive && userId && supabaseClient) {
                try {
                    await supabaseClient
                        .from('live_chats')
                        .update({ is_active: false })
                        .eq('user_id', userId)
                        .eq('is_active', true);
                    console.log('✅ Session marked as inactive');
                } catch (e) {
                    console.log('⚠️ Session cleanup error:', e);
                }
            }
            
            // UNCHANGED: Keep your existing cleanup logic
            if (this.activeSubscription) {
                try {
                    await this.activeSubscription.unsubscribe();
                    console.log('✅ Subscription unsubscribed');
                } catch (e) {
                    console.log('⚠️ Subscription cleanup error:', e);
                }
                this.activeSubscription = null;
            }
            if (supabaseClient) {
                try {
                    await supabaseClient.removeAllChannels();
                    console.log('✅ All channels removed');
                } catch (e) {
                    console.log('⚠️ Channel cleanup error:', e);
                }
            }
            this.messageSet.clear();
            this.isInitialized = false;
            sessionActive = false; // MINIMAL ADDITION
            console.log('✅ Aggressive cleanup complete');
        }
    };
    
    // Set global instance
    window.AUTOFLOW_CHATBOT_INSTANCE = chatbotInstance;
    
    // UNCHANGED: Keep your existing Supabase configuration
    const SUPABASE_URL = window.AUTOFLOW_CONFIG?.SUPABASE_CONFIG?.SUPABASE_URL || null;
    const SUPABASE_ANON_KEY = window.AUTOFLOW_CONFIG?.SUPABASE_CONFIG?.SUPABASE_ANON_KEY || null;
    
    // UNCHANGED: Keep your existing user ID initialization
    function initializeUserId() {
        userId = localStorage.getItem('chatbot_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('chatbot_user_id', userId);
        }
        console.log('🆔 User ID:', userId);
    }
    
    // MINIMAL ADDITION: Simple heartbeat to keep session alive (prevents ghost users)
    function startHeartbeat() {
        if (heartbeatInterval) return;
        
        heartbeatInterval = setInterval(async () => {
            if (!sessionActive || !supabaseClient || !userId) return;
            
            try {
                // Simple heartbeat - just update timestamp
                await supabaseClient
                    .from('live_chats')
                    .insert([{
                        user_id: userId,
                        from_user: 'heartbeat',
                        message: 'session_active',
                        timestamp: new Date().toISOString(),
                        is_active: true
                    }]);
                
                console.log('💓 Heartbeat sent');
            } catch (error) {
                console.error('❌ Heartbeat error:', error);
            }
        }, 3 * 60 * 1000); // Every 3 minutes
    }

    // UNCHANGED: Keep your ENTIRE existing Supabase initialization logic
    async function initializeSupabase() {
        try {
            let createClientFn = window.supabase?.createClient;
            
            if (createClientFn && SUPABASE_URL && SUPABASE_ANON_KEY) {
                console.log('🔗 Creating Supabase client...');
                
                // UNCHANGED: Keep your existing cleanup logic
                await chatbotInstance.cleanup();
                await new Promise(resolve => setTimeout(resolve, 100));
                
                supabaseClient = createClientFn(SUPABASE_URL, SUPABASE_ANON_KEY);
                
                // UNCHANGED: Keep your existing initialization check
                if (chatbotInstance.isInitialized) {
                    console.log('⚠️ Already initialized, skipping subscription setup');
                    return;
                }
                
                console.log('📡 Setting up SINGLE real-time subscription for user:', userId);
                
                // UNCHANGED: Keep your existing channel creation
                const channelName = `live_chat_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // UNCHANGED: Keep your ENTIRE existing subscription logic
                const subscriptionPromise = new Promise((resolve, reject) => {
                    const subscription = supabaseClient
                        .channel(channelName, {
                            config: {
                                broadcast: { self: false },
                                presence: { key: userId }
                            }
                        })
                        .on('postgres_changes', {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'live_chats',
                            filter: `user_id=eq.${userId}` // Only current user
                        }, (payload) => {
                            
                            // UNCHANGED: Keep your ENTIRE existing message handling logic
                           if (!chatbotInstance.isInitialized) {
                           console.log('⚠️ Chatbot not initialized, ignoring message');
                           return;
                           }

                           const message = payload.new;
                           const messageId = message.id;
                           const messageContent = message.message;
                           const now = Date.now();

                           // AGGRESSIVE: Rate limiting
                           if (now - chatbotInstance.lastMessageTime < 2000) { // Increased to 2 seconds
    console.log('⏭️ RATE LIMITED: Message too soon, skipping');
    return;
                           }

                           console.log('🔥 Real-time event for message ID:', messageId);
                           console.log('📝 Message content:', messageContent);

                           // 1. ID-based duplicate check
                           if (chatbotInstance.messageSet.has(messageId)) {
    console.log('⏭️ DUPLICATE DETECTED (ID already processed), skipping');
    return;
                           } 

                           // 2. DOM-based duplicate check
                           if (document.querySelector(`[data-msg-id="${messageId}"]`)) {
    console.log('⏭️ DUPLICATE DETECTED (ID in DOM), skipping');
    chatbotInstance.messageSet.add(messageId);
    return;
                           }

                           // 3. AGGRESSIVE: Content-based duplicate check
                           const recentMessages = Array.from(document.querySelectorAll('.message.received'))
                           .slice(-5) // Check last 5 received messages
                           .map(el => el.textContent?.trim().replace(/\s+/g, ' '));

                           const cleanContent = messageContent.trim().replace(/\s+/g, ' ');
                           if (recentMessages.includes(cleanContent)) {
    console.log('⏭️ DUPLICATE DETECTED (Same content found in recent messages), skipping');
    console.log('🔍 Duplicate content:', cleanContent);
    chatbotInstance.messageSet.add(messageId); // Mark as seen anyway
    return;
                           }

                           // 4. ULTRA-AGGRESSIVE: Global content cache
                           if (!window.chatbotContentCache) {
    window.chatbotContentCache = new Set();
                           }

                           const contentKey = `${messageContent}_${message.from_user}_${message.user_id}`;
                            if (window.chatbotContentCache.has(contentKey)) {
    console.log('⏭️ DUPLICATE DETECTED (Global content cache), skipping');
    return;
                            }

                            // Add to cache and limit size
                            window.chatbotContentCache.add(contentKey);
                            if (window.chatbotContentCache.size > 20) {
    const firstItem = window.chatbotContentCache.values().next().value;
    window.chatbotContentCache.delete(firstItem);
                            }
                            
                            // UNCHANGED: Keep your existing filtering logic
                            if (message.user_id === userId && 
                                message.from_user === 'human' && 
                                isHumanMode) {
                                
                                console.log('✅ DISPLAYING UNIQUE MESSAGE:', message.message);
                                
                                // UNCHANGED: Keep your existing marking logic
                                chatbotInstance.messageSet.add(messageId);
                                chatbotInstance.lastMessageTime = now;
                                
                                // Add message
                                const messageElement = addMessage(message.message, false, 'human');
                                
                                // UNCHANGED: Keep your existing tracking
                                if (messageElement) {
                                    messageElement.setAttribute('data-msg-id', messageId);
                                    messageElement.setAttribute('data-processed', 'true');
                                }
                            } else {
                                console.log('❌ Message filtered out:', {
                                    userMatch: message.user_id === userId,
                                    isHuman: message.from_user === 'human',
                                    inHumanMode: isHumanMode
                                });
                            }
                        })
                        .subscribe((status, err) => {
                            console.log('📡 Subscription status:', status, 'for:', channelName);
                            if (status === 'SUBSCRIBED') {
                                console.log('🎯 REAL-TIME READY!');
                                chatbotInstance.isInitialized = true;
                                sessionActive = true; // MINIMAL ADDITION: Mark session as active
                                startHeartbeat(); // MINIMAL ADDITION: Start heartbeat
                                resolve(subscription);
                            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                                reject(new Error(`Subscription failed: ${status}`));
                            }
                            if (err) {
                                console.error('❌ Subscription error:', err);
                                reject(err);
                            }
                        });
                    
                    // UNCHANGED: Keep your existing timeout
                    setTimeout(() => {
                        if (!chatbotInstance.isInitialized) {
                            reject(new Error('Subscription timeout'));
                        }
                    }, 10000);
                });
                
                try {
                    chatbotInstance.activeSubscription = await subscriptionPromise;
                    console.log('✅ Single real-time setup complete');
                } catch (error) {
                    console.error('❌ Subscription setup failed:', error);
                    chatbotInstance.isInitialized = false;
                }
                
            } else {
                console.log('📱 Running in offline mode');
            }
        } catch (error) {
            console.error('❌ Supabase initialization error:', error);
            chatbotInstance.isInitialized = false;
        }
    }
    
    // UNCHANGED: Keep ALL your existing UI functions (typing indicators, etc.)
    function showTypingIndicator(fromUser = 'agent') {
        hideTypingIndicator(fromUser); // Remove existing first
        
        const typingIndicator = document.createElement('div');
        typingIndicator.id = `typing-indicator-${fromUser}`;
        typingIndicator.className = 'message received typing';
        typingIndicator.innerHTML = `
    <p style="display: flex; align-items: center; gap: 8px;">
        <span>${fromUser === 'agent' ? '👤 Support' : '🤖 AI Assistant'} is typing</span>
        <span class="typing-dots">
            <span></span><span></span><span></span>
        </span>
    </p>
`;
        
        chatMessages.appendChild(typingIndicator);
        window.smoothScrollToBottom(chatMessages);
    }
    
    function hideTypingIndicator(fromUser = 'agent') {
        const indicator = document.getElementById(`typing-indicator-${fromUser}`);
        if (indicator) {
            indicator.remove();
        }
    }
    
    // UNCHANGED: Keep your existing storeMessage function, just add session marking
    async function storeMessage(message, fromUser, metadata = null) {
        if (!supabaseClient || !userId) return;
        
        try {
            const messageData = {
                user_id: userId,
                from_user: fromUser,
                message: message,
                timestamp: new Date().toISOString(),
                is_active: true
            };
            
            if (metadata) {
                messageData.metadata = metadata;
            }
            
            const { error } = await supabaseClient
                .from('live_chats')
                .insert([messageData]);
            
            if (error) throw error;
        } catch (error) {
            console.error('Error storing message:', error);
        }
    }
    
    // --- UPDATED addMessage FUNCTION ---
function addMessage(message, isUser = false, fromType = 'bot') {
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'sent' : 'received'}`;

    // Check if the message is an image URL
    const isImage = typeof message === 'string' && (message.startsWith('http') && /\.(jpg|jpeg|png|gif)$/i.test(message));

    if (isImage) {
        // If it's an image, create an <img> element
        const p = document.createElement('p');
        const img = document.createElement('img');
        img.src = message;
        img.alt = isUser ? "Uploaded by you" : "Image from support";
        img.style.cssText = `max-width: 250px; width: 100%; height: auto; border-radius: 12px; display: block;`;
        p.appendChild(img);
        messageDiv.appendChild(p);
    } else {
        // Otherwise, treat it as a regular text message
        const messageContent = document.createElement('p');
        const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        messageContent.innerHTML = formattedMessage;
        messageDiv.appendChild(messageContent);

        if (fromType === 'human') {
            messageContent.style.background = 'linear-gradient(135deg, #059669, #047857)';
            messageContent.style.color = 'white';
            messageContent.style.borderRadius = '15px 15px 15px 0';
            messageDiv.style.justifyContent = 'flex-start';
            const humanIndicator = document.createElement('small');
            humanIndicator.textContent = '👤';
            humanIndicator.style.cssText = 'color: #6b7280; font-size: 0.75rem; margin-bottom: 5px; display: block;';
            messageDiv.insertBefore(humanIndicator, messageContent);
        }
    }

    chatMessages.appendChild(messageDiv);
    window.smoothScrollToBottom(chatMessages);

    // Store the message (URL or text) in Supabase, but only if it's the user sending it
    if (isUser && supabaseClient && userId) {
        storeMessage(message, 'user');
    }

    if (!isUser && !isImage) {
        announceToScreenReader(`${fromType === 'human' ? 'Human Support' : 'AI Assistant'} says: ${message}`);
    }

    return messageDiv;
}
    
    // UNCHANGED: Keep your ENTIRE existing QA tree and buttons logic
    // REPLACE your existing qaTree object with this comprehensive version:

const qaTree = {
    welcome: {
        message: "🤖 Hi! I'm here to help you with automation solutions. What would you like to know?",
        buttons: [
            { text: "🤖 I want an automation", action: "automation" },
            { text: "💰 Pricing & Costs", action: "pricing" },
            { text: "⚙️ Technical Support", action: "technical" },
            { text: "ℹ️ General Questions", action: "general" }
        ]
    },

    // AUTOMATION PATH
    automation: {
        message: "Great! What type of automation are you looking for?",
        buttons: [
            { text: "📊 Google Sheets Automation", action: "sheets_automation" },
            { text: "🤖 AI Chatbot", action: "ai_chatbot" },
            { text: "🔄 Process Automation", action: "process_automation" },
            { text: "🎯 Custom Solution", action: "custom_solution" },
            { text: "🤔 Not sure what I need", action: "automation_help" }
        ]
    },

    sheets_automation: {
        message: "📊 **Google Sheets Automation** - Transform your spreadsheets into powerful databases!\n\n**What we can automate:**\n• Data sync between apps\n• Automated workflows\n• Custom functions\n• Report generation\n\n**Starting from €100**\n\nWhat specific Sheets task would you like to automate?",
        buttons: [
            { text: "💬 Discuss my needs", action: "connect_human" },
            { text: "📅 Book consultation", action: "book_consultation" },
            { text: "🔙 Back to automation types", action: "automation" }
        ]
    },

    ai_chatbot: {
        message: "🤖 **AI Chatbots** - Perfect for customer support and lead qualification!\n\n**Features:**\n• GPT-powered responses\n• 24/7 availability\n• Custom knowledge base\n• Multi-platform integration\n\n**Starting from €250**\n\nWhat would your chatbot help with?",
        buttons: [
            { text: "💼 Customer support", action: "chatbot_support" },
            { text: "🎯 Lead qualification", action: "chatbot_leads" },
            { text: "📚 Knowledge base", action: "chatbot_knowledge" },
            { text: "💬 Discuss requirements", action: "connect_human" }
        ]
    },

    process_automation: {
        message: "🔄 **Process Automation** - Eliminate manual tasks and boost efficiency!\n\n**Popular automations:**\n• Email workflows\n• Data entry\n• File processing\n• API integrations\n\n**Starting from €100**\n\nWhat process takes up most of your time?",
        buttons: [
            { text: "📧 Email automation", action: "email_automation" },
            { text: "📁 File processing", action: "file_automation" },
            { text: "🔗 App integrations", action: "integration_automation" },
            { text: "💬 Describe my process", action: "connect_human" }
        ]
    },

    custom_solution: {
        message: "🎯 **Custom Solutions** - We build exactly what you need!\n\n**Our process:**\n1. Free consultation & audit\n2. Custom solution design\n3. Build & test (under 7 days)\n4. Deploy & train your team\n\n**Investment: €100-400+ depending on complexity**\n\nReady to discuss your unique requirements?",
        buttons: [
            { text: "📅 Book free audit", action: "book_consultation" },
            { text: "💬 Describe my needs", action: "connect_human" },
            { text: "💰 Get price estimate", action: "pricing_calculator" }
        ]
    },

    automation_help: {
        message: "🤔 **No worries!** Let me help you identify the best automation for your needs.\n\n**Answer this:** What task do you do repeatedly that feels like a waste of time?",
        buttons: [
            { text: "📊 Managing spreadsheets", action: "sheets_automation" },
            { text: "📧 Sending emails", action: "email_automation" },
            { text: "💬 Answering customer questions", action: "ai_chatbot" },
            { text: "📋 Data entry", action: "process_automation" },
            { text: "🤷 Something else", action: "connect_human" }
        ]
    },

    // PRICING PATH
    pricing: {
        message: "💰 **Our Pricing Structure:**\n\n🟢 **Simple Syncs:** €100/task\n🟡 **Smart Workflows:** €250/task\n🔴 **Advanced Solutions:** €400/task\n\n**+ Optional:**\n• Google Sheets Dashboard: +€150\n• Custom Dashboard: +€350\n• Monthly Support: €50/month\n\n**All projects delivered in under 7 days!**",
        buttons: [
            { text: "🧮 Calculate my price", action: "pricing_calculator" },
            { text: "❓ What's the difference?", action: "pricing_explained" },
            { text: "📅 Get custom quote", action: "book_consultation" },
            { text: "💬 Discuss pricing", action: "connect_human" }
        ]
    },

    pricing_explained: {
        message: "📋 **Pricing Breakdown:**\n\n🟢 **Simple Syncs (€100):**\nBasic data transfer between two apps\n*Example: Gmail → Google Sheets*\n\n🟡 **Smart Workflows (€250):**\nInvolves AI, conditions, or data processing\n*Example: AI email categorization*\n\n🔴 **Advanced Solutions (€400):**\nWeb scraping, custom APIs, complex logic\n*Example: Automated lead generation*",
        buttons: [
            { text: "🧮 Calculate my project", action: "pricing_calculator" },
            { text: "💬 Discuss my needs", action: "connect_human" },
            { text: "🔙 Back to pricing", action: "pricing" }
        ]
    },

    // TECHNICAL SUPPORT PATH
    technical: {
        message: "⚙️ **Technical Support** - How can I help you?",
        buttons: [
            { text: "🔧 My automation isn't working", action: "automation_broken" },
            { text: "📝 I need help with setup", action: "setup_help" },
            { text: "🔄 Request modifications", action: "modification_request" },
            { text: "📚 Documentation/Training", action: "documentation" },
            { text: "🆘 Emergency support", action: "emergency_support" }
        ]
    },

    automation_broken: {
        message: "🔧 **Automation Issue** - I'll connect you with our technical team immediately.\n\n**Please prepare:**\n• Description of the problem\n• When it started happening\n• Any error messages\n• Screenshots if possible\n\n**Our support team typically responds within 2 hours.**",
        buttons: [
            { text: "💬 Report the issue", action: "connect_human" },
            { text: "📧 Email support", action: "email_support" },
            { text: "🔙 Back to technical", action: "technical" }
        ]
    },

    setup_help: {
        message: "📝 **Setup Assistance** - Need help getting your automation running?\n\n**We provide:**\n• Step-by-step guidance\n• Screen sharing sessions\n• Complete setup service\n• Team training\n\n**Most setups take 15-30 minutes with our help.**",
        buttons: [
            { text: "💬 Get setup help", action: "connect_human" },
            { text: "📅 Schedule setup call", action: "book_consultation" },
            { text: "📚 View documentation", action: "documentation" }
        ]
    },

    // GENERAL QUESTIONS PATH  
    general: {
        message: "ℹ️ **General Questions** - What would you like to know?",
        buttons: [
            { text: "🏢 About AutoFlow Studio", action: "about_company" },
            { text: "⏰ How long does it take?", action: "timeline" },
            { text: "🛡️ Security & Privacy", action: "security" },
            { text: "🎯 Success stories", action: "case_studies" },
            { text: "🤝 How we work", action: "process" }
        ]
    },

    about_company: {
        message: "🏢 **About AutoFlow Studio**\n\nWe're automation specialists who help startups and growing businesses eliminate manual work.\n\n**Founded on the belief that:**\n• Technology should work FOR you\n• Time is your most valuable asset\n• Every business deserves custom solutions\n\n**We've automated 1000+ hours of work for our clients!**",
        buttons: [
            { text: "🎯 See our work", action: "case_studies" },
            { text: "💬 Start a project", action: "automation" },
            { text: "🔙 Back to general", action: "general" }
        ]
    },

    timeline: {
        message: "⏰ **Project Timeline:**\n\n**Day 1-2:** Requirements & design\n**Day 3-5:** Build & test\n**Day 6-7:** Deploy & train\n\n**Most projects delivered in under 7 days!**\n\n**Rush jobs available for urgent needs.**",
        buttons: [
            { text: "📅 Start my project", action: "book_consultation" },
            { text: "🚨 I need it urgently", action: "connect_human" },
            { text: "🔙 Back to general", action: "general" }
        ]
    },

    // SPECIFIC AUTOMATION TYPES
    email_automation: {
        message: "📧 **Email Automation** - Stop spending hours on email!\n\n**Popular solutions:**\n• Auto-respond to inquiries\n• Lead nurturing sequences\n• Follow-up reminders\n• Email sorting & filing\n\n**Starting from €150**",
        buttons: [
            { text: "💬 Discuss my email needs", action: "connect_human" },
            { text: "📅 Book consultation", action: "book_consultation" },
            { text: "🔙 Back to automations", action: "automation" }
        ]
    },

    chatbot_support: {
        message: "💼 **Customer Support Chatbot**\n\n**Perfect for:**\n• 24/7 customer service\n• FAQ automation\n• Ticket routing\n• Order status updates\n\n**Features:**\n✅ Instant responses\n✅ Human handoff\n✅ Multiple platforms\n✅ Analytics dashboard",
        buttons: [
            { text: "💬 Plan my support bot", action: "connect_human" },
            { text: "📅 Book consultation", action: "book_consultation" },
            { text: "🔙 Back to chatbots", action: "ai_chatbot" }
        ]
    },

    // ACTION ENDPOINTS
    connect_human: {
        message: "🤝 **Connecting you with our team...**\n\nA human expert will respond shortly. You can continue typing here and they'll see your messages.\n\n**Average response time: 15 minutes**",
        action: "human_handoff"
    },

    book_consultation: {
        message: "📅 **Ready to book your free consultation?**\n\nClick the button below to choose a time that works for you. Our automation experts will:\n\n✅ Audit your current processes\n✅ Identify automation opportunities  \n✅ Provide a custom solution plan\n✅ Give you an accurate quote\n\n**100% free, no commitment required!**",
        buttons: [
            { text: "📅 Book Free Consultation", action: "external_calendar" },
            { text: "💬 Ask questions first", action: "connect_human" }
        ]
    },

    pricing_calculator: {
        message: "🧮 **Price Calculator**\n\nUse our interactive calculator to get an instant estimate for your automation project.\n\n**Takes just 2 minutes!**",
        buttons: [
            { text: "🧮 Open Calculator", action: "open_calculator" },
            { text: "💬 Get custom quote", action: "connect_human" }
        ]
    },

    case_studies: {
        message: "🎯 **Success Stories**\n\n**Food Platform:** Saved 20 hours/week with photo automation\n**Sales Team:** 10X outreach volume with AI emails  \n**Support Team:** 70% of inquiries automated\n**Data Team:** 5-7X faster lead generation\n\n**Ready to see similar results?**",
        buttons: [
            { text: "📅 Start my project", action: "book_consultation" },
            { text: "💬 Discuss my goals", action: "connect_human" },
            { text: "🔙 Back to general", action: "general" }
        ]
    }
};
    
    // REPLACE your existing addButtons function with this enhanced version:

function addButtons(buttons, currentStep = null) {
    if (!chatMessages || !buttons) return;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'chat-buttons';
    buttonContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 10px 0;
        max-width: 80%;
    `;
    
    // Add main buttons
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.textContent = button.text;
        btn.style.cssText = `
            background: #f1f5f9;
            border: 2px solid #e5e7eb;
            border-radius: 20px;
            padding: 8px 16px;
            color: #374151;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            text-align: left;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#e91e63';
            btn.style.color = 'white';
            btn.style.borderColor = '#e91e63';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#f1f5f9';
            btn.style.color = '#374151';
            btn.style.borderColor = '#e5e7eb';
        });
        
        btn.addEventListener('click', () => {
            handleButtonClick(button.action, button.text);
            buttonContainer.remove();
        });
        
        buttonContainer.appendChild(btn);
    });
    
    // Add "Go Back" button (skip for welcome screen)
    if (currentStep !== 'welcome' && currentStep !== null) {
        const backBtn = document.createElement('button');
        backBtn.textContent = "🔙 Go Back";
        backBtn.style.cssText = `
            background: #f8fafc;
            border: 2px solid #cbd5e1;
            border-radius: 20px;
            padding: 8px 16px;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
            margin-top: 5px;
        `;
        
        backBtn.addEventListener('mouseenter', () => {
            backBtn.style.background = '#64748b';
            backBtn.style.color = 'white';
            backBtn.style.borderColor = '#64748b';
        });
        
        backBtn.addEventListener('mouseleave', () => {
            backBtn.style.background = '#f8fafc';
            backBtn.style.color = '#64748b';
            backBtn.style.borderColor = '#cbd5e1';
        });
        
        backBtn.addEventListener('click', () => {
            handleButtonClick('welcome', '🔙 Go Back');
            buttonContainer.remove();
        });
        
        buttonContainer.appendChild(backBtn);
    }
    
    // Add "Talk to human" button - PRESERVE THIS EXACTLY!
    const humanBtn = document.createElement('button');
    humanBtn.textContent = "👤 Talk to a human";
    humanBtn.style.cssText = `
        background: linear-gradient(135deg, #e91e63, #9c27b0);
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
        margin-top: 5px;
    `;
    
    // PRESERVE THIS EVENT LISTENER - calls your existing handleHumanRequest!
    humanBtn.addEventListener('click', () => {
        handleHumanRequest(); // This is your existing function!
        buttonContainer.remove();
    });
    
    buttonContainer.appendChild(humanBtn);
    chatMessages.appendChild(buttonContainer);
    window.smoothScrollToBottom(chatMessages);
        console.log('✅ Enhanced chatbot initialization complete');
    
    // Make AI functions globally available for testing
    window.tryAIResponse = tryAIResponse;
    window.callAIEndpoint = callAIEndpoint;
    
    // Initialize
    initializeUserId();
    initializeSupabase();
}
    // UNCHANGED: Keep your existing handleButtonClick function
// REPLACE your existing handleButtonClick function with this:

// REPLACE your existing handleButtonClick function with this enhanced version:

function handleButtonClick(action, buttonText) {
    addMessage(buttonText, true);
    showTypingIndicator('bot');
    
    setTimeout(() => {
        hideTypingIndicator('bot');
        
        // Handle special actions first (preserves existing human handoff)
        if (action === 'human_handoff' || action === 'connect_human') {
            handleHumanRequest(); // This calls your existing function!
            return;
        }
        
        if (action === 'external_calendar') {
            addMessage("📅 **Opening calendar...**\n\nRedirecting you to book your free consultation!");
            setTimeout(() => {
                window.open('https://autoflow.neetocal.com/meeting-with-auto-flow', '_blank');
                showCompletionMessage(); // Show completion after action
            }, 2000);
            return;
        }
        
        if (action === 'open_calculator') {
            addMessage("🧮 **Opening price calculator...**\n\nUse this tool to get an instant estimate!");
            setTimeout(() => {
                hideModal('chatbot-modal-overlay');
                showModal('calculator-modal-overlay');
                // Don't show completion message here since they're leaving the chat
            }, 1000);
            return;
        }
        
        if (action === 'email_support') {
            addMessage("📧 **Email Support**\n\nFor technical issues, email us at: **autoflowcompany2025@gmail.com**\n\nWe typically respond within 4 hours.");
            setTimeout(() => showCompletionMessage(), 1000);
            return;
        }
        
        // Handle standard tree navigation
        const response = qaTree[action];
        if (response) {
            addMessage(response.message);
            
            // Add buttons if they exist
            if (response.buttons) {
                setTimeout(() => addButtons(response.buttons, action), 500);
            } else {
                // No buttons = terminal node, show completion
                setTimeout(() => showCompletionMessage(), 1000);
            }
            
            // Handle special tree actions
            if (response.action === 'human_handoff') {
                setTimeout(() => handleHumanRequest(), 1000);
            }
        } else {
            // Fallback for unknown actions
            addMessage("I'm not sure about that. Let me connect you with our team who can help!");
            setTimeout(() => handleHumanRequest(), 1000);
        }
        
    }, 1000 + Math.random() * 1000);
}

// NEW: Completion message function
function showCompletionMessage() {
    setTimeout(() => {
        showTypingIndicator('bot');
        
        setTimeout(() => {
            hideTypingIndicator('bot');
            addMessage("✨ **Do you have anything else in mind?**\n\nI'm here to help with any other automation questions!");
            
            setTimeout(() => addButtons([
                { text: "🤖 Explore automations", action: "automation" },
                { text: "💰 Check pricing", action: "pricing" },
                { text: "ℹ️ General questions", action: "general" },
                { text: "🏠 Back to main menu", action: "welcome" }
            ], 'completion'), 500);
        }, 800);
    }, 1500);
}
    // UNCHANGED: Keep your existing handleHumanRequest function
    async function handleHumanRequest() {
        addMessage("👤 Talk to a human", true);
        showTypingIndicator('bot');
        
        setTimeout(async () => {
            hideTypingIndicator('bot');
            
            isHumanMode = true;
            console.log('🤝 Entering human mode for user:', userId);
            
            addMessage("🤝 **Connecting you with our team...**\n\nA human support agent will respond shortly. You can continue typing here and they'll see your messages.");
            
            // Send notification to Telegram
            await sendToTelegram(`🔔 **New Support Request**\n\nUser ID: ${userId}\nRequesting human support.\n\nRespond with: /reply ${userId} your message`);
            
            console.log('📢 Telegram notification sent');
            console.log('🔍 Watching for real-time messages...');
            
        }, 1000);
    }
    
    // UNCHANGED: Keep your existing sendToTelegram function
    async function sendToTelegram(message) {
        const TELEGRAM_BOT_TOKEN = window.AUTOFLOW_CONFIG?.TELEGRAM_CONFIG?.BOT_TOKEN;
        const TELEGRAM_CHAT_ID = window.AUTOFLOW_CONFIG?.TELEGRAM_CONFIG?.SUPPORT_CHAT_ID;
        
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            console.log('Telegram not configured - human request logged locally');
            return;
        }
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send to Telegram');
            }
        } catch (error) {
            console.error('Error sending to Telegram:', error);
        }
    }
    
    // REPLACE your existing sendMessage function with this updated version:

function sendMessage() {
    if (!chatInput) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Stop typing indicator
    if (isUserTyping) {
        isUserTyping = false;
        clearTimeout(typingTimeout);
    }
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    chatInput.value = '';
    
    // PRESERVE: Your existing human mode logic exactly as is
    if (isHumanMode) {
        // In human mode, just send to Telegram
        sendToTelegram(`💬 **User Message**\n\nUser ID: ${userId}\nMessage: ${message}\n\nRespond with: /reply ${userId} your message`);
        return;
    }
    
    // Show typing indicator
    showTypingIndicator('bot');
    
    // Handle response with delay
    setTimeout(() => {
        hideTypingIndicator('bot');
        
        const lowerMessage = message.toLowerCase();
        
        // PRESERVE: All your existing keyword logic exactly as is
        if (lowerMessage.includes('human') || lowerMessage.includes('agent') || lowerMessage.includes('support')) {
            handleHumanRequest();
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            addMessage("💰 Our automations start from €100. Use the pricing calculator for an instant estimate!");
            setTimeout(() => addButtons([
                { text: "🧮 Open Calculator", action: "open_calculator" },
                { text: "💬 Discuss pricing", action: "connect_human" },
                { text: "📅 Get custom quote", action: "book_consultation" }
            ], 'pricing'), 500);
        } else if (lowerMessage.includes('automation')) {
            addMessage("🤖 Great! What would you like to automate?");
            setTimeout(() => addButtons(qaTree.automation.buttons, 'automation'), 500);
        } else if (lowerMessage.includes('sheet') || lowerMessage.includes('excel')) {
            addMessage("📊 Google Sheets automation can transform your spreadsheets! What would you like to automate?");
            setTimeout(() => addButtons(qaTree.sheets_automation.buttons, 'sheets_automation'), 500);
        } else if (lowerMessage.includes('email') || lowerMessage.includes('mail')) {
            addMessage("📧 Email automation saves tons of time! What email tasks do you want to automate?");
            setTimeout(() => addButtons(qaTree.email_automation.buttons, 'email_automation'), 500);
        } else if (lowerMessage.includes('chatbot') || lowerMessage.includes('bot')) {
            addMessage("🤖 AI chatbots are perfect for customer support! What would your chatbot help with?");
            setTimeout(() => addButtons(qaTree.ai_chatbot.buttons, 'ai_chatbot'), 500);
        } else if (lowerMessage.includes('how long') || lowerMessage.includes('timeline') || lowerMessage.includes('when')) {
            addMessage("⏰ Most projects are delivered in under 7 days! Here's our typical timeline:");
            setTimeout(() => addButtons(qaTree.timeline.buttons, 'timeline'), 500);
        } else if (lowerMessage.includes('book') || lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
            addMessage("📅 Ready to get started? Let's book your free consultation:");
            setTimeout(() => addButtons(qaTree.book_consultation.buttons, 'book_consultation'), 500);
        } else {
            // NEW: Only change - try AI for unmatched messages
            console.log('🧠 No keyword match, trying AI for:', message);
            tryAIResponse(message);
        }
    }, 1500);
}
    // AI FUNCTIONS - Move inside chatbot scope for access to addMessage
async function tryAIResponse(userMessage) {
    console.log('🧠 Attempting AI response for:', userMessage);
    
    try {
        const aiResponse = await callAIEndpoint(userMessage);
        
        if (aiResponse && aiResponse.trim()) {
            console.log('✅ AI responded successfully');
            addMessage(`🤖 ${aiResponse}`);
            
            // Add helpful navigation buttons
            setTimeout(() => addButtons([
                { text: "💬 Talk to a human", action: "connect_human" },
                { text: "🤖 Explore automations", action: "automation" },
                { text: "💰 Check pricing", action: "pricing" },
                { text: "🏠 Main menu", action: "welcome" }
            ], 'ai_response'), 500);
            
        } else {
            throw new Error('Empty AI response');
        }
        
    } catch (error) {
        console.log('⚠️ AI failed, using default response:', error.message);
        
        // Fallback to existing default response
        addMessage("Thanks for your message! I can help you with automation questions. Here are some topics I can assist with:");
        setTimeout(() => addButtons(qaTree.welcome.buttons, 'welcome'), 1500);
    }
}

async function callAIEndpoint(message) {
    const userId = localStorage.getItem('chatbot_user_id') || 'web_user_' + Date.now();
    const endpoint = 'https://gngpakwohqumvkalnykf.supabase.co/functions/v1/telegram-webhook?ai=true';
    
    console.log('📡 Calling AI with simple format:', message);
    
    const payload = {
        message: message,
        userId: userId
    };
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    console.log('📥 Response:', responseText);
    
    if (!response.ok) {
        throw new Error(`AI failed: ${response.status} - ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ AI success:', data);
    
    return data.response || null;
}

    // UNCHANGED: Keep your existing initializeChat function
    function initializeChat() {
        if (!chatMessages) return;
        
        // Clear existing messages
        chatMessages.innerHTML = '';
        
        // Reset state
        isHumanMode = false;
        currentStep = 'welcome';
        isUserTyping = false;
        
        // Add welcome message with buttons
        setTimeout(() => {
            addMessage(qaTree.welcome.message);
            setTimeout(() => addButtons(qaTree.welcome.buttons), 500);
        }, 500);
    }
    
    // UNCHANGED: Keep your existing input event listeners
    if (chatInput) {
        chatInput.addEventListener('input', () => {
            if (!isUserTyping && chatInput.value.length > 0) {
                isUserTyping = true;
            }
            
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                if (isUserTyping) {
                    isUserTyping = false;
                }
            }, 2000);
        });
        
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }
    
    // UNCHANGED: Keep your existing modal event listeners
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', () => {
            hideModal('chatbot-modal-overlay');
        });
    }
    // File upload functionality
const chatUploadBtn = document.getElementById('chat-upload-btn');
if (chatUploadBtn) {
    chatUploadBtn.addEventListener('click', () => {
        handleFileUpload();
    });
}

/**
 * Handle file upload for chatbot
 */
function handleFileUpload() {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif'; // Adjust as needed
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleSelectedFile(file);
        }
        // Clean up
        document.body.removeChild(fileInput);
    });
    
    // Add to body temporarily and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
}

// --- UPDATED handleSelectedFile FUNCTION ---
async function handleSelectedFile(file) {
    console.log('📎 File selected:', file.name);

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('File too large. Maximum size is 10MB.');
        return;
    }

    addMessage(`📎 Uploading ${file.name}...`, true);
    showTypingIndicator('bot');

    try {
        const formData = new FormData();
        formData.append('file', file);
        const chatId = window.AUTOFLOW_CONFIG?.TELEGRAM_CONFIG?.SUPPORT_CHAT_ID;
        if (!chatId) throw new Error("Telegram support chat ID is not configured.");
        formData.append('chatId', chatId);

        const edgeFunctionUrl = 'https://gngpakwohqumvkalnykf.supabase.co/functions/v1/telegram-webhook/send-image-to-telegram';

        const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            body: formData,
        });

        hideTypingIndicator('bot');

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed.');
        }

        const result = await response.json();
        console.log('File upload successful, URL:', result.url);

        // Remove the "Uploading..." message
        const messages = document.querySelectorAll('.message.sent');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.textContent.startsWith('📎 Uploading')) {
            lastMessage.remove();
        }

        // Display the uploaded image using its public URL.
        // The addMessage function will also store this URL in the database.
        addMessage(result.url, true);

    } catch (error) {
        hideTypingIndicator('bot');
        console.error('❌ File upload error:', error);
        addMessage(`❌ **Error:** Could not send the file. Please try again or contact support.`);
    }
}
console.log('📎 File upload functionality added to chatbot');
if (chatbotModalOverlay) {
    chatbotModalOverlay.addEventListener('click', (e) => {
        if (e.target === chatbotModalOverlay) hideModal('chatbot-modal-overlay');
    });
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                // This no longer calls initializeChat(). It just manages session state.
                if (chatbotModalOverlay.classList.contains('visible')) {
                    sessionActive = true;
                    // Automatically scroll to the bottom when chat is opened
                    if(chatMessages) window.smoothScrollToBottom(chatMessages);
                } else {
                    sessionActive = false;
                }
            }
        });
    });
    observer.observe(chatbotModalOverlay, { attributes: true });
}
    
// --- UPDATED STARTUP SEQUENCE ---
// This IIFE (Immediately Invoked Function Expression) ensures the setup runs in the correct order.
(async () => {
    console.log('✅ Enhanced chatbot initialization complete, starting setup...');
    initializeUserId();
    await initializeSupabase(); // Wait for Supabase to connect
    initializeChat(); // Then initialize the chat UI
})();
}

// UNCHANGED: Keep all your existing debug functions
window.testRealtimeConnection = function() {
    console.log('🧪 Testing real-time connection...');
    const storedUserId = localStorage.getItem('chatbot_user_id');
    console.log('📍 Current state:');
    console.log('   - Stored User ID:', storedUserId);
    console.log('   - Supabase available:', typeof window.supabase !== 'undefined');
    console.log('   - Config available:', !!window.AUTOFLOW_CONFIG);
    console.log('   - Chatbot instance exists:', !!window.AUTOFLOW_CHATBOT_INSTANCE);
    console.log('   - Instance initialized:', window.AUTOFLOW_CHATBOT_INSTANCE?.isInitialized);
    console.log('   - Active subscription:', !!window.AUTOFLOW_CHATBOT_INSTANCE?.activeSubscription);
    console.log('   - Messages in set:', window.AUTOFLOW_CHATBOT_INSTANCE?.messageSet?.size || 0);
};

console.log('✅ MINIMAL FIXES applied to Enhanced chatbot');

/**
 * Show a modal
 * PRESERVED EXACTLY AS YOUR ORIGINAL
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('visible');
        
        // Focus management
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        // Trap focus within modal
        trapFocus(modal);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide a modal
 * PRESERVED EXACTLY AS YOUR ORIGINAL
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('visible');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to trigger element
        const mainFab = document.getElementById('main-fab');
        if (mainFab) {
            mainFab.focus();
        }
    }
}

/**
 * Trap focus within an element
 * PRESERVED EXACTLY AS YOUR ORIGINAL
 */
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        } else if (e.key === 'Escape') {
            // Close modal on escape
            const modalOverlay = element.closest('.calculator-modal-overlay');
            if (modalOverlay) {
                hideModal(modalOverlay.id);
            }
        }
    }
    
    element.addEventListener('keydown', handleTabKey);
    
    // Store the handler so it can be removed later if needed
    element._trapFocusHandler = handleTabKey;
}

/**
 * Announce messages to screen readers
 * PRESERVED EXACTLY AS YOUR ORIGINAL
 */
function announceToScreenReader(message) {
    let liveRegion = document.getElementById('tools-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'tools-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
}

// AGGRESSIVE TEST FUNCTION
function testRealtimeConnection() {
    console.log('🧪 Testing real-time connection...');
    
    // Try to get userId from localStorage (same way the chatbot does)
    const storedUserId = localStorage.getItem('chatbot_user_id');
    
    console.log('📍 Current state:');
    console.log('   - Stored User ID:', storedUserId);
    console.log('   - Supabase available:', typeof window.supabase !== 'undefined');
    console.log('   - Config available:', !!window.AUTOFLOW_CONFIG);
    console.log('   - Chatbot instance exists:', !!window.AUTOFLOW_CHATBOT_INSTANCE);
    console.log('   - Instance initialized:', window.AUTOFLOW_CHATBOT_INSTANCE?.isInitialized);
    console.log('   - Active subscription:', !!window.AUTOFLOW_CHATBOT_INSTANCE?.activeSubscription);
    console.log('   - Messages in set:', window.AUTOFLOW_CHATBOT_INSTANCE?.messageSet?.size || 0);
    
    if (!storedUserId) {
        console.error('❌ No user ID found. Make sure you opened the chatbot first!');
        return;
    }
    
    // Create Supabase client (same way the chatbot does)
    const SUPABASE_URL = window.AUTOFLOW_CONFIG?.SUPABASE_CONFIG?.SUPABASE_URL;
    const SUPABASE_ANON_KEY = window.AUTOFLOW_CONFIG?.SUPABASE_CONFIG?.SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ Supabase config not found!');
        return;
    }
    
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    console.log('🔍 Checking database for messages...');
    
    supabase
        .from('live_chats')
        .select('*')
        .eq('user_id', storedUserId)
        .eq('from_user', 'human')
        .order('timestamp', { ascending: false })
        .limit(5)
        .then(({ data, error }) => {
            if (error) {
                console.error('❌ Database query failed:', error);
            } else {
                console.log('📨 Recent human messages in database:', data);
                if (data && data.length > 0) {
                    console.log('✅ Found messages! Latest message:', data[0]);
                    console.log('🕒 Message timestamp:', data[0].timestamp);
                    console.log('💬 Message content:', data[0].message);
                    
                    // Check if this message was already displayed using simple ID
                    const messageId = data[0].id;
                    const alreadyDisplayed = window.AUTOFLOW_CHATBOT_INSTANCE?.messageSet?.has(messageId);
                    console.log('🔍 Message ID already displayed:', alreadyDisplayed);
                    console.log('🔍 Message ID:', messageId);
                } else {
                    console.log('❌ No human messages found in database for user:', storedUserId);
                    console.log('💡 This means either:');
                    console.log('   1. The Telegram reply hasn\'t been stored yet');
                    console.log('   2. The user_id in Telegram doesn\'t match');
                    console.log('   3. The message wasn\'t marked as from_user="human"');
                }
            }
        });
    
    // Force cleanup and restart if needed
    if (window.AUTOFLOW_CHATBOT_INSTANCE && !window.AUTOFLOW_CHATBOT_INSTANCE.isInitialized) {
        console.log('🔄 Instance exists but not initialized, forcing cleanup...');
        window.AUTOFLOW_CHATBOT_INSTANCE.cleanup();
    }
}

window.testRealtimeConnection = testRealtimeConnection;

// AGGRESSIVE CLEANUP FUNCTION - Call this if you're still getting duplicates
function forceCleanupChatbot() {
    console.log('🧨 FORCE CLEANUP: Destroying everything...');
    
    // Cleanup global instance
    if (window.AUTOFLOW_CHATBOT_INSTANCE) {
        window.AUTOFLOW_CHATBOT_INSTANCE.cleanup();
        delete window.AUTOFLOW_CHATBOT_INSTANCE;
    }
    
    // Clear all possible global states
    if (window.displayedMessages) {
        window.displayedMessages.clear();
        delete window.displayedMessages;
    }
    
    // Remove all supabase channels
    if (window.supabase) {
        try {
            const tempClient = window.supabase.createClient(
                window.AUTOFLOW_CONFIG?.SUPABASE_CONFIG?.SUPABASE_URL,
                window.AUTOFLOW_CONFIG?.SUPABASE_CONFIG?.SUPABASE_ANON_KEY
            );
            tempClient.removeAllChannels();
        } catch (e) {
            console.log('Channel cleanup error:', e);
        }
    }
    
    // Clear chat messages in DOM
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        console.log('🧹 Cleared chat messages from DOM');
    }
    
    console.log('💥 FORCE CLEANUP COMPLETE - Try opening chatbot again');
}

window.forceCleanupChatbot = forceCleanupChatbot;

// DEBUG FUNCTION - Shows current state of chat
function debugChatState() {
    console.log('🔍 CHAT DEBUG STATE:');
    
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        const messages = chatMessages.querySelectorAll('[data-msg-id]');
        console.log('📨 Messages in DOM:', messages.length);
        
        messages.forEach((msg, i) => {
            const msgId = msg.getAttribute('data-msg-id');
            const isProcessed = msg.getAttribute('data-processed');
            console.log(`  ${i + 1}. ID: ${msgId}, Processed: ${isProcessed}`);
        });
    }
    
    console.log('💾 Message IDs in memory:', Array.from(window.AUTOFLOW_CHATBOT_INSTANCE?.messageSet || []));
    console.log('⏰ Last message time:', new Date(window.AUTOFLOW_CHATBOT_INSTANCE?.lastMessageTime || 0));
}

window.debugChatState = debugChatState;

// PRESERVED: Your original export functionality
window.ToolsControls = {
    showCalculator: () => showModal('calculator-modal-overlay'),
    showChatbot: () => showModal('chatbot-modal-overlay'),
    hideCalculator: () => hideModal('calculator-modal-overlay'),
    hideChatbot: () => hideModal('chatbot-modal-overlay')
};

// ========================================
// COMPLETE ENHANCED VIDEO + CAROUSEL INTEGRATION
// Replace ALL existing video functions in your tools.js with this
// ========================================

// Global video state tracking
let isAnyVideoPlaying = false;
let activeVideo = null;

/**
 * Enhanced video control functions with proper carousel integration
 */
function playVideo(videoId) {
    console.log('🎬 Playing video:', videoId);
    
    const video = document.getElementById(videoId);
    const wrapper = video?.closest('.video-wrapper');
    
    if (!video || !wrapper) {
        console.error('❌ Video or wrapper not found:', videoId);
        return;
    }

    // Stop any other playing videos first
    if (activeVideo && activeVideo !== video) {
        pauseVideo(activeVideo.id);
    }

    // Set loading state
    wrapper.classList.add('loading');
    wrapper.classList.remove('paused', 'playing');
    
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('✅ Video playing successfully');
            
            // Update states
            wrapper.classList.remove('loading', 'paused');
            wrapper.classList.add('playing');
            
            // Set global state
            isAnyVideoPlaying = true;
            activeVideo = video;
            
            // Pause carousel
            if (window.pauseCarouselForVideo) {
                window.pauseCarouselForVideo();
            } else {
                pauseCarouselAutoPlay();
            }
            
        }).catch(error => {
            console.error('❌ Video play failed:', error);
            wrapper.classList.remove('loading');
            wrapper.classList.add('paused');
            showVideoError('Unable to play video. Please try again.');
        });
    } else {
        // Fallback for older browsers
        wrapper.classList.remove('loading', 'paused');
        wrapper.classList.add('playing');
        isAnyVideoPlaying = true;
        activeVideo = video;
        pauseCarouselAutoPlay();
    }
}

function pauseVideo(videoId) {
    console.log('⏸️ Pausing video:', videoId);
    
    const video = document.getElementById(videoId);
    const wrapper = video?.closest('.video-wrapper');
    
    if (!video || !wrapper) {
        console.error('❌ Video or wrapper not found:', videoId);
        return;
    }

    video.pause();
    
    // Update states
    wrapper.classList.remove('playing', 'loading');
    wrapper.classList.add('paused');
    
    // Clear global state
    if (activeVideo === video) {
        isAnyVideoPlaying = false;
        activeVideo = null;
        
        // Resume carousel
        if (window.resumeCarouselAfterVideo) {
            window.resumeCarouselAfterVideo();
        } else {
            resumeCarouselAutoPlay();
        }
    }
    
    console.log('✅ Video paused successfully');
}

/**
 * Stop all videos (called when carousel slides change)
 */
function stopAllVideos() {
    console.log('⏹️ Stopping all videos');
    
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
        if (!video.paused) {
            pauseVideo(video.id);
        }
    });
}

/**
 * Carousel integration functions
 */
function pauseCarouselAutoPlay() {
    // Try to pause carousel autoplay
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    if (autoPlayBtn && autoPlayBtn.classList.contains('active')) {
        // Store that we paused it due to video
        autoPlayBtn.dataset.pausedByVideo = 'true';
        autoPlayBtn.click(); // This will toggle autoplay off
        console.log('⏸️ Carousel paused for video');
    }
}

function resumeCarouselAutoPlay() {
    // Resume carousel autoplay if we paused it
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    if (autoPlayBtn && autoPlayBtn.dataset.pausedByVideo === 'true') {
        delete autoPlayBtn.dataset.pausedByVideo;
        if (!autoPlayBtn.classList.contains('active')) {
            autoPlayBtn.click(); // This will toggle autoplay back on
            console.log('▶️ Carousel resumed after video');
        }
    }
}

/**
 * Show video error message
 */
function showVideoError(message) {
    if (window.AutoFlowStudio?.showNotification) {
        window.AutoFlowStudio.showNotification(message, 'error');
    } else {
        alert(message);
    }
}

/**
 * Enhanced video event listeners and click handlers
 */
function initializeVideoControls() {
    console.log('🎬 Initializing enhanced video controls...');
    
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        const wrapper = video.closest('.video-wrapper');
        if (!wrapper) return;

        // Ensure initial state
        wrapper.classList.add('paused');
        wrapper.classList.remove('playing', 'loading');
        
        // Video event listeners
        video.addEventListener('ended', function() {
            console.log('🔚 Video ended:', this.id);
            wrapper.classList.remove('playing', 'loading');
            wrapper.classList.add('paused');
            
            if (activeVideo === this) {
                isAnyVideoPlaying = false;
                activeVideo = null;
                resumeCarouselAutoPlay();
            }
        });
        
        video.addEventListener('pause', function() {
            if (!this.ended) {
                console.log('⏸️ Video paused (event):', this.id);
                wrapper.classList.remove('playing', 'loading');
                wrapper.classList.add('paused');
                
                if (activeVideo === this) {
                    isAnyVideoPlaying = false;
                    activeVideo = null;
                    resumeCarouselAutoPlay();
                }
            }
        });
        
        video.addEventListener('play', function() {
            console.log('▶️ Video playing (event):', this.id);
            wrapper.classList.remove('paused', 'loading');
            wrapper.classList.add('playing');
            
            isAnyVideoPlaying = true;
            activeVideo = this;
            pauseCarouselAutoPlay();
        });
        
        video.addEventListener('error', function(e) {
            console.error('❌ Video error:', e);
            wrapper.classList.remove('playing', 'loading');
            wrapper.classList.add('paused');
            showVideoError('Video failed to load.');
        });

        console.log('🎬 Enhanced video controls initialized for:', video.id);
    });
    
    // Set up click handlers for play/pause buttons
    setupVideoClickHandlers();
}

/**
 * Set up click handlers for video controls (no onclick needed in HTML)
 */
function setupVideoClickHandlers() {
    console.log('🖱️ Setting up video click handlers...');
    
    // Play button click handlers
    document.querySelectorAll('.video-overlay').forEach(overlay => {
        const wrapper = overlay.closest('.video-wrapper');
        const video = wrapper?.querySelector('video');
        
        if (video) {
            overlay.addEventListener('click', () => {
                playVideo(video.id);
            });
            
            // Also make the play button clickable
            const playButton = overlay.querySelector('.play-button');
            if (playButton) {
                playButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent double firing
                    playVideo(video.id);
                });
            }
        }
    });
    
    // Pause button click handlers
    document.querySelectorAll('.pause-button').forEach(pauseBtn => {
        const wrapper = pauseBtn.closest('.video-wrapper');
        const video = wrapper?.querySelector('video');
        
        if (video) {
            pauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                pauseVideo(video.id);
            });
        }
    });
    
    console.log('✅ Video click handlers set up');
}

/**
 * Debug function to check video state
 */
function debugVideoState() {
    console.log('🔍 Enhanced Video Debug Info:');
    console.log('   - Active video:', activeVideo?.id || 'none');
    console.log('   - Any video playing:', isAnyVideoPlaying);
    
    const videos = document.querySelectorAll('video');
    videos.forEach((video, i) => {
        const wrapper = video.closest('.video-wrapper');
        console.log(`   - Video ${i + 1} (${video.id}):`);
        console.log(`     * Paused: ${video.paused}`);
        console.log(`     * Ended: ${video.ended}`);
        console.log(`     * Wrapper classes: ${wrapper?.className || 'no wrapper'}`);
    });
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing enhanced video + carousel integration...');
    
    // Wait a bit for carousel to initialize first
    setTimeout(() => {
        initializeVideoControls();
        
        // Make functions globally available
        window.playVideo = playVideo;
        window.pauseVideo = pauseVideo;
        window.stopAllVideos = stopAllVideos;
        window.debugVideoState = debugVideoState;
        window.isAnyVideoPlaying = () => isAnyVideoPlaying;
        window.pauseCarouselForVideo = pauseCarouselAutoPlay;
        window.resumeCarouselAfterVideo = resumeCarouselAutoPlay;
        
        console.log('✅ Enhanced video + carousel integration ready');
    }, 500);
});

// Ensure carousel integration works
window.onCarouselSlideChange = function() {
    console.log('🎠 Carousel slide changed - stopping videos');
    stopAllVideos();
};

console.log('🎬 Enhanced video integration loaded');
// Video Controls JavaScript - Add this to your project

document.addEventListener('DOMContentLoaded', () => {
    initializeVideoControls();
});

function initializeVideoControls() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        setupVideoWrapper(wrapper);
    });
    
    // Make stopAllVideos globally available for carousel
    window.stopAllVideos = stopAllVideos;
    
    console.log('🎥 Video controls initialized');
}

function setupVideoWrapper(wrapper) {
    const video = wrapper.querySelector('video');
    const playButton = wrapper.querySelector('.play-button');
    const pauseButton = wrapper.querySelector('.pause-button');
    const videoOverlay = wrapper.querySelector('.video-overlay');
    const videoControls = wrapper.querySelector('.video-controls');
    
    // FORCE initial state - this fixes the double button issue
    wrapper.classList.remove('playing', 'loading');
    wrapper.classList.add('paused');
    
    console.log('🎬 Setting up video wrapper:', wrapper, 'Initial classes:', wrapper.className);
    
    // Play button click handler
    if (playButton) {
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('▶️ Play button clicked');
            playVideo(wrapper, video);
        });
    }
    
    // Pause button click handler  
    if (pauseButton) {
        pauseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('⏸️ Pause button clicked');
            pauseVideo(wrapper, video);
        });
    }
    
    // Video click handler (acts as play/pause toggle)
    if (video) {
        video.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                playVideo(wrapper, video);
            } else {
                pauseVideo(wrapper, video);
            }
        });
        
        // Handle video ended
        video.addEventListener('ended', () => {
            console.log('🔚 Video ended');
            pauseVideo(wrapper, video);
            video.currentTime = 0; // Reset to beginning
        });
    }
    
    // Overlay click handler (acts as play button)
    if (videoOverlay) {
        videoOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('🎯 Overlay clicked');
            playVideo(wrapper, video);
        });
    }
}

function playVideo(wrapper, video) {
    console.log('🎬 playVideo called - Before state:', wrapper.className);
    
    // Stop all other videos first
    stopAllVideos();
    
    // Pause carousel if available
    if (window.pauseCarouselForVideo) {
        window.pauseCarouselForVideo();
    }
    
    // FORCE proper state transition
    wrapper.classList.remove('paused', 'loading');
    wrapper.classList.add('playing');
    
    console.log('🎬 playVideo - After state:', wrapper.className);
    
    // Play the video
    if (video) {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error('❌ Error playing video:', error);
                // Revert to paused state on error
                pauseVideo(wrapper, video);
            });
        }
    }
    
    console.log('▶️ Video playing');
}

function pauseVideo(wrapper, video) {
    console.log('⏸️ pauseVideo called - Before state:', wrapper.className);
    
    // FORCE proper state transition
    wrapper.classList.remove('playing', 'loading');
    wrapper.classList.add('paused');
    
    console.log('⏸️ pauseVideo - After state:', wrapper.className);
    
    // Pause the video
    if (video) {
        video.pause();
    }
    
    // Resume carousel if available
    if (window.resumeCarouselAfterVideo) {
        window.resumeCarouselAfterVideo();
    }
    
    console.log('⏸️ Video paused');
}

function stopAllVideos() {
    console.log('⏹️ stopAllVideos called');
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        
        // FORCE paused state for all videos
        wrapper.classList.remove('playing', 'loading');
        wrapper.classList.add('paused');
        
        if (video && !video.paused) {
            video.pause();
        }
    });
    
    console.log('⏹️ All videos stopped and reset to paused state');
}

// Debug function to check current video states
function debugVideoStates() {
    console.log('🔍 === VIDEO DEBUG INFO ===');
    const wrappers = document.querySelectorAll('.video-wrapper');
    
    wrappers.forEach((wrapper, index) => {
        const video = wrapper.querySelector('video');
        const overlay = wrapper.querySelector('.video-overlay');
        const controls = wrapper.querySelector('.video-controls');
        
        console.log(`Video ${index + 1}:`);
        console.log(`  - Wrapper classes: ${wrapper.className}`);
        console.log(`  - Video paused: ${video ? video.paused : 'no video'}`);
        console.log(`  - Overlay opacity: ${overlay ? getComputedStyle(overlay).opacity : 'none'}`);
        console.log(`  - Controls opacity: ${controls ? getComputedStyle(controls).opacity : 'none'}`);
    });
    
    console.log('=========================');
}

// Global video controls for external use
window.VideoControls = {
    playVideo: (wrapperId) => {
        const wrapper = document.getElementById(wrapperId);
        if (wrapper) {
            const video = wrapper.querySelector('video');
            playVideo(wrapper, video);
        }
    },
    
    pauseVideo: (wrapperId) => {
        const wrapper = document.getElementById(wrapperId);
        if (wrapper) {
            const video = wrapper.querySelector('video');
            pauseVideo(wrapper, video);
        }
    },
    
    stopAllVideos: stopAllVideos,
    debugVideoStates: debugVideoStates
    
};
// ==========================================
// FIRST SLIDE VIDEO DEBUG HELPER
// Specifically for debugging the enhancer video
// ==========================================

/**
 * Debug the first slide video positioning specifically
 */
function debugFirstSlideVideo() {
    console.log('🎬 === FIRST SLIDE VIDEO DEBUG ===');
    
    const videoWrapper = document.getElementById('video-wrapper-enhancer');
    const video = document.getElementById('enhancer-video');
    
    if (!videoWrapper) {
        console.error('❌ First slide video wrapper not found!');
        return;
    }
    
    if (!video) {
        console.error('❌ First slide video element not found!');
        return;
    }
    
    const overlay = videoWrapper.querySelector('.video-overlay');
    const controls = videoWrapper.querySelector('.video-controls');
    const playButton = videoWrapper.querySelector('.play-button');
    const pauseButton = videoWrapper.querySelector('.pause-button');
    
    console.log('📦 Video Wrapper (#video-wrapper-enhancer):');
    const wrapperStyles = getComputedStyle(videoWrapper);
    console.log(`  - Position: ${wrapperStyles.position}`);
    console.log(`  - Width: ${wrapperStyles.width}`);
    console.log(`  - Height: ${wrapperStyles.height}`);
    console.log(`  - Classes: ${videoWrapper.className}`);
    console.log(`  - Computed display: ${wrapperStyles.display}`);
    
    console.log('\n🎥 Video Element (#enhancer-video):');
    const videoStyles = getComputedStyle(video);
    console.log(`  - Position: ${videoStyles.position}`);
    console.log(`  - Width: ${videoStyles.width}`);
    console.log(`  - Height: ${videoStyles.height}`);
    console.log(`  - Object-fit: ${videoStyles.objectFit}`);
    console.log(`  - Top: ${videoStyles.top}`);
    console.log(`  - Left: ${videoStyles.left}`);
    
    if (overlay) {
        console.log('\n🎯 Video Overlay:');
        const overlayStyles = getComputedStyle(overlay);
        console.log(`  - Position: ${overlayStyles.position}`);
        console.log(`  - Top: ${overlayStyles.top}`);
        console.log(`  - Left: ${overlayStyles.left}`);
        console.log(`  - Width: ${overlayStyles.width}`);
        console.log(`  - Height: ${overlayStyles.height}`);
        console.log(`  - Display: ${overlayStyles.display}`);
        console.log(`  - Align-items: ${overlayStyles.alignItems}`);
        console.log(`  - Justify-content: ${overlayStyles.justifyContent}`);
        console.log(`  - Z-index: ${overlayStyles.zIndex}`);
        console.log(`  - Opacity: ${overlayStyles.opacity}`);
        console.log(`  - Visibility: ${overlayStyles.visibility}`);
    }
    
    if (playButton) {
        console.log('\n▶️ Play Button:');
        const buttonStyles = getComputedStyle(playButton);
        console.log(`  - Position: ${buttonStyles.position}`);
        console.log(`  - Width: ${buttonStyles.width}`);
        console.log(`  - Height: ${buttonStyles.height}`);
        console.log(`  - Display: ${buttonStyles.display}`);
        console.log(`  - Align-items: ${buttonStyles.alignItems}`);
        console.log(`  - Justify-content: ${buttonStyles.justifyContent}`);
        console.log(`  - Z-index: ${buttonStyles.zIndex}`);
        console.log(`  - Padding-left: ${buttonStyles.paddingLeft}`);
    }
    
    // Check positioning
    if (videoWrapper && playButton) {
        const wrapperRect = videoWrapper.getBoundingClientRect();
        const buttonRect = playButton.getBoundingClientRect();
        
        const wrapperCenterX = wrapperRect.left + wrapperRect.width / 2;
        const wrapperCenterY = wrapperRect.top + wrapperRect.height / 2;
        
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        const offsetX = Math.abs(wrapperCenterX - buttonCenterX);
        const offsetY = Math.abs(wrapperCenterY - buttonCenterY);
        
        console.log('\n📐 Centering Analysis:');
        console.log(`  - Wrapper center: (${wrapperCenterX.toFixed(1)}, ${wrapperCenterY.toFixed(1)})`);
        console.log(`  - Button center: (${buttonCenterX.toFixed(1)}, ${buttonCenterY.toFixed(1)})`);
        console.log(`  - X offset: ${offsetX.toFixed(1)}px`);
        console.log(`  - Y offset: ${offsetY.toFixed(1)}px`);
        
        if (offsetX < 5 && offsetY < 5) {
            console.log('  ✅ WELL CENTERED!');
        } else {
            console.log('  ❌ NOT CENTERED - Offset too large');
            console.log('  💡 Try running fixFirstSlideVideo()');
        }
    }
    
    console.log('\n=================================');
}

/**
 * Force fix the first slide video positioning
 */
function fixFirstSlideVideo() {
    console.log('🔧 Applying emergency fix to first slide video...');
    
    const videoWrapper = document.getElementById('video-wrapper-enhancer');
    if (!videoWrapper) {
        console.error('❌ Video wrapper not found!');
        return;
    }
    
    // Apply critical CSS fixes via JavaScript
    const style = document.createElement('style');
    style.id = 'first-slide-emergency-fix';
    style.textContent = `
        #video-wrapper-enhancer {
            position: relative !important;
            width: 100% !important;
            height: 300px !important;
        }
        
        #video-wrapper-enhancer .video-overlay,
        #video-wrapper-enhancer .video-controls {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 10 !important;
        }
        
        #video-wrapper-enhancer .play-button,
        #video-wrapper-enhancer .pause-button {
            position: relative !important;
            z-index: 15 !important;
            width: 70px !important;
            height: 70px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: linear-gradient(135deg, #e91e63, #9c27b0) !important;
            color: white !important;
            border: none !important;
            font-size: 28px !important;
            cursor: pointer !important;
        }
        
        #video-wrapper-enhancer .play-button {
            padding-left: 3px !important;
        }
    `;
    
    // Remove any existing emergency fix
    const existingFix = document.getElementById('first-slide-emergency-fix');
    if (existingFix) {
        existingFix.remove();
    }
    
    document.head.appendChild(style);
    
    // Force state refresh
    videoWrapper.classList.remove('paused', 'playing', 'loading');
    // Force reflow
    videoWrapper.offsetHeight;
    videoWrapper.classList.add('paused');
    
    console.log('🔧 Emergency fix applied to first slide video');
    console.log('🧪 Run debugFirstSlideVideo() to verify the fix');
}

/**
 * Test first slide video state transitions
 */
function testFirstSlideStates() {
    console.log('🧪 Testing first slide video states...');
    
    const videoWrapper = document.getElementById('video-wrapper-enhancer');
    if (!videoWrapper) {
        console.error('❌ Video wrapper not found!');
        return;
    }
    
    console.log('1️⃣ Setting PAUSED state...');
    videoWrapper.classList.remove('playing', 'loading');
    videoWrapper.classList.add('paused');
    
    setTimeout(() => {
        console.log('2️⃣ Setting PLAYING state...');
        videoWrapper.classList.remove('paused', 'loading');
        videoWrapper.classList.add('playing');
        
        setTimeout(() => {
            console.log('3️⃣ Back to PAUSED state...');
            videoWrapper.classList.remove('playing', 'loading');
            videoWrapper.classList.add('paused');
            
            console.log('✅ State test complete');
        }, 2000);
    }, 2000);
}

/**
 * Check if first slide is currently visible in carousel
 */
function isFirstSlideVisible() {
    const videoWrapper = document.getElementById('video-wrapper-enhancer');
    if (!videoWrapper) return false;
    
    const rect = videoWrapper.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0 && 
                     rect.top < window.innerHeight && rect.bottom > 0;
    
    console.log('👁️ First slide visibility:', isVisible);
    console.log('📏 Wrapper bounds:', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom
    });
    
    return isVisible;
}

/**
 * Quick visual test - adds colored borders temporarily
 */
function visualTestFirstSlide() {
    console.log('🎨 Adding visual test borders...');
    
    const style = document.createElement('style');
    style.id = 'visual-test-borders';
    style.textContent = `
        #video-wrapper-enhancer {
            border: 3px solid lime !important;
        }
        
        #video-wrapper-enhancer .video-overlay {
            border: 3px solid red !important;
        }
        
        #video-wrapper-enhancer .video-controls {
            border: 3px solid blue !important;
        }
        
        #video-wrapper-enhancer .play-button,
        #video-wrapper-enhancer .pause-button {
            border: 3px solid yellow !important;
        }
    `;
    
    document.head.appendChild(style);
    
    console.log('🎨 Visual borders added!');
    console.log('🟢 Green = video wrapper');
    console.log('🔴 Red = video overlay (play state)');
    console.log('🔵 Blue = video controls (pause state)'); 
    console.log('🟡 Yellow = buttons');
    console.log('');
    console.log('🧹 Run removeVisualTest() to remove borders');
}

/**
 * Remove visual test borders
 */
function removeVisualTest() {
    const testStyle = document.getElementById('visual-test-borders');
    if (testStyle) {
        testStyle.remove();
        console.log('🧹 Visual test borders removed');
    }
}

// Make functions globally available
window.debugFirstSlideVideo = debugFirstSlideVideo;
window.fixFirstSlideVideo = fixFirstSlideVideo;
window.testFirstSlideStates = testFirstSlideStates;
window.isFirstSlideVisible = isFirstSlideVisible;
window.visualTestFirstSlide = visualTestFirstSlide;
window.removeVisualTest = removeVisualTest;

// Auto-check first slide when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🎬 Auto-checking first slide video...');
        debugFirstSlideVideo();
        
        if (!isFirstSlideVisible()) {
            console.log('💡 First slide not visible - navigate to it and run debugFirstSlideVideo()');
        }
    }, 2000);
});
/**
 * Try to get an AI response as fallback
 */
async function tryAIResponse(userMessage) {
    console.log('🧠 Attempting AI response for:', userMessage);
    
    try {
        const aiResponse = await callAIEndpoint(userMessage);
        
        if (aiResponse && aiResponse.trim()) {
            console.log('✅ AI responded successfully');
            addMessage(`🤖 ${aiResponse}`);
            
            // Add helpful navigation buttons
            setTimeout(() => addButtons([
                { text: "💬 Talk to a human", action: "connect_human" },
                { text: "🤖 Explore automations", action: "automation" },
                { text: "💰 Check pricing", action: "pricing" },
                { text: "🏠 Main menu", action: "welcome" }
            ], 'ai_response'), 500);
            
        } else {
            throw new Error('Empty AI response');
        }
        
    } catch (error) {
        console.log('⚠️ AI failed, using default response:', error.message);
        
        // Fallback to your existing default response
        addMessage("Thanks for your message! I can help you with automation questions. Here are some topics I can assist with:");
        setTimeout(() => addButtons(qaTree.welcome.buttons, 'welcome'), 1000);
    }
}

async function callAIEndpoint(message) {
    const userId = localStorage.getItem('chatbot_user_id') || 'web_user_' + Date.now();
    const endpoint = 'https://gngpakwohqumvkalnykf.supabase.co/functions/v1/telegram-webhook?ai=true';
    
    console.log('📡 Calling AI with simple format:', message);
    
    // CORRECT FORMAT: Simple JSON as your function expects
    const payload = {
        message: message,  // Simple string
        userId: userId     // Simple string
    };
    
    console.log('📤 Sending:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    console.log('📥 Response:', responseText);
    
    if (!response.ok) {
        throw new Error(`AI failed: ${response.status} - ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ AI success:', data);
    
    return data.response || null;
}
/**
 * Debug your AI configuration and test different approaches
 */
window.debugAIEndpoint = function() {
    console.log('🔍 AI Endpoint Debug Information:');
    
    const config = window.AUTOFLOW_CONFIG?.AI_ASSISTANT_CONFIG;
    console.log('📋 AI Config:', config);
    
    const endpoint = config?.ENDPOINT;
    console.log('🌐 Endpoint URL:', endpoint);
    
    const userId = localStorage.getItem('chatbot_user_id');
    console.log('👤 User ID:', userId);
    
    // Parse the endpoint URL to understand the expected format
    if (endpoint) {
        const url = new URL(endpoint);
        console.log('🔗 Base URL:', url.origin + url.pathname);
        console.log('❓ Query params:', Object.fromEntries(url.searchParams));
        
        if (url.searchParams.has('ai')) {
            console.log('✅ AI parameter found in URL');
        } else {
            console.log('⚠️ No AI parameter in URL - might need to add ai: true to payload');
        }
    }
    
    console.log('\n🧪 Try these test functions:');
    console.log('  - window.testAIEndpointDirect("test message")');
    console.log('  - window.testAI("test message")  (improved version)');
};

console.log('🔧 AI endpoint fixes loaded!');
console.log('🧪 Test with: window.testAIEndpointDirect("What do you do?")');
console.log('🔍 Debug with: window.debugAIEndpoint()');
// STEP 3: ADD test functions for debugging:

/**
 * Test AI endpoint directly
 */
window.testAI = async function(testMessage = "What services does AutoFlow Studio offer?") {
    console.log('🧪 Testing AI endpoint with:', testMessage);
    
    try {
        const response = await callAIEndpoint(testMessage);
        console.log('✅ AI Test Result:', response);
        return response;
    } catch (error) {
        console.error('❌ AI Test Failed:', error);
        return null;
    }
};

/**
 * Test AI through chat interface
 */
window.testAIInChat = function(testMessage = "tell me about your company") {
    const chatInput = document.querySelector('.chat-input-area input');
    if (chatInput) {
        console.log('💬 Testing AI in chat with:', testMessage);
        chatInput.value = testMessage;
        sendMessage();
    } else {
        console.error('❌ Chat input not found');
    }
};

// PRESERVE: Keep your existing debug and cleanup functions exactly as they are
console.log('🧠 Minimal AI integration added!');
console.log('🧪 Test with: window.testAI("your question")');
console.log('💬 Test in chat: window.testAIInChat("tell me about cars")');
console.log('📞 All Telegram functionality preserved!');
console.log('🎬 First slide debug helper loaded! Available functions:');
console.log('  - debugFirstSlideVideo() - Check positioning');
console.log('  - fixFirstSlideVideo() - Apply emergency fix');
console.log('  - testFirstSlideStates() - Test state transitions');
console.log('  - visualTestFirstSlide() - Add colored borders');
console.log('  - removeVisualTest() - Remove colored borders');
console.log('  - isFirstSlideVisible() - Check if slide is visible');
// Make functions globally available 
window.stopAllVideos = stopAllVideos;
window.debugVideoStates = debugVideoStates;

console.log('🎥 Video control functions loaded');
