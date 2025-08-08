// smooth-scroll.js
// Dedicated module for handling smooth chat scrolling with GSAP.

(function() {
    // Wait for GSAP to be available
    if (typeof gsap === 'undefined' || typeof ScrollToPlugin === 'undefined') {
        console.error("GSAP or ScrollToPlugin is not loaded. Make sure to include them in your HTML.");
        return;
    }

    // Register the plugin once
    gsap.registerPlugin(ScrollToPlugin);

    /**
     * A robust, GSAP-powered function to smoothly scroll an element to the bottom.
     * @param {HTMLElement} element - The scrollable element (e.g., your chat messages container).
     */
    function smoothScrollToBottom(element) {
        if (!element) {
            console.error("Scroll target element not provided.");
            return;
        }

        // Use GSAP for a guaranteed smooth scroll
        gsap.to(element, {
            duration: 0.5, // Animation duration in seconds
            scrollTo: {
                y: "max", // Scrolls to the maximum vertical position
                autoKill: true // Stops the animation if the user scrolls manually
            },
            ease: "power2.out" // An easing function for a natural feel
        });
    }

    // Attach the function to the global window object to make it accessible from tools.js
    window.smoothScrollToBottom = smoothScrollToBottom;

    console.log('✅ Smooth Scroll module loaded successfully.');

})();
