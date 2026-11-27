'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import TopNav from '@/components/TopNav';
import ContactPill from '@/components/ContactPill';
import PortfolioModal, { STATION_PORTFOLIOS } from '@/components/PortfolioModal';
import clsx from 'clsx';

// Dynamically import SceneCanvas to avoid SSR issues with Three.js / WebGL
const SceneCanvas = dynamic(() => import('@/components/SceneCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 gap-3">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs tracking-wider uppercase font-mono">Initializing 3D Viewport...</span>
    </div>
  ),
});

const STATION_INFO = {
  TECH: {
    title: '3D and 2D Art Development & Real-time Pipelines',
    desc: 'Interactive shader authoring, PBR workflows, Unreal Engine / WebGL integration, procedural modeling.',
    tags: ['Three.js', 'R3F', 'GLSL', 'Blender', 'Substance Painter'],
  },
  ART: {
    title: 'Tactile Fine Arts & Oil Studies',
    desc: 'Traditional oil on canvas, physical pigment chemistry, anatomical draftsmanship.',
    tags: ['Oil Mediums', 'Color Theory', 'Composition', 'Fine Arts'],
  },
  BRAND: {
    title: 'Brand Archetypes & Visual Identity',
    desc: 'Design systems, visual identity, packaging prototypes, typography, and print strategy.',
    tags: ['Typography', 'Design Systems', 'Visual Identity', 'Packaging'],
  },
  LOUNGE: {
    title: 'Culture, Trends, and Media Digest',
    desc: 'Books, games, films, music by genre, collected aesthetics, art references, and personal studio lore.',
    tags: ['Media Digest', 'Aesthetics', 'Music & Art', 'Studio Lore'],
  },
};

export default function HomePage() {
  const [activeStation, setActiveStation] = useState('OVERVIEW');
  const [settledStation, setSettledStation] = useState('OVERVIEW');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openPortfolioStation, setOpenPortfolioStation] = useState(null);
  const [openLoungeReviewId, setOpenLoungeReviewId] = useState(null);
  const [hoveredHotspotStation, setHoveredHotspotStation] = useState(null);

  const handleOpenStationPortfolio = useCallback((stationId, reviewId = null) => {
    setOpenLoungeReviewId(reviewId);
    setOpenPortfolioStation(stationId);
  }, []);

  const handleClosePortfolio = useCallback(() => {
    setOpenPortfolioStation(null);
    setOpenLoungeReviewId(null);
  }, []);

  const handleSelectStation = useCallback((nextStation) => {
    setActiveStation((prev) => {
      if (prev === nextStation) return prev;
      setSettledStation(null);
      setHoveredHotspotStation(null);
      setOpenPortfolioStation((openStation) => {
        if (openStation && openStation !== nextStation) {
          setOpenLoungeReviewId(null);
          return null;
        }
        return openStation;
      });
      return nextStation;
    });
  }, []);

  const handleArriveSection = useCallback((arrivedSection) => {
    setSettledStation(arrivedSection);
  }, []);

  const activePortfolioConfig = STATION_PORTFOLIOS[activeStation] || null;
  const isStationZoomed = Boolean(activePortfolioConfig) && settledStation === activeStation;
  const hoveredPortfolioConfig = hoveredHotspotStation
    ? STATION_PORTFOLIOS[hoveredHotspotStation]
    : null;
  const activeMeta = STATION_INFO[activeStation];

  return (
    <main
      className={clsx(
        'relative w-screen h-screen overflow-hidden select-none transition-colors duration-500',
        isDarkMode ? 'bg-[#0f1115] text-neutral-100' : 'bg-[#f4ead6] text-neutral-900'
      )}
    >
      {/* Top HUD Navigation */}
      <TopNav
        activeStation={activeStation}
        onSelectStation={handleSelectStation}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* 3D Scene Viewport */}
      <div className="w-full h-full absolute inset-0">
        <SceneCanvas
          activeView={activeStation}
          setActiveView={handleSelectStation}
          isDarkMode={isDarkMode}
          settledSection={settledStation}
          onArriveSection={handleArriveSection}
          onOpenStationPortfolio={handleOpenStationPortfolio}
          onHoverHotspot={setHoveredHotspotStation}
        />
      </div>

      {/* Station Hotspot Hover Prompt (Only when zoomed into a portfolio station & hovering its target) */}
      {isStationZoomed &&
        hoveredHotspotStation === activeStation &&
        hoveredPortfolioConfig &&
        !openPortfolioStation && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in duration-150">
            <div
              className={clsx(
                'flex items-center gap-2.5 text-base sm:text-lg font-display font-medium tracking-wide',
                isDarkMode
                  ? 'text-neutral-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]'
                  : 'text-neutral-900 drop-shadow-[0_2px_8px_rgba(255,255,255,0.85)]'
              )}
            >
              <hoveredPortfolioConfig.Icon className="w-5 h-5 text-emerald-400" />
              <span>{hoveredPortfolioConfig.hoverPrompt}</span>
            </div>
          </div>
        )}

      {/* Active Station Info Drawer / Card (Displays when zoomed into a station) */}
      {activeMeta && (
        <div className="fixed bottom-6 left-6 z-30 max-w-lg pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={clsx(
              'p-5 rounded-2xl border backdrop-blur-xl shadow-xl pointer-events-auto transition-all',
              isDarkMode
                ? 'bg-neutral-900/80 border-neutral-800 text-neutral-100'
                : 'bg-white/80 border-neutral-200 text-neutral-900'
            )}
          >
            <div className="flex items-center justify-between gap-4 mb-1.5">
              <span className="text-xs font-mono tracking-wider uppercase text-emerald-500 font-semibold">
                Zone Active: {activeStation}
              </span>
              <button
                type="button"
                onClick={() => handleSelectStation('OVERVIEW')}
                className={clsx(
                  'text-sm font-medium underline underline-offset-4 cursor-pointer transition-colors',
                  isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-950'
                )}
              >
                ← Overview
              </button>
            </div>
            <h2 className="font-display text-lg font-semibold tracking-tight">{activeMeta.title}</h2>
            <p className={clsx('mt-1.5 text-[15px] leading-relaxed', isDarkMode ? 'text-neutral-300' : 'text-neutral-600')}>
              {activeMeta.desc}
            </p>
            {activePortfolioConfig && (
              <div className="mt-3">
                {isStationZoomed ? (
                  <button
                    type="button"
                    onClick={() => handleOpenStationPortfolio(activeStation)}
                    className="text-left text-sm text-emerald-500 hover:text-emerald-400 font-medium underline underline-offset-4 cursor-pointer"
                  >
                    {activePortfolioConfig.zoomedActionLabel}
                  </button>
                ) : (
                  <p className="text-sm text-emerald-500/90 font-medium">
                    {activePortfolioConfig.zoomingLabel}
                  </p>
                )}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {activeMeta.tags.map((tag) => (
                <span
                  key={tag}
                  className={clsx(
                    'px-2.5 py-1 text-xs rounded-md font-mono',
                    isDarkMode
                      ? 'bg-neutral-800/80 text-neutral-300'
                      : 'bg-neutral-200/70 text-neutral-700'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recruiter Floating Contact Drawer */}
      <ContactPill isDarkMode={isDarkMode} />

      {/* Station Portfolio Website Popup */}
      <PortfolioModal
        stationId={openPortfolioStation}
        initialReviewId={openLoungeReviewId}
        onClose={handleClosePortfolio}
        onOpenStationPortfolio={handleOpenStationPortfolio}
        isDarkMode={isDarkMode}
      />
    </main>
  );
}
