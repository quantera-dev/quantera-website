// ==========================================
// QUANTERA - Marketing Website JavaScript
// ==========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initScrollEffects();
    initCharts();
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

// ==========================================
// CHARTS INITIALIZATION
// ==========================================
function initCharts() {
    console.log('Initializing charts...');

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded! Charts will not display.');

        // Show error message to user
        const chartWrappers = document.querySelectorAll('.chart-wrapper');
        chartWrappers.forEach(wrapper => {
            wrapper.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ef4444; font-size: 14px;">Chart library failed to load. Please refresh the page.</div>';
        });
        return;
    }

    console.log('Chart.js loaded successfully');

    try {
        // Chart.js default configuration
        Chart.defaults.color = '#a1a1a1';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif';

        // Initialize Chart 1: Time Comparison Chart
        console.log('Initializing time comparison chart...');
        initTimeComparisonChart();

        // Initialize Chart 2: Financial Impact Chart
        console.log('Initializing financial impact chart...');
        initFinancialImpactChart();

        console.log('All charts initialized successfully!');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// ==========================================
// CHART 1: TIME WASTED VS TIME SAVED
// ==========================================
function initTimeComparisonChart() {
    const ctx = document.getElementById('timeComparisonChart');
    if (!ctx) {
        console.warn('Time comparison chart canvas not found');
        return;
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Searching for data', 'Duplicating work', 'Total Productivity Gain'],
            datasets: [
                {
                    label: 'Traditional Workflow (hrs/day)',
                    data: [2.5, 1.1, 0], // Total will be shown separately
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                },
                {
                    label: 'With Quantera (hrs/day)',
                    data: [0.083, 0.167, 0], // 5 min = 0.083 hrs, 10 min = 0.167 hrs
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                },
                {
                    label: 'Hours Saved per Year (100 employees, in thousands)',
                    data: [0, 0, 85], // 85,000 hours shown as 85 (in thousands)
                    backgroundColor: 'rgba(236, 72, 153, 0.8)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#d1d5db',
                        usePointStyle: true,
                        pointStyle: 'rect',
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 17, 17, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#d1d5db',
                    borderColor: 'rgba(236, 72, 153, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.datasetIndex === 2) {
                                // For hours saved, show in thousands
                                label += context.parsed.y + 'k hours';
                            } else {
                                label += context.parsed.y + ' hrs/day';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            }
        }
    });
}

// ==========================================
// CHART 2: FINANCIAL IMPACT
// ==========================================
function initFinancialImpactChart() {
    const ctx = document.getElementById('financialImpactChart');
    if (!ctx) {
        console.warn('Financial impact chart canvas not found');
        return;
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['100 Employees', '1,000 Employees'],
            datasets: [
                {
                    label: 'Lost Productivity (Before Quantera)',
                    data: [0.65, 6.5], // In millions
                    backgroundColor: 'rgba(239, 68, 68, 0.8)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                },
                {
                    label: 'Annual Savings (With Quantera)',
                    data: [4.2, 42], // In millions
                    backgroundColor: 'rgba(34, 197, 94, 0.8)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#d1d5db',
                        usePointStyle: true,
                        pointStyle: 'rect',
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 17, 17, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#d1d5db',
                    borderColor: 'rgba(236, 72, 153, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += '$' + context.parsed.y + 'M';
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return '$' + value + 'M';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}
