// AutoFlow Studio - Main JavaScript with Enhanced GSAP Animations
// Common functionality across all pages

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Functionality ---
    initializeNavigation();
    
    // --- Smooth Scroll ---
    initializeSmoothScroll();
    
    // --- Scroll Effects ---
    initializeScrollEffects();
    
    // --- Form Handling ---
    initializeFormHandling();
    
    // --- Animation Observers ---
    initializeAnimations();
    
    // --- CTA Button Functionality ---
    initializeCTAButtons();
    
    // --- Newsletter Functionality ---
    initializeNewsletter();
    
    // --- Enhanced GSAP Interactions ---
    initializeGSAPInteractions();
});

// Loading Animation Functions
function splitTextToLetters() {
    const logoElement = document.getElementById('loadingLogo');
    if (!logoElement) return;
    
    const text = logoElement.textContent;
    logoElement.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'space';
            logoElement.appendChild(spaceSpan);
        } else {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = char;
            logoElement.appendChild(letterSpan);
        }
    }
}

function animateLetters() {
    const letters = document.querySelectorAll('.letter');
    if (letters.length === 0) return;
    
    // Enhanced GSAP letter animations
    gsap.fromTo(letters, 
        { 
            y: 30, 
            opacity: 0,
            scale: 0.8,
            rotation: -15
        },
        { 
            y: 0, 
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: {
                each: 0.08,
                ease: "power2.out"
            },
            ease: 'elastic.out(1, 0.6)'
        }
    );
    
    // Enhanced continuous wave animation
    gsap.to(letters, {
        y: -12,
        duration: 1.2,
        stagger: {
            each: 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        },
        ease: 'sine.inOut',
        delay: 1.5
    });
}

function initLoading() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return;
    
    splitTextToLetters();
    animateLetters();
    
    // Enhanced loading timeline
    const tl = gsap.timeline();
    
    tl.to('.loading-progress', {
        width: '100%',
        duration: 2.5,
        ease: 'power3.out'
    })
    .to('body:not(.loaded) .main-content, body:not(.loaded) .navbar, body:not(.loaded) .footer', {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.inOut'
    }, '-=1.2')
    .to('.loading-screen', {
        opacity: 0,
        filter: 'blur(15px)',
        scale: 0.9,
        duration: 1.5,
        ease: 'power3.inOut',
        onComplete: () => {
            loadingScreen.style.display = 'none';
            document.body.classList.add('loaded');
            if (typeof initMainAnimations === 'function') {
                initMainAnimations();
            }
        }
    }, '-=1');
}

// Initialize loading when page loads
window.addEventListener('load', () => {
    initLoading();
});

// Enhanced scroll down arrow functionality
document.addEventListener('DOMContentLoaded', () => {
    const scrollDownArrow = document.getElementById('scrollDownArrow');
    
    if (scrollDownArrow) {
        // Enhanced click animation
        scrollDownArrow.addEventListener('click', () => {
            // Button press animation
            gsap.to(scrollDownArrow, {
                scale: 0.9,
                duration: 0.1,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
            
            // Smooth scroll to the next section
            const nextSection = document.getElementById('what-we-build');
            if (nextSection && window.smoothScrollTo) {
                window.smoothScrollTo(nextSection, 80);
            } else if (nextSection) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { 
                        y: nextSection,
                        offsetY: 80
                    },
                    ease: "power3.inOut"
                });
            }
            
            console.log('🔽 Enhanced scroll indicator clicked');
        });
        
        // Enhanced scroll fade out animation
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                gsap.to(scrollDownArrow, {
                    opacity: 0,
                    y: 15,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        scrollDownArrow.style.pointerEvents = 'none';
                    }
                });
            } else {
                gsap.to(scrollDownArrow, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        scrollDownArrow.style.pointerEvents = 'auto';
                    }
                });
            }
        }, { passive: true });
        
        console.log('🔽 Enhanced scroll indicator initialized');
    }
});

/**
 * Initialize smooth scrolling functionality using GSAP
 */
