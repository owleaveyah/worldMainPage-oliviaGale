'use client';

import React from 'react';

export default function SceneLighting({ isDarkMode }) {
  return (
    <>
      {/* Daylight State: Window Sunlight */}
      <directionalLight
        position={[-9, 11, -3]}
        intensity={isDarkMode ? 0.0 : 2.5}
        color="#fffbf2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <ambientLight
        intensity={isDarkMode ? 0.05 : 0.45}
        color={isDarkMode ? '#0a0e17' : '#faf6f0'}
      />

      {/* Dark Mode State: Screen Glow & Interior Lamps */}
      {isDarkMode && (
        <>
          {/* Dual Monitors Glow */}
          <pointLight
            position={[-3.1, 1.6, -0.3]}
            intensity={3.2}
            distance={5.0}
            color="#00e5ff"
          />
          {/* Desk Lamp */}
          <pointLight
            position={[-3.3, 2.0, 0.5]}
            intensity={1.8}
            distance={3.5}
            color="#ffb366"
          />
          {/* Bedside Lamp */}
          <pointLight
            position={[3.2, 1.5, -3.2]}
            intensity={2.2}
            distance={4.0}
            color="#ff9944"
          />
        </>
      )}
    </>
  );
}
