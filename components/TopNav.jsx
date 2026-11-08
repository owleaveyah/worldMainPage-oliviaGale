'use client';

import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const STATIONS = [
  { id: 'OVERVIEW', label: 'Overview' },
  { id: 'TECH', label: 'Tech Lab' },
  { id: 'ART', label: 'Fine Art' },
  { id: 'BRAND', label: 'Brand & Print' },
  { id: 'LOUNGE', label: 'Lounge' },
];

export default function TopNav({ activeStation, onSelectStation, isDarkMode, onToggleDarkMode }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand / Logo */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectStation('OVERVIEW')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectStation('OVERVIEW');
          }}
          className={clsx(
            'flex items-center gap-2.5 px-3 py-1.5 rounded-full cursor-pointer backdrop-blur-md transition-all border',
            isDarkMode
              ? 'bg-neutral-900/70 border-neutral-800 text-neutral-100 hover:border-neutral-700 shadow-lg shadow-black/40'
              : 'bg-white/70 border-neutral-200 text-neutral-900 hover:border-neutral-300 shadow-md shadow-neutral-200/50'
          )}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide uppercase leading-tight">
              Olivia Gale
            </span>
            <span className="text-[10px] text-neutral-400 leading-none">
              3D Technical Artist & Designer
            </span>
          </div>
        </div>

        {/* Anchor Pills */}
        <nav
          aria-label="Room Stations"
          className={clsx(
            'hidden md:flex items-center gap-1 p-1 rounded-full border backdrop-blur-md transition-colors',
            isDarkMode
              ? 'bg-neutral-900/70 border-neutral-800 shadow-lg shadow-black/40'
              : 'bg-white/70 border-neutral-200 shadow-md shadow-neutral-200/50'
          )}
        >
          {STATIONS.map((st) => {
            const isActive = activeStation === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStation(st.id)}
                className={clsx(
                  'px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer',
                  isActive
                    ? isDarkMode
                      ? 'bg-neutral-100 text-neutral-950 shadow-sm'
                      : 'bg-neutral-900 text-white shadow-sm'
                    : isDarkMode
                    ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                )}
              >
                {st.label}
              </button>
            );
          })}
        </nav>

        {/* Right HUD Controls: Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle daylight / dark mode"
            className={clsx(
              'p-2 rounded-full border backdrop-blur-md transition-all cursor-pointer flex items-center justify-center',
              isDarkMode
                ? 'bg-neutral-900/70 border-neutral-800 text-amber-300 hover:bg-neutral-800 shadow-lg'
                : 'bg-white/70 border-neutral-200 text-neutral-700 hover:bg-neutral-100 shadow-md'
            )}
          >
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Station Strip */}
      <div className="md:hidden mt-2 flex items-center justify-center pointer-events-auto">
        <div
          className={clsx(
            'flex items-center gap-1 p-1 rounded-full border backdrop-blur-md overflow-x-auto max-w-full',
            isDarkMode
              ? 'bg-neutral-900/80 border-neutral-800'
              : 'bg-white/80 border-neutral-200'
          )}
        >
          {STATIONS.map((st) => {
            const isActive = activeStation === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStation(st.id)}
                className={clsx(
                  'px-2.5 py-1 text-[11px] font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer',
                  isActive
                    ? isDarkMode
                      ? 'bg-neutral-100 text-neutral-950'
                      : 'bg-neutral-900 text-white'
                    : isDarkMode
                    ? 'text-neutral-400'
                    : 'text-neutral-600'
                )}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
