'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Wifi,
  BatteryCharging,
  Palette,
  Copy,
  Check,
  Coffee,
  Sparkles,
  ExternalLink,
  Compass,
  ArrowLeft,
  Tv,
  User,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';
import { withBasePath } from '@/lib/assetPath';
import { loungeReviews } from '@/data/loungeReviews';
import { loungeAesthetics } from '@/data/loungeAesthetics';
import { loungeArtReferences } from '@/data/loungeArt';

const TAB_HEADERS = {
  screening: {
    eyebrow: "LIVIE'S CULTURE LOUNGE",
    title: 'Notes on Craft, Story & Worldbuilding',
  },
  aesthetics: {
    eyebrow: 'VISUAL & ERA ARCHIVE',
    title: 'Aesthetics Library — Collected Movements & Palettes',
  },
  art: {
    eyebrow: 'FINE ART & ILLUSTRATION INSPO',
    title: 'Art Library — Creators, Sketchbooks & Linework',
  },
  profile: {
    eyebrow: 'PERSONAL STUDIO PROFILE',
    title: 'Iloilo-Based Creative & Studio Lore',
  },
};

const CATEGORIES = ['ALL', 'BOOKS', 'GAMES', 'FILMS', 'CAMPAIGNS', 'MUSIC'];

// Derived from Olivia Gale's personal brand gradient:
// Rose-Coral (#D66370), Warm Sand (#C7AF6E), Matcha-Mint (#AEE8A2), Seafoam Teal (#42AEA3)
const BADGE_STYLES = {
  BOOKS: 'bg-[#C7AF6E]/20 text-[#EAD9A4] border-[#C7AF6E]/45',
  GAMES: 'bg-[#42AEA3]/20 text-[#86EFE4] border-[#42AEA3]/45',
  FILMS: 'bg-[#D66370]/20 text-[#FFA3AD] border-[#D66370]/45',
  CAMPAIGNS: 'bg-[#AEE8A2]/18 text-[#C7F7BA] border-[#AEE8A2]/40',
  MUSIC: 'bg-[#B497FF]/20 text-[#D8CAFF] border-[#B497FF]/45',
};

const CHANNEL_ACCENTS = {
  BOOKS: '#C7AF6E',
  GAMES: '#42AEA3',
  FILMS: '#D66370',
  CAMPAIGNS: '#AEE8A2',
  MUSIC: '#B497FF',
};

const BRAND_GRADIENT =
  'linear-gradient(125deg, #D66370 0%, #C7AF6E 36%, #AEE8A2 70%, #42AEA3 100%)';

const LORE_PILLS = [
  'Sci-Fi Reading List',
  'PS5 Gaming',
  'Crochet WIPs',
  'Journaling',
  'Iced Matcha',
  'Hojicha',
  'My Shih Tzus',
];

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function ScreeningMonitorFrame({ item, compact = false }) {
  const accent = CHANNEL_ACCENTS[item.category] || '#42AEA3';

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0B0E12] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        compact ? 'aspect-[16/9]' : 'aspect-[16/8.5]'
      )}
    >
      {item.coverImage ? (
        <img
          src={withBasePath(item.coverImage)}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col justify-between p-4"
          style={{
            background: `radial-gradient(circle at 16% 18%, rgba(214,99,112,0.22), transparent 48%), radial-gradient(circle at 86% 82%, rgba(66,174,163,0.24), transparent 52%), radial-gradient(circle at 60% 25%, ${accent}20, transparent 48%), linear-gradient(155deg, #0f1419 0%, #161d24 100%)`,
          }}
        >
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono tracking-wider text-neutral-300/80">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
              />
              {item.channelCode}
            </span>
            <span className="text-neutral-400">{item.year}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto px-2">
            <div className="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.04] flex items-center justify-center mb-2 shadow-inner">
              <ImageIcon className="w-4 h-4 text-neutral-300/75" />
            </div>
            <p className="font-display text-sm sm:text-base font-semibold tracking-tight text-neutral-100 line-clamp-1">
              {item.title}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400/80 mt-0.5">
              16:9 Still Slot
            </p>
          </div>

          {/* Subtle brand-gradient horizon line */}
          <div
            className="h-[2px] w-full rounded-full opacity-75"
            style={{ background: BRAND_GRADIENT }}
          />
        </div>
      )}
    </div>
  );
}

