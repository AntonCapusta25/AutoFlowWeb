// AutoFlow Studio - Main JavaScript
// Common functionality across all pages

document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Functionality ---
    initializeNavigation();
    
    // --- Scroll Effects ---
    initializeScrollEffects();
    
    // --- Form Handling ---
    initializeFormHandling();
    
    // --- Animation Observers ---
    initializeAnimations();
    
    // --- CTA Button Functionality ---
    initializeCTAButtons();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinksContainer) {
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navLinksContainer.classList.toggle('mobile-active');
            mobileMenuBtn.textContent = isActive ? '✖' : '☰';
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-active');
                mobileMenuBtn.textContent = '☰';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
                navLinksContainer.classList.remove('mobile-active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    }
    
    // Set active nav link based on current page
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
 * Initialize scroll effects for navbar
 */
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        let ticking = false;
        
        function updateNavbar() {
            const heroSection = document.querySelector('.hero, .blog-header');
            
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                const scrollY = window.scrollY;
                
                if (scrollY > heroHeight - 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
}

/**
 * Initialize form handling
 */
function initializeFormHandling() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
    
    // Newsletter form (if exists)
    const newsletterForm = document.querySelector('input[type="email"][placeholder*="email"]');
    if (newsletterForm) {
        const submitBtn = newsletterForm.nextElementSibling;
        if (submitBtn && submitBtn.classList.contains('cta-button')) {
            submitBtn.addEventListener('click', handleNewsletterSubmit);
        }
    }
}

/**
 * Handle contact form submission
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

/**
 * Handle newsletter submission
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.previousElementSibling;
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
    e.target.textContent = 'Subscribing...';
    e.target.disabled = true;
    
    setTimeout(() => {
        showNotification('Thanks for subscribing! Check your email to confirm.', 'success');
        emailInput.value = '';
        e.target.textContent = originalText;
        e.target.disabled = false;
    }, 1500);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
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
                animation: slideInFromRight 0.3s ease;
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
            
            @keyframes slideInFromRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutToRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutToRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Initialize animations using Intersection Observer
 */
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
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
 * Initialize CTA button functionality
 */
function initializeCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        
        // Handle booking buttons
        if (buttonText.includes('book') || buttonText.includes('audit')) {
            button.addEventListener('click', handleBookingClick);
        }
        
        // Handle case study buttons
        if (buttonText.includes('case study')) {
            button.addEventListener('click', handleCaseStudyClick);
        }
        
        // Handle learn more buttons
        if (buttonText.includes('learn more')) {
            button.addEventListener('click', handleLearnMoreClick);
        }
    });
}

/**
 * Handle booking button clicks
 */
function handleBookingClick(e) {
    e.preventDefault();
    
    // In a real application, this would open a Calendly widget or similar
    showNotification('This would normally open a Calendly booking widget. For this demo, redirecting to the contact page.', 'info');
    
    // Redirect to contact page after a brief delay
    setTimeout(() => {
        window.location.href = 'contact.html';
    }, 2000);
}

/**
 * Handle case study button clicks
 */
function handleCaseStudyClick(e) {
    e.preventDefault();
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
    showNotification('More details would be shown here. For this demo, redirecting to contact page.', 'info');
    
    setTimeout(() => {
        window.location.href = 'contact.html';
    }, 2000);
}

/**
 * Utility function to debounce function calls
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

/**
 * Utility function to throttle function calls
 */
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
    throttle
};