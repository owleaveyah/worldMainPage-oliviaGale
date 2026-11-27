'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
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
        </Suspense>
      </Canvas>
    </div>
  );
}
