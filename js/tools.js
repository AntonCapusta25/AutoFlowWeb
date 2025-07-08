// AutoFlow Studio - Tools JavaScript
// Handles FAB tools menu and pricing calculator

document.addEventListener('DOMContentLoaded', () => {
    initializeToolsFAB();
    initializePricingCalculator();
    initializeChatbot();
});

/**
 * Initialize the floating action button (FAB) tools menu
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
 * Initialize the pricing calculator
 */
function initializePricingCalculator() {
    // DOM Elements
    const calculatorModalOverlay = document.getElementById('calculator-modal-overlay');
    const closeCalculatorBtn = document.getElementById('close-calculator-modal-btn');
    const proceedButton = document.getElementById('proceed-button');
    const form = document.getElementById('pricing-calculator-form');
    
    // Form elements
    const companySizeEl = document.getElementById('company-size');
    const complexityEl = document.getElementById('complexity');
    const extraWorkflowsEl = document.getElementById('extra-workflows');
    const trainingHoursEl = document.getElementById('training-hours');
    const monthlySupportEl = document.getElementById('monthly-support');
    const totalPriceEl = document.getElementById('total-price');
    
    if (!form || !totalPriceEl) return;
    
    // Pricing Data
    const pricing = {
        base: { 
            small: 250, 
            medium: 600, 
            large: 1200 
        },
        complexityMultiplier: { 
            basic: 1, 
            intermediate: 1.5, 
            advanced: 2 
        },
        addons: {
            extraWorkflow: { 
                small: 100, 
                medium: 300, 
                large: 300 
            },
            trainingHour: { 
                small: 75, 
                medium: 100, 
                large: 100 
            },
            monthlySupport: { 
                small: 40, 
                medium: 80, 
                large: 150 
            }
        }
    };
    
    /**
     * Calculate and update the price
     */
    function calculatePrice() {
        if (!companySizeEl || !complexityEl) return;
        
        const size = companySizeEl.value;
        const complexity = complexityEl.value;
        const extraWorkflows = parseInt(extraWorkflowsEl?.value || '0', 10);
        const trainingHours = parseInt(trainingHoursEl?.value || '0', 10);
        const hasMonthlySupport = monthlySupportEl?.checked || false;
        
        // Calculate base price with complexity multiplier
        let total = pricing.base[size] * pricing.complexityMultiplier[complexity];
        
        // Add extra workflows
        total += extraWorkflows * pricing.addons.extraWorkflow[size];
        
        // Add training hours
        total += trainingHours * pricing.addons.trainingHour[size];
        
        // Add monthly support
        if (hasMonthlySupport) {
            total += pricing.addons.monthlySupport[size];
        }
        
        // Update display
        if (totalPriceEl) {
            totalPriceEl.textContent = `€${total.toLocaleString('en-US')}`;
        }
        
        // Announce price change to screen readers
        announceToScreenReader(`Price updated to ${total} euros`);
        
        return total;
    }
    
    // Event Listeners
    if (form) {
        form.addEventListener('input', calculatePrice);
        form.addEventListener('change', calculatePrice);
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
        proceedButton.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal('calculator-modal-overlay');
            
            // Show notification and redirect
            if (window.AutoFlowStudio?.showNotification) {
                window.AutoFlowStudio.showNotification(
                    'Redirecting to contact page with your pricing estimate...', 
                    'info'
                );
            }
            
            setTimeout(() => {
                window.location.href = 'contact.html';
            }, 1500);
        });
    }
    
    // Initialize with default calculation
    calculatePrice();
    
    // Add input validation
    addInputValidation();
}

/**
 * Add input validation to form fields
 */
function addInputValidation() {
    const extraWorkflowsEl = document.getElementById('extra-workflows');
    const trainingHoursEl = document.getElementById('training-hours');
    
    // Validate extra workflows
    if (extraWorkflowsEl) {
        extraWorkflowsEl.addEventListener('input', (e) => {
            let value = parseInt(e.target.value, 10);
            
            if (isNaN(value) || value < 0) {
                e.target.value = 0;
            } else if (value > 10) {
                e.target.value = 10;
                if (window.AutoFlowStudio?.showNotification) {
                    window.AutoFlowStudio.showNotification(
                        'Maximum 10 extra workflows allowed', 
                        'info'
                    );
                }
            }
        });
    }
    
    // Validate training hours
    if (trainingHoursEl) {
        trainingHoursEl.addEventListener('input', (e) => {
            let value = parseInt(e.target.value, 10);
            
            if (isNaN(value) || value < 0) {
                e.target.value = 0;
            } else if (value > 20) {
                e.target.value = 20;
                if (window.AutoFlowStudio?.showNotification) {
                    window.AutoFlowStudio.showNotification(
                        'Maximum 20 training hours allowed', 
                        'info'
                    );
                }
            }
        });
    }
}

