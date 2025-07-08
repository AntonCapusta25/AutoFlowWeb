// AutoFlow Studio - Carousel JavaScript
// Handles the work examples carousel on the home page

document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
});

/**
 * Initialize the carousel functionality
 */
function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    
    // Only initialize if carousel exists (home page)
    if (!track) return;
    
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const indicatorsContainer = document.getElementById('indicators');
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    const timerProgress = document.getElementById('timerProgress');
    const carouselContainer = document.querySelector('.carousel-container');
    
    // Carousel state
    const slideCount = slides.length;
    let currentIndex = 0;
    let autoPlay = true;
    let autoPlayInterval;
    const autoPlayTime = 5000; // 5 seconds
    let isUserInteracting = false;
    
    // Create indicators
    createIndicators();
    
    // Initialize carousel
    updateCarousel(true);
    
    // Event listeners
    setupEventListeners();
    
    /**
     * Create indicator dots
     */
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < slideCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.setAttribute('data-slide', i);
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('tabindex', '0');
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    /**
     * Update carousel position and UI
     */
    function updateCarousel(isInstant = false) {
        // Handle CSS transitions
        if (isInstant) {
            track.style.transition = 'none';
        }
        
        // Move track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Restore transition after instant movement
        if (isInstant) {
            setTimeout(() => {
                track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 50);
        }
        
        // Update indicators
        updateIndicators();
        
        // Update timer if autoplay is on
        if (autoPlay && !isUserInteracting) {
            resetTimer();
        }
        
        // Update ARIA attributes
        updateAriaAttributes();
    }
    
    /**
     * Update indicator states
     */
    function updateIndicators() {
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
            indicator.setAttribute('aria-selected', index === currentIndex);
        });
    }
    
    /**
     * Update ARIA attributes for accessibility
     */
    function updateAriaAttributes() {
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.setAttribute('aria-hidden', !isActive);
            
            // Update focusable elements within slides
            const focusableElements = slide.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
            focusableElements.forEach(el => {
                el.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        });
    }
    
    /**
     * Timer functions for autoplay
     */
    function startTimer() {
        if (!autoPlay || isUserInteracting) return;
        
        clearTimeout(autoPlayInterval);
        
        // Reset progress bar
        timerProgress.style.transition = 'none';
        timerProgress.style.width = '0%';
        
        // Start progress animation
        setTimeout(() => {
            timerProgress.style.transition = `width ${autoPlayTime}ms linear`;
            timerProgress.style.width = '100%';
        }, 50);
        
        // Set timeout for next slide
        autoPlayInterval = setTimeout(() => {
            nextSlide();
        }, autoPlayTime);
    }
    
    function resetTimer() {
        startTimer();
    }
    
    function pauseTimer() {
        clearTimeout(autoPlayInterval);
        
        // Pause progress bar animation
        const computedWidth = getComputedStyle(timerProgress).width;
        timerProgress.style.transition = 'none';
        timerProgress.style.width = computedWidth;
    }
    
    function stopTimer() {
        clearTimeout(autoPlayInterval);
        timerProgress.style.transition = 'none';
        timerProgress.style.width = '0%';
    }
    
    /**
     * Navigation functions
     */
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
        announceSlideChange();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
        announceSlideChange();
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < slideCount && index !== currentIndex) {
            currentIndex = index;
            updateCarousel();
            announceSlideChange();
        }
    }
    
    /**
     * Toggle autoplay functionality
     */
    function toggleAutoPlay() {
        autoPlay = !autoPlay;
        autoPlayBtn.classList.toggle('active', autoPlay);
        autoPlayBtn.textContent = autoPlay ? 'Auto Play' : 'Manual';
        autoPlayBtn.setAttribute('aria-pressed', autoPlay);
        
        if (autoPlay) {
            startTimer();
        } else {
            stopTimer();
        }
        
        // Announce change to screen readers
        const announcement = autoPlay ? 'Autoplay enabled' : 'Autoplay disabled';
        announceToScreenReader(announcement);
    }
    
    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Navigation buttons
        nextBtn.addEventListener('click', () => {
            setUserInteracting(true);
            nextSlide();
            setTimeout(() => setUserInteracting(false), 1000);
        });
        
        prevBtn.addEventListener('click', () => {
            setUserInteracting(true);
            prevSlide();
            setTimeout(() => setUserInteracting(false), 1000);
        });
        
        // Autoplay toggle
        autoPlayBtn.addEventListener('click', toggleAutoPlay);
        
        // Indicators
        indicatorsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator')) {
                const slideIndex = parseInt(e.target.dataset.slide);
                setUserInteracting(true);
                goToSlide(slideIndex);
                setTimeout(() => setUserInteracting(false), 1000);
            }
        });
        
        // Keyboard navigation for indicators
        indicatorsContainer.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('indicator') && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                const slideIndex = parseInt(e.target.dataset.slide);
                setUserInteracting(true);
                goToSlide(slideIndex);
                setTimeout(() => setUserInteracting(false), 1000);
            }
        });
        
        // Mouse interaction with carousel
        carouselContainer.addEventListener('mouseenter', () => {
            if (autoPlay) {
                pauseTimer();
            }
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            if (autoPlay && !isUserInteracting) {
                resetTimer();
            }
        });
        
        // Keyboard navigation for entire carousel
        document.addEventListener('keydown', (e) => {
            // Only handle if we're on the home page and carousel is visible
            if (!isOnHomePage() || !isCarouselVisible()) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setUserInteracting(true);
                prevSlide();
                setTimeout(() => setUserInteracting(false), 1000);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setUserInteracting(true);
                nextSlide();
                setTimeout(() => setUserInteracting(false), 1000);
            }
        });
        
        // Touch/swipe support
        setupTouchSupport();
        
        // Visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseTimer();
            } else if (autoPlay && !isUserInteracting) {
                resetTimer();
            }
        });
    }
    
    /**
     * Setup touch/swipe support
     */
    function setupTouchSupport() {
        let startX = 0;
        let startY = 0;
        let moveX = 0;
        let moveY = 0;
        let isMoving = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isMoving = true;
            setUserInteracting(true);
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (!isMoving) return;
            
            moveX = e.touches[0].clientX;
            moveY = e.touches[0].clientY;
            
            // Calculate distances
            const deltaX = Math.abs(moveX - startX);
            const deltaY = Math.abs(moveY - startY);
            
            // If horizontal movement is greater than vertical, prevent scrolling
            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        track.addEventListener('touchend', (e) => {
            if (!isMoving) return;
            
            const endX = e.changedTouches[0].clientX;
            const deltaX = startX - endX;
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            
            isMoving = false;
            setTimeout(() => setUserInteracting(false), 1000);
        }, { passive: true });
    }
    
    /**
     * Utility functions
     */
    function setUserInteracting(interacting) {
        isUserInteracting = interacting;
    }
    
    function isOnHomePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        return currentPage === 'index.html' || currentPage === '';
    }
    
    function isCarouselVisible() {
        const rect = carouselContainer.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }
    
    function announceSlideChange() {
        const currentSlideTitle = slides[currentIndex].querySelector('.work-content h2').textContent;
        announceToScreenReader(`Now showing: ${currentSlideTitle}`);
    }
    
    function announceToScreenReader(message) {
        // Create or update live region for screen reader announcements
        let liveRegion = document.getElementById('carousel-live-region');
        
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'carousel-live-region';
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
    
    // Initialize with first timer start
    if (autoPlay) {
        startTimer();
    }
}

// Export carousel controls for external use
window.CarouselControls = {
    goToSlide: (index) => {
        const event = new CustomEvent('carousel:goToSlide', { detail: { index } });
        document.dispatchEvent(event);
    },
    next: () => {
        const event = new CustomEvent('carousel:next');
        document.dispatchEvent(event);
    },
    prev: () => {
        const event = new CustomEvent('carousel:prev');
        document.dispatchEvent(event);
    },
    toggleAutoPlay: () => {
        const event = new CustomEvent('carousel:toggleAutoPlay');
        document.dispatchEvent(event);
    }
};