'use client';

import React, { useEffect } from 'react';
import { ExternalLink, X, Palette, Monitor, Stamp, Tablet } from 'lucide-react';
import clsx from 'clsx';
import BrandDossierModal from './BrandDossierModal';
import LoungeDashboardModal from './LoungeDashboardModal';

export const STATION_PORTFOLIOS = {
  ART: {
    url: 'https://owleaveyah.github.io/theartofgale/',
    title: 'The Art of Gale — Painting Portfolio',
    subtitle: 'Olivia Gale Gerochi • Fine Arts & Illustration',
    ariaLabel: 'The Art of Gale Painting Portfolio',
    closeAriaLabel: 'Close painting portfolio',
    hoverPrompt: 'Click canvas to view The Art of Gale',
    zoomedActionLabel: '✦ Click the easel canvas (or here) to open The Art of Gale portfolio',
    zoomingLabel: 'Zooming to easel…',
    iframeBgClass: 'bg-[#fffbef]',
    Icon: Palette,
  },
  TECH: {
    url: 'https://owleaveyah.github.io/ArTech_Portfolio/',
    title: 'ArTech Portfolio — Technical Art & Interactive 3D',
    subtitle: 'Olivia Gale Gerochi • Shaders, Real-time Pipelines & Creative Tech',
    ariaLabel: 'ArTech Portfolio',
    closeAriaLabel: 'Close ArTech portfolio',
    hoverPrompt: 'Click monitor to view ArTech Portfolio',
    zoomedActionLabel: '✦ Click either monitor screen (or here) to open ArTech Portfolio',
    zoomingLabel: 'Zooming to workstation…',
    iframeBgClass: 'bg-neutral-950',
    Icon: Monitor,
  },
  BRAND: {
    title: 'Brand & Identity Archive',
    subtitle: 'Olivia Gale Gerochi • Editorial Systems, Packaging & Print',
    ariaLabel: 'Brand and Identity Archive',
    closeAriaLabel: 'Close brand archive',
    hoverPrompt: 'Click corkboard to open Brand & Identity Archive',
    zoomedActionLabel: '✦ Click the corkboard or bed proofs (or here) to open Brand & Identity Archive',
    zoomingLabel: 'Zooming to brand studio…',
    Icon: Stamp,
  },
  LOUNGE: {
    title: "Livie's Culture Lounge Dashboard",
    subtitle: 'Olivia Gale Gerochi • Craft Reviews, Culture & Studio Lore',
    ariaLabel: "Livie's Culture Lounge Dashboard",
    closeAriaLabel: 'Close Culture Lounge dashboard',
    hoverPrompt: "Click iPad to open Livie's Culture Lounge",
    zoomedActionLabel: "✦ Click the lounge iPad (or here) to open Livie's Culture Lounge",
    zoomingLabel: 'Zooming to lounge…',
    Icon: Tablet,
  },
};

export default function PortfolioModal({
  stationId,
  initialReviewId = null,
  onClose,
  isDarkMode,
  onOpenStationPortfolio,
}) {
  const portfolio = stationId ? STATION_PORTFOLIOS[stationId] : null;

  useEffect(() => {
    if (!portfolio || stationId === 'BRAND' || stationId === 'LOUNGE') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [portfolio, stationId, onClose]);

  if (!portfolio) return null;

  if (stationId === 'BRAND') {
    return <BrandDossierModal onClose={onClose} isDarkMode={isDarkMode} />;
  }

  if (stationId === 'LOUNGE') {
    return (
      <LoungeDashboardModal
        onClose={onClose}
        isDarkMode={isDarkMode}
        initialReviewId={initialReviewId}
        onOpenFineArt={
          onOpenStationPortfolio ? () => onOpenStationPortfolio('ART') : undefined
        }
      />
    );
  }

  const { url, title, subtitle, ariaLabel, closeAriaLabel, iframeBgClass, Icon } = portfolio;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'w-full max-w-6xl h-[88vh] rounded-2xl border overflow-hidden flex flex-col shadow-2xl transition-colors',
          isDarkMode
            ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
            : 'bg-white border-neutral-200 text-neutral-900'
        )}
      >
        {/* Modal Header Bar */}
        <div
          className={clsx(
            'flex items-center justify-between gap-3 px-4 py-3 border-b shrink-0',
            isDarkMode ? 'border-neutral-800 bg-neutral-900/95' : 'border-neutral-200 bg-neutral-50'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-display text-xs sm:text-sm font-semibold tracking-tight truncate">
                {title}
              </h2>
              <p className="text-[10px] text-neutral-400 truncate">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                isDarkMode
                  ? 'border-neutral-700 text-neutral-200 hover:bg-neutral-800'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <span className="hidden sm:inline">Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label={closeAriaLabel}
              className={clsx(
                'p-1.5 rounded-lg border transition-colors cursor-pointer',
                isDarkMode
                  ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Portfolio Website */}
        <iframe
          src={url}
          title={title}
          className={clsx('w-full flex-1 border-0', iframeBgClass)}
        />
      </div>
    </div>
  );
}
