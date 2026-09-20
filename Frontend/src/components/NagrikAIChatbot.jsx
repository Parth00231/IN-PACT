import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  ChevronRight, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { sendNagrikAIMessage } from "../services/nagrikAiService";
import inpactLogo from "../assets/inpact-icon.svg";

export default function NagrikAIChatbot({ navigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGreetingToast, setShowGreetingToast] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Namaste! 🙏 I am **Nagrik AI**, the official virtual assistant for the **IN-PACT Civic Portal** (Govt. of India & GNIDA).

How can I help you today? You can ask me how to **file a grievance**, **track a complaint**, check **department SLAs**, or find **nodal officers**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setShowGreetingToast(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const quickPrompts = [
    "Track RN20260920A8091",
    "How to lodge a grievance?",
    "What are the SLA timelines?",
    "Nodal officer directory",
    "24x7 Emergency Helplines"
  ];

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedMessages = [
      ...messages,
      { role: "user", content: text, timestamp: userTimestamp }
    ];

    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Send conversation to Groq API / Nagrik AI service
      const aiReply = await sendNagrikAIMessage(
        updatedMessages.map(m => ({ role: m.role, content: m.content }))
      );

      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: aiReply, timestamp: botTimestamp }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "I encountered a network difficulty. Please try again or call our 24x7 Citizen Helpline at **1913**.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat history cleared. I am **Nagrik AI**, ready to assist you with the IN-PACT portal. You can give me your complaint Reference Number (e.g. \`RN20260920A8091\`) anytime to view live tracking details!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to render formatted markdown-like text
  const formatMessage = (content) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      let parsed = line;

      // Bold text replacement
      parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Code / ID replacement
      parsed = parsed.replace(/`([^`]+)`/g, '<code class="chat-code-inline">$1</code>');

      if (line.startsWith("### ")) {
        return <h4 key={idx} className="chat-msg-heading" dangerouslySetInnerHTML={{ __html: parsed.replace("### ", "") }} />;
      }
      if (line.startsWith("|")) {
        if (line.includes("---")) {
          return null; // Ignore markdown separator row
        }
        const parts = line.split("|").map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const key = parts[0].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          const val = parts[1].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="chat-code-inline">$1</code>');
          return (
            <div key={idx} className="chat-table-key-row" style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", background: idx % 2 === 0 ? "rgba(241, 245, 249, 0.7)" : "transparent", borderRadius: "4px", fontSize: "12px", margin: "2px 0", gap: "8px" }}>
              <span style={{ color: "#475569", flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: key }} />
              <span style={{ color: "#0F172A", textAlign: "right", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: val }} />
            </div>
          );
        }
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="chat-msg-li" dangerouslySetInnerHTML={{ __html: parsed.substring(2) }} />
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="chat-msg-step" dangerouslySetInnerHTML={{ __html: parsed }} />
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="chat-msg-p" dangerouslySetInnerHTML={{ __html: parsed }} />;
    });
  };

  return (
    <div className="nagrik-ai-widget-container">
      {/* Floating Widget Trigger: Circle Button with Left-side Callout Pill */}
      {!isOpen && (
        <div className="nagrik-ai-trigger-group">
          {/* Left-side "How may I help you" Callout Pill */}
          <button
            className="nagrik-help-pill"
            onClick={() => setIsOpen(true)}
            aria-label="Open Nagrik AI: How may I help you?"
            title="Ask Nagrik AI"
          >
            <Sparkles size={15} className="text-amber-500 animate-pulse flex-shrink-0" />
            <span className="help-text">How may I help you?</span>
          </button>

          {/* Circular Chatbot Action Button */}
          <button
            className="nagrik-ai-circle-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Open Nagrik AI Civic Assistant"
            title="Nagrik AI • Virtual Portal Guide"
          >
            <Bot size={26} className="text-white" />
            <span className="nagrik-online-indicator"></span>
          </button>
        </div>
      )}

      {/* Expanded Chat Drawer / Window */}
      {isOpen && (
        <div className="nagrik-chat-window" role="dialog" aria-modal="true" aria-label="Nagrik AI Chat">
          {/* Chat Window Header */}
          <div className="nagrik-chat-header">
            <div className="nagrik-header-left">
              <div className="nagrik-avatar-box">
                <img src={inpactLogo} alt="Logo" className="w-5 h-5 rounded" />
                <span className="nagrik-pulse-dot"></span>
              </div>
              <div>
                <div className="nagrik-chat-title">
                  <span>Nagrik AI</span>
                  <span className="nagrik-tag-pill">AI ASSISTANT</span>
                </div>
                <div className="nagrik-chat-subtitle">
                  Official IN-PACT Guide &bull; Govt. of India
                </div>
              </div>
            </div>

            <div className="nagrik-header-actions">
              <button
                className="nagrik-icon-btn"
                onClick={handleClearChat}
                title="Clear Conversation"
                aria-label="Clear chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className="nagrik-icon-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close Nagrik AI"
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Buttons in Chat Header */}
          <div className="nagrik-nav-shortcuts">
            <button 
              className="shortcut-pill"
              onClick={() => {
                if (navigateTo) navigateTo("citizen-dashboard");
              }}
            >
              <span>Citizen Portal</span>
              <ChevronRight size={12} />
            </button>
            <button 
              className="shortcut-pill"
              onClick={() => {
                if (navigateTo) navigateTo("home");
                setTimeout(() => {
                  document.getElementById("tracker-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <span>Track Grievance</span>
              <ChevronRight size={12} />
            </button>
            <button 
              className="shortcut-pill"
              onClick={() => {
                if (navigateTo) navigateTo("home");
                setTimeout(() => {
                  document.getElementById("nodal-officers")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <span>Nodal Directory</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="nagrik-chat-body">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`nagrik-message-row ${msg.role === "user" ? "user-row" : "bot-row"}`}
              >
                {msg.role === "assistant" && (
                  <div className="bot-msg-avatar">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`nagrik-message-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}>
                  <div className="msg-content">
                    {formatMessage(msg.content)}
                  </div>
                  <div className="msg-timestamp">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Live Typing Loading Indicator */}
            {isLoading && (
              <div className="nagrik-message-row bot-row">
                <div className="bot-msg-avatar">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="nagrik-message-bubble bot-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">Nagrik AI is generating response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Suggestion Chips */}
          <div className="nagrik-quick-chips">
            <span className="chips-label">Suggested:</span>
            <div className="chips-scroll">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  className="quick-chip-btn"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="nagrik-chat-input-bar">
            <div className="input-wrap">
              <input
                ref={inputRef}
                type="text"
                className="nagrik-input"
                placeholder="Ask about filing, tracking, SLAs, or helplines..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                maxLength={400}
              />
              <button
                className="nagrik-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message to Nagrik AI"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="nagrik-input-footer">
              <span className="guardrail-note">
                <ShieldCheck size={11} className="inline mr-1 text-amber-600" />
                Nagrik AI answers portal queries only. Irrelevant queries will be declined.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
