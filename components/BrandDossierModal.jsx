'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { brandCases } from '@/data/brandCases';
import { withBasePath } from '@/lib/assetPath';

export default function BrandDossierModal({ onClose }) {
  const [selectedId, setSelectedId] = useState(brandCases[0].id);
  const [copiedHex, setCopiedHex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activeCase =
    brandCases.find((item) => item.id === selectedId) || brandCases[0];

  const handleCopyHex = (hex) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Brand and Identity Editorial Archive"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      {/* Swiss Editorial Container */}
      <div
        className="relative w-full max-w-5xl max-h-[88vh] flex flex-col bg-[#FAF3E6] text-[#1F2937] border border-[#1F2937] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Studio Index Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#1F2937] bg-[#F3E8D2] shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-mono text-xs uppercase tracking-widest px-2 py-0.5 border border-[#1F2937] bg-[#FAF3E6] shrink-0">
              BRAND &amp; IDENTITY ARCHIVE
            </span>
            <span className="hidden sm:inline font-mono text-xs text-[#4B5563] truncate">
              SELECTED WORKS + ACTIVE STUDIO WIP // 2025–2026
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Brand Archive"
            className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-[#1F2937] bg-[#1F2937] text-[#FAF3E6] hover:bg-[#E11D48] hover:border-[#E11D48] transition-colors cursor-pointer shrink-0"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* Split Swiss Grid Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-y-auto md:overflow-hidden">
          {/* Left Column: Case Index Directory */}
          <aside className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#1F2937] divide-y divide-[#1F2937] bg-[#FAF3E6] md:overflow-y-auto">
            {brandCases.map((item) => {
              const isSelected = item.id === activeCase.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-5 transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1F2937] text-[#FAF3E6]'
                      : 'hover:bg-[#EFE4CE] text-[#1F2937]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full font-mono text-[11px] tracking-widest">
                    <span>{item.index}</span>
                    <span
                      className={`px-2 py-0.5 border ${
                        item.status === 'IN PROGRESS'
                          ? 'border-[#E64B26] text-[#E64B26]'
                          : isSelected
                          ? 'border-[#FAF3E6]/40 text-[#FAF3E6]'
                          : 'border-[#1F2937]/40 text-[#4B5563]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-black uppercase tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p
                      className={`font-mono text-xs mt-1 ${
                        isSelected ? 'text-[#D1D5DB]' : 'text-[#6B7280]'
                      }`}
                    >
                      {item.role} — {item.year}
                    </p>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Right Column: Active Case Dossier */}
          <section className="md:col-span-7 p-6 md:p-8 space-y-6 bg-[#FFFDF9] md:overflow-y-auto">
            {/* Case Title & Meta */}
            <div className="border-b border-[#1F2937] pb-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs uppercase tracking-wider text-[#0F766E]">
                <span>
                  {activeCase.index} // {activeCase.client}
                </span>
                <span>{activeCase.year}</span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-[#1F2937]">
                {activeCase.title}
              </h2>

              <p className="text-sm md:text-base text-[#374151] leading-relaxed pt-1">
                {activeCase.summary}
              </p>
            </div>

            {/* Optional Visual Proof / Gallery Frame */}
            <div className="border border-[#1F2937] bg-[#FAF3E6]">
              {activeCase.images && activeCase.images.length >= 3 ? (
                <div className="divide-y divide-[#1F2937]">
                  <div
                    className="p-6 flex flex-col justify-between gap-3 min-h-[160px]"
                    style={{
                      background:
                        activeCase.id === 'olivia-gale-identity'
                          ? 'linear-gradient(125deg, #D66370 0%, #C7AF6E 36%, #AEE8A2 70%, #42AEA3 100%)'
                          : activeCase.imageBg || '#F3E8D2',
                    }}
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={withBasePath(activeCase.images[0])}
                        alt={activeCase.imageLabels?.[0] || activeCase.title}
                        className="max-h-36 object-contain"
                      />
                    </div>
                    {activeCase.imageLabels?.[0] && (
                      <p
                        className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${
                          activeCase.id === 'olivia-gale-identity'
                            ? 'text-white/90'
                            : 'text-[#4B5563]'
                        }`}
                      >
                        FIG 01 // {activeCase.imageLabels[0]}
                      </p>
                    )}
                  </div>
                  <div
                    className={`grid grid-cols-1 divide-y sm:divide-y-0 sm:divide-x divide-[#1F2937] ${
                      activeCase.images.length >= 4 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                    }`}
                  >
                    {activeCase.images.slice(1).map((imgSrc, i) => (
                      <div
                        key={imgSrc}
                        className={`p-3 flex flex-col justify-between gap-2 ${
                          i % 2 === 0 ? 'bg-white' : 'bg-[#FAF3E6]'
                        }`}
                      >
                        <div className="flex-1 flex items-center justify-center">
                          <img
                            src={withBasePath(imgSrc)}
                            alt={activeCase.imageLabels?.[i + 1] || activeCase.title}
                            className="max-h-60 w-full object-contain"
                          />
                        </div>
                        {activeCase.imageLabels?.[i + 1] && (
                          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                            FIG 0{i + 2} // {activeCase.imageLabels[i + 1]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeCase.images && activeCase.images.length > 1 ? (
                <div className="grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-[#1F2937]">
                  <div className="sm:col-span-5 bg-[#08090B] p-4 flex flex-col justify-between gap-2">
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={withBasePath(activeCase.images[0])}
                        alt={activeCase.imageLabels?.[0] || activeCase.title}
                        className="max-h-52 w-full object-contain"
                      />
                    </div>
                    {activeCase.imageLabels?.[0] && (
                      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                        FIG 01 // {activeCase.imageLabels[0]}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-7 bg-white p-3 flex flex-col justify-between gap-2">
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={withBasePath(activeCase.images[1])}
                        alt={activeCase.imageLabels?.[1] || activeCase.title}
                        className="max-h-64 w-full object-contain"
                      />
                    </div>
                    {activeCase.imageLabels?.[1] && (
                      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                        FIG 02 // {activeCase.imageLabels[1]}
                      </p>
                    )}
                  </div>
                </div>
              ) : activeCase.images && activeCase.images.length === 1 ? (
                <div
                  className="p-6 flex items-center justify-center min-h-[180px]"
                  style={{
                    background:
                      activeCase.id === 'olivia-gale-identity'
                        ? 'linear-gradient(125deg, #D66370 0%, #C7AF6E 36%, #AEE8A2 70%, #42AEA3 100%)'
                        : activeCase.imageBg || '#F3E8D2',
                  }}
                >
                  <img
                    src={withBasePath(activeCase.images[0])}
                    alt={activeCase.title}
                    className="max-h-44 object-contain"
                  />
                </div>
              ) : (
                <div className="px-4 py-6 flex items-center justify-between gap-4 text-[#4B5563]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-[#1F2937]/30 bg-[#FFFDF9] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4 text-[#0F766E]" />
                    </div>
                    <div>
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1F2937]">
                        {activeCase.isPlaceholder
                          ? 'IN THE WORKS // PLACEHOLDER'
                          : 'PROOF & MOCKUP SLOT'}
                      </p>
                      <p className="font-mono text-[11px] text-[#6B7280]">
                        {activeCase.isPlaceholder
                          ? 'Case study details & logo proofs coming soon.'
                          : 'Ready for renders/stills in public/images/brand/'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest border border-[#1F2937]/30 px-2 py-0.5">
                    {activeCase.status}
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Color Swatch Strip */}
            {activeCase.palette && activeCase.palette.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[#6B7280]">
                  <span>SYSTEM PALETTE (CLICK TO COPY)</span>
                  {copiedHex && (
                    <span className="text-[#0D9488] font-bold">
                      COPIED {copiedHex}
                    </span>
                  )}
                </div>

                <div
                  className={`grid border-t border-l border-[#1F2937] ${
                    activeCase.palette.length > 6
                      ? 'grid-cols-4 sm:grid-cols-8'
                      : 'grid-cols-3 sm:grid-cols-6'
                  }`}
                >
                  {activeCase.palette.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => handleCopyHex(hex)}
                      title={`Copy ${hex}`}
                      className="group flex flex-col items-start p-2 border-r border-b border-[#1F2937] hover:bg-[#FAF3E6] transition-colors cursor-pointer"
                    >
                      <span
                        className="w-full h-8 border border-[#1F2937]/20 mb-1.5"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="font-mono text-[10px] uppercase text-[#1F2937]">
                        {hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Structured Case Breakdown */}
            {activeCase.pillars && activeCase.pillars.length > 0 && (
              <div className="divide-y divide-[#E5DEC9] border-t border-b border-[#1F2937]">
                {activeCase.pillars.map((pillar, idx) => (
                  <div key={pillar.label} className="py-4 space-y-1">
                    <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E64B26]">
                      0{idx + 1} // {pillar.label}
                    </h4>
                    <p className="text-sm text-[#374151] leading-relaxed">
                      {pillar.detail}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Deliverables Footer */}
            {activeCase.deliverables && activeCase.deliverables.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#6B7280]">
                  DELIVERABLES &amp; ARTIFACTS
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCase.deliverables.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 border border-[#1F2937] bg-[#FAF3E6] font-mono text-xs text-[#1F2937]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
