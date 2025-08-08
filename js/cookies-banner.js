// Manual Cookies Banner - No Automatic CSS Injection
// Place this file in: Assets/js/cookies-banner.js

(function() {
    'use strict';

    // Cookie consent state
    let cookieConsent = {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
    };

    // Initialize banner when DOM is ready
    function initCookiesBanner() {
        // Add banner HTML (NO automatic CSS loading)
        const bannerHTML = `
            <!-- GDPR Cookies Banner -->
            <div id="cookiesBanner" class="cookies-banner">
                <div class="cookies-content">
                    <div class="cookies-text">
                        🍪 <strong>We use cookies to enhance your experience.</strong><br>
                        We use cookies and similar technologies to personalize content, analyze traffic, and improve your browsing experience. 
                        Some cookies are set by us and third parties (Google, Microsoft, etc.) for analytics and marketing. 
                        You can manage your preferences anytime. 
                        <a href="privacy-policy.html" target="_blank">Privacy Policy</a> | 
                        <a href="cookie-policy.html" target="_blank">Cookie Policy</a>
                    </div>
                    <div class="cookies-buttons">
                        <button class="cookies-btn accept-all" onclick="CookiesBanner.acceptAll()">Accept All</button>
                        <button class="cookies-btn reject-all" onclick="CookiesBanner.rejectAll()">Reject All</button>
                        <button class="cookies-btn customize" onclick="CookiesBanner.showSettings()">Customize</button>
                    </div>
                </div>
            </div>

            <!-- Cookie Settings Modal -->
            <div id="cookieSettingsOverlay" class="cookie-settings-overlay">
                <div class="cookie-settings-modal">
                    <button class="cookie-close-btn" onclick="CookiesBanner.closeSettings()">&times;</button>
                    
                    <div class="cookie-settings-header">
                        <div class="cookie-settings-title">🍪 Cookie Preferences</div>
                        <div class="cookie-settings-description">
                            Manage your cookie preferences. You can enable or disable different types of cookies below. 
                            Note that disabling some cookies may affect your browsing experience.
                        </div>
                    </div>

                    <div class="cookie-settings-content">
                        <!-- Strictly Necessary -->
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Strictly Necessary Cookies</h4>
                                    <p>Essential for the website to function properly. These cannot be disabled.</p>
                                    <div class="cookie-duration">Duration: Session + 1 year</div>
                                </div>
                                <div class="cookie-toggle-wrapper">
                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">
                                        <div class="cookie-toggle active disabled" data-category="necessary"></div>
                                        <span style="font-size: 12px; color: #9ca3af;">Always On</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Preferences/Functional -->
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Preferences / Functional Cookies</h4>
                                    <p>Remember your settings and preferences to enhance your experience.</p>
                                    <div class="cookie-duration">Duration: 6 months</div>
                                </div>
                                <div class="cookie-toggle-wrapper">
                                    <div class="cookie-toggle" data-category="functional" onclick="CookiesBanner.toggleCategory(this)"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Statistics/Analytics -->
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Statistics / Analytics Cookies</h4>
                                    <p>Help us understand how visitors interact with our website (Google Analytics, Microsoft Clarity).</p>
                                    <div class="cookie-duration">Duration: 2 years</div>
                                </div>
                                <div class="cookie-toggle-wrapper">
                                    <div class="cookie-toggle" data-category="analytics" onclick="CookiesBanner.toggleCategory(this)"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Marketing/Tracking -->
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Marketing / Tracking Cookies</h4>
                                    <p>Used to deliver personalized advertisements and track campaign performance (Google Ads, Facebook Pixel).</p>
                                    <div class="cookie-duration">Duration: 1 year</div>
                                </div>
                                <div class="cookie-toggle-wrapper">
                                    <div class="cookie-toggle" data-category="marketing" onclick="CookiesBanner.toggleCategory(this)"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="cookie-settings-actions">
                        <button class="cookies-btn reject-all" onclick="CookiesBanner.rejectAllFromSettings()">Reject All</button>
                        <button class="cookies-btn accept-all" onclick="CookiesBanner.saveSettings()">Save Preferences</button>
                    </div>
                </div>
            </div>

            <!-- Change Settings Link -->
            <a href="#" id="changeSettingsLink" class="change-settings-link" onclick="CookiesBanner.showSettings(); return false;">
                🍪 Cookie Settings
            </a>
        `;

        // Inject banner HTML into body
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Initialize functionality
        loadCookiePreferences();
        checkConsentOnLoad();
        setupModalCloseListener();
    }

    // Global CookiesBanner object for external access
    window.CookiesBanner = {
        acceptAll: acceptAllCookies,
        rejectAll: rejectAllCookies,
        showSettings: showCookieSettings,
        closeSettings: closeCookieSettings,
        toggleCategory: toggleCookieCategory,
        saveSettings: saveCookieSettings,
        rejectAllFromSettings: rejectAllFromSettings,
        reset: resetCookies // For testing
    };

    // Load saved preferences
    function loadCookiePreferences() {
        const saved = localStorage.getItem('cookieConsent');
        if (saved) {
            cookieConsent = { ...cookieConsent, ...JSON.parse(saved) };
        }
    }

    // Save preferences
    function saveCookiePreferences() {
        localStorage.setItem('cookieConsent', JSON.stringify(cookieConsent));
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
    }

    // Show/hide banner
    function hideBanner() {
        const banner = document.getElementById('cookiesBanner');
        const settingsLink = document.getElementById('changeSettingsLink');
        if (banner) banner.classList.remove('show');
        if (settingsLink) settingsLink.classList.add('show');
    }

    // Accept all cookies
    function acceptAllCookies() {
        cookieConsent = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true
        };
        saveCookiePreferences();
        hideBanner();
        loadCookieScripts();
        console.log('✅ All cookies accepted');
    }

    // Reject all non-essential cookies
    function rejectAllCookies() {
        cookieConsent = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        };
        saveCookiePreferences();
        hideBanner();
        console.log('❌ Non-essential cookies rejected');
    }

    // Show cookie settings modal
    function showCookieSettings() {
        const overlay = document.getElementById('cookieSettingsOverlay');
        if (overlay) {
            overlay.classList.add('show');
            updateToggleStates();
        }
    }

    // Close cookie settings modal
    function closeCookieSettings() {
        const overlay = document.getElementById('cookieSettingsOverlay');
        if (overlay) overlay.classList.remove('show');
    }

    // Toggle individual cookie category
    function toggleCookieCategory(toggle) {
        if (toggle.classList.contains('disabled')) return;
        
        const category = toggle.getAttribute('data-category');
        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
            toggle.classList.remove('active');
            cookieConsent[category] = false;
        } else {
            toggle.classList.add('active');
            cookieConsent[category] = true;
        }
    }

    // Update toggle states in settings modal
    function updateToggleStates() {
        Object.keys(cookieConsent).forEach(category => {
            const toggle = document.querySelector(`[data-category="${category}"]`);
            if (toggle && !toggle.classList.contains('disabled')) {
                if (cookieConsent[category]) {
                    toggle.classList.add('active');
                } else {
                    toggle.classList.remove('active');
                }
            }
        });
    }

    // Reject all from settings modal
    function rejectAllFromSettings() {
        cookieConsent = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        };
        updateToggleStates();
        saveCookiePreferences();
        closeCookieSettings();
        hideBanner();
        console.log('❌ Non-essential cookies rejected from settings');
    }

    // Save cookie settings from modal
    function saveCookieSettings() {
        saveCookiePreferences();
        closeCookieSettings();
        hideBanner();
        loadCookieScripts();
        console.log('✅ Cookie preferences saved:', cookieConsent);
    }

    // Load third-party scripts based on consent
    function loadCookieScripts() {
        // Analytics cookies
        if (cookieConsent.analytics) {
            // Load Microsoft Clarity
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sc7rg8deco");
            console.log('📊 Analytics cookies loaded');
        }

        // Marketing cookies
        if (cookieConsent.marketing) {
            // Add your marketing scripts here (Google Ads, Facebook Pixel, etc.)
            console.log('📢 Marketing cookies would be loaded here');
        }

        // Functional cookies
        if (cookieConsent.functional) {
            // Add your functional scripts here
            console.log('⚙️ Functional cookies would be loaded here');
        }
    }

    // Reset function for testing
    function resetCookies() {
        localStorage.removeItem('cookieConsent');
        localStorage.removeItem('cookieConsentDate');
        const settingsLink = document.getElementById('changeSettingsLink');
        const banner = document.getElementById('cookiesBanner');
        if (settingsLink) settingsLink.classList.remove('show');
        cookieConsent = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        };
        setTimeout(function() {
            if (banner) banner.classList.add('show');
        }, 500);
        console.log('🔄 Cookie consent reset');
    }

    // Check if consent is needed on page load
    function checkConsentOnLoad() {
        const hasConsent = localStorage.getItem('cookieConsent');
        const banner = document.getElementById('cookiesBanner');
        const settingsLink = document.getElementById('changeSettingsLink');
        
        if (!hasConsent) {
            // Show banner after a short delay for new visitors
            setTimeout(function() {
                if (banner) banner.classList.add('show');
            }, 1000);
        } else {
            // Show settings link for returning visitors
            if (settingsLink) settingsLink.classList.add('show');
            // Load scripts based on existing consent
            loadCookieScripts();
        }
    }

    // Setup modal close listener
    function setupModalCloseListener() {
        const overlay = document.getElementById('cookieSettingsOverlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeCookieSettings();
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookiesBanner);
    } else {
        initCookiesBanner();
    }

})();