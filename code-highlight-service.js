console.log("code-highlight-service.js loaded");

const CodeHighlightService = {
    // Language patterns for detection
    LANGUAGE_PATTERNS: {
        javascript: /^(javascript|js|jsx)$/i,
        python: /^(python|py)$/i,
        html: /^(html|xml)$/i,
        css: /^(css|scss|sass)$/i,
        json: /^json$/i,
        bash: /^(bash|sh|shell)$/i,
        sql: /^sql$/i,
        csharp: /^(csharp|c#)$/i,
        java: /^java$/i,
        php: /^php$/i,
        ruby: /^(ruby|rb)$/i,
        go: /^go$/i,
        rust: /^rust$/i,
        typescript: /^(typescript|ts)$/i
    },
    
    // Colors for syntax highlighting (for both light and dark themes)
    SYNTAX_COLORS: {
        light: {
            keyword: '#0077aa',
            string: '#669900',
            number: '#aa5500',
            comment: '#999999',
            function: '#3311bb',
            operator: '#ff3300',
            variable: '#0055aa',
            property: '#7d2727',
            punctuation: '#666666'
        },
        dark: {
            keyword: '#569cd6',
            string: '#ce9178',
            number: '#b5cea8',
            comment: '#6a9955',
            function: '#dcdcaa',
            operator: '#d4d4d4',
            variable: '#9cdcfe',
            property: '#4ec9b0',
            punctuation: '#d4d4d4'
        }
    },
    
    // Detect code blocks in text and wrap them in proper HTML
    processMessageWithCodeBlocks: function(message) {
        // Check if message already contains HTML
        if (message.includes('<pre') || message.includes('<code')) {
            return message;
        }
        
        // Pattern for code blocks with language specification: ```language\ncode\n```
        const codeBlockRegex = /```([a-zA-Z0-9#]+)?\n([\s\S]*?)```/g;
        
        // Replace code blocks with highlighted HTML
        return message.replace(codeBlockRegex, (match, language, code) => {
            const highlightedCode = this.highlightCode(code, language);
            const langDisplay = language ? language.trim() : 'plaintext';
            
            return `<div class="code-block">
                <div class="code-header">
                    <span class="code-language">${langDisplay}</span>
                    <button class="copy-code-button" onclick="CodeHighlightService.copyCodeToClipboard(this)">Copy</button>
                </div>
                <pre><code class="language-${langDisplay}">${highlightedCode}</code></pre>
            </div>`;
        });
    },
    
    // Highlight code based on language
    highlightCode: function(code, language) {
        // Escape HTML to prevent XSS
        const escapedCode = this.escapeHtml(code);
        
        // If no language specified or not recognized, return as is
        if (!language) {
            return escapedCode;
        }
        
        // Determine language for highlighting
        let lang = 'plaintext';
        for (const [key, pattern] of Object.entries(this.LANGUAGE_PATTERNS)) {
            if (pattern.test(language)) {
                lang = key;
                break;
            }
        }
        
        // Apply basic syntax highlighting based on language
        switch (lang) {
            case 'javascript':
            case 'typescript':
                return this.highlightJavaScript(escapedCode);
            case 'python':
                return this.highlightPython(escapedCode);
            case 'html':
                return this.highlightHtml(escapedCode);
            case 'css':
                return this.highlightCss(escapedCode);
            case 'json':
                return this.highlightJson(escapedCode);
            default:
                return escapedCode;
        }
    },
    
    // JavaScript syntax highlighting
    highlightJavaScript: function(code) {
        // Keywords
        code = code.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|try|catch|throw|new|this|super|extends|async|await|yield|typeof|instanceof|in|of|null|undefined|true|false)\b/g, 
            '<span class="code-keyword">$1</span>');
        
        // Strings
        code = code.replace(/(['"`])(.*?)\1/g, '<span class="code-string">$1$2$1</span>');
        
        // Numbers
        code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="code-number">$1</span>');
        
        // Comments
        code = code.replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>');
        code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="code-comment">$1</span>');
        
        // Functions
        code = code.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="code-function">$1</span>(');
        
        return code;
    },
    
    // Python syntax highlighting
    highlightPython: function(code) {
        // Keywords
        code = code.replace(/\b(def|class|import|from|as|return|if|elif|else|for|while|try|except|finally|with|in|is|not|and|or|True|False|None|lambda|global|nonlocal|raise|assert|yield|break|continue|pass)\b/g, 
            '<span class="code-keyword">$1</span>');
        
        // Strings
        code = code.replace(/(['"])(.*?)\1/g, '<span class="code-string">$1$2$1</span>');
        
        // Numbers
        code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="code-number">$1</span>');
        
        // Comments
        code = code.replace(/(#.*$)/gm, '<span class="code-comment">$1</span>');
        
        // Functions
        code = code.replace(/\b(def)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="code-keyword">$1</span> <span class="code-function">$2</span>(');
        
        return code;
    },
    
    // HTML syntax highlighting
    highlightHtml: function(code) {
        // Tags
        code = code.replace(/(&lt;[\/]?)([a-zA-Z0-9]+)([^&]*?)(&gt;)/g, 
            '$1<span class="code-keyword">$2</span>$3$4');
        
        // Attributes
        code = code.replace(/\s([a-zA-Z0-9-_]+)=["']/g, ' <span class="code-property">$1</span>=');
        
        // Values
        code = code.replace(/=["']([^"']*)["']/g, '="<span class="code-string">$1</span>"');
        
        return code;
    },
    
    // CSS syntax highlighting
    highlightCss: function(code) {
        // Selectors
        code = code.replace(/([a-zA-Z0-9_\-\.#\[\]="']+)(\s*\{)/g, '<span class="code-keyword">$1</span>$2');
        
        // Properties
        code = code.replace(/(\s+)([a-zA-Z\-]+)(\s*:)/g, '$1<span class="code-property">$2</span>$3');
        
        // Values
        code = code.replace(/(:)(\s*)([\w\d\s\.\-#%]+)(;)/g, '$1$2<span class="code-string">$3</span>$4');
        
        return code;
    },
    
    // JSON syntax highlighting
    highlightJson: function(code) {
        // Keys
        code = code.replace(/(".*?")(\s*:)/g, '<span class="code-property">$1</span>$2');
        
        // Strings
        code = code.replace(/(:)(\s*)(".*?")(,?)/g, '$1$2<span class="code-string">$3</span>$4');
        
        // Numbers
        code = code.replace(/(:)(\s*)(\d+(\.\d+)?)(,?)/g, '$1$2<span class="code-number">$3</span>$5');
        
        // Booleans and null
        code = code.replace(/(:)(\s*)(true|false|null)(,?)/g, '$1$2<span class="code-keyword">$3</span>$4');
        
        return code;
    },
    
    // Copy code to clipboard
    copyCodeToClipboard: function(button) {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        
        // Create temporary textarea to copy from
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        
        // Select and copy
        textarea.select();
        document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(textarea);
        
        // Update button text temporarily
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    },
    
    // Escape HTML to prevent XSS
    escapeHtml: function(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    
    // Apply theme-specific colors to code elements
    applyThemeColors: function(theme) {
        const colors = this.SYNTAX_COLORS[theme];
        
        // Create or update style element
        let styleEl = document.getElementById('code-highlight-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'code-highlight-styles';
            document.head.appendChild(styleEl);
        }
        
        // Set CSS variables for syntax colors
        styleEl.textContent = `
            .code-keyword { color: ${colors.keyword}; }
            .code-string { color: ${colors.string}; }
            .code-number { color: ${colors.number}; }
            .code-comment { color: ${colors.comment}; }
            .code-function { color: ${colors.function}; }
            .code-operator { color: ${colors.operator}; }
            .code-variable { color: ${colors.variable}; }
            .code-property { color: ${colors.property}; }
            .code-punctuation { color: ${colors.punctuation}; }
        `;
    },
    
    // Initialize code highlighting
    init: function() {
        // Apply initial theme colors
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        this.applyThemeColors(currentTheme);
        
        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            this.applyThemeColors(e.detail.theme);
        });
        
        // Add CSS for code blocks
        const style = document.createElement('style');
        style.textContent = `
            .code-block {
                position: relative;
                margin: 1rem 0;
                border-radius: 6px;
                overflow: hidden;
            }
            
            .code-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 1rem;
                background-color: rgba(0, 0, 0, 0.1);
                font-family: monospace;
                font-size: 0.8rem;
            }
            
            .code-language {
                text-transform: uppercase;
                font-weight: bold;
            }
            
            .copy-code-button {
                background: transparent;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 4px;
                padding: 2px 8px;
                font-size: 0.7rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .copy-code-button:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
            
            .copy-code-button.copied {
                background-color: #4caf50;
                color: white;
                border-color: #4caf50;
            }
            
            .code-block pre {
                margin: 0;
                padding: 1rem;
                overflow-x: auto;
            }
            
            .code-block code {
                font-family: 'Courier New', Courier, monospace;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize code highlighting when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CodeHighlightService.init();
});