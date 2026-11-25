'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { withBasePath } from '@/lib/assetPath';

const STATIONS = [
  { id: 'OVERVIEW', label: 'Overview' },
  { id: 'TECH', label: 'Tech Lab' },
  { id: 'ART', label: 'Fine Art' },
  { id: 'BRAND', label: 'Brand & Print' },
  { id: 'LOUNGE', label: 'Lounge' },
];

export default function TopNav({ activeStation, onSelectStation, isDarkMode, onToggleDarkMode }) {
  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 px-5 py-2 sm:px-8 sm:py-3 pointer-events-none transition-colors duration-500',
        isDarkMode
          ? 'bg-gradient-to-b from-black/45 via-black/15 to-transparent'
          : 'bg-gradient-to-b from-white/55 via-white/20 to-transparent'
      )}
    >
      <div className="max-w-[90rem] mx-auto flex items-center justify-between gap-6 pointer-events-auto">
        {/* Brand / Logo */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectStation('OVERVIEW')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectStation('OVERVIEW');
          }}
          className={clsx(
            'group flex items-center gap-4 sm:gap-5 cursor-pointer shrink-0 transition-opacity duration-200 hover:opacity-85',
            isDarkMode
              ? 'text-neutral-100 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]'
              : 'text-neutral-900 drop-shadow-[0_1px_6px_rgba(255,255,255,0.6)]'
          )}
        >
          <img
            src={withBasePath('/images/og-logo.png')}
            alt="Olivia Gale logo"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-display text-xl sm:text-2xl font-semibold tracking-wider uppercase leading-tight">
              Olivia Gale
            </span>
            <span
              className={clsx(
                'text-xs sm:text-sm font-medium leading-tight tracking-wide',
                isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
              )}
            >
              3D Technical Artist & Designer
            </span>
          </div>
        </div>

        {/* Spread Hoverable Text Navigation */}
        <nav
          aria-label="Room Stations"
          className="hidden md:flex flex-1 max-w-3xl mx-4 lg:mx-10 items-center justify-between gap-5"
        >
          {STATIONS.map((st) => {
            const isActive = activeStation === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStation(st.id)}
                className={clsx(
                  'group relative py-1 font-display text-base lg:text-lg tracking-wide transition-colors duration-200 cursor-pointer whitespace-nowrap bg-transparent border-0',
                  isDarkMode
                    ? 'drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]'
                    : 'drop-shadow-[0_1px_6px_rgba(255,255,255,0.7)]',
                  isActive
                    ? isDarkMode
                      ? 'text-white font-semibold'
                      : 'text-neutral-950 font-semibold'
                    : isDarkMode
                    ? 'text-neutral-300/80 hover:text-white font-medium'
                    : 'text-neutral-600 hover:text-neutral-950 font-medium'
                )}
              >
                <span>{st.label}</span>
                <span
                  className={clsx(
                    'absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full transition-transform duration-200 origin-left',
                    isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600',
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 opacity-70'
                  )}
                />
              </button>
            );
          })}
        </nav>

        {/* Right HUD Control: Hoverable Theme Toggle */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label="Toggle daylight / dark mode"
            className={clsx(
              'flex items-center gap-2 py-1 font-display text-base lg:text-lg font-medium cursor-pointer transition-all duration-200 bg-transparent border-0',
              isDarkMode
                ? 'text-amber-300 hover:text-amber-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]'
                : 'text-neutral-700 hover:text-neutral-950 drop-shadow-[0_1px_6px_rgba(255,255,255,0.7)]'
            )}
          >
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="hidden sm:inline">{isDarkMode ? 'Night' : 'Day'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Station Strip */}
      <div className="md:hidden mt-3 flex items-center justify-center pointer-events-auto">
        <div className="flex items-center justify-between gap-5 overflow-x-auto max-w-full px-1">
          {STATIONS.map((st) => {
            const isActive = activeStation === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStation(st.id)}
                className={clsx(
                  'relative py-1 font-display text-sm sm:text-base tracking-wide whitespace-nowrap transition-colors cursor-pointer bg-transparent border-0',
                  isActive
                    ? isDarkMode
                      ? 'text-white font-semibold'
                      : 'text-neutral-950 font-semibold'
                    : isDarkMode
                    ? 'text-neutral-300/80 hover:text-white font-medium'
                    : 'text-neutral-600 hover:text-neutral-950 font-medium'
                )}
              >
                <span>{st.label}</span>
                <span
                  className={clsx(
                    'absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full transition-transform duration-200',
                    isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600',
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