/**
 * Initialize the chatbot modal
 */
function initializeChatbot() {
    const chatbotModalOverlay = document.getElementById('chatbot-modal-overlay');
    const closeChatbotBtn = document.getElementById('close-chatbot-modal-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input-area input');
    const chatSendBtn = document.querySelector('.chat-input-area button');
    
    if (!chatbotModalOverlay) return;
    
    // Predefined responses
    const responses = {
        greeting: [
            "Hello! I'm here to help you with your automation needs. What would you like to know?",
            "Hi there! How can I assist you with automating your business processes today?",
            "Welcome! I'm ready to help you discover automation opportunities for your business."
        ],
        pricing: [
            "Our pricing varies based on complexity and company size. You can use our price calculator for an instant estimate, or tell me more about your specific needs!",
            "Prices start from €250 for basic automations. For a personalized quote, I'd recommend using our pricing calculator or booking a free consultation."
        ],
        services: [
            "We specialize in Google Sheets automation, AI chatbots, process automation, and custom integrations. What type of automation are you interested in?",
            "Our main services include workflow automation, AI-powered tools, data synchronization, and custom business process automation."
        ],
        timeline: [
            "Most automation projects are delivered within 5-7 business days. Complex integrations may take 10-14 days. What kind of timeline are you working with?",
            "We pride ourselves on fast delivery! Simple automations can often be completed in 3-5 days, while more complex projects typically take 1-2 weeks."
        ],
        support: [
            "All projects include 30 days of free support and training. After that, we offer flexible maintenance plans. Would you like to know more about our support options?",
            "Yes, we provide comprehensive support including documentation, training, and ongoing maintenance. What specific support do you need?"
        ],
        default: [
            "That's a great question! For detailed information about that topic, I'd recommend booking a free consultation call where we can discuss your specific needs.",
            "I'd love to help you with that! Could you provide a bit more detail about what you're looking to automate?",
            "Thanks for asking! For the most accurate information, I'd suggest using our contact form or booking a call with our team."
        ]
    };
    
    /**
     * Detect intent from user message
     */
    function detectIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'greeting';
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            return 'pricing';
        } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you') || lowerMessage.includes('what can you')) {
            return 'services';
        } else if (lowerMessage.includes('time') || lowerMessage.includes('delivery') || lowerMessage.includes('how long')) {
            return 'timeline';
        } else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('maintenance')) {
            return 'support';
        } else {
            return 'default';
        }
    }
    
    /**
     * Get a random response for the detected intent
     */
    function getResponse(intent) {
        const intentResponses = responses[intent] || responses.default;
        return intentResponses[Math.floor(Math.random() * intentResponses.length)];
    }
    
    /**
     * Add a message to the chat
     */
    function addMessage(message, isUser = false) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'sent' : 'received'}`;
        
        const messageContent = document.createElement('p');
        messageContent.textContent = message;
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Announce new messages to screen readers
        if (!isUser) {
            announceToScreenReader(`AI Assistant says: ${message}`);
        }
    }
    
    /**
     * Handle sending a message
     */
    function sendMessage() {
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, true);
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message received typing';
        typingIndicator.innerHTML = '<p>AI Assistant is typing...</p>';
        if (chatMessages) {
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Simulate AI response delay
        setTimeout(() => {
            // Remove typing indicator
            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            
            // Detect intent and respond
            const intent = detectIntent(message);
            const response = getResponse(intent);
            addMessage(response);
        }, 1000 + Math.random() * 1000); // 1-2 second delay
    }
    
    // Event Listeners
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', () => {
            hideModal('chatbot-modal-overlay');
        });
    }
    
    if (chatbotModalOverlay) {
        chatbotModalOverlay.addEventListener('click', (e) => {
            if (e.target === chatbotModalOverlay) {
                hideModal('chatbot-modal-overlay');
            }
        });
    }
    
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

/**
 * Show a modal
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

// Export tools functionality for external use
window.ToolsControls = {
    showCalculator: () => showModal('calculator-modal-overlay'),
    showChatbot: () => showModal('chatbot-modal-overlay'),
    hideCalculator: () => hideModal('calculator-modal-overlay'),
    hideChatbot: () => hideModal('chatbot-modal-overlay')
};