'use client';

import { useAssistantStore } from '@/stores/useAssistantStore';
import { useState, useEffect, useRef } from 'react';

export default function SupportChatWidget() {
  const { messages, sendMessage } = useAssistantStore();
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(messages.length);
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsTyping(true);
    await sendMessage({ input });
    setIsTyping(false);
    setInput('');
  };

  // Auto-open and scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > prevCount) {
      setIsOpen(true);
    }
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    setPrevCount(messages.length);
  }, [messages]);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-4 right-4 z-[100] bg-black text-white px-4 py-2 rounded-full shadow-md"
      >
        {isOpen ? 'Close Assistant' : 'Open Assistant'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 bg-white shadow-xl p-4 w-80 h-96 flex flex-col rounded-2xl border border-gray-200 z-[90]">
          <h2 className="text-lg font-semibold mb-2">Assistant</h2>

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto space-y-2 text-sm mb-2"
          >
            {messages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
            {isTyping && (
              <p className="italic text-gray-500 animate-pulse">
                Assistant is typing<span className="animate-ping">...</span>
              </p>
            )}
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
              disabled={!input.trim()}
              className="px-3 py-1 bg-black text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
