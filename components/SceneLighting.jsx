'use client';

import React from 'react';

export default function SceneLighting({ isDarkMode, lightPositions }) {
  return (
    <>
      {/* Base Ambient Fill */}
      <ambientLight
        intensity={isDarkMode ? 0.18 : 0.55}
        color={isDarkMode ? '#0b132b' : '#fffcf5'}
      />

      {/* Daylight Window Sun (Active in Daylight Mode ONLY) */}
      <directionalLight
        position={[-8, 10, -4]}
        intensity={isDarkMode ? 0 : 2.3}
        color="#fff4e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
      />

      {/* Nightstand Lamp (Active in Night Mode ONLY) */}
      {isDarkMode && lightPositions?.nightstand && (
        <pointLight
          position={lightPositions.nightstand}
          color="#ff9e44"
          intensity={18}
          distance={7.5}
          decay={2}
        />
      )}

      {/* Far-Left Art Corner Ceiling Light (Active in Night Mode ONLY) */}
      {isDarkMode && lightPositions?.artCeiling && (
        <pointLight
          position={lightPositions.artCeiling}
          color="#ffaa5e"
          intensity={24}
          distance={9.0}
          decay={2}
        />
      )}
    </>
  );
}
