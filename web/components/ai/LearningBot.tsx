'use client';

import React, { useState } from 'react';
import { Brain, Send, Loader } from 'lucide-react';
import { ChatMessage } from '@/types';

export const LearningBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col h-[500px]">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <h2 className="text-white font-bold text-lg">Learning Bot (Nvidia AI)</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-slate-400 text-center py-8">
            Ask me about forex, gold trading, or risk management...
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-yellow-600 text-slate-900'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="bg-slate-700 px-4 py-2 rounded-lg text-slate-300 flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-slate-900 px-4 py-2 rounded font-semibold transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