function initializeSmoothScroll() {
    console.log('🛼 Initializing enhanced smooth scroll...');
    
    // Enhanced scroll settings
    const scrollSettings = {
        duration: 1.4,
        ease: "power3.inOut"
    };
    
    // Handle all anchor links for smooth scrolling
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a[href^="#"]');
        
        if (target) {
            e.preventDefault();
            
            // Button press animation
            gsap.to(target, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });
            
            const targetId = target.getAttribute('href');
            
            if (targetId === '#' || targetId === '#top') {
                gsap.to(window, {
                    duration: scrollSettings.duration,
                    scrollTo: { y: 0 },
                    ease: scrollSettings.ease
                });
                console.log('🛼 Enhanced smooth scroll to top');
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const offset = navbarHeight + 20;
                
                gsap.to(window, {
                    duration: scrollSettings.duration,
                    scrollTo: { 
                        y: targetElement,
                        offsetY: offset
                    },
                    ease: scrollSettings.ease
                });
                
                console.log(`🛼 Enhanced smooth scroll to: ${targetId}`);
            }
        }
    });
    
    // Enhanced programmatic scrolling
    window.smoothScrollTo = (target, offset = 0) => {
        let scrollTarget;
        
        if (typeof target === 'string') {
            scrollTarget = document.querySelector(target);
        } else if (typeof target === 'number') {
            scrollTarget = target;
        } else {
            scrollTarget = target;
        }
        
        if (scrollTarget) {
            gsap.to(window, {
                duration: scrollSettings.duration,
                scrollTo: { 
                    y: scrollTarget,
                    offsetY: offset
                },
                ease: scrollSettings.ease
            });
        }
    };
    
    console.log('✅ Enhanced smooth scroll initialized');
}

/**
 * Enhanced navigation functionality with GSAP animations
 */
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinksContainer) {
        // Enhanced mobile menu toggle with GSAP
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navLinksContainer.classList.contains('mobile-active');
            
            if (!isActive) {
                // Opening animation
                navLinksContainer.classList.add('mobile-active');
                gsap.fromTo(navLinksContainer, 
                    { 
                        opacity: 0, 
                        y: -20, 
                        scale: 0.95 
                    },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.4, 
                        ease: "back.out(1.4)" 
                    }
                );
                
                // Animate menu items
                const navLinks = navLinksContainer.querySelectorAll('a');
                gsap.fromTo(navLinks,
                    { opacity: 0, x: -20 },
                    { 
                        opacity: 1, 
                        x: 0, 
                        duration: 0.3,
                        stagger: 0.1,
                        delay: 0.2,
                        ease: "power2.out"
                    }
                );
                
                mobileMenuBtn.textContent = '✖';
            } else {
                // Closing animation
                gsap.to(navLinksContainer, {
                    opacity: 0,
                    y: -10,
                    scale: 0.95,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        navLinksContainer.classList.remove('mobile-active');
                    }
                });
                
                mobileMenuBtn.textContent = '☰';
            }
        });
        
        // Enhanced close functionality
        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                gsap.to(navLinksContainer, {
                    opacity: 0,
                    y: -10,
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        navLinksContainer.classList.remove('mobile-active');
                        mobileMenuBtn.textContent = '☰';
                    }
                });
            });
        });
        
        // Enhanced outside click
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
                if (navLinksContainer.classList.contains('mobile-active')) {
                    gsap.to(navLinksContainer, {
                        opacity: 0,
                        y: -10,
                        duration: 0.2,
                        ease: "power2.in",
                        onComplete: () => {
                            navLinksContainer.classList.remove('mobile-active');
                            mobileMenuBtn.textContent = '☰';
                        }
                    });
                }
            }
        });
    }
    
    setActiveNavLink();
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Enhanced scroll effects with GSAP
 */
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero, .blog-header');

    if (navbar && heroSection) {
        let isScrolled = false;

        function updateNavbar() {
            const heroHeight = heroSection.offsetHeight;
            const scrollY = window.scrollY;
            const shouldScroll = scrollY > heroHeight - 100;

            if (shouldScroll && !isScrolled) {
                isScrolled = true;
                gsap.to(navbar, {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
                    duration: 0.4,
                    ease: "power2.out"
                });
                navbar.classList.add('scrolled');
            } else if (!shouldScroll && isScrolled) {
                isScrolled = false;
                gsap.to(navbar, {
                    backgroundColor: 'transparent',
                    backdropFilter: 'none',
                    boxShadow: 'none',
                    duration: 0.4,
                    ease: "power2.out"
                });
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', throttle(updateNavbar, 16), { passive: true });
    } else {
        console.log('📜 No hero/header section found, skipping scroll effects.');
    }
}

/**
 * Initialize form handling with enhanced animations
 */
function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

/**
 * Enhanced contact form submission with GSAP animations
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name')?.value?.trim() || '',
        email: document.getElementById('email')?.value?.trim() || '',
        company: document.getElementById('company')?.value?.trim() || '',
        automation: document.getElementById('automation')?.value?.trim() || ''
    };
    
    console.log('📋 Contact form data collected:', formData);
    
    if (!formData.name || !formData.email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Enhanced loading animation
    gsap.to(submitBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    });
    
    submitBtn.textContent = '⏳ Sending...';
    submitBtn.disabled = true;
    
    gsap.to(submitBtn, {
        opacity: 0.7,
        duration: 0.2,
        ease: "power2.out"
    });
    
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyq0Y_ILIVb2Ubs9Ye1FKuqLw7LHpOz7u9ZkxHStd_T7EVUaeds9ZqUZRnIzU3h4I1PrQ/exec';
    
    fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        console.log('✅ Contact form submitted successfully!');
        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
        e.target.reset();
    })
    .catch(error => {
        console.error('❌ Contact form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again or email us directly at hello@autoflowstudio.com', 'error');
    })
    .finally(() => {
        // Enhanced restore animation
        gsap.to(submitBtn, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Newsletter Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyee7JkEOt3kgtLiYHBRc--cbBf3p2GaxKN15Yq_fTlVpfE7VRArUpy9jf-9j0uB8wG/exec';

/**
 * Initialize newsletter functionality
 */
function initializeNewsletter() {
    const emailInput = document.querySelector('input[type="email"]');
    
    if (emailInput) {
        const newsletterButton = emailInput.nextElementSibling;
        
        if (newsletterButton && newsletterButton.classList.contains('cta-button')) {
            newsletterButton.addEventListener('click', handleNewsletterSubmit);
            console.log('📧 Newsletter button initialized for:', emailInput.placeholder);
        }
    } else {
        console.log('📧 No email input found - skipping newsletter initialization');
    }
}

/**
 * Enhanced newsletter submission with GSAP animations
 */
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.previousElementSibling;
    
    if (!emailInput || emailInput.type !== 'email') {
        console.error('Newsletter email input not found');
        showNotification('❌ Email input not found. Please refresh the page.', 'error');
        return;
    }
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter your email address.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    const originalText = e.target.textContent;
    
    // Enhanced button animation
    gsap.to(e.target, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    });
    
    e.target.textContent = 'Subscribing...';
    e.target.disabled = true;
    
    try {
        console.log('📧 Submitting newsletter subscription for:', email);
        
        await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        console.log('✅ Newsletter subscription submitted successfully!');
        showNotification('🎉 Successfully subscribed! Check your email for a welcome message.', 'success');
        emailInput.value = '';
        
    } catch (error) {
        console.error('❌ Newsletter subscription error:', error);
        showNotification('❌ Network error. Please try again.', 'error');
    } finally {
        e.target.textContent = originalText;
        e.target.disabled = false;
    }
}

