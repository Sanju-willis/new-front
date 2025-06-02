// src\components\SupportChatWidget.tsx
'use client';

import { useAssistantStore } from '@/stores/useAssistantStore';
import { useState } from 'react';

export default function SupportChatWidget() {
  const { messages, sendMessage } = useAssistantStore();
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // ✅ toggle state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ input });
    setInput('');
  };

  return (
    <>
      {/* ✅ Toggle button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-md"
      >
        {isOpen ? 'Close Assistant' : 'Open Assistant'}
      </button>

      {/* ✅ Conditional chat window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 bg-white shadow-xl p-4 w-80 h-96 flex flex-col rounded-2xl border border-gray-200 z-40">
          <h2 className="text-lg font-semibold mb-2">Assistant</h2>

          <div className="flex-1 overflow-y-auto space-y-2 text-sm mb-2">
            {messages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-lg px-2 py-1 text-sm"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="px-3 py-1 bg-black text-white rounded-lg text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
