// ==========================================
// QUANTERA - Marketing Website JavaScript
// ==========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initScrollEffects();
});

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Animate hamburger icon
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ==========================================
// SMOOTH SCROLLING
// ==========================================
function initSmoothScroll() {
    // Add smooth scrolling to all links with hash
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or targets non-existent elements
            if (href === '#' || href === '#privacy' || href === '#terms') {
                return;
            }

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();

                // Get navbar height for offset
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;

                // Calculate target position
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;

                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// CONTACT FORM HANDLING
// ==========================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent redirect to web3forms.com/success

            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Get form data
            const formData = new FormData(form);

            // Submit to Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showFormMessage('success', 'Message sent successfully!');
                    form.reset();
                } else {
                    showFormMessage('error', 'Failed to send message. Please try again.');
                }
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            })
            .catch(error => {
                showFormMessage('error', 'Failed to send message. Please try again.');
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
}

// ==========================================
// FORM MESSAGE DISPLAY
// ==========================================
function showFormMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;

    // Add styles
    messageDiv.style.padding = '1rem';
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.borderRadius = '0.5rem';
    messageDiv.style.fontWeight = '500';

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d1fae5';
        messageDiv.style.color = '#065f46';
        messageDiv.style.border = '2px solid #10b981';
    } else {
        messageDiv.style.backgroundColor = '#fee2e2';
        messageDiv.style.color = '#991b1b';
        messageDiv.style.border = '2px solid #ef4444';
    }

    // Insert message before form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.5s';
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 500);
    }, 5000);
}

// ==========================================
// SCROLL EFFECTS (NAVBAR SHADOW)
// ==========================================
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });
}

// ==========================================
// ANALYTICS & TRACKING (FOR SALES TEAM)
// ==========================================

// Track CTA button clicks
document.addEventListener('click', function(e) {
    const target = e.target;

    // Track demo requests
    if (target.closest('.btn-primary') && target.textContent.includes('Demo')) {
        trackEvent('CTA', 'Click', 'Request Demo');
    }

    // Track sales contact
    if (target.closest('.btn') && target.textContent.includes('Sales')) {
        trackEvent('CTA', 'Click', 'Contact Sales');
    }

    // Track pricing interactions
    if (target.closest('.pricing-card')) {
        const planName = target.closest('.pricing-card').querySelector('h3').textContent;
        trackEvent('Pricing', 'View', planName);
    }
});

// Generic event tracking function
// Replace with your analytics platform (Google Analytics, Mixpanel, etc.)
function trackEvent(category, action, label) {
    console.log(`Event tracked: ${category} - ${action} - ${label}`);

    // Example: Google Analytics 4
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }

    // Example: Facebook Pixel
    // if (typeof fbq !== 'undefined') {
    //     fbq('track', action, {
    //         category: category,
    //         label: label
    //     });
    // }
}

// ==========================================
// PAGE VISIBILITY TRACKING
// ==========================================

// Track which sections users spend time on
let sectionTimers = {};
let currentSection = null;

function initSectionTracking() {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Start timer for this section
                if (currentSection && sectionTimers[currentSection]) {
                    const timeSpent = Date.now() - sectionTimers[currentSection];
                    trackEvent('Section', 'Time Spent', `${currentSection}: ${Math.round(timeSpent / 1000)}s`);
                }

                currentSection = sectionId;
                sectionTimers[sectionId] = Date.now();
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

// Initialize section tracking
initSectionTracking();

// ==========================================
// SALES TEAM UTILITIES
// ==========================================

// Log page visits
console.log('%c🚀 Quantera Marketing Website', 'font-size: 16px; font-weight: bold; color: #0ea5e9;');
console.log('%cFor sales team support, contact: quantera4us@gmail.com', 'color: #6b7280;');
