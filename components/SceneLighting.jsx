'use client';

import React, { useMemo } from 'react';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import WindowGodrays from './WindowGodrays';

function EaselSpotlight({ isDarkMode }) {
  const target = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(-3.14, 2.38, -1.53);
    return obj;
  }, []);

  if (!isDarkMode) return null;

  return (
    <>
      <primitive object={target} />
      <spotLight
        position={[-1.4, 3.85, -0.35]}
        target={target}
        angle={0.55}
        penumbra={0.65}
        intensity={24}
        distance={7.5}
        decay={1.4}
        color="#ffd9ad"
      />
    </>
  );
}

function WindowPortalLight({ isDarkMode }) {
  const target = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(1.2, 1.35, 0.2);
    return obj;
  }, []);

  if (isDarkMode) return null;

  return (
    <>
      <primitive object={target} />
      <spotLight
        position={[-6.0, 3.45, 0.25]}
        target={target}
        angle={1.12}
        penumbra={0.9}
        intensity={90}
        distance={18}
        decay={1.35}
        color="#ffe1bd"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.03}
        shadow-radius={4}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
      />
    </>
  );
}

export default function SceneLighting({ isDarkMode, lightPositions }) {
  return (
    <>
      {/* Dim Baseline Shadow Fill so Interior Illumination Comes From the Window */}
      <ambientLight
        intensity={isDarkMode ? 0.34 : 0.1}
        color={isDarkMode ? '#182442' : '#d8e4f7'}
      />
      <hemisphereLight
        args={isDarkMode ? ['#1d2948', '#1b1410', 0.42] : ['#d8e6ff', '#8f6b4e', 0.22]}
      />

      {/* Procedural Local IBL Environment Weighted Toward the -X Window Portal */}
      <Environment
        resolution={256}
        frames={1}
        environmentIntensity={isDarkMode ? 0.16 : 0.24}
      >
        {/* Soft morning sky overhead */}
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#edf3ff"
          position={[0, 8, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[14, 14, 1]}
        />
        {/* Warm sunrise portal reflection on -X window wall */}
        <Lightformer
          form="rect"
          intensity={4.6}
          color="#ffc887"
          position={[-8, 3, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 6, 1]}
        />
        {/* Minimal interior wall bounce from +X / +Z */}
        <Lightformer
          form="rect"
          intensity={0.4}
          color="#f2d9ba"
          position={[8, 3, 6]}
          rotation={[0, -Math.PI * 0.75, 0]}
          scale={[10, 6, 1]}
        />
      </Environment>

      {/* Low-Angled Golden Sunrise Window Sun (Active in Daylight Mode ONLY) */}
      <directionalLight
        position={[-9.5, 4.4, -2.6]}
        intensity={isDarkMode ? 0 : 5.4}
        color="#ffb76e"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
      />

      {/* Shadow-Casting Window Sky & Sun-Bounce Portal Light */}
      <WindowPortalLight isDarkMode={isDarkMode} />

      {/* Warm Sill & Floor Bounce Just Inside the Window Bays */}
      {!isDarkMode && (
        <pointLight
          position={[-3.6, 2.75, 0.25]}
          color="#ffdcb5"
          intensity={14}
          distance={12}
          decay={1.5}
        />
      )}

      {/* Feathered Afternoon Sunbeams Through Window */}
      <WindowGodrays isDarkMode={isDarkMode} />

      {/* Nightstand Lamp (Active in Night Mode ONLY) */}
      {isDarkMode && lightPositions?.nightstand && (
        <pointLight
          position={lightPositions.nightstand}
          color="#ff9f4a"
          intensity={48}
          distance={18}
          decay={1.35}
        />
      )}

      {/* Far-Left Art Corner Ceiling Light (Active in Night Mode ONLY) */}
      {isDarkMode && lightPositions?.artCeiling && (
        <pointLight
          position={lightPositions.artCeiling}
          color="#ffb26b"
          intensity={36}
          distance={16}
          decay={1.45}
        />
      )}

      {/* Gallery Spotlight Aimed at the Easel Canvas Face (Active in Night Mode ONLY) */}
      <EaselSpotlight isDarkMode={isDarkMode} />

      {/* Dual-Monitor Desk Spill Light (Active in Night Mode ONLY) */}
      {isDarkMode && (
        <pointLight
          position={[-2.75, 2.45, 3.25]}
          color="#7ee8d8"
          intensity={9}
          distance={5.0}
          decay={1.6}
        />
      )}

      {/* Lounge iPad Turquoise Screen Spill onto Coffee Table (Night Mode ONLY) */}
      {isDarkMode && (
        <pointLight
          position={[1.75, 1.15, 1.85]}
          color="#5eead4"
          intensity={1.6}
          distance={1.8}
          decay={2}
        />
      )}
    </>
  );
}
