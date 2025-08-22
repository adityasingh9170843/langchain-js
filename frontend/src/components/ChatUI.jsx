import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Bot, Zap } from "lucide-react";
import axios from "axios";

function ChatMessage({ message, isUser = false }) {
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 animate-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`flex items-start gap-5 max-w-2xl lg:max-w-3xl ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
        )}
        <Card
          className={`px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-cyan-600 to-violet-600 text-white shadow-lg shadow-cyan-500/20 border-0"
              : "bg-gray-800/80 text-gray-100 border-gray-700/50 shadow-lg backdrop-blur-sm"
          }`}
        >
          <p className="text-sm leading-relaxed">{message}</p>
        </Card>
      </div>
    </div>
  );
}

export default function ChatUI() {

 const [conversationID] = useState(() => Date.now().toString(36) + Math.random().toString(36).substring(2, 8));
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm AI, your advanced AI assistant. I'm here to help you with anything you need. How can I assist you today?",
      isUser: false,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:3000/chat", {
        message,
        ConversationID: conversationID,
      });
      console.log(response);
     
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            text: response.data.message,
            isUser: false,
          },
        ]);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "What can you help me with?",
    "Tell me about your capabilities",
    "Help me brainstorm ideas",
    "Explain a complex topic",
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="p-6 border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/80">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-xl backdrop-blur-sm border border-cyan-500/30">
              <Bot className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">AI Chat</h1>
              <p className="text-sm text-gray-400">Advanced AI Assistant</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-cyan-400">Online</span>
              </div>
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-start gap-3 max-w-xs">
                    <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                    <Card className="px-4 py-3 bg-gray-800/80 text-gray-100 border-gray-700/50 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-800/50 backdrop-blur-sm bg-gray-900/80">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here... (Press Enter to send)"
                  className="bg-gray-800/80 border-gray-700/50 focus:border-cyan-500 focus:ring-cyan-500/20 text-white placeholder:text-gray-400 min-h-[48px] text-base shadow-lg backdrop-blur-sm"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!message.trim()}
                className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 min-h-[48px] border-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-700/50 hover:bg-cyan-500/10 hover:border-cyan-500/50 bg-gray-800/50 backdrop-blur-sm transition-all duration-200 text-gray-300 hover:text-cyan-400"
                  onClick={() => setMessage(action)}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
