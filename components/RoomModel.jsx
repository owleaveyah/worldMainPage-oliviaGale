'use client';

import React, { useState } from 'react';

export default function RoomModel({ activeView = 'OVERVIEW', isDarkMode, onSelectSection }) {
  const [hoveredStation, setHoveredStation] = useState(null);

  const handleHover = (station, over) => {
    setHoveredStation(over ? station : null);
    document.body.style.cursor = over ? 'pointer' : 'auto';
  };

  const handleSelect = (section) => {
    if (onSelectSection) {
      onSelectSection(section.toUpperCase());
    }
  };

  const isStationActive = (st) => activeView === st || hoveredStation === st;

  return (
    <group>
      {/* Floor Slab (Light warm pine/birch) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[11, 11]} />
        <meshStandardMaterial color={isDarkMode ? '#0e1117' : '#dfdad1'} roughness={0.6} />
      </mesh>

      {/* Back Wall (Gallery off-white) */}
      <mesh position={[0, 2.75, -5.5]} receiveShadow>
        <boxGeometry args={[11, 5.5, 0.2]} />
        <meshStandardMaterial color={isDarkMode ? '#141822' : '#eeeae2'} />
      </mesh>

      {/* Left Wall */}
      <group position={[-5.5, 2.75, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[0.2, 5.5, 11]} />
          <meshStandardMaterial color={isDarkMode ? '#12151e' : '#eae5dc'} />
        </mesh>
        {/* Recessed Window Frame */}
        <mesh position={[0.15, 0.6, -1.0]}>
          <boxGeometry args={[0.08, 2.4, 3.2]} />
          <meshStandardMaterial color={isDarkMode ? '#090d14' : '#ffffff'} />
        </mesh>
      </group>

      {/* Back Wall Framed Art (Warm gallery prints) */}
      <group position={[1.4, 3.2, -5.35]}>
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[1.2, 1.4, 0.05]} />
          <meshStandardMaterial color={isDarkMode ? '#1c222e' : '#d9d2c5'} />
        </mesh>
        <mesh position={[0.7, 0, 0]}>
          <boxGeometry args={[1.2, 1.4, 0.05]} />
          <meshStandardMaterial color={isDarkMode ? '#1c222e' : '#d9d2c5'} />
        </mesh>
      </group>

      {/* ========================================================
          1. TECH STATION: Workstation Desk, Inward-Facing Screens, Chair
          ======================================================== */}
      <group position={[-3.4, 0, -0.4]}>
        {/* Floor Target Glow Ring when Active */}
        {isStationActive('TECH') && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[1.6, 1.75, 32]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
          </mesh>
        )}

        {/* Desk Table */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.08, 3.2]} />
          <meshStandardMaterial
            color={isStationActive('TECH') ? (isDarkMode ? '#2d3748' : '#a89078') : isDarkMode ? '#1a1a1a' : '#8b7355'}
          />
        </mesh>
        {/* Desk Legs */}
        <mesh position={[-0.65, 0.36, -1.4]} castShadow>
          <boxGeometry args={[0.08, 0.72, 0.08]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.65, 0.36, -1.4]} castShadow>
          <boxGeometry args={[0.08, 0.72, 0.08]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[-0.65, 0.36, 1.4]} castShadow>
          <boxGeometry args={[0.08, 0.72, 0.08]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.65, 0.36, 1.4]} castShadow>
          <boxGeometry args={[0.08, 0.72, 0.08]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        {/* Dual Monitors: Angled 30° inward toward the room */}
        <mesh
          position={[0.15, 1.25, 0.2]}
          rotation={[0, Math.PI / 6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect('TECH');
          }}
          onPointerOver={() => handleHover('TECH', true)}
          onPointerOut={() => handleHover('TECH', false)}
        >
          <boxGeometry args={[0.08, 0.75, 2.0]} />
          <meshStandardMaterial
            color={isDarkMode ? '#080c14' : '#1f2937'}
            emissive={isDarkMode ? '#00e5ff' : isStationActive('TECH') ? '#00e5ff' : '#111827'}
            emissiveIntensity={isStationActive('TECH') ? 3.5 : isDarkMode ? 2.8 : 0.15}
          />
        </mesh>

        {/* Ergonomic Office Chair */}
        <group position={[0.8, 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.55, 0.08, 0.55]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.25, 0.8, 0]} castShadow>
            <boxGeometry args={[0.08, 0.65, 0.5]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          2. FINE ART STATION: Studio Easel, Canvas, Stool
          ======================================================== */}
      <group position={[-0.6, 0, -3.8]}>
        {/* Floor Target Glow Ring when Active */}
        {isStationActive('ART') && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.2]}>
            <ringGeometry args={[1.3, 1.45, 32]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
          </mesh>
        )}

        {/* Canvas (Clickable) */}
        <mesh
          position={[0, 1.65, 0.1]}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect('ART');
          }}
          onPointerOver={() => handleHover('ART', true)}
          onPointerOut={() => handleHover('ART', false)}
          castShadow
        >
          <boxGeometry args={[1.5, 1.9, 0.08]} />
          <meshStandardMaterial
            color={isStationActive('ART') ? '#dc2626' : '#b91c1c'}
            roughness={0.4}
            emissive={isStationActive('ART') ? '#ef4444' : '#000000'}
            emissiveIntensity={isStationActive('ART') ? 0.4 : 0}
          />
        </mesh>
        {/* Easel Tripod */}
        <mesh position={[0, 1.1, -0.05]} castShadow>
          <boxGeometry args={[1.6, 2.2, 0.25]} />
          <meshStandardMaterial color={isDarkMode ? '#1f1813' : '#634735'} />
        </mesh>
        {/* Painter's Stool */}
        <mesh position={[0.1, 0.3, 0.9]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.6, 16]} />
          <meshStandardMaterial color={isDarkMode ? '#222' : '#3e3228'} />
        </mesh>
      </group>

      {/* ========================================================
          3. STRATEGY / BRAND STATION: Daybed, Table, Lamp
          ======================================================== */}
      <group position={[2.9, 0, -1.8]}>
        {/* Floor Target Glow Ring when Active */}
        {isStationActive('BRAND') && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[1.9, 2.05, 32]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
          </mesh>
        )}

        {/* Daybed Mattress */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.65, 4.2]} />
          <meshStandardMaterial color={isDarkMode ? '#191d26' : '#f1f0eb'} />
        </mesh>
        {/* Brand Proofs & Zines on Bed (Clickable) */}
        <mesh
          position={[0, 0.8, 0.3]}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect('BRAND');
          }}
          onPointerOver={() => handleHover('BRAND', true)}
          onPointerOut={() => handleHover('BRAND', false)}
        >
          <boxGeometry args={[1.8, 0.04, 2.2]} />
          <meshStandardMaterial
            color={isStationActive('BRAND') ? '#9333ea' : '#7c3aed'}
            emissive={isStationActive('BRAND') ? '#a855f7' : '#000000'}
            emissiveIntensity={isStationActive('BRAND') ? 0.5 : 0}
          />
        </mesh>
        {/* Nightstand & Lamp */}
        <group position={[0.2, 0, -2.6]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.0, 0.8, 0.9]} />
            <meshStandardMaterial color={isDarkMode ? '#222' : '#785f4b'} />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.35, 16]} />
            <meshStandardMaterial
              color={isDarkMode ? '#fff' : '#eee'}
              emissive={isDarkMode || isStationActive('BRAND') ? '#ffaa55' : '#000'}
              emissiveIntensity={isStationActive('BRAND') ? 3.5 : isDarkMode ? 3.0 : 0}
            />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          4. CULTURE LOUNGE: Soft Woven Rug & Slim Low Coffee Table
          ======================================================== */}
      <group position={[0, 0, 1.2]}>
        {/* Floor Target Glow Ring when Active */}
        {isStationActive('LOUNGE') && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[1.4, 1.55, 32]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
          </mesh>
        )}

        {/* Round Rug (Warm neutral tone) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <circleGeometry args={[2.0, 32]} />
          <meshStandardMaterial
            color={isStationActive('LOUNGE') ? (isDarkMode ? '#263339' : '#b8c9c0') : isDarkMode ? '#1a202c' : '#d4ccc0'}
            roughness={0.8}
          />
        </mesh>
        {/* Slim Low Coffee Table (Birch/Natural tone) */}
        <mesh
          position={[0, 0.22, 0]}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect('LOUNGE');
          }}
          onPointerOver={() => handleHover('LOUNGE', true)}
          onPointerOut={() => handleHover('LOUNGE', false)}
          castShadow
        >
          <cylinderGeometry args={[1.0, 1.0, 0.16, 32]} />
          <meshStandardMaterial
            color={isStationActive('LOUNGE') ? '#e2e8f0' : isDarkMode ? '#2d3748' : '#f8fafc'}
            roughness={0.3}
            emissive={isStationActive('LOUNGE') ? '#10b981' : '#000000'}
            emissiveIntensity={isStationActive('LOUNGE') ? 0.3 : 0}
          />
        </mesh>
      </group>
    </group>
  );
}
