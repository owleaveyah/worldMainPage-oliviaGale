'use client';

import { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { withBasePath } from '@/lib/assetPath';

const ROOM_MODEL_URL = withBasePath('/models/room.glb');

const STATION_HOTSPOTS = {
  ART: {
    objectNames: ['Art_Canvas_WIP'],
    highlightColor: new THREE.Color('#fff4db'),
    highlightIntensity: 0.14,
  },
  TECH: {
    objectNames: ['Tech_Monitor_Left_Screen', 'Tech_Monitor_Right_Screen'],
    highlightColor: new THREE.Color('#d8fff1'),
    highlightIntensity: 0.18,
  },
};

function findAncestorMatch(object, targetNames) {
  let curr = object;
  while (curr) {
    const trimmedName = curr.name ? curr.name.trim() : '';
    if (targetNames.includes(trimmedName)) return trimmedName;
    curr = curr.parent;
  }
  return null;
}

// Map trimmed GLB mesh/group names to canonical portfolio station IDs
const INTERACTIVE_TARGETS = {
  // TECH
  Tech_Monitor_Left_Screen: 'TECH',
  Tech_Monitor_Left_Bezel: 'TECH',
  Tech_Monitor_Right_Screen: 'TECH',
  Tech_Monitor_Right_Bezel: 'TECH',
  Tech_Desk_Frame: 'TECH',
  Tech_Chair_Ergonomic: 'TECH',
  Tech_Keyboard_Mech: 'TECH',
  Tech_Mouse_Pad: 'TECH',
  Tech_Mouse_Pad_Set: 'TECH',
  Tech_PC_Tower_RTX3060: 'TECH',
  Tech_PC_Tower_Motherboard: 'TECH',
  Tech_PC_Tower_Glass: 'TECH',
  Tech_PS5_Controller: 'TECH',
  Tech_B5_Folio_Open: 'TECH',
  Tech_Glass_IcedMatcha: 'TECH',

  // ART
  Art_Canvas_WIP: 'ART',
  Art_Easel_AFrame: 'ART',
  Art_RollingCart_3Tier: 'ART',
  Art_Wooden_Stool: 'ART',
  Art_Palette_Messy: 'ART',
  Art_Mesh_Panel: 'ART',
  'Art_Wooden_Bookshelf.001': 'ART',

  // BRAND
  Brand_Corkboard_Wall: 'BRAND',
  Brand_Bed_Frame_Wood: 'BRAND',
  Brand_Mattress_Duvet: 'BRAND',
  Brand_Paper_Bed1: 'BRAND',
  Brand_Paper_Bed2: 'BRAND',
  Brand_Paper_Bed3: 'BRAND',
  Brand_Pillows_Plush: 'BRAND',
  Brand_SmallShelf_3Tier: 'BRAND',
  Brand_Lamp_Bedside: 'BRAND',

  // LOUNGE
  Lounge_Table_Low: 'LOUNGE',
  Lounge_iPad_Screen: 'LOUNGE',
  Lounge_Ipad: 'LOUNGE',
  'Lounge_Ipad.001': 'LOUNGE',
  Lounge_Rug_Woven: 'LOUNGE',
  Lounge_ScifiBook_1: 'LOUNGE',
  Lounge_ScifiBook_2: 'LOUNGE',
  Lounge_StickyNote: 'LOUNGE',
  Lounge_Zine1: 'LOUNGE',
  'Lounge_Zine1.001': 'LOUNGE',
  Lounge_Zine2: 'LOUNGE',
};

export default function RoomModel({
  activeView = 'OVERVIEW',
  settledSection = null,
  onSelectSection,
  onOpenStationPortfolio,
  onHoverHotspot,
  onLightsLoaded,
}) {
  const { scene, nodes } = useGLTF(ROOM_MODEL_URL);
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const hotspotMaterialsRef = useRef([]);

  const activeHotspotStation =
    activeView && activeView === settledSection && STATION_HOTSPOTS[activeView]
      ? activeView
      : null;

  // Configure shadows, cache interactive hotspot materials, & extract LightPos_* Empty coordinates on load
  useEffect(() => {
    const hotspotMaterials = [];

    scene.traverse((child) => {
      if (!child.isMesh) return;
      const lowerName = child.name.trim().toLowerCase();

      for (const [stationId, hotspot] of Object.entries(STATION_HOTSPOTS)) {
        const targetName = findAncestorMatch(child, hotspot.objectNames);
        if (targetName && child.material && 'emissive' in child.material) {
          child.material = child.material.clone();
          hotspotMaterials.push({
            stationId,
            targetName,
            material: child.material,
            baseEmissive: child.material.emissive.clone(),
            baseIntensity: child.material.emissiveIntensity ?? 1,
            highlightColor: hotspot.highlightColor,
            highlightIntensity: hotspot.highlightIntensity,
          });
          break;
        }
      }

      // Prevent window glass and exterior backdrop from blocking directional sunlight
      if (lowerName.includes('glass')) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material && !child.material.map) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.opacity = 0.2;
          child.material.roughness = 0.1;
          child.material.depthWrite = false;
        }
      } else if (lowerName.includes('backdrop')) {
        child.castShadow = false;
        child.receiveShadow = false;
      } else {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    hotspotMaterialsRef.current = hotspotMaterials;

    const nightstandEmpty =
      nodes.LightPos_Nightstand || scene.getObjectByName('LightPos_Nightstand');
    const artCeilingEmpty =
      nodes.LightPos_ArtCeiling || scene.getObjectByName('LightPos_ArtCeiling');

    const positions = { nightstand: null, artCeiling: null };

    if (nightstandEmpty) {
      const pos = new THREE.Vector3();
      nightstandEmpty.updateWorldMatrix(true, false);
      nightstandEmpty.getWorldPosition(pos);
      positions.nightstand = [pos.x, pos.y, pos.z];
    }

    if (artCeilingEmpty) {
      const pos = new THREE.Vector3();
      artCeilingEmpty.updateWorldMatrix(true, false);
      artCeilingEmpty.getWorldPosition(pos);
      positions.artCeiling = [pos.x, pos.y, pos.z];
    }

    if (onLightsLoaded) {
      onLightsLoaded(positions);
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [scene, nodes, onLightsLoaded]);

  // Clear hover state whenever the camera leaves a zoomed-in hotspot station
  useEffect(() => {
    if (!activeHotspotStation) {
      setHoveredTarget(null);
      onHoverHotspot?.(null);
      document.body.style.cursor = 'auto';
    }
  }, [activeHotspotStation, onHoverHotspot]);

  // Subtle emissive highlight on interactive station meshes when hovered while zoomed in
  useEffect(() => {
    for (const entry of hotspotMaterialsRef.current) {
      const isHovered =
        activeHotspotStation === entry.stationId &&
        hoveredTarget?.stationId === entry.stationId &&
        hoveredTarget?.targetName === entry.targetName;

      if (isHovered) {
        entry.material.emissive.copy(entry.highlightColor);
        entry.material.emissiveIntensity = entry.highlightIntensity;
      } else {
        entry.material.emissive.copy(entry.baseEmissive);
        entry.material.emissiveIntensity = entry.baseIntensity;
      }
    }
  }, [activeHotspotStation, hoveredTarget]);

  const resolveSection = (object) => {
    let curr = object;
    while (curr) {
      const trimmedName = curr.name ? curr.name.trim() : '';
      if (INTERACTIVE_TARGETS[trimmedName]) {
        return INTERACTIVE_TARGETS[trimmedName];
      }
      curr = curr.parent;
    }
    return null;
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    const section = resolveSection(e.object);

    if (activeHotspotStation) {
      const targetName = findAncestorMatch(
        e.object,
        STATION_HOTSPOTS[activeHotspotStation].objectNames
      );
      if (targetName) {
        document.body.style.cursor = 'pointer';
        setHoveredTarget({ stationId: activeHotspotStation, targetName });
        onHoverHotspot?.(activeHotspotStation);
      } else {
        setHoveredTarget(null);
        onHoverHotspot?.(null);
        document.body.style.cursor =
          section && section !== activeHotspotStation ? 'pointer' : 'auto';
      }
      return;
    }

    setHoveredTarget(null);
    onHoverHotspot?.(null);
    if (section) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHoveredTarget(null);
    onHoverHotspot?.(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    // Ignore drag-releases from OrbitControls so orbiting doesn't trigger accidental clicks
    if (e.delta > 5) return;

    if (activeHotspotStation) {
      const targetName = findAncestorMatch(
        e.object,
        STATION_HOTSPOTS[activeHotspotStation].objectNames
      );
      if (targetName) {
        e.stopPropagation();
        onOpenStationPortfolio?.(activeHotspotStation);
        return;
      }
    }

    const section = resolveSection(e.object);
    if (section && onSelectSection) {
      e.stopPropagation();
      onSelectSection(section);
    }
  };

  return (
    <primitive
      object={scene}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

useGLTF.preload(ROOM_MODEL_URL);
