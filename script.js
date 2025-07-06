// Global variables
let fishData = [];
let isLoading = false;

// DOM elements
const fishGallery = document.getElementById('fish-gallery');
const loadingElement = document.getElementById('loading');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load fish data
    loadFishData();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize intersection observer for animations
    initializeIntersectionObserver();
});

/**
 * Load fish data from JSON file
 */
async function loadFishData() {
    try {
        showLoading(true);
        
        const response = await fetch('fish-data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        fishData = await response.json();
        
        if (!Array.isArray(fishData)) {
            throw new Error('Fish data must be an array');
        }
        
        renderFishCards();
        
    } catch (error) {
        console.error('Error loading fish data:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Show or hide loading indicator
 */
function showLoading(show) {
    isLoading = show;
    loadingElement.style.display = show ? 'block' : 'none';
}

/**
 * Display error message
 */
function showError(message) {
    fishGallery.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #e74c3c; grid-column: 1 / -1;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
            <h3>เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
            <p>กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่</p>
            <button onclick="loadFishData()" style="
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: #88c9bf;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">ลองใหม่</button>
        </div>
    `;
}

/**
 * Render fish cards in the gallery
 */
function renderFishCards() {
    if (!fishData.length) {
        fishGallery.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666; grid-column: 1 / -1;">
                <i class="fas fa-fish" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>ยังไม่มีปลาในระบบ</h3>
                <p>เจ้าหน้าที่กำลังเพิ่มปลาใหม่ กรุณารอสักครู่</p>
            </div>
        `;
        return;
    }

    let cardsHTML = '';
    
    fishData.forEach((fish, index) => {
        // Validate fish data
        if (!fish.image || !fish.description || !fish.price) {
            console.warn(`Fish at index ${index} is missing required fields:`, fish);
            return;
        }
        
        // Ensure videoFile exists, use empty string if not
        const videoFile = fish.videoFile || '';

        cardsHTML += `
            <div class="fish-card" data-index="${index}">
                <div class="fish-image-container" onclick="playFishVideo('${videoFile}', '${escapeHtml(fish.description)}')">
                    <img 
                        src="${escapeHtml(fish.image)}" 
                        alt="${escapeHtml(fish.description)}"
                        onerror="handleImageError(this)"
                        loading="lazy"
                    >
                    <div class="video-play-overlay">
                        <i class="fas fa-play"></i>
                        <span>ดูวิดีโอ</span>
                    </div>
                </div>
                <div class="desc">
                    ${fish.title ? `<h2 class="fish-title">${escapeHtml(fish.title)}</h2>` : ''}
                    <p>${escapeHtml(fish.description)}</p>
                    <strong>${escapeHtml(fish.price)}</strong>
                    <div class="action-buttons">
                        <a href="https://line.me/ti/p/@834wrclo" 
                           class="line-button" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           onclick="trackLineClick('${escapeHtml(fish.description)}')">
                            <i class="fab fa-line"></i>
                            📲 สอบถามผ่าน LINE
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    fishGallery.innerHTML = cardsHTML;
    
    // Add animation delay to cards
    const cards = fishGallery.querySelectorAll('.fish-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Handle image loading errors
 */
function handleImageError(img) {
    img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f0f8ff"/><text x="150" y="100" text-anchor="middle" fill="%23888" font-family="Arial" font-size="14">ไม่สามารถโหลดรูปภาพได้</text><circle cx="150" cy="120" r="20" fill="%23ddd"/><path d="M135 115 L165 115 M150 105 L150 135" stroke="%23888" stroke-width="2"/></svg>';
    img.alt = 'ไม่สามารถโหลดรูปภาพได้';
    img.style.opacity = '0.7';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Track LINE button clicks (for analytics)
 */
function trackLineClick(fishDescription) {
    // Here you could send analytics data if needed
    console.log('LINE clicked for fish:', fishDescription);
    
    // Optional: You could use Google Analytics or other tracking here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact', {
            'event_category': 'line_click',
            'event_label': fishDescription
        });
    }
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Update mobile menu icon
            updateMobileMenuIcon();
        });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', highlightActiveSection);
}

/**
 * Highlight active navigation section based on scroll position
 */
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Default to home if no section is active
    if (!current) {
        current = 'home';
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        updateMobileMenuIcon();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            updateMobileMenuIcon();
        }
    });
    
    // Close mobile menu on window resize if it becomes desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            updateMobileMenuIcon();
        }
    });
}

/**
 * Update mobile menu icon based on state
 */
function updateMobileMenuIcon() {
    const icon = mobileMenuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

/**
 * Initialize intersection observer for scroll animations
 */
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.feature-item, .step, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Header scroll effect
 */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(136, 201, 191, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #88c9bf 0%, #6ba3d6 100%)';
        header.style.backdropFilter = 'none';
    }
});

/**
 * Add loading states to buttons
 */
function addButtonLoadingState(button, text = 'กำลังโหลด...') {
    const originalText = button.innerHTML;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.disabled = true;
    
    return function restore() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

/**
 * Utility function to format Thai numbers
 */
function formatThaiNumber(number) {
    return new Intl.NumberFormat('th-TH').format(number);
}

/**
 * Check if user prefers reduced motion
 */
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Error boundary for JavaScript errors
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // You could send this to an error tracking service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.toString(),
            'fatal': false
        });
    }
});

/**
 * Handle offline/online status
 */
window.addEventListener('online', function() {
    // Retry loading fish data if it failed due to network issues
    if (!fishData.length && !isLoading) {
        loadFishData();
    }
});

window.addEventListener('offline', function() {
    console.warn('Application is offline');
    // You could show an offline indicator here
});

/**
 * Play fish video in modal
 */
function playFishVideo(videoFile, fishDescription) {
    console.log('Playing video:', videoFile, 'for fish:', fishDescription);
    
    // Check if videoFile is valid
    if (!videoFile || videoFile === '') {
        alert('วิดีโอของ ' + fishDescription + ' จะมาเร็วๆ นี้! \nติดต่อทาง LINE เพื่อดูปลาตัวจริง @834wrclo');
        return;
    }
    
    const modal = document.getElementById('videoModal');
    const videoElement = document.getElementById('videoPlayer');
    
    if (!modal || !videoElement) {
        console.error('Video modal or player not found');
        alert('เกิดข้อผิดพลาดในการเล่นวิดีโอ');
        return;
    }
    
    // Reset video element
    videoElement.pause();
    videoElement.currentTime = 0;
    videoElement.removeAttribute('data-retry');
    
    // Set the video source
    videoElement.src = videoFile;
    console.log('Video source set to:', videoElement.src);
    
    // Show the modal
    modal.style.display = 'block';
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Show loading indicator
    const loadingDiv = document.getElementById('videoLoading');
    if (loadingDiv) {
        loadingDiv.style.display = 'block';
    }
    
    // Remove any existing event listeners to prevent conflicts
    videoElement.onloadstart = null;
    videoElement.onloadeddata = null;
    videoElement.onerror = null;
    
    // Handle video loading events with simple event handlers
    videoElement.onloadstart = () => {
        console.log('Video loading started');
        if (loadingDiv) loadingDiv.style.display = 'block';
    };
    
    videoElement.onloadeddata = () => {
        console.log('Video data loaded');
        if (loadingDiv) loadingDiv.style.display = 'none';
    };
    
    videoElement.onerror = (e) => {
        console.error('Video error:', e);
        if (loadingDiv) loadingDiv.style.display = 'none';
        console.log('Video failed to load, user can try again');
    };
    
    // Prevent fullscreen behavior on mobile
    videoElement.addEventListener('webkitbeginfullscreen', function(e) {
        e.preventDefault();
    });
    
    videoElement.addEventListener('webkitendfullscreen', function(e) {
        e.preventDefault();
    });
    
    // Load and play the video
    videoElement.load();
    
    // Try to play after a small delay to ensure loading
    setTimeout(() => {
        videoElement.play().then(() => {
            console.log('Video playing successfully');
            if (loadingDiv) loadingDiv.style.display = 'none';
        }).catch(error => {
            console.error('Error playing video:', error);
            if (loadingDiv) loadingDiv.style.display = 'none';
            alert('ไม่สามารถเล่นวิดีโอได้ กรุณาลองอีกครั้ง\nError: ' + error.message);
            closeVideo();
        });
    }, 100);
    
    // Track video view
    trackLineClick('Video viewed: ' + fishDescription);
}

/**
 * Close video modal
 */
function closeVideo() {
    const modal = document.getElementById('videoModal');
    const videoElement = document.getElementById('videoPlayer');
    
    // Stop and reset the video
    videoElement.pause();
    videoElement.currentTime = 0;
    videoElement.src = '';
    
    // Hide the modal
    modal.style.display = 'none';
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
    
    // Scroll to top of page (home section)
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Handle escape key to close video
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeVideo();
    }
});



// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadFishData,
        renderFishCards,
        escapeHtml,
        trackLineClick,
        playFishVideo,
        closeVideo
    };
}
