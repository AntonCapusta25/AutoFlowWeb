// METHOD 1: EASY FIX - Replace your entire smooth-scroll.js with this:

// smooth-scroll.js - COMPLETELY DISABLED VERSION
(function() {
    /**
     * Disabled scrolling function - does absolutely nothing
     * @param {HTMLElement} element - The element (ignored)
     */
    function smoothScrollToBottom(element) {
        // Do absolutely nothing - no scrolling at all
        console.log('📍 Scrolling disabled - staying at current position');
    }

    // Override the global function
    window.smoothScrollToBottom = smoothScrollToBottom;

    console.log('🚫 All chatbot scrolling completely disabled.');
})();
