// smooth-scroll.js - REALLY SLOW SCROLL VERSION
// Dedicated module for handling very slow, gentle chat scrolling with GSAP.

(function() {
    // Wait for GSAP to be available
    if (typeof gsap === 'undefined' || typeof ScrollToPlugin === 'undefined') {
        console.error("GSAP or ScrollToPlugin is not loaded. Make sure to include them in your HTML.");
        return;
    }

    // Register the plugin once
    gsap.registerPlugin(ScrollToPlugin);

    /**
     * A very slow, gentle GSAP-powered function to scroll an element to the bottom.
     * @param {HTMLElement} element - The scrollable element (e.g., your chat messages container).
     */
    function smoothScrollToBottom(element) {
        if (!element) {
            console.error("Scroll target element not provided.");
            return;
        }

        // Use GSAP for a very slow, gentle scroll
        gsap.to(element, {
            duration: 2.0, // INCREASED from 0.5 to 2.0 seconds - very slow
            scrollTo: {
                y: "max", // Scrolls to the maximum vertical position
                autoKill: true // Stops the animation if the user scrolls manually
            },
            ease: "power1.inOut" // Gentle ease in and out for smooth, slow movement
        });
    }

    // Attach the function to the global window object to make it accessible from tools.js
    window.smoothScrollToBottom = smoothScrollToBottom;

    console.log('✅ Really Slow Scroll module loaded successfully.');

})();
