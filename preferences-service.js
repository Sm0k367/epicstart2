console.log("preferences-service.js loaded");

const PreferencesService = {
    // Default preferences
    DEFAULT_PREFERENCES: {
        theme: 'light',
        fontSize: 'medium',
        messageTimestamps: true,
        codeHighlighting: true,
        speechRecognition: true,
        notificationSounds: true,
        autoScroll: true
    },
    
    // Get all preferences
    getPreferences: function() {
        const savedPrefs = localStorage.getItem('epic-ai-preferences');
        if (savedPrefs) {
            try {
                return JSON.parse(savedPrefs);
            } catch (e) {
                console.error('Error parsing preferences:', e);
                return { ...this.DEFAULT_PREFERENCES };
            }
        }
        return { ...this.DEFAULT_PREFERENCES };
    },
    
    // Get a specific preference
    getPreference: function(key) {
        const prefs = this.getPreferences();
        return prefs[key] !== undefined ? prefs[key] : this.DEFAULT_PREFERENCES[key];
    },
    
    // Set a specific preference
    setPreference: function(key, value) {
        const prefs = this.getPreferences();
        prefs[key] = value;
        localStorage.setItem('epic-ai-preferences', JSON.stringify(prefs));
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('preferenceChanged', { 
            detail: { key, value, preferences: prefs } 
        }));
        
        return prefs;
    },
    
    // Reset preferences to defaults
    resetPreferences: function() {
        localStorage.setItem('epic-ai-preferences', JSON.stringify({ ...this.DEFAULT_PREFERENCES }));
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('preferencesReset', { 
            detail: { preferences: { ...this.DEFAULT_PREFERENCES } } 
        }));
        
        return { ...this.DEFAULT_PREFERENCES };
    },
    
    // Apply preferences to UI
    applyPreferences: function() {
        const prefs = this.getPreferences();
        
        // Apply theme
        if (window.ThemeService) {
            ThemeService.setTheme(prefs.theme);
        } else if (prefs.theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        
        // Apply font size
        document.documentElement.style.setProperty('--font-size-factor', this.getFontSizeFactor(prefs.fontSize));
        
        // Apply other preferences
        document.body.classList.toggle('timestamps-enabled', prefs.messageTimestamps);
        document.body.classList.toggle('code-highlighting-enabled', prefs.codeHighlighting);
        document.body.classList.toggle('speech-recognition-enabled', prefs.speechRecognition);
        document.body.classList.toggle('notification-sounds-enabled', prefs.notificationSounds);
        document.body.classList.toggle('auto-scroll-enabled', prefs.autoScroll);
    },
    
    // Get font size factor based on preference
    getFontSizeFactor: function(size) {
        switch (size) {
            case 'small': return '0.9';
            case 'large': return '1.1';
            case 'x-large': return '1.2';
            case 'medium':
            default: return '1';
        }
    },
    
    // Show preferences dialog
    showPreferencesDialog: function() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('preferences-modal');
        
        if (!modal) {
            const prefs = this.getPreferences();
            
            modal = document.createElement('div');
            modal.id = 'preferences-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>Preferences</h2>
                    
                    <div class="preference-group">
                        <label for="theme-preference">Theme</label>
                        <select id="theme-preference">
                            <option value="light" ${prefs.theme === 'light' ? 'selected' : ''}>Light</option>
                            <option value="dark" ${prefs.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        </select>
                    </div>
                    
                    <div class="preference-group">
                        <label for="font-size-preference">Font Size</label>
                        <select id="font-size-preference">
                            <option value="small" ${prefs.fontSize === 'small' ? 'selected' : ''}>Small</option>
                            <option value="medium" ${prefs.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="large" ${prefs.fontSize === 'large' ? 'selected' : ''}>Large</option>
                            <option value="x-large" ${prefs.fontSize === 'x-large' ? 'selected' : ''}>Extra Large</option>
                        </select>
                    </div>
                    
                    <div class="preference-group checkbox">
                        <input type="checkbox" id="timestamps-preference" ${prefs.messageTimestamps ? 'checked' : ''}>
                        <label for="timestamps-preference">Show message timestamps</label>
                    </div>
                    
                    <div class="preference-group checkbox">
                        <input type="checkbox" id="code-highlighting-preference" ${prefs.codeHighlighting ? 'checked' : ''}>
                        <label for="code-highlighting-preference">Enable code syntax highlighting</label>
                    </div>
                    
                    <div class="preference-group checkbox">
                        <input type="checkbox" id="speech-recognition-preference" ${prefs.speechRecognition ? 'checked' : ''}>
                        <label for="speech-recognition-preference">Enable speech recognition</label>
                    </div>
                    
                    <div class="preference-group checkbox">
                        <input type="checkbox" id="notification-sounds-preference" ${prefs.notificationSounds ? 'checked' : ''}>
                        <label for="notification-sounds-preference">Enable notification sounds</label>
                    </div>
                    
                    <div class="preference-group checkbox">
                        <input type="checkbox" id="auto-scroll-preference" ${prefs.autoScroll ? 'checked' : ''}>
                        <label for="auto-scroll-preference">Auto-scroll to new messages</label>
                    </div>
                    
                    <div class="preference-actions">
                        <button id="reset-preferences-button">Reset to Defaults</button>
                        <button id="save-preferences-button">Save Preferences</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            const closeButton = modal.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            const saveButton = document.getElementById('save-preferences-button');
            saveButton.addEventListener('click', () => {
                // Get values from form
                const theme = document.getElementById('theme-preference').value;
                const fontSize = document.getElementById('font-size-preference').value;
                const messageTimestamps = document.getElementById('timestamps-preference').checked;
                const codeHighlighting = document.getElementById('code-highlighting-preference').checked;
                const speechRecognition = document.getElementById('speech-recognition-preference').checked;
                const notificationSounds = document.getElementById('notification-sounds-preference').checked;
                const autoScroll = document.getElementById('auto-scroll-preference').checked;
                
                // Save preferences
                this.setPreference('theme', theme);
                this.setPreference('fontSize', fontSize);
                this.setPreference('messageTimestamps', messageTimestamps);
                this.setPreference('codeHighlighting', codeHighlighting);
                this.setPreference('speechRecognition', speechRecognition);
                this.setPreference('notificationSounds', notificationSounds);
                this.setPreference('autoScroll', autoScroll);
                
                // Apply preferences
                this.applyPreferences();
                
                // Close modal
                modal.style.display = 'none';
            });
            
            const resetButton = document.getElementById('reset-preferences-button');
            resetButton.addEventListener('click', () => {
                // Reset preferences
                this.resetPreferences();
                
                // Update form values
                document.getElementById('theme-preference').value = this.DEFAULT_PREFERENCES.theme;
                document.getElementById('font-size-preference').value = this.DEFAULT_PREFERENCES.fontSize;
                document.getElementById('timestamps-preference').checked = this.DEFAULT_PREFERENCES.messageTimestamps;
                document.getElementById('code-highlighting-preference').checked = this.DEFAULT_PREFERENCES.codeHighlighting;
                document.getElementById('speech-recognition-preference').checked = this.DEFAULT_PREFERENCES.speechRecognition;
                document.getElementById('notification-sounds-preference').checked = this.DEFAULT_PREFERENCES.notificationSounds;
                document.getElementById('auto-scroll-preference').checked = this.DEFAULT_PREFERENCES.autoScroll;
                
                // Apply preferences
                this.applyPreferences();
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Add modal styles
            const style = document.createElement('style');
            style.textContent = `
                .preference-group {
                    margin-bottom: 15px;
                }
                
                .preference-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                
                .preference-group select {
                    width: 100%;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid var(--border-color, #ccc);
                    background-color: var(--input-bg, #fff);
                    color: var(--text-color, #333);
                }
                
                .preference-group.checkbox {
                    display: flex;
                    align-items: center;
                }
                
                .preference-group.checkbox label {
                    margin-bottom: 0;
                    margin-left: 10px;
                    font-weight: normal;
                }
                
                .preference-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                
                .preference-actions button {
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                #reset-preferences-button {
                    background-color: #f1f1f1;
                    color: #333;
                    border: 1px solid #ccc;
                }
                
                #reset-preferences-button:hover {
                    background-color: #e1e1e1;
                }
                
                #save-preferences-button {
                    background-color: var(--primary-color, #3498db);
                    color: white;
                    border: none;
                }
                
                #save-preferences-button:hover {
                    background-color: var(--secondary-color, #2980b9);
                }
            `;
            document.head.appendChild(style);
        } else {
            // Update form values with current preferences
            const prefs = this.getPreferences();
            document.getElementById('theme-preference').value = prefs.theme;
            document.getElementById('font-size-preference').value = prefs.fontSize;
            document.getElementById('timestamps-preference').checked = prefs.messageTimestamps;
            document.getElementById('code-highlighting-preference').checked = prefs.codeHighlighting;
            document.getElementById('speech-recognition-preference').checked = prefs.speechRecognition;
            document.getElementById('notification-sounds-preference').checked = prefs.notificationSounds;
            document.getElementById('auto-scroll-preference').checked = prefs.autoScroll;
        }
        
        // Show modal
        modal.style.display = 'block';
    },
    
    // Initialize preferences service
    init: function() {
        // Apply preferences
        this.applyPreferences();
        
        // Create preferences button if it doesn't exist
        if (!document.getElementById('preferences-button')) {
            const preferencesButton = document.createElement('button');
            preferencesButton.id = 'preferences-button';
            preferencesButton.className = 'preferences-button';
            preferencesButton.innerHTML = '⚙️';
            preferencesButton.setAttribute('aria-label', 'Preferences');
            preferencesButton.setAttribute('title', 'Preferences');
            
            // Add click event listener
            preferencesButton.addEventListener('click', () => {
                this.showPreferencesDialog();
            });
            
            // Add to header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(preferencesButton);
            }
            
            // Add button styles
            const style = document.createElement('style');
            style.textContent = `
                .preferences-button {
                    position: absolute;
                    top: 15px;
                    right: 115px;
                    background: transparent;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.3s ease;
                    z-index: 100;
                }
                
                .preferences-button:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
                
                @media (max-width: 768px) {
                    .preferences-button {
                        top: 10px;
                        right: 100px;
                        width: 35px;
                        height: 35px;
                        font-size: 1rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add font size CSS variables
        const fontSizeStyle = document.createElement('style');
        fontSizeStyle.textContent = `
            :root {
                --font-size-factor: 1;
            }
            
            body {
                font-size: calc(16px * var(--font-size-factor));
            }
            
            .message {
                font-size: calc(1rem * var(--font-size-factor));
            }
            
            #user-input {
                font-size: calc(1rem * var(--font-size-factor));
            }
            
            button {
                font-size: calc(1rem * var(--font-size-factor));
            }
            
            .message-timestamp {
                font-size: calc(0.7rem * var(--font-size-factor));
            }
            
            pre code {
                font-size: calc(0.9rem * var(--font-size-factor));
            }
        `;
        document.head.appendChild(fontSizeStyle);
    }
};

// Initialize preferences service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PreferencesService.init();
});