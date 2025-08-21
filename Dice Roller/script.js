class DiceRoller {
    constructor() {
        this.rollHistory = [];
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.diceTypeSelect = document.getElementById('diceType');
        this.diceCountInput = document.getElementById('diceCount');
        this.rollBtn = document.getElementById('rollBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.diceDisplay = document.getElementById('diceDisplay');
        this.totalValue = document.getElementById('totalValue');
        this.rollCount = document.getElementById('rollCount');
        this.averageValue = document.getElementById('averageValue');
        this.highestValue = document.getElementById('highestValue');
    }

    attachEventListeners() {
        this.rollBtn.addEventListener('click', () => this.rollDice());
        this.clearBtn.addEventListener('click', () => this.clearResults());
        
        // Allow Enter key to roll dice
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.rollDice();
            }
        });

        // Validate dice count input
        this.diceCountInput.addEventListener('input', () => {
            const value = parseInt(this.diceCountInput.value);
            if (value < 1) this.diceCountInput.value = 1;
            if (value > 20) this.diceCountInput.value = 20;
        });
    }

    rollDice() {
        const diceType = parseInt(this.diceTypeSelect.value);
        const diceCount = parseInt(this.diceCountInput.value);
        
        if (diceCount < 1 || diceCount > 20) {
            this.showNotification('Please enter a valid number of dice (1-20)', 'error');
            return;
        }

        // Add rolling animation to button
        this.rollBtn.disabled = true;
        this.rollBtn.textContent = '🎲 Rolling...';

        // Generate dice results
        const results = [];
        for (let i = 0; i < diceCount; i++) {
            results.push(Math.floor(Math.random() * diceType) + 1);
        }

        // Calculate total
        const total = results.reduce((sum, value) => sum + value, 0);

        // Store in history
        this.rollHistory.push({
            diceType,
            diceCount,
            results,
            total,
            timestamp: new Date()
        });

        // Display results with animation delay
        setTimeout(() => {
            this.displayResults(results, total, diceType);
            this.updateStats();
            this.rollBtn.disabled = false;
            this.rollBtn.textContent = '🎲 Roll Dice';
        }, 300);
    }

    displayResults(results, total, diceType) {
        // Clear previous results
        this.diceDisplay.innerHTML = '';

        // Create dice elements with staggered animation
        results.forEach((value, index) => {
            const diceElement = document.createElement('div');
            diceElement.className = 'dice';
            diceElement.textContent = value;
            diceElement.title = `D${diceType}: ${value}`;
            
            // Add staggered animation delay
            diceElement.style.animationDelay = `${index * 0.1}s`;
            
            this.diceDisplay.appendChild(diceElement);
        });

        // Update total with animation
        this.animateNumber(this.totalValue, parseInt(this.totalValue.textContent) || 0, total);
    }

    animateNumber(element, start, end) {
        const duration = 500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    updateStats() {
        const totalRolls = this.rollHistory.length;
        const allTotals = this.rollHistory.map(roll => roll.total);
        const average = allTotals.reduce((sum, total) => sum + total, 0) / totalRolls;
        const highest = Math.max(...allTotals);

        this.rollCount.textContent = totalRolls;
        this.averageValue.textContent = average.toFixed(1);
        this.highestValue.textContent = highest;
    }

    clearResults() {
        // Clear display with fade out effect
        this.diceDisplay.style.opacity = '0.5';
        
        setTimeout(() => {
            this.diceDisplay.innerHTML = '';
            this.diceDisplay.style.opacity = '1';
            this.totalValue.textContent = '0';
            this.rollHistory = [];
            this.rollCount.textContent = '0';
            this.averageValue.textContent = '0';
            this.highestValue.textContent = '0';
            
            this.showNotification('Results cleared!', 'success');
        }, 200);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Get dice emoji based on value (for D6 only)
    getDiceEmoji(value) {
        const diceEmojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceEmojis[value] || value.toString();
    }

    // Export roll history as JSON
    exportHistory() {
        const dataStr = JSON.stringify(this.rollHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `dice-rolls-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Roll history exported!', 'success');
    }
}

// Initialize the dice roller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const diceRoller = new DiceRoller();
    
    // Make it globally accessible for debugging
    window.diceRoller = diceRoller;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'r':
                    e.preventDefault();
                    diceRoller.rollDice();
                    break;
                case 'c':
                    e.preventDefault();
                    diceRoller.clearResults();
                    break;
                case 'e':
                    e.preventDefault();
                    diceRoller.exportHistory();
                    break;
            }
        }
    });

    // Add touch support for mobile
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - roll dice
                diceRoller.rollDice();
            } else {
                // Swipe down - clear results
                diceRoller.clearResults();
            }
        }
    }

    // Add visual feedback for touch interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });
});
