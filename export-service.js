console.log("export-service.js loaded");

const ExportService = {
    // Export formats
    FORMATS: {
        TEXT: 'text',
        HTML: 'html',
        JSON: 'json',
        MARKDOWN: 'markdown'
    },
    
    // Get all messages from the chat
    getMessages: function() {
        const chatMessages = document.querySelectorAll('.message');
        const messages = [];
        
        chatMessages.forEach(message => {
            const isUser = message.classList.contains('user-message');
            const content = message.textContent.trim();
            const timestamp = message.querySelector('.message-timestamp')?.textContent || new Date().toLocaleTimeString();
            
            messages.push({
                role: isUser ? 'user' : 'bot',
                content: content,
                timestamp: timestamp
            });
        });
        
        return messages;
    },
    
    // Export chat history as plain text
    exportAsText: function(messages) {
        let text = "Epic Tech AI Chat History\n";
        text += "=========================\n\n";
        
        messages.forEach(message => {
            text += `[${message.timestamp}] ${message.role === 'user' ? 'You' : 'AI'}: ${message.content}\n\n`;
        });
        
        return text;
    },
    
    // Export chat history as HTML
    exportAsHTML: function(messages) {
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Epic Tech AI Chat History</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #3498db;
            text-align: center;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .message {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 10px;
        }
        .user {
            background-color: #e1f5fe;
            margin-left: 50px;
        }
        .bot {
            background-color: #f0f0f0;
            margin-right: 50px;
        }
        .timestamp {
            font-size: 0.8rem;
            color: #888;
            text-align: right;
            margin-top: 5px;
        }
        .role {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .user .role {
            color: #2980b9;
        }
        .bot .role {
            color: #27ae60;
        }
        pre {
            background-color: #f8f8f8;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', Courier, monospace;
        }
    </style>
</head>
<body>
    <h1>Epic Tech AI Chat History</h1>`;
        
        messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'AI';
            const cssClass = message.role === 'user' ? 'user' : 'bot';
            
            html += `
    <div class="message ${cssClass}">
        <div class="role">${role}</div>
        <div class="content">${message.content}</div>
        <div class="timestamp">${message.timestamp}</div>
    </div>`;
        });
        
        html += `
</body>
</html>`;
        
        return html;
    },
    
    // Export chat history as JSON
    exportAsJSON: function(messages) {
        const chatData = {
            title: "Epic Tech AI Chat History",
            timestamp: new Date().toISOString(),
            messages: messages
        };
        
        return JSON.stringify(chatData, null, 2);
    },
    
    // Export chat history as Markdown
    exportAsMarkdown: function(messages) {
        let markdown = "# Epic Tech AI Chat History\n\n";
        
        messages.forEach(message => {
            const role = message.role === 'user' ? 'You' : 'AI';
            markdown += `### ${role} (${message.timestamp})\n\n${message.content}\n\n---\n\n`;
        });
        
        return markdown;
    },
    
    // Download file
    downloadFile: function(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    },
    
    // Export chat history
    exportChat: function(format = this.FORMATS.TEXT) {
        const messages = this.getMessages();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        let content, filename, mimeType;
        
        switch (format) {
            case this.FORMATS.HTML:
                content = this.exportAsHTML(messages);
                filename = `epic-tech-ai-chat-${timestamp}.html`;
                mimeType = 'text/html';
                break;
            case this.FORMATS.JSON:
                content = this.exportAsJSON(messages);
                filename = `epic-tech-ai-chat-${timestamp}.json`;
                mimeType = 'application/json';
                break;
            case this.FORMATS.MARKDOWN:
                content = this.exportAsMarkdown(messages);
                filename = `epic-tech-ai-chat-${timestamp}.md`;
                mimeType = 'text/markdown';
                break;
            case this.FORMATS.TEXT:
            default:
                content = this.exportAsText(messages);
                filename = `epic-tech-ai-chat-${timestamp}.txt`;
                mimeType = 'text/plain';
                break;
        }
        
        this.downloadFile(content, filename, mimeType);
        return { success: true, format, filename };
    },
    
    // Show export options dialog
    showExportDialog: function() {
        // Create modal if it doesn't exist
        let modal = document.getElementById('export-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'export-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>Export Chat History</h2>
                    <p>Choose a format to export your chat history:</p>
                    <div class="export-options">
                        <button data-format="text" class="export-option-button">Text (.txt)</button>
                        <button data-format="html" class="export-option-button">HTML (.html)</button>
                        <button data-format="json" class="export-option-button">JSON (.json)</button>
                        <button data-format="markdown" class="export-option-button">Markdown (.md)</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            const closeButton = modal.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            const exportButtons = modal.querySelectorAll('.export-option-button');
            exportButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const format = button.getAttribute('data-format');
                    this.exportChat(format);
                    modal.style.display = 'none';
                });
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
                .modal {
                    display: none;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    animation: fadeIn 0.3s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .modal-content {
                    background-color: var(--chat-bg, #fff);
                    color: var(--text-color, #333);
                    margin: 15% auto;
                    padding: 20px;
                    border-radius: 10px;
                    width: 80%;
                    max-width: 500px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    position: relative;
                    animation: slideDown 0.3s ease-out;
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    font-size: 24px;
                    font-weight: bold;
                    color: var(--light-text, #aaa);
                    cursor: pointer;
                    transition: color 0.2s;
                }
                
                .close-button:hover {
                    color: var(--text-color, #333);
                }
                
                .export-options {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .export-option-button {
                    padding: 10px;
                    background-color: var(--primary-color, #3498db);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .export-option-button:hover {
                    background-color: var(--secondary-color, #2980b9);
                }
                
                @media (max-width: 600px) {
                    .export-options {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show modal
        modal.style.display = 'block';
    },
    
    // Initialize export service
    init: function() {
        // Create export button if it doesn't exist
        if (!document.getElementById('export-button')) {
            const exportButton = document.createElement('button');
            exportButton.id = 'export-button';
            exportButton.innerHTML = '💾';
            exportButton.setAttribute('aria-label', 'Export chat history');
            exportButton.setAttribute('title', 'Export chat history');
            
            // Add click event listener
            exportButton.addEventListener('click', () => {
                this.showExportDialog();
            });
            
            // Add to header
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(exportButton);
            }
        }
    }
};

// Initialize export service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ExportService.init();
});