'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import * as THREE from 'three';
import clsx from 'clsx';
import { withBasePath } from '@/lib/assetPath';
import SceneLighting from './SceneLighting';
import CameraRig from './CameraRig';
import RoomModel from './RoomModel';

const disableRaycast = () => null;

function DaytimeSkyDome() {
  const skyMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTopColor: { value: new THREE.Color('#faf6ed') },
          uMidColor: { value: new THREE.Color('#f4ead6') },
          uBottomColor: { value: new THREE.Color('#e8d7bc') },
        },
        vertexShader: `
          varying vec3 vWorldPos;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform vec3 uTopColor;
          uniform vec3 uMidColor;
          uniform vec3 uBottomColor;
          varying vec3 vWorldPos;
          void main() {
            float h = clamp((normalize(vWorldPos).y + 0.35) / 1.15, 0.0, 1.0);
            vec3 col = mix(uBottomColor, uMidColor, smoothstep(0.0, 0.45, h));
            col = mix(col, uTopColor, smoothstep(0.45, 1.0, h));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    []
  );

  useEffect(() => {
    return () => {
      skyMaterial.dispose();
    };
  }, [skyMaterial]);

  return (
    <mesh material={skyMaterial} scale={60} raycast={disableRaycast}>
      <sphereGeometry args={[1, 24, 16]} />
    </mesh>
  );
}

function ExposureController({ isDarkMode }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.toneMappingExposure = isDarkMode ? 1.0 : 1.02;
  }, [gl, isDarkMode]);
  return null;
}

// Signals once the Suspense-wrapped 3D scene has mounted and rendered its first frames
function SceneReadySignal({ onReady }) {
  const framesRef = useRef(0);
  const doneRef = useRef(false);

  useFrame(() => {
    if (doneRef.current) return;
    framesRef.current += 1;
    if (framesRef.current >= 2) {
      doneRef.current = true;
      onReady?.();
    }
  });

  return null;
}

function SceneLoadingOverlay({ isDarkMode, sceneReady }) {
  const { active, progress, loaded, total } = useProgress();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!sceneReady) return;
    const timer = setTimeout(() => setDismissed(true), 700);
    return () => clearTimeout(timer);
  }, [sceneReady]);

  if (dismissed) return null;

  const pct = sceneReady ? 100 : Math.min(99, Math.max(progress > 0 ? Math.round(progress) : 8, 8));
  const statusLabel = sceneReady
    ? 'Studio ready'
    : !active || pct >= 95
    ? 'Preparing lighting & materials…'
    : total > 0
    ? `Loading 3D studio (${loaded}/${total} assets)…`
    : 'Loading 3D studio…';

  return (
    <div
      aria-live="polite"
      className={clsx(
        'fixed inset-0 z-30 flex flex-col items-center justify-center px-6 transition-opacity duration-700',
        sceneReady ? 'opacity-0 pointer-events-none' : 'opacity-100',
        isDarkMode ? 'bg-[#0f1115]/95 text-neutral-100' : 'bg-[#f4ead6]/95 text-neutral-900'
      )}
    >
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center text-center">
        <div className="relative mb-5 flex items-center justify-center">
          <div
            className={clsx(
              'w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 animate-spin',
              isDarkMode
                ? 'border-neutral-800 border-t-emerald-400'
                : 'border-neutral-300 border-t-emerald-600'
            )}
          />
          <img
            src={withBasePath('/images/og-logo.png')}
            alt=""
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain absolute"
          />
        </div>

        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-emerald-500 font-semibold mb-1">
          From the Mind of Olivia Gale
        </p>
        <p className="font-display text-sm sm:text-base font-semibold tracking-wide">
          {statusLabel}
        </p>

        {/* Progress Bar */}
        <div
          className={clsx(
            'mt-3.5 w-full h-1.5 rounded-full overflow-hidden',
            isDarkMode ? 'bg-neutral-800' : 'bg-neutral-300/80'
          )}
        >
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-300 ease-out',
              isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-2 w-full flex items-center justify-between font-mono text-[11px] opacity-70">
          <span>Interactive 3D Brainchild</span>
          <span>{pct}%</span>
        </div>

        <p
          className={clsx(
            'mt-5 text-[11px] sm:text-xs font-mono tracking-wide',
            isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
          )}
        >
          Drag to orbit • Pinch or scroll to zoom • Tap a station
        </p>
      </div>
    </div>
  );
}

export default function SceneCanvas({
  activeView,
  setActiveView,
  isDarkMode,
  settledSection,
  onArriveSection,
  onOpenStationPortfolio,
  onHoverHotspot,
}) {
  const [lightPositions, setLightPositions] = useState({
    nightstand: null,
    artCeiling: null,
  });
  const [sceneReady, setSceneReady] = useState(false);
  const handleSceneReady = useCallback(() => setSceneReady(true), []);

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
        <color attach="background" args={[isDarkMode ? '#0f1115' : '#f4ead6']} />
        <ExposureController isDarkMode={isDarkMode} />
        {!isDarkMode && <DaytimeSkyDome />}
        <Suspense fallback={null}>
          <SceneLighting
            isDarkMode={isDarkMode}
            lightPositions={lightPositions}
          />
          <CameraRig
            activeView={activeView}
            onArriveSection={onArriveSection}
          />
          <RoomModel
            activeView={activeView}
            settledSection={settledSection}
            isDarkMode={isDarkMode}
            onSelectSection={setActiveView}
            onOpenStationPortfolio={onOpenStationPortfolio}
            onHoverHotspot={onHoverHotspot}
            onLightsLoaded={setLightPositions}
          />
          <SceneReadySignal onReady={handleSceneReady} />
        </Suspense>
      </Canvas>
      <SceneLoadingOverlay isDarkMode={isDarkMode} sceneReady={sceneReady} />
    </div>
  );
}
