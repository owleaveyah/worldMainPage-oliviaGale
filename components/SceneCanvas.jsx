'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneLighting from './SceneLighting';
import CameraRig from './CameraRig';
import RoomModel from './RoomModel';

export default function SceneCanvas({ activeView, setActiveView, isDarkMode }) {
  const [lightPositions, setLightPositions] = useState({
    nightstand: null,
    artCeiling: null,
  });

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{
          fov: 42, // Overridden dynamically by exported 27mm Blender cameras when present
          position: [8.2, 6.4, 8.8],
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
      >
        <color attach="background" args={[isDarkMode ? '#0f1115' : '#f5f3ef']} />
        <Suspense fallback={null}>
          <SceneLighting
            isDarkMode={isDarkMode}
            lightPositions={lightPositions}
          />
          <CameraRig activeView={activeView} />
          <RoomModel
            isDarkMode={isDarkMode}
            onSelectSection={setActiveView}
            onLightsLoaded={setLightPositions}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
