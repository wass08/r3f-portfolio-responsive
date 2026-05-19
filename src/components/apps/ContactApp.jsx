import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { profile } from '../../data/profile';
import { socials } from '../../data/socials';

/**
 * Contact App
 * Direct contact methods and social links
 */
const ContactApp = ({ windowId, windowData }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (email && message) {
      setSent(true);
      setTimeout(() => {
        setEmail('');
        setMessage('');
        setSent(false);
      }, 2000);
    }
  };

  return (
    <div className="h-full p-6 overflow-auto bg-gradient-to-br from-neutral-900 to-neutral-800">
      <h1 className="text-2xl font-bold text-white mb-2">Get in Touch</h1>
      <p className="text-neutral-400 mb-6">Have a question or want to collaborate? Reach out!</p>

      {/* Contact Info */}
      <div className="mb-8 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-neutral-400">Email:</span>
            <a href={`mailto:${profile.contact.email}`} className="text-primary-400 hover:text-primary-300 ml-2">
              {profile.contact.email}
            </a>
          </div>
          <div>
            <span className="text-neutral-400">Status:</span>
            <span className="text-green-400 ml-2">🟢 {profile.availability.message}</span>
          </div>
        </div>
      </div>

      {/* Quick Message Form */}
      <div className="mb-8">
        <h3 className="font-semibold text-white mb-3">Send a Message</h3>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-primary-500"
          />
          <textarea
            placeholder="Your message..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-primary-500 resize-none"
          />
          <Button variant="primary" onClick={handleSend} className="w-full text-sm">
            {sent ? '✅ Sent!' : 'Send Message'}
          </Button>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="font-semibold text-white mb-3">Connect With Me</h3>
        <div className="grid grid-cols-2 gap-2">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:text-white hover:border-primary-500 transition-all"
            >
              <span className="mr-2">{social.icon}</span>
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactApp;
