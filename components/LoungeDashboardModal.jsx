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
} from 'lucide-react';
import clsx from 'clsx';
import { withBasePath } from '@/lib/assetPath';
import { loungeReviews } from '@/data/loungeReviews';

const CATEGORIES = ['ALL', 'BOOKS', 'GAMES', 'FILMS', 'CAMPAIGNS'];

// Derived from Olivia Gale's personal brand gradient:
// Rose-Coral (#D66370), Warm Sand (#C7AF6E), Matcha-Mint (#AEE8A2), Seafoam Teal (#42AEA3)
const BADGE_STYLES = {
  BOOKS: 'bg-[#C7AF6E]/20 text-[#EAD9A4] border-[#C7AF6E]/45',
  GAMES: 'bg-[#42AEA3]/20 text-[#86EFE4] border-[#42AEA3]/45',
  FILMS: 'bg-[#D66370]/20 text-[#FFA3AD] border-[#D66370]/45',
  CAMPAIGNS: 'bg-[#AEE8A2]/18 text-[#C7F7BA] border-[#AEE8A2]/40',
};

const CHANNEL_ACCENTS = {
  BOOKS: '#C7AF6E',
  GAMES: '#42AEA3',
  FILMS: '#D66370',
  CAMPAIGNS: '#AEE8A2',
};

const BRAND_GRADIENT =
  'linear-gradient(125deg, #D66370 0%, #C7AF6E 36%, #AEE8A2 70%, #42AEA3 100%)';

const LORE_PILLS = [
  'Sci-Fi Reading List',
  'PS5 Gaming',
  'Crochet WIPs',
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

export default function LoungeDashboardModal({
  onClose,
  onOpenFineArt,
  initialReviewId = null,
}) {
  const [activeTab, setActiveTab] = useState('screening');
  const [activeCategory, setActiveCategory] = useState('ALL');
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

  const filteredReviews =
    activeCategory === 'ALL'
      ? loungeReviews
      : loungeReviews.filter((item) => item.category === activeCategory);

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
                {activeTab === 'screening'
                  ? "LIVIE'S CULTURE LOUNGE"
                  : 'PERSONAL STUDIO PROFILE'}
              </p>
              <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mt-0.5">
                {activeTab === 'screening'
                  ? 'Notes on Craft, Story & Worldbuilding'
                  : 'Iloilo-Based Creative & Studio Lore'}
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Segmented Pill Switcher */}
              <div className="inline-flex p-1 rounded-xl bg-[#090C10] border border-white/10 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('screening')}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer',
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
                  onClick={() => setActiveTab('profile')}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer',
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
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-[#0E1318]/80 border-b border-white/10 shrink-0">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={clsx(
                      'px-3.5 py-1 rounded-lg font-mono text-xs font-semibold tracking-wider border transition-all cursor-pointer',
                      isActive
                        ? 'bg-[#42AEA3]/20 text-[#8CF0E6] border-[#42AEA3]/50 shadow-[0_2px_12px_rgba(66,174,163,0.18)]'
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
                    <span className="font-mono text-xs text-neutral-400">
                      {selectedReview.creator} • {selectedReview.year}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
                    {selectedReview.title}
                  </h3>

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
                      <p className="font-mono text-[11px] text-neutral-400 mt-0.5 mb-2.5">
                        {item.creator}
                      </p>

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
