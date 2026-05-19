import React, { useState } from 'react';
import { Mail, Inbox, Send, Archive } from 'lucide-react';

/**
 * Mail App - System Mail Application
 */
const MailApp = () => {
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [messages, setMessages] = useState([
    { id: 'm1', from: 'alice@example.com', subject: 'Welcome!', body: 'Welcome to your mailbox.', folder: 'inbox' },
    { id: 'm2', from: 'bob@example.com', subject: 'Project update', body: 'Project looks good.', folder: 'inbox' },
  ]);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' });

  const sendMessage = () => {
    const msg = { id: `m-${Date.now()}`, from: 'you@local', subject: compose.subject, body: compose.body, folder: 'sent', to: compose.to };
    setMessages((m) => [msg, ...m]);
    setShowCompose(false);
    setCompose({ to: '', subject: '', body: '' });
  };

  return (
    <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-center gap-2">
          <Mail size={20} className="text-red-500" />
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Mail</h1>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 p-4 overflow-y-auto">
          <div className="space-y-2">
            {[
              { id: 'inbox', label: 'Inbox', icon: Inbox },
              { id: 'sent', label: 'Sent', icon: Send },
              { id: 'archive', label: 'Archive', icon: Archive },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedTab === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <item.icon size={16} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{selectedTab === 'inbox' ? 'Inbox' : selectedTab === 'sent' ? 'Sent' : 'Archive'}</h2>
            <div>
              <button onClick={() => setShowCompose(true)} className="px-3 py-1 rounded bg-cyan-500 text-white mr-2">Compose</button>
            </div>
          </div>

          <div className="space-y-3">
            {messages.filter(m => m.folder === selectedTab).map((m) => (
              <div key={m.id} className="p-3 bg-white/5 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{m.subject}</div>
                    <div className="text-xs text-neutral-400">From: {m.from}</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-neutral-300">{m.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-neutral-800 rounded p-4 w-full max-w-2xl">
              <h3 className="font-semibold mb-2">Compose</h3>
              <input className="w-full p-2 mb-2 rounded bg-white/5" placeholder="To" value={compose.to} onChange={(e) => setCompose({...compose, to: e.target.value})} />
              <input className="w-full p-2 mb-2 rounded bg-white/5" placeholder="Subject" value={compose.subject} onChange={(e) => setCompose({...compose, subject: e.target.value})} />
              <textarea className="w-full p-2 mb-2 rounded bg-white/5" rows={6} placeholder="Body" value={compose.body} onChange={(e) => setCompose({...compose, body: e.target.value})} />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowCompose(false)} className="px-3 py-1 rounded bg-neutral-200">Cancel</button>
                <button onClick={sendMessage} className="px-3 py-1 rounded bg-cyan-500 text-white">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailApp;
