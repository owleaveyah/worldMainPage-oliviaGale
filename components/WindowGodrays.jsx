'use client';

import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Generates a soft vertical + horizontal radial-feathered alpha texture
 * so additive sunbeam planes have no hard rectangular edges.
 */
function createSunbeamAlphaTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 256, 512);

  // Horizontal softness across beam width
  const horiz = ctx.createLinearGradient(0, 0, 256, 0);
  horiz.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  horiz.addColorStop(0.22, 'rgba(255, 255, 255, 0.75)');
  horiz.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  horiz.addColorStop(0.78, 'rgba(255, 255, 255, 0.75)');
  horiz.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = horiz;
  ctx.fillRect(0, 0, 256, 512);

  // Multiply vertical falloff: soft entry at window top, gradual fade into room
  ctx.globalCompositeOperation = 'destination-in';
  const vert = ctx.createLinearGradient(0, 0, 0, 512);
  vert.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
  vert.addColorStop(0.12, 'rgba(255, 255, 255, 0.95)');
  vert.addColorStop(0.55, 'rgba(255, 255, 255, 0.5)');
  vert.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = vert;
  ctx.fillRect(0, 0, 256, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Sun direction aligned with low sunrise directionalLight at [-9.5, 4.4, -2.6] -> [0, 0, 0]
const BEAM_DIR = new THREE.Vector3(9.5, -4.4, 2.6).normalize();
const UP_AXIS = new THREE.Vector3(0, -1, 0);

const WINDOW_BAYS = [
  // Back window bay (z: -2.0 to 0.1)
  { id: 'bay-back-a', origin: [-4.45, 2.86, -0.95], width: 2.0, length: 6.2, yawOffset: 0.08, opacity: 0.14 },
  { id: 'bay-back-b', origin: [-4.45, 2.86, -0.95], width: 1.8, length: 5.8, yawOffset: 0.78, opacity: 0.085 },
  // Front window bay (z: 0.5 to 2.6)
  { id: 'bay-front-a', origin: [-4.45, 2.86, 1.55], width: 2.0, length: 6.2, yawOffset: 0.08, opacity: 0.14 },
  { id: 'bay-front-b', origin: [-4.45, 2.86, 1.55], width: 1.8, length: 5.8, yawOffset: 0.78, opacity: 0.085 },
];

const disableRaycast = () => null;

export default function WindowGodrays({ isDarkMode }) {
  const alphaMap = useMemo(() => createSunbeamAlphaTexture(), []);

  useEffect(() => {
    return () => {
      alphaMap?.dispose();
    };
  }, [alphaMap]);

  const beams = useMemo(() => {
    const alignQuat = new THREE.Quaternion().setFromUnitVectors(UP_AXIS, BEAM_DIR);
    return WINDOW_BAYS.map((bay) => {
      const center = new THREE.Vector3(...bay.origin).addScaledVector(
        BEAM_DIR,
        bay.length * 0.5
      );
      const twistQuat = new THREE.Quaternion().setFromAxisAngle(BEAM_DIR, bay.yawOffset);
      const finalQuat = twistQuat.multiply(alignQuat.clone());
      return {
        ...bay,
        position: [center.x, center.y, center.z],
        quaternion: finalQuat,
      };
    });
  }, []);

  if (isDarkMode || !alphaMap) return null;

  return (
    <group name="Afternoon_Window_Godrays">
      {beams.map((beam) => (
        <mesh
          key={beam.id}
          position={beam.position}
          quaternion={beam.quaternion}
          raycast={disableRaycast}
          renderOrder={4}
        >
          <planeGeometry args={[beam.width, beam.length]} />
          <meshBasicMaterial
            color="#ffab54"
            alphaMap={alphaMap}
            transparent
            opacity={beam.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
