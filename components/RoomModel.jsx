'use client';

import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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
  onSelectSection,
  onLightsLoaded,
}) {
  const { scene, nodes } = useGLTF('/models/room.glb');

  // Configure shadows & extract LightPos_* Empty coordinates on load
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const lowerName = child.name.trim().toLowerCase();

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
    const section = resolveSection(e.object);
    if (section) {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
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

useGLTF.preload('/models/room.glb');
