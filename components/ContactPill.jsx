'use client';

import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, Palette, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function ContactPill({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const email = 'olivia.gale.creative@gmail.com';

  const copyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end pointer-events-auto">
      {/* Expanded Drawer Card */}
      {isOpen && (
        <div
          className={clsx(
            'mb-3 w-80 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2',
            isDarkMode
              ? 'bg-neutral-900/90 border-neutral-800 text-neutral-100'
              : 'bg-white/90 border-neutral-200 text-neutral-900'
          )}
        >
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-neutral-800/80">
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Olivia Gale</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Ready for Q1/Q2 3D Technical & Design Roles
              </p>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Quick Email Copy Row */}
          <div className="mt-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              Direct Contact
            </span>
            <div
              className={clsx(
                'mt-1 flex items-center justify-between p-2 rounded-lg border text-xs font-mono',
                isDarkMode ? 'bg-neutral-950/60 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
              )}
            >
              <span className="truncate mr-2">{email}</span>
              <button
                type="button"
                onClick={copyEmail}
                title="Copy email to clipboard"
                className={clsx(
                  'p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer',
                  copied
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : isDarkMode
                    ? 'hover:bg-neutral-800 text-neutral-300'
                    : 'hover:bg-neutral-200 text-neutral-700'
                )}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* External Social Profiles */}
          <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/80 flex items-center justify-between">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className={clsx(
                'flex items-center gap-1.5 text-xs font-medium py-1 px-2 rounded-md transition-colors',
                isDarkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
              )}
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://artstation.com"
              target="_blank"
              rel="noreferrer"
              className={clsx(
                'flex items-center gap-1.5 text-xs font-medium py-1 px-2 rounded-md transition-colors',
                isDarkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
              )}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>ArtStation</span>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={clsx(
                'flex items-center gap-1.5 text-xs font-medium py-1 px-2 rounded-md transition-colors',
                isDarkMode ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-100 text-neutral-700'
              )}
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}

      {/* Trigger Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2.5 px-4 py-2.5 rounded-full border backdrop-blur-xl shadow-xl transition-all duration-200 cursor-pointer group',
          isDarkMode
            ? 'bg-neutral-900/85 border-neutral-700 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800'
            : 'bg-white/85 border-neutral-300 text-neutral-900 hover:border-neutral-400 hover:bg-white'
        )}
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold tracking-wide">
          {isOpen ? 'Close Contact' : 'Get in Touch'}
        </span>
        <MessageSquare className="w-4 h-4 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
      </button>
    </div>
  );
}
