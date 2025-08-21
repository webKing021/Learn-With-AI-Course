// Multi-Agency Hero Slider JavaScript

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let autoSlideInterval = null;

// Initialize slider
document.addEventListener('DOMContentLoaded', function() {
    if (totalSlides === 0) return;
    showSlide(currentSlideIndex);
    startAutoSlide();
    
    // Pause auto-slide on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
});

// Show specific slide
function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev');
    });
    if (indicators && indicators.length) {
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
    }
    
    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    if (indicators && indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    // Add prev class to previous slide for smooth transition
    const prevIndex = index === 0 ? totalSlides - 1 : index - 1;
    slides[prevIndex].classList.add('prev');
    
    // Trigger text animation
    const heroText = slides[index].querySelector('.hero-text');
    if (heroText) {
        heroText.style.animation = 'none';
        setTimeout(() => {
            heroText.style.animation = 'slideInUp 1s ease-out both';
        }, 50);
    }
}

// Navigate to next slide
function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

// Navigate to previous slide
function prevSlide() {
    currentSlideIndex = currentSlideIndex === 0 ? totalSlides - 1 : currentSlideIndex - 1;
    showSlide(currentSlideIndex);
}

// Change slide (used by navigation buttons)
function changeSlide(direction) {
    stopAutoSlide();
    if (direction === 1) {
        nextSlide();
    } else {
        prevSlide();
    }
    startAutoSlide();
}

// Go to specific slide (used by indicators)
function currentSlide(index) {
    stopAutoSlide();
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
    startAutoSlide();
}

// Start automatic slideshow
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Stop automatic slideshow
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'ArrowRight':
            changeSlide(1);
            break;
        case ' ': // Spacebar to pause/resume
            event.preventDefault();
            if (autoSlideInterval) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
            break;
    }
});

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            changeSlide(-1); // Swipe right - go to previous slide
        } else {
            changeSlide(1); // Swipe left - go to next slide
        }
    }
}

// Preload background effects animations
function initializeBackgroundEffects() {
    // Add dynamic particles for gaming theme
    const gamingSlide = document.querySelector('.gaming-agency');
    if (gamingSlide) {
        const particlesContainer = gamingSlide.querySelector('.floating-particles');
        // Additional particle effects can be added here
    }
    
    // Add dynamic film effects for movie theme
    const movieSlide = document.querySelector('.movie-agency');
    if (movieSlide) {
        const filmStrip = movieSlide.querySelector('.film-strip');
        // Additional film effects can be added here
    }
    
    // Add dynamic circuit effects for robotics theme
    const roboticsSlide = document.querySelector('.robotics-agency');
    if (roboticsSlide) {
        const circuitBoard = roboticsSlide.querySelector('.circuit-board');
        // Additional circuit effects can be added here
    }
    
    // Add dynamic code effects for web theme
    const webSlide = document.querySelector('.web-agency');
    if (webSlide) {
        const codeRain = webSlide.querySelector('.code-rain');
        // Additional code effects can be added here
    }
}

// Initialize background effects when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBackgroundEffects);

// Performance optimization - pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoSlide();
        // Pause CSS animations
        document.body.style.animationPlayState = 'paused';
    } else {
        startAutoSlide();
        // Resume CSS animations
        document.body.style.animationPlayState = 'running';
    }
});

// Smooth scroll behavior for better UX
window.addEventListener('load', function() {
    document.body.style.overflow = 'hidden';
    
    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});
