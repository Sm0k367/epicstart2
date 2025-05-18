/**
 * Epic Tech AI - Enhancements
 * 
 * This file integrates all enhancement services for the Epic Tech AI chatbot.
 */

console.log("Loading Epic Tech AI enhancements...");

// Load order is important for dependencies
document.addEventListener('DOMContentLoaded', () => {
    // Load theme service first (other services may depend on theme)
    loadScript('theme-service.js', () => {
        console.log("Theme service loaded");
        
        // Load code highlighting service
        loadScript('code-highlight-service.js', () => {
            console.log("Code highlighting service loaded");
        });
        
        // Load message enhancement service
        loadScript('message-enhancement-service.js', () => {
            console.log("Message enhancement service loaded");
        });
        
        // Load export service
        loadScript('export-service.js', () => {
            console.log("Export service loaded");
        });
        
        // Load preferences service (should be loaded last)
        loadScript('preferences-service.js', () => {
            console.log("Preferences service loaded");
            console.log("All enhancement services loaded successfully!");
        });
    });
});

// Helper function to load scripts
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = (error) => {
        console.error(`Error loading script ${src}:`, error);
        // Continue loading other scripts even if one fails
        if (callback) callback();
    };
    document.head.appendChild(script);
}

// Add enhancement styles
const enhancementStyles = document.createElement('link');
enhancementStyles.rel = 'stylesheet';
enhancementStyles.href = 'theme-styles.css';
document.head.appendChild(enhancementStyles);

// Notify user that enhancements are loaded
console.log("Epic Tech AI enhancements initialized");
// Notify user that enhancements are loaded
console.log("Epic Tech AI enhancements initialized");