/**
 * Initialize CTA button functionality with enhanced animations
 */
function initializeCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase().trim();
        const buttonHref = button.getAttribute('href');
        
        // Add hover animations to all CTA buttons
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                y: -2,
                boxShadow: '0 10px 25px rgba(233, 30, 99, 0.4)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                y: 0,
                boxShadow: '0 8px 25px rgba(233, 30, 99, 0.3)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Skip newsletter button (handled separately)
        if (button.previousElementSibling && button.previousElementSibling.type === 'email') {
            console.log('📧 Skipping newsletter button:', buttonText);
            return;
        }
        
        // Let "View Full Case Study" buttons work as normal links
        if (buttonText.includes('view full case study') || 
            (buttonHref && (buttonHref.includes('Project') || buttonHref.includes('.html')))) {
            console.log('📄 Case study link - letting it work normally:', buttonText, buttonHref);
            return;
        }
        
        // Handle booking/project buttons
        if (buttonText.includes('book') || 
            buttonText.includes('audit') || 
            buttonText.includes('start your project') ||
            buttonText.includes('schedule') ||
            buttonText.includes('get your free') ||
            (buttonHref && buttonHref.includes('calendly.com'))) {
            button.addEventListener('click', handleBookingClick);
            console.log('📞 Initialized booking button:', buttonText);
        }
        
        // Handle generic case study buttons
        else if (buttonText.includes('case study') && !buttonText.includes('view full')) {
            button.addEventListener('click', handleCaseStudyClick);
            console.log('📄 Initialized generic case study button:', buttonText);
        }
        
        // Handle learn more buttons
        else if (buttonText.includes('learn more')) {
            button.addEventListener('click', handleLearnMoreClick);
            console.log('📖 Initialized learn more button:', buttonText);
        }
    });
}

/**
 * Handle booking button clicks with enhanced feedback
 */
function handleBookingClick(e) {
    // Enhanced click animation
    gsap.to(e.target, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    });
    
    console.log('📞 Booking/Project button clicked:', e.target.textContent);
}

/**
 * Handle case study button clicks
 */
function handleCaseStudyClick(e) {
    e.preventDefault();
    
    gsap.to(e.target, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    });
    
    showNotification('Case study details would be shown here. For this demo, redirecting to portfolio page.', 'info');
    
    setTimeout(() => {
        window.location.href = 'portfolio.html';
    }, 2000);
}

/**
 * Handle learn more button clicks
 */
function handleLearnMoreClick(e) {
    e.preventDefault();
    
    gsap.to(e.target, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    });
    
    showNotification('More details would be shown here. For this demo, redirecting to contact page.', 'info');
    
    setTimeout(() => {
        window.location.href = 'contact.html';
    }, 2000);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Enhanced notification system with GSAP animations
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications with animation
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        gsap.to(notification, {
            x: '100%',
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => notification.remove()
        });
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                transform: translateX(100%);
                opacity: 0;
            }
            
            .notification-success {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9));
                color: white;
            }
            
            .notification-error {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
                color: white;
            }
            
            .notification-info {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9));
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
            }
            
            .notification-message {
                flex-grow: 1;
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .notification-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Enhanced slide-in animation
    gsap.fromTo(notification,
        { x: '100%', opacity: 0 },
        { 
            x: '0%', 
            opacity: 1, 
            duration: 0.4, 
            ease: "back.out(1.4)" 
        }
    );
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        gsap.to(notification, {
            x: '100%',
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => notification.remove()
        });
    });
    
    // Auto-remove with enhanced animation
    setTimeout(() => {
        if (notification.parentNode) {
            gsap.to(notification, {
                x: '100%',
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => notification.remove()
            });
        }
    }, 5000);
}

/**
 * Enhanced animations using Intersection Observer with GSAP
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Enhanced reveal animations based on element type
                if (element.classList.contains('feature-card')) {
                    gsap.fromTo(element,
                        { y: 60, opacity: 0, scale: 0.9 },
                        { 
                            y: 0, 
                            opacity: 1, 
                            scale: 1, 
                            duration: 0.8,
                            ease: "power3.out",
                            delay: Math.random() * 0.2
                        }
                    );
                } else if (element.classList.contains('testimonial')) {
                    gsap.fromTo(element,
                        { x: -40, opacity: 0 },
                        { 
                            x: 0, 
                            opacity: 1, 
                            duration: 0.8,
                            ease: "power3.out"
                        }
                    );
                } else if (element.classList.contains('step')) {
                    gsap.fromTo(element,
                        { y: 50, opacity: 0, rotationY: 15 },
                        { 
                            y: 0, 
                            opacity: 1, 
                            rotationY: 0,
                            duration: 1,
                            ease: "power3.out"
                        }
                    );
                } else {
                    // Default animation
                    gsap.fromTo(element,
                        { y: 40, opacity: 0 },
                        { 
                            y: 0, 
                            opacity: 1, 
                            duration: 0.6,
                            ease: "power2.out"
                        }
                    );
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const elementsToAnimate = document.querySelectorAll(`
        .feature-card,
        .step,
        .pricing-card,
        .testimonial,
        .blog-card,
        .portfolio-card,
        .work-stats .stat-item
    `);
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initialize additional GSAP interactions
 */
function initializeGSAPInteractions() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.feature-card, .testimonial, .step');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    console.log('✨ Enhanced GSAP interactions initialized');
}

/**
 * Test functions (unchanged)
 */
function testContactForm() {
    console.log('🧪 Testing contact form submission...');
    
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Company',
        automation: 'This is a test message to verify the form is working correctly.'
    };
    
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyq0Y_ILIVb2Ubs9Ye1FKuqLw7LHpOz7u9ZkxHStd_T7EVUaeds9ZqUZRnIzU3h4I1PrQ/exec';
    
    fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
    })
    .then(() => {
        console.log('✅ Test contact form submission successful!');
        showNotification('Test form submission completed! Check your Google Sheets and Notion.', 'success');
    })
    .catch(error => {
        console.error('❌ Test contact form submission failed:', error);
        showNotification('Test form submission failed: ' + error.message, 'error');
    });
}

function testNewsletter() {
    console.log('🧪 Testing newsletter subscription...');
    
    const testEmail = 'test@example.com';
    
    fetch(WEB_APP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail })
    })
    .then(response => response.json())
    .then(result => {
        console.log('✅ Test newsletter subscription result:', result);
        showNotification('Test newsletter subscription completed! Check your Google Sheets.', 'success');
    })
    .catch(error => {
        console.error('❌ Test newsletter subscription failed:', error);
        showNotification('Test newsletter subscription failed: ' + error.message, 'error');
    });
}

/**
 * Utility functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other scripts
window.AutoFlowStudio = {
    showNotification,
    isValidEmail,
    debounce,
    throttle,
    testContactForm,
    testNewsletter,
    smoothScrollTo: null // Will be set after initialization
};

console.log('✨ AutoFlow Studio Main JavaScript loaded with enhanced GSAP animations!');