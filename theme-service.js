console.log("theme-service.js loaded");

const ThemeService = {
    // Theme constants
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },
    
    // Get current theme from localStorage or default to light
    getCurrentTheme: function() {
        return localStorage.getItem('epic-ai-theme') || this.THEMES.LIGHT;
    },
    
    // Set theme and save to localStorage
    setTheme: function(theme) {
        localStorage.setItem('epic-ai-theme', theme);
        this.applyTheme(theme);
    },
    
    // Toggle between light and dark themes
    toggleTheme: function() {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
        this.setTheme(newTheme);
        return newTheme;
    },
    
    // Apply theme to document
    applyTheme: function(theme) {
        document.body.classList.remove(this.THEMES.LIGHT, this.THEMES.DARK);
        document.body.classList.add(theme);
        
        // Update theme color meta tag for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === this.THEMES.DARK ? '#1a1a2e' : '#3498db');
        }
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    },
    
    // Initialize theme service
    init: function() {
        // Apply saved theme on load
        const savedTheme = this.getCurrentTheme();
        this.applyTheme(savedTheme);
        
        // Create theme toggle button if it doesn't exist
        if (!document.getElementById('theme-toggle')) {
            const themeToggle = document.createElement('button');
            themeToggle.id = 'theme-toggle';
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = `<span class="theme-toggle-icon">🌓</span>`;
            themeToggle.setAttribute('aria-label', 'Toggle dark mode');
            themeToggle.setAttribute('title', 'Toggle dark mode');
            
            // Add click event listener
            themeToggle.addEventListener('click', () => {
                const newTheme = this.toggleTheme();
                themeToggle.setAttribute('aria-label', `Toggle ${newTheme === this.THEMES.DARK ? 'light' : 'dark'} mode`);
                themeToggle.setAttribute('title', `Toggle ${newTheme === this.THEMES.DARK ? 'light' : 'dark'} mode`);
            });
            
            // Add to header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(themeToggle);
            }
        }
    }
};

// Initialize theme service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ThemeService.init();
});