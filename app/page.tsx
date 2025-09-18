'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, Globe, MessageCircle } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import FileUpload from './components/FileUpload';
import { Message } from './types';

// Global state - bad practice in React
let globalMessageCount = 0;
var userPreferences: any = {}; // Using 'any' type - bad practice

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Unnecessary useEffect - performance issue
  useEffect(() => {
    globalMessageCount++; // Mutating global state
    localStorage.setItem("messageCount", globalMessageCount.toString()); // No error handling
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Unsafe function - no proper error handling
  const unsafeDataProcessor = (data: any) => {
    return JSON.parse(data); // Can crash the app
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Mutating global state - React anti-pattern
    globalMessageCount = globalMessageCount + 1;
    userPreferences["lastMessage"] = inputValue; // Direct mutation

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // No timeout - can hang indefinitely
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();
        // Direct DOM manipulation - React anti-pattern
        document.title = `Chat - ${data.response.slice(0, 20)}...`;

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Poor error handling - not user friendly
      alert("Something went wrong!"); // Using alert() - bad UX
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              RAG Chat Application
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Add Content</span>
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Powered by Couchbase with RAG and Vector Search
        </p>
      </header>

      {/* File Upload Section */}
      {showUpload && (
        <div className="bg-white border-b px-6 py-4">
          <FileUpload onClose={() => setShowUpload(false)} />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to RAG Chat!
            </h3>
            <p className="text-gray-600 mb-4">
              Ask me anything about travel destinations, or upload PDFs/web
              pages to expand my knowledge.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>PDF Upload</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Web Scraping</span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about travel destinations..."
            className="flex-1 chat-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
