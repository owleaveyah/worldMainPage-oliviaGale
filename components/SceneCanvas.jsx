'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneLighting from './SceneLighting';
import CameraRig from './CameraRig';
import RoomModel from './RoomModel';

export default function SceneCanvas({ activeView, setActiveView, isDarkMode }) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        orthographic
        shadows
        camera={{
          zoom: 84, // Calibrated so upper walls and floor corners fit neatly without top cropping
          position: [7.8, 6.2, 8.8], // Adjusted z-depth and elevation
          near: -50,
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
          <SceneLighting isDarkMode={isDarkMode} />
          <CameraRig activeView={activeView} />
          <RoomModel
            activeView={activeView}
            isDarkMode={isDarkMode}
            onSelectSection={setActiveView}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
