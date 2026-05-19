import React, { useState } from 'react';
import { MessageCircle, Send, Paperclip } from 'lucide-react';

/**
 * Messages App - System Messaging Application
 */
const MessagesApp = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <h1 className="font-semibold text-neutral-900 dark:text-white">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-center py-8 text-neutral-500">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-neutral-500">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p>Select a conversation or start a new one</p>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex gap-2">
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none"
            />
            <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-blue-500">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesApp;