function AestheticSpecimenBanner({ item }) {
  return (
    <div className="relative w-full aspect-[16/8] overflow-hidden rounded-xl border border-white/15 bg-[#0B0E12] shadow-inner">
      {item.specimenType === 'neo-retro' && (
        <div
          className="w-full h-full relative flex flex-col justify-between p-3.5"
          style={{
            background:
              'radial-gradient(circle at 75% 25%, rgba(255,107,74,0.38), transparent 52%), radial-gradient(circle at 22% 80%, rgba(44,198,184,0.32), transparent 55%), linear-gradient(155deg, #1b1f2b 0%, #10141d 100%)',
          }}
        >
          {/* Retro scanline overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 4px)',
            }}
          />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F4C95D]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#2CC6B8]" />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[#F4C95D]/90">
              SYS // CRT-1999
            </span>
          </div>
          <div className="relative flex items-end justify-between">
            <div className="px-2.5 py-1 rounded border border-[#F4C95D]/40 bg-black/45 font-mono text-[11px] font-bold tracking-wider text-[#F4C95D]">
              NEO-RETRO.EXE
            </div>
            <div className="w-12 h-12 rounded-xl border border-white/25 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm shadow-[0_0_20px_rgba(255,107,74,0.35)]" />
          </div>
        </div>
      )}

      {item.specimenType === 'frutiger-aero' && (
        <div
          className="w-full h-full relative flex flex-col justify-between p-3.5"
          style={{
            background:
              'radial-gradient(circle at 25% 22%, rgba(255,255,255,0.55), transparent 42%), radial-gradient(circle at 80% 78%, rgba(163,230,53,0.45), transparent 52%), linear-gradient(145deg, #0ea5e9 0%, #2dd4bf 55%, #84cc16 100%)',
          }}
        >
          {/* Glossy specular dome */}
          <div className="absolute -top-10 -left-8 w-44 h-28 rounded-full bg-white/30 blur-[1px] pointer-events-none" />
          {/* Floating aqua orbs */}
          <div className="absolute right-8 top-5 w-16 h-16 rounded-full border border-white/60 bg-gradient-to-br from-white/55 via-cyan-200/20 to-transparent shadow-[0_8px_24px_rgba(14,165,233,0.35)]" />
          <div className="absolute right-20 bottom-6 w-8 h-8 rounded-full border border-white/65 bg-white/25" />
          <div className="relative flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full bg-white/35 backdrop-blur-md border border-white/50 font-mono text-[10px] font-bold text-[#083344]">
              AERO // AQUA GLASS
            </span>
          </div>
          <div className="relative">
            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-b from-white/75 to-white/30 border border-white/70 shadow-md font-sans text-xs font-bold text-[#082f49]">
              Eco-Futurism
            </div>
          </div>
        </div>
      )}

      {item.specimenType === 'abstract-corporate' && (
        <div className="w-full h-full relative flex flex-col justify-between p-3.5 bg-[#EAE6DF]">
          {/* Modernist geometric blocks */}
          <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-[#2563EB]" />
          <div className="absolute right-12 bottom-0 w-24 h-20 rounded-tl-full bg-[#D66370]" />
          <div className="absolute left-6 bottom-4 w-12 h-12 rounded-full bg-[#EAB308]" />
          <div className="absolute left-20 top-7 w-16 h-2 rounded-full bg-[#111827]" />
          <div className="relative flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#111827] font-mono text-[10px] font-bold tracking-wider text-[#EAE6DF]">
              GRID // 03
            </span>
          </div>
          <div className="relative flex justify-end">
            <span className="px-2.5 py-0.5 rounded bg-white/90 border border-[#111827]/20 font-display text-[11px] font-bold tracking-tight text-[#111827]">
              Modernist Vector
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoungeDashboardModal({
  onClose,
  onOpenFineArt,
  initialReviewId = null,
}) {
  const [activeTab, setActiveTab] = useState('screening');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeMusicGenre, setActiveMusicGenre] = useState('ALL GENRES');
  const [selectedReview, setSelectedReview] = useState(() =>
    initialReviewId ? loungeReviews.find((r) => r.id === initialReviewId) || null : null
  );
  const [copied, setCopied] = useState(false);
  const [selectedPill, setSelectedPill] = useState('Iced Matcha');
  const email = 'livieph@gmail.com';

  useEffect(() => {
    if (initialReviewId) {
      const match = loungeReviews.find((r) => r.id === initialReviewId) || null;
      setSelectedReview(match);
      setActiveTab('screening');
    }
  }, [initialReviewId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const musicGenres = [
    'ALL GENRES',
    ...Array.from(
      new Set(
        loungeReviews
          .filter((item) => item.category === 'MUSIC' && item.genre)
          .map((item) => item.genre)
      )
    ),
  ];

  const filteredReviews = loungeReviews.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (item.category !== activeCategory) return false;
    if (activeCategory === 'MUSIC' && activeMusicGenre !== 'ALL GENRES') {
      return item.genre === activeMusicGenre;
    }
    return true;
  });

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Livie's Culture Lounge Dashboard"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Sleek Dark Tablet Frame with Ambient Brand Gradient Depth */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[89vh] flex flex-col rounded-[28px] border border-white/15 bg-[#0C1014] text-neutral-100 shadow-[0_28px_80px_rgba(0,0,0,0.85)] overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 8% 6%, rgba(214,99,112,0.18), transparent 38%), radial-gradient(circle at 52% 10%, rgba(174,232,162,0.10), transparent 40%), radial-gradient(circle at 92% 92%, rgba(66,174,163,0.20), transparent 42%), radial-gradient(circle at 14% 90%, rgba(199,175,110,0.12), transparent 36%)',
        }}
      >
        {/* Top Luminous Brand Hairline */}
        <div className="h-[2px] w-full shrink-0" style={{ background: BRAND_GRADIENT }} />

        {/* Header Bar */}
        <div className="bg-[#11161C]/85 border-b border-white/10 backdrop-blur-xl shrink-0">
          {/* Status Strip */}
          <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-[#66D1C6]">LivieOS</span>
              <span className="text-white/25">•</span>
              <span>Iloilo, PH</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Wifi className="w-3.5 h-3.5 text-[#66D1C6]" />
              <span>98%</span>
              <BatteryCharging className="w-4 h-4 text-[#AEE8A2]" />
            </div>
          </div>

          {/* Main Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 pb-4 pt-1.5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#66D1C6] font-semibold">
                {TAB_HEADERS[activeTab]?.eyebrow}
              </p>
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                {TAB_HEADERS[activeTab]?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Segmented Pill Switcher */}
              <div className="inline-flex flex-wrap p-1 rounded-xl bg-[#090C10] border border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('screening')}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer',
                    activeTab === 'screening'
                      ? 'bg-[#42AEA3]/25 text-[#8CF0E6] border border-[#42AEA3]/45 shadow-[0_2px_10px_rgba(66,174,163,0.22)]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  )}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Culture Lounge</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('aesthetics')}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer',
                    activeTab === 'aesthetics'
                      ? 'bg-[#C7AF6E]/25 text-[#F6E5AF] border border-[#C7AF6E]/45 shadow-[0_2px_10px_rgba(199,175,110,0.22)]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Aesthetics Library</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('art')}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer',
                    activeTab === 'art'
                      ? 'bg-[#AEE8A2]/22 text-[#D5FAD0] border border-[#AEE8A2]/45 shadow-[0_2px_10px_rgba(174,232,162,0.22)]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  )}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Art</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer',
                    activeTab === 'profile'
                      ? 'bg-[#D66370]/25 text-[#FFB0B9] border border-[#D66370]/45 shadow-[0_2px_10px_rgba(214,99,112,0.22)]'
                      : 'text-neutral-400 hover:text-neutral-200 border border-transparent'
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>About Livie</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Lounge Reader"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.04] text-neutral-300 font-mono text-xs hover:bg-[#D66370]/25 hover:text-white hover:border-[#D66370]/50 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">ESC</span>
                <X className="w-4 h-4 sm:hidden" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Shelf (Visible in Screening Room shelf view) */}
        {activeTab === 'screening' && !selectedReview && (
          <div className="bg-[#0E1318]/80 border-b border-white/10 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat);
                        if (cat !== 'MUSIC') {
                          setActiveMusicGenre('ALL GENRES');
                        }
                      }}
                      className={clsx(
                        'px-3.5 py-1 rounded-lg font-mono text-xs font-semibold tracking-wider border transition-all cursor-pointer',
                        isActive
                          ? cat === 'MUSIC'
                            ? 'bg-[#B497FF]/22 text-[#E5DAFF] border-[#B497FF]/55 shadow-[0_2px_12px_rgba(180,151,255,0.2)]'
                            : 'bg-[#42AEA3]/20 text-[#8CF0E6] border-[#42AEA3]/50 shadow-[0_2px_12px_rgba(66,174,163,0.18)]'
                          : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:text-neutral-100 hover:border-white/25'
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              <span className="font-mono text-[11px] text-neutral-400">
                {filteredReviews.length} {filteredReviews.length === 1 ? 'ENTRY' : 'ENTRIES'}
              </span>
            </div>

            {activeCategory === 'MUSIC' && (
              <div className="flex flex-wrap items-center gap-1.5 px-6 pb-3 pt-0.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mr-1">
                  Genre:
                </span>
                {musicGenres.map((genre) => {
                  const isActive = activeMusicGenre === genre;
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => setActiveMusicGenre(genre)}
                      className={clsx(
                        'px-2.5 py-1 rounded-full font-mono text-[10px] font-medium border transition-all cursor-pointer',
                        isActive
                          ? 'bg-[#B497FF]/25 text-[#EFE9FF] border-[#B497FF]/60 shadow-[0_2px_10px_rgba(180,151,255,0.18)]'
                          : 'bg-white/[0.02] text-neutral-400 border-white/10 hover:text-neutral-200 hover:border-white/25'
                      )}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Main Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {activeTab === 'screening' ? (
            selectedReview ? (
              /* Deconstruction Reader */
              <article className="max-w-2xl mx-auto space-y-6">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs font-semibold text-[#66D1C6] hover:bg-white/[0.08] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Shelf</span>
                </button>

                <ScreeningMonitorFrame item={selectedReview} />

                <header className="space-y-2 border-b border-white/10 pb-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                      {selectedReview.channelCode}
                    </span>
                    <span
                      className={clsx(
                        'px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold tracking-wider border',
                        BADGE_STYLES[selectedReview.category] || 'bg-[#42AEA3]/20 text-[#86EFE4]'
                      )}
                    >
                      {selectedReview.category}
                    </span>
                    {selectedReview.genre && (
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-medium border border-[#B497FF]/35 bg-[#B497FF]/12 text-[#E5DAFF]">
                        {selectedReview.genre}
                      </span>
                    )}
                    <span className="font-mono text-xs text-neutral-400">
                      {selectedReview.creator} • {selectedReview.year}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
                    {selectedReview.title}
                  </h3>

                  {selectedReview.artists?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedReview.artists.map((artist) => (
                        <span
                          key={artist.name}
                          className={clsx(
                            'px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold border',
                            artist.inspo
                              ? 'bg-gradient-to-r from-[#D66370]/30 to-[#B497FF]/30 border-[#D66370]/60 text-white'
                              : 'bg-white/[0.04] border-white/15 text-neutral-200'
                          )}
                        >
                          {artist.name}
                          {artist.inspo ? ' ★ Inspo' : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-base text-neutral-300 leading-relaxed">
                    {selectedReview.hook}
                  </p>
                </header>

                {selectedReview.quote && (
                  <blockquote className="p-4 sm:p-5 rounded-xl bg-[#141A21]/90 border border-white/10 border-l-4 border-l-[#D66370] shadow-[0_10px_28px_rgba(0,0,0,0.35)] italic text-sm md:text-base text-neutral-200">
                    &ldquo;{selectedReview.quote}&rdquo;
                  </blockquote>
                )}

                <div className="grid gap-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-[#141A21]/85 border border-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#66D1C6] mb-1.5">
                      01 // Visual &amp; Spatial Direction
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-300">
                      {selectedReview.breakdown.visualDirection}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-[#141A21]/85 border border-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#F08A95] mb-1.5">
                      02 // Narrative &amp; Emotional Resonance
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-300">
                      {selectedReview.breakdown.narrativeDesign}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#42AEA3]/15 via-[#141A21] to-[#AEE8A2]/10 border border-[#42AEA3]/35 shadow-[0_12px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#AEE8A2] mb-1.5">
                      03 // The Livie Takeaway (Applied to My Work)
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-100">
                      {selectedReview.breakdown.creativeTakeaway}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedReview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.04] font-mono text-[11px] text-neutral-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ) : (
              /* Clean 2-Column Dark Glass Channel Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredReviews.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedReview(item)}
                    className="group text-left flex flex-col justify-between p-4 rounded-2xl bg-[#131920]/88 border border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-[#42AEA3]/55 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(0,0,0,0.6),0_0_24px_rgba(66,174,163,0.12)] transition-all cursor-pointer"
                  >
                    <div>
                      <ScreeningMonitorFrame item={item} compact />

                      <div className="flex items-center justify-between gap-2 mt-3.5 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                            {item.channelCode}
                          </span>
                          <span
                            className={clsx(
                              'px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-wider border',
                              BADGE_STYLES[item.category] || 'bg-[#42AEA3]/20 text-[#86EFE4]'
                            )}
                          >
                            {item.category}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-neutral-400">
                          {item.year}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-white group-hover:text-[#7DE2D7] transition-colors">
                        {item.title}
                      </h3>
                      {item.genre && (
                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#D8CAFF] mt-1">
                          {item.genre}
                        </p>
                      )}
                      <p className="font-mono text-[11px] text-neutral-400 mt-0.5 mb-2.5">
                        {item.creator}
                      </p>

                      {item.artists?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {item.artists.map((artist) => (
                            <span
                              key={artist.name}
                              className={clsx(
                                'px-2 py-0.5 rounded-full font-mono text-[10px] border',
                                artist.inspo
                                  ? 'bg-[#D66370]/25 border-[#D66370]/55 text-[#FFD2D7] font-semibold'
                                  : 'bg-white/[0.04] border-white/10 text-neutral-200'
                              )}
                            >
                              {artist.name}
                              {artist.inspo ? ' ★' : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-sm text-neutral-300/90 leading-relaxed line-clamp-2">
                        {item.hook}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/10">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] text-neutral-300 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#F08A95] group-hover:translate-x-0.5 transition-transform">
                        Read Digest &rarr;
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : activeTab === 'aesthetics' ? (
            /* Aesthetics Library — Collected Movements, Palettes & Visual Motifs */
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <p className="text-xs sm:text-sm text-neutral-300">
                  Visual movements, nostalgic textures, and graphic eras I collect as moodboards for 3D rooms, shaders, and brand identity work.
                </p>
                <span className="font-mono text-[11px] text-[#F6E5AF] bg-[#C7AF6E]/15 border border-[#C7AF6E]/35 px-2.5 py-0.5 rounded-full shrink-0">
                  {loungeAesthetics.length} COLLECTED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {loungeAesthetics.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-[#131920]/90 border border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)] hover:border-white/25 transition-all"
                  >
                    <div>
                      <AestheticSpecimenBanner item={item} />

                      <div className="flex items-center justify-between gap-2 mt-3.5 mb-2">
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-neutral-200">
                          {item.code}
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400 truncate">
                          {item.era}
                        </span>
                      </div>

                      <h3 className="font-display text-lg font-bold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-300">
                        {item.summary}
                      </p>

                      {/* Palette Swatches */}
                      <div className="mt-4">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                          Core Palette
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {item.palette.map((hex) => (
                            <div
                              key={hex}
                              className="flex flex-col items-center gap-1"
                            >
                              <span
                                className="w-full h-5 rounded-md border border-white/15 shadow-inner"
                                style={{ backgroundColor: hex }}
                              />
                              <span className="font-mono text-[9px] text-neutral-400">
                                {hex}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Motifs */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {item.motifs.map((motif) => (
                          <span
                            key={motif}
                            className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-white/[0.04] border border-white/10 text-neutral-200"
                          >
                            {motif}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#66D1C6] font-semibold mb-1">
                        Studio Application
                      </p>
                      <p className="text-xs leading-relaxed text-neutral-300">
                        {item.studioNote}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : activeTab === 'art' ? (
            /* Art Library — Visual Artists, Illustrators & Linework Inspo */
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                <p className="text-xs sm:text-sm text-neutral-300">
                  Illustrators, painters, and visual storytellers whose linework, color courage, and physical mediums inspire my sketchbook and painting practice.
                </p>
                <span className="font-mono text-[11px] text-[#D5FAD0] bg-[#AEE8A2]/15 border border-[#AEE8A2]/35 px-2.5 py-0.5 rounded-full shrink-0">
                  {loungeArtReferences.length} COLLECTED
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {loungeArtReferences.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl p-5 sm:p-6 bg-[#131920]/90 border border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.07)] grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch"
                  >
                    {/* Bold Pop-Art / Linework Specimen Frame */}
                    <div
                      className="md:col-span-5 rounded-xl border border-white/15 p-4 flex flex-col justify-between min-h-[210px] relative overflow-hidden"
                      style={{
                        background:
                          'radial-gradient(circle at 20% 25%, rgba(255,94,91,0.35), transparent 52%), radial-gradient(circle at 82% 78%, rgba(45,212,191,0.28), transparent 52%), linear-gradient(145deg, #1E1B4B 0%, #11161C 100%)',
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-black/45 border border-white/15 text-[#FFCE45]">
                          {item.code}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-200/80">
                          Pop Art • Mixed Media
                        </span>
                      </div>

                      <div className="my-auto py-4">
                        <div className="inline-block px-3.5 py-1.5 rounded-xl bg-[#FFCE45] text-[#111827] font-display text-xl font-extrabold tracking-tight border-2 border-[#111827] shadow-[4px_4px_0px_#FF5E5B]">
                          GAWX ART
                        </div>
                        <p className="mt-3 font-mono text-[11px] text-neutral-200/90">
                          {item.discipline}
                        </p>
                      </div>

                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-300/75 mb-1.5">
                          Signature Color Pop
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {item.palette.map((hex) => (
                            <span
                              key={hex}
                              title={hex}
                              className="h-4 rounded border border-white/25"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Artist Breakdown & Mediums */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display text-2xl font-bold text-white">
                            {item.artist}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border border-[#AEE8A2]/45 bg-[#AEE8A2]/15 text-[#D5FAD0]">
                            Artist Inspo ★
                          </span>
                        </div>

                        <p className="mt-2.5 text-sm leading-relaxed text-neutral-300">
                          {item.summary}
                        </p>

                        <div className="mt-4">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                            Core Mediums
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.mediums.map((medium) => (
                              <span
                                key={medium}
                                className="px-2.5 py-1 rounded-full font-mono text-[11px] bg-[#AEE8A2]/12 border border-[#AEE8A2]/35 text-[#D5FAD0]"
                              >
                                {medium}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3.5">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
                            Visual Signatures
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.signatures.map((sig) => (
                              <span
                                key={sig}
                                className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-white/[0.04] border border-white/10 text-neutral-200"
                              >
                                {sig}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <p className="text-xs leading-relaxed text-neutral-300">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#66D1C6] font-semibold mr-1.5">
                            Why It Inspires Me:
                          </span>
                          {item.craftNotes}
                        </p>
                        {item.quote && (
                          <p className="text-xs italic text-neutral-400">
                            &ldquo;{item.quote}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            /* About Livie — Dimensional Dark Glass + Personal Brand Gradient Accents */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Widget 1: "The Human" Bio, Portrait & 3 Mindsets */}
              <section className="md:col-span-7 rounded-2xl p-5 sm:p-6 bg-[#131920]/88 border border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#66D1C6] font-semibold">
                      <Compass className="w-3.5 h-3.5" />
                      Widget 01 // The Human
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-[#D66370]/45 text-[11px] font-mono font-medium bg-[#D66370]/15 text-[#FFA3AD]">
                      Iloilo-based Creative
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Soft Gradient-Rimmed Portrait */}
                    <div
                      className="w-24 sm:w-28 shrink-0 rounded-2xl p-[2px] shadow-[0_10px_24px_rgba(0,0,0,0.5)]"
                      style={{ background: BRAND_GRADIENT }}
                    >
                      <img
                        src={withBasePath('/images/livie-portrait.jpg')}
                        alt="Olivia Gale (Livie) portrait"
                        className="w-full aspect-[4/5] object-cover object-top rounded-[14px] bg-[#0C1014]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl font-bold tracking-tight text-white">
                        Hey, I&apos;m Olivia Gale (Livie)
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                        I&apos;m an Iloilo-based creative building real-time 3D worlds, tactile paintings, and brand print systems—guided by three daily studio mindsets:
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Elevated Dark Mindset Cards */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl p-3.5 bg-[#0E1318]/90 border border-[#42AEA3]/30 shadow-inner">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#66D1C6] font-bold">
                      &ldquo;Document, Don&apos;t Create&rdquo;
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                      Sharing honest studio WIPs, shader experiments, and raw process over perfection.
                    </p>
                  </div>
                  <div className="rounded-xl p-3.5 bg-[#0E1318]/90 border border-[#D66370]/30 shadow-inner">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#F08A95] font-bold">
                      &ldquo;Minimum Viable Day&rdquo;
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                      Consistent small creative ship-blocks every day that compound into complete worlds.
                    </p>
                  </div>
                  <div className="rounded-xl p-3.5 bg-[#0E1318]/90 border border-[#AEE8A2]/30 shadow-inner">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-[#AEE8A2] font-bold">
                      &ldquo;Programmer Mindset&rdquo;
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                      Treating art, 3D pipelines, and design systems as modular, debuggable blocks that ship.
                    </p>
                  </div>
                </div>
              </section>

              {/* Widget 2: Socials & Portals */}
              <section className="md:col-span-5 rounded-2xl p-5 sm:p-6 bg-[#131920]/88 border border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#F08A95] font-semibold">
                    Widget 02 // Socials &amp; Portals
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#AEE8A2]" />
                </div>

                <div className="space-y-3">
                  <a
                    href="https://instagram.com/livie.gale"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl p-3 bg-[#0E1318]/85 border border-white/10 hover:border-[#D66370]/55 hover:bg-[#171E26] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D66370] to-[#C7AF6E] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <InstagramIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold flex items-center gap-1 text-white">
                        Instagram <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 truncate">@livie.gale • Studio WIPs</div>
                    </div>
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl p-3 bg-[#0E1318]/85 border border-white/10 hover:border-[#42AEA3]/55 hover:bg-[#171E26] transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#42AEA3] to-[#2B7C75] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <LinkedInIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold flex items-center gap-1 text-white">
                        LinkedIn <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 truncate">Olivia Gale Gerochi</div>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenFineArt) {
                        onOpenFineArt();
                      } else {
                        window.open(withBasePath('/theartofgale/index.html'), '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="group w-full text-left flex items-center gap-3 rounded-xl p-3 bg-[#0E1318]/85 border border-white/10 hover:border-[#AEE8A2]/55 hover:bg-[#171E26] transition-all cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#AEE8A2] to-[#42AEA3] text-[#0C1014] flex items-center justify-center shrink-0 shadow-sm">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold flex items-center gap-1 text-white">
                        The Art of Gale <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 truncate">ArtStation &amp; Fine Art</div>
                    </div>
                  </button>
                </div>
              </section>

              {/* Widget 3: Off-Screen Lore & Spotify Embed */}
              <section className="md:col-span-12 rounded-2xl p-5 sm:p-6 bg-[#131920]/88 border border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-5">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#AEE8A2] font-semibold block mb-3">
                    Widget 03 // Off-Screen Lore &amp; Currently Into
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {LORE_PILLS.map((pill) => {
                      const active = selectedPill === pill;
                      return (
                        <button
                          key={pill}
                          type="button"
                          onClick={() => setSelectedPill(pill)}
                          className={clsx(
                            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer',
                            active
                              ? 'bg-gradient-to-r from-[#D66370]/30 via-[#AEE8A2]/20 to-[#42AEA3]/30 text-white border-[#66D1C6]/60 shadow-[0_2px_12px_rgba(66,174,163,0.2)]'
                              : 'bg-[#0E1318]/85 border-white/10 text-neutral-300 hover:border-white/25 hover:text-white'
                          )}
                        >
                          {pill}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-xs font-mono text-neutral-400 border-t border-white/10 pt-3">
                    Currently vibing with:{' '}
                    <span className="font-semibold text-[#AEE8A2]">{selectedPill}</span>
                  </p>
                </div>

                <div className="md:col-span-7 w-full p-1.5 rounded-2xl bg-[#090C10] border border-white/10 shadow-inner">
                  <iframe
                    data-testid="embed-iframe"
                    title="Livie's Studio Spotify Playlist"
                    style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/playlist/76egvhOabLSpnEzEgl8Yh7?utm_source=generator&si=0330b3fe76da4748"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </div>
              </section>

              {/* Widget 4: "Grab a Matcha" Direct Contact Card */}
              <section className="md:col-span-12 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-[#D66370]/12 via-[#131920]/95 to-[#42AEA3]/15 border border-white/12 shadow-[0_14px_34px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-[#66D1C6] font-semibold">
                      <Coffee className="w-3.5 h-3.5" />
                      Widget 04 // Grab a Matcha
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full border border-[#AEE8A2]/35 bg-[#AEE8A2]/10 text-[10px] font-mono text-[#AEE8A2] font-semibold">
                      Open for OJT
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-300">
                    Down for OJT opportunities, creative collaborations, and studio chats.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#0B0E12] border border-white/10 font-mono text-xs sm:text-sm shrink-0 shadow-inner">
                  <span className="truncate text-neutral-200">{email}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={clsx(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer shrink-0',
                      copied
                        ? 'bg-[#42AEA3] text-[#090C10]'
                        : 'bg-gradient-to-r from-[#D66370] to-[#42AEA3] text-white hover:brightness-110'
                    )}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
