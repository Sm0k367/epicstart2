console.log("message-enhancement-service.js loaded");

const MessageEnhancementService = {
    // Show typing indicator
    showTypingIndicator: function() {
        // Check if typing indicator already exists
        if (document.querySelector('.typing-indicator-container')) {
            return;
        }
        
        // Create typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator-container';
        typingIndicator.innerHTML = `
            <div class="message bot-message">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        // Add to chat container
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            chatContainer.appendChild(typingIndicator);
            this.scrollToBottom();
        }
    },
    
    // Hide typing indicator
    hideTypingIndicator: function() {
        const typingIndicator = document.querySelector('.typing-indicator-container');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },
    
    // Add timestamp to message
    addTimestampToMessage: function(messageElement) {
        // Check if message already has timestamp
        if (messageElement.querySelector('.message-timestamp')) {
            return;
        }
        
        // Create timestamp element
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        
        // Add to message
        messageElement.appendChild(timestamp);
    },
    
    // Add timestamps to all messages
    addTimestampsToAllMessages: function() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(message => {
            this.addTimestampToMessage(message);
        });
    },
    
    // Process message content
    processMessageContent: function(content) {
        // Process code blocks if CodeHighlightService exists
        if (window.CodeHighlightService) {
            content = CodeHighlightService.processMessageWithCodeBlocks(content);
        }
        
        return content;
    },
    
    // Create a new message element
    createMessageElement: function(content, isUser = false) {
        // Process content
        const processedContent = this.processMessageContent(content);
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageElement.innerHTML = processedContent;
        
        // Add timestamp
        this.addTimestampToMessage(messageElement);
        
        // Add animation class
        messageElement.classList.add('message-animation');
        
        return messageElement;
    },
    
    // Add a message to the chat
    addMessageToChat: function(content, isUser = false) {
        // Create message element
        const messageElement = this.createMessageElement(content, isUser);
        
        // Add to chat container
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            chatContainer.appendChild(messageElement);
            this.scrollToBottom();
        }
        
        return messageElement;
    },
    
    // Scroll to bottom of chat
    scrollToBottom: function() {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    },
    
    // Initialize message enhancement service
    init: function() {
        // Add message animation styles
        const style = document.createElement('style');
        style.textContent = `
            .message-animation {
                animation: message-appear 0.3s ease-out;
            }
            
            @keyframes message-appear {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .typing-indicator-container {
                margin-bottom: 10px;
            }
            
            .typing-indicator {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                border-radius: 18px;
                width: fit-content;
            }
            
            .typing-indicator span {
                height: 8px;
                width: 8px;
                background-color: var(--typing-indicator-bg, #e0e0e0);
                border-radius: 50%;
                display: inline-block;
                margin-right: 5px;
                animation: typing 1.4s infinite ease-in-out;
            }
            
            .typing-indicator span:nth-child(1) {
                animation-delay: 0s;
            }
            
            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
                margin-right: 0;
            }
            
            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.6;
                }
                30% {
                    transform: translateY(-5px);
                    opacity: 1;
                }
            }
            
            .message-timestamp {
                font-size: 0.7rem;
                color: var(--timestamp-color, #999);
                margin-top: 4px;
                text-align: right;
            }
        `;
        document.head.appendChild(style);
        
        // Add timestamps to existing messages
        this.addTimestampsToAllMessages();
        
        // Override the default message adding function if it exists
        if (window.addMessageToChat) {
            const originalAddMessageToChat = window.addMessageToChat;
            window.addMessageToChat = (content, isUser) => {
                return this.addMessageToChat(content, isUser);
            };
        }
    }
};

// Initialize message enhancement service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    MessageEnhancementService.init();
});