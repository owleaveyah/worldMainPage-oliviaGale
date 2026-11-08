'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import TopNav from '@/components/TopNav';
import ContactPill from '@/components/ContactPill';
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
    title: '3D Technical & Real-time Pipelines',
    desc: 'Interactive shader authoring, PBR workflows, Unreal Engine / WebGL integration, procedural modeling.',
    tags: ['Three.js', 'R3F', 'GLSL', 'Blender', 'Substance Painter'],
  },
  ART: {
    title: 'Tactile Fine Arts & Oil Studies',
    desc: 'Traditional oil on canvas, physical pigment chemistry, digital painting, anatomical draftsmanship.',
    tags: ['Oil Mediums', 'Color Theory', 'Composition', 'Fine Arts'],
  },
  BRAND: {
    title: 'Brand Archetypes & Editorial Print',
    desc: 'Design systems, publication layouts, packaging prototypes, typography, luxury brand strategy.',
    tags: ['Typography', 'Editorial', 'Visual Identity', 'Packaging'],
  },
  LOUNGE: {
    title: 'Game Culture, Research & Collaboration',
    desc: 'Interactive storytelling, game mechanics analysis, research reports, creative direction inquiries.',
    tags: ['Game Design', 'Creative Direction', 'Open for Roles'],
  },
};

export default function HomePage() {
  const [activeStation, setActiveStation] = useState('OVERVIEW');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const activeMeta = STATION_INFO[activeStation];

  return (
    <main
      className={clsx(
        'relative w-screen h-screen overflow-hidden select-none transition-colors duration-500',
        isDarkMode ? 'bg-[#0f1115] text-neutral-100' : 'bg-[#f5f3ef] text-neutral-900'
      )}
    >
      {/* Top HUD Navigation */}
      <TopNav
        activeStation={activeStation}
        onSelectStation={setActiveStation}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* 3D Scene Viewport */}
      <div className="w-full h-full absolute inset-0">
        <SceneCanvas
          activeView={activeStation}
          setActiveView={setActiveStation}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Active Station Info Drawer / Card (Displays when zoomed into a station) */}
      {activeMeta && (
        <div className="fixed bottom-6 left-6 z-30 max-w-sm pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={clsx(
              'p-4 rounded-2xl border backdrop-blur-xl shadow-xl pointer-events-auto transition-all',
              isDarkMode
                ? 'bg-neutral-900/80 border-neutral-800 text-neutral-100'
                : 'bg-white/80 border-neutral-200 text-neutral-900'
            )}
          >
            <div className="flex items-center justify-between gap-4 mb-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-500 font-semibold">
                Zone Active: {activeStation}
              </span>
              <button
                type="button"
                onClick={() => setActiveStation('OVERVIEW')}
                className="text-[11px] underline text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                ← Overview
              </button>
            </div>
            <h2 className="text-sm font-semibold tracking-tight">{activeMeta.title}</h2>
            <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{activeMeta.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeMeta.tags.map((tag) => (
                <span
                  key={tag}
                  className={clsx(
                    'px-2 py-0.5 text-[10px] rounded-md font-mono',
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
    </main>
  );
}
