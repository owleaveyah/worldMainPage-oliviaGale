'use client';

import PortfolioModal from './PortfolioModal';

export default function ArtPortfolioModal({ isOpen, onClose, isDarkMode }) {
  return (
    <PortfolioModal
      stationId={isOpen ? 'ART' : null}
      onClose={onClose}
      isDarkMode={isDarkMode}
    />
  );
}
