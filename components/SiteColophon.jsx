'use client';

import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import clsx from 'clsx';

export default function SiteColophon({ isDarkMode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3.5 left-4 sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2 z-20 flex flex-col items-start sm:items-center pointer-events-auto">
      {open && (
        <div
          role="note"
          className={clsx(
            'mb-2 w-[calc(100vw-2rem)] max-w-sm p-3.5 rounded-xl border backdrop-blur-xl shadow-xl text-xs leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-150',
            isDarkMode
              ? 'bg-neutral-900/92 border-neutral-800 text-neutral-200'
              : 'bg-white/92 border-neutral-200 text-neutral-800'
          )}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-500 font-semibold">
              <Sparkles className="w-3 h-3" />
              From the Mind of Olivia Gale
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close site credits"
              className={clsx(
                'p-0.5 rounded transition-colors cursor-pointer',
                isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
              )}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-semibold">
            &copy; 2026 Olivia Gale Gerochi. All rights reserved.
          </p>
          <p className={clsx('mt-1', isDarkMode ? 'text-neutral-400' : 'text-neutral-600')}>
            This interactive 3D world is my creative brainchild — crafted from the mind of Olivia Gale with Blender, Three.js, React Three Fiber, Next.js &amp; Tailwind CSS.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        title="View site credits and copyright"
        className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono tracking-wide backdrop-blur-md transition-colors cursor-pointer',
          isDarkMode
            ? 'bg-neutral-950/55 border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/25'
            : 'bg-white/70 border-neutral-300/70 text-neutral-600 hover:text-neutral-900 hover:border-neutral-400'
        )}
      >
        <span>&copy; 2026 Olivia Gale</span>
        <span className="hidden md:inline opacity-50">•</span>
        <span className="hidden md:inline">From the mind of Olivia Gale — built with Blender, R3F &amp; Next.js</span>
      </button>
    </div>
  );
}
