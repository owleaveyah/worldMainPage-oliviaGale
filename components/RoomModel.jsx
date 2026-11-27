'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { withBasePath } from '@/lib/assetPath';
import MonitorScreens from './MonitorScreens';

const ROOM_MODEL_URL = withBasePath('/models/room.glb');
const PALETTE_TEXTURE_URL = withBasePath('/textures/art-palette.jpg');

const STATION_HOTSPOTS = {
  ART: {
    objectNames: ['Art_Canvas_WIP'],
    highlightColor: new THREE.Color('#fff4db'),
    highlightIntensity: 0.16,
  },
  TECH: {
    objectNames: ['Tech_Monitor_Left_Screen', 'Tech_Monitor_Right_Screen'],
    highlightColor: new THREE.Color('#d8fff1'),
    highlightIntensity: 0.25,
  },
  BRAND: {
    objectNames: [
      'Brand_Corkboard_Wall',
      'Brand_Paper_Bed1',
      'Brand_Paper_Bed2',
      'Brand_Paper_Bed2.001',
      'Brand_Paper_Bed3',
      'Brand_brand',
      'Brand_Pantone',
      'Brand_Mantra',
      'Brand_Cuadro',
      'Brand_textCard',
      'Brand_textCard.001',
      'Brand_textCard.002',
      'Brand_textCard.003',
    ],
    highlightColor: new THREE.Color('#ffeadb'),
    highlightIntensity: 0.16,
  },
  LOUNGE: {
    objectNames: ['Lounge_iPad_Screen', 'Lounge_Ipad', 'Lounge_Ipad.001', 'Lounge_Table_Low'],
    highlightColor: new THREE.Color('#d6fff9'),
    highlightIntensity: 0.22,
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
  'Tech_Monitor_Left_Bezel.001': 'TECH',
  Tech_Monitor_Right_Screen: 'TECH',
  Tech_Monitor_Right_Bezel: 'TECH',
  'Tech_Monitor_Right_Bezel.001': 'TECH',
  Tech_Monitor_Bracket: 'TECH',
  Tech_Monitor_Arms_Left: 'TECH',
  'Tech_Monitor_Bracket.001': 'TECH',
  Tech_Monitor_Arms_Right: 'TECH',
  Tech_Desk_Frame: 'TECH',
  'Tech_Desk_Frame.001': 'TECH',
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
  'Tech_Glass_IcedMatcha.001': 'TECH',

  // ART
  Art_Canvas_WIP: 'ART',
  Art_Easel_AFrame: 'ART',
  Art_RollingCart_3Tier: 'ART',
  'Art_RollingCart_3Tier.001': 'ART',
  'Art_RollingCart_3Tier.002': 'ART',
  'Art_RollingCart_3Tier.003': 'ART',
  'Art_RollingCart_3Tier.004': 'ART',
  'Art_RollingCart_3Tier.005': 'ART',
  'Art_RollingCart_3Tier.006': 'ART',
  'Art_RollingCart_3Tier.007': 'ART',
  'Art_RollingCart_3Tier.008': 'ART',
  'Art_RollingCart_3Tier.009': 'ART',
  'Art_RollingCart_3Tier.010': 'ART',
  Art_Wooden_Stool: 'ART',
  Art_Palette_Messy: 'ART',
  Art_Mesh_Panel: 'ART',
  Art_Mesh_Impasto: 'ART',
  Art_Mesh_Work: 'ART',
  Art_CeilingLamp: 'ART',
  'Art_Wooden_Bookshelf.001': 'ART',
  'Art_Wooden_Bookshelf.002': 'ART',
  'Art_Wooden_Bookshelf.003': 'ART',
  'Art_Wooden_Bookshelf.004': 'ART',

  // BRAND
  Brand_Corkboard_Wall: 'BRAND',
  Brand_Bed_Frame_Wood: 'BRAND',
  Brand_Mattress_Duvet: 'BRAND',
  Brand_Paper_Bed1: 'BRAND',
  Brand_Paper_Bed2: 'BRAND',
  'Brand_Paper_Bed2.001': 'BRAND',
  Brand_Paper_Bed3: 'BRAND',
  Brand_Pillows_Plush: 'BRAND',
  Brand_SmallShelf_3Tier: 'BRAND',
  Brand_Lamp_Bedside: 'BRAND',
  Brand_brand: 'BRAND',
  Brand_Cuadro: 'BRAND',
  Brand_Mantra: 'BRAND',
  Brand_Pantone: 'BRAND',
  Brand_textCard: 'BRAND',
  'Brand_textCard.001': 'BRAND',
  'Brand_textCard.002': 'BRAND',
  'Brand_textCard.003': 'BRAND',

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

// Material overrides for untextured Blender procedural shaders, broken shared AO/dust maps,
// and greyscale bump maps mistakenly exported into glTF normalTexture slots
const PROCEDURAL_MATERIAL_OVERRIDES = {
  'White Painted Wood': {
    color: '#f4f0e8',
    clearMap: true,
    clearNormalMap: true,
    roughness: 0.42,
    metalness: 0,
  },
  'White Metallic Pearl Car Paint': {
    color: '#e8ecf2',
    clearMap: true,
    roughness: 0.26,
    metalness: 0.25,
    clearcoat: 1,
  },
  'Off White Plastic Glossy': {
    color: '#f3efe8',
    clearMap: true,
    roughness: 0.24,
    metalness: 0,
  },
  'Edge Wear Plastic (Worn Green Plastic)': {
    color: '#487a5f',
    clearMap: true,
    roughness: 0.36,
    metalness: 0,
  },
  'Emerald Jade': {
    color: '#1b8a68',
    clearMap: true,
    roughness: 0.16,
    metalness: 0.05,
    clearcoat: 0.75,
  },
  // Used solely by Tech_B5_Folio_Open's outer cover (was Calfskin Leather Pine Green in backup GLB)
  'Paper.1002': {
    color: '#1f4837',
    clearMap: true,
    roughness: 0.58,
    metalness: 0,
  },
  'Electronic matte plastic': {
    color: '#252930',
    roughness: 0.65,
    metalness: 0.05,
  },
  'Stainless Steel': {
    color: '#cfd5dc',
    clearMap: true,
    roughness: 0.22,
    metalness: 0.88,
  },
  'Brown Metal': {
    color: '#5a3d30',
    clearMap: true,
    roughness: 0.35,
    metalness: 0.75,
  },
  'Turquoise Toy Plastic': {
    color: '#18b8b3',
    clearMap: true,
    roughness: 0.25,
    metalness: 0,
  },
  'Car Blue Metallic Paint': {
    color: '#2563eb',
    clearMap: true,
    roughness: 0.22,
    metalness: 0.65,
  },
  'Green Velvet': {
    color: '#2d6a4f',
    clearMap: true,
    roughness: 0.88,
    metalness: 0,
  },
  'Procedral Brown Silk': {
    color: '#7a543c',
    clearMap: true,
    roughness: 0.45,
    metalness: 0.03,
  },
  Linen: {
    color: '#e6dfd3',
    clearMap: true,
    roughness: 0.85,
    metalness: 0,
  },
  'Translucent Stylised Light Teal Plastic': {
    color: '#58c9c2',
    clearMap: true,
    clearNormalMap: true,
    emissive: '#000000',
    emissiveIntensity: 0,
    roughness: 0.22,
    metalness: 0,
  },
  'Sage green textured paper': {
    clearNormalMap: true,
  },
  'Book Cover Fabric Red': {
    clearNormalMap: true,
  },
  'Carbon Fiber Orange': {
    clearNormalMap: true,
  },
  'Tech gold metal': {
    clearNormalMap: true,
  },
  'Rough Plastic': {
    color: '#3c414a',
    clearMap: true,
    roughness: 0.72,
    metalness: 0,
  },
  'Grip plastic': {
    color: '#20242b',
    clearMap: true,
    roughness: 0.78,
    metalness: 0,
  },
  'Procedural glass material for every use': {
    color: '#e8f1f5',
    clearMap: true,
    transparent: true,
    opacity: 0.32,
    roughness: 0.1,
    metalness: 0,
    depthWrite: false,
  },
  'Transparent plastic (Plastic)': {
    color: '#e8f1f5',
    clearMap: true,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    metalness: 0,
    depthWrite: false,
  },
  glass: {
    color: '#e8f1f5',
    transparent: true,
    opacity: 0.28,
    roughness: 0.08,
    depthWrite: false,
  },
};

function applyProceduralMaterialOverride(mat) {
  const override = mat?.name ? PROCEDURAL_MATERIAL_OVERRIDES[mat.name] : null;
  if (!override) return;

  if (override.clearNormalMap && mat.normalMap) {
    mat.normalMap = null;
  }
  if (override.clearMap && mat.map) {
    mat.map = null;
  }

  // Preserve valid baked PBR maps (e.g., White Painted Wood, Sage green textured paper)
  // unless clearMap explicitly stripped a broken shared AO/dust mask.
  const hasBakedMaps = Boolean(
    mat.map || mat.normalMap || mat.roughnessMap || mat.metalnessMap
  );
  if (hasBakedMaps && !override.clearMap) {
    if (override.emissive && !mat.emissiveMap && mat.emissive) {
      mat.emissive.set(override.emissive);
      if (override.emissiveIntensity !== undefined && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = override.emissiveIntensity;
      }
    }
    mat.needsUpdate = true;
    return;
  }

  if (override.color && mat.color) {
    mat.color.set(override.color);
  }
  if (override.emissive && mat.emissive) {
    mat.emissive.set(override.emissive);
  }
  if (override.emissiveIntensity !== undefined && 'emissiveIntensity' in mat) {
    mat.emissiveIntensity = override.emissiveIntensity;
  }
  if (override.roughness !== undefined && 'roughness' in mat) {
    mat.roughness = override.roughness;
  }
  if (override.metalness !== undefined && 'metalness' in mat) {
    mat.metalness = override.metalness;
  }
  if (override.clearcoat !== undefined && 'clearcoat' in mat) {
    mat.clearcoat = override.clearcoat;
  }
  if (override.transparent !== undefined) {
    mat.transparent = override.transparent;
  }
  if (override.opacity !== undefined) {
    mat.opacity = override.opacity;
  }
  if (override.depthWrite !== undefined) {
    mat.depthWrite = override.depthWrite;
  }
  mat.needsUpdate = true;
}

function findObjectByTrimmedName(root, targetName) {
  const trimmedTarget = targetName.trim();
  const sanitizedTarget = THREE.PropertyBinding.sanitizeNodeName(trimmedTarget).trim();
  let found = null;
  root.traverse((obj) => {
    if (!found && obj.name) {
      const trimmed = obj.name.trim();
      if (trimmed === trimmedTarget || trimmed === sanitizedTarget) {
        found = obj;
      }
    }
  });
  return found;
}

/**
 * Remaps an existing partial UV island (e.g., [0.25..0.59]) cleanly to full [0..1]
 * so a standalone photo texture fits edge-to-edge without tiling or cropping.
 */
function normalizeGeometryUvBounds(sourceGeometry) {
  if (!sourceGeometry) return sourceGeometry;
  const geometry = sourceGeometry.clone();
  const uv = geometry.getAttribute('uv');
  if (!uv || uv.count === 0) return geometry;

  let uMin = Infinity;
  let uMax = -Infinity;
  let vMin = Infinity;
  let vMax = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i);
    const v = uv.getY(i);
    if (u < uMin) uMin = u;
    if (u > uMax) uMax = u;
    if (v < vMin) vMin = v;
    if (v > vMax) vMax = v;
  }

  const uSpan = uMax - uMin || 1;
  const vSpan = vMax - vMin || 1;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (uv.getX(i) - uMin) / uSpan, (uv.getY(i) - vMin) / vSpan);
  }
  uv.needsUpdate = true;
  return geometry;
}

export default function RoomModel({
  activeView = 'OVERVIEW',
  settledSection = null,
  isDarkMode = true,
  onSelectSection,
  onOpenStationPortfolio,
  onHoverHotspot,
  onLightsLoaded,
}) {
  const { scene, nodes } = useGLTF(ROOM_MODEL_URL);
  const paletteTex = useTexture(PALETTE_TEXTURE_URL);
  const [hoveredTarget, setHoveredTarget] = useState(null);
  const hotspotMaterialsRef = useRef([]);
  const backdropMaterialsRef = useRef([]);
  const lampShadeMaterialsRef = useRef([]);
  const ceilingShadeMaterialsRef = useRef([]);
  const pcRgbMaterialsRef = useRef([]);
  const pcRgbLightRef = useRef(null);
  const isDarkModeRef = useRef(isDarkMode);
  isDarkModeRef.current = isDarkMode;

  const activeHotspotStation =
    activeView && activeView === settledSection && STATION_HOTSPOTS[activeView]
      ? activeView
      : null;

  // Configure shadows, procedural material overrides, hotspot highlights, and practical light positions
  useEffect(() => {
    paletteTex.colorSpace = THREE.SRGBColorSpace;
    paletteTex.flipY = false;
    paletteTex.anisotropy = 8;
    paletteTex.wrapS = THREE.ClampToEdgeWrapping;
    paletteTex.wrapT = THREE.ClampToEdgeWrapping;
    paletteTex.repeat.set(1, 1);
    paletteTex.offset.set(0, 0);
    paletteTex.needsUpdate = true;

    const hotspotMaterials = [];
    const backdropMaterials = [];
    const lampShadeMaterials = [];
    const ceilingShadeMaterials = [];
    const pcRgbMaterials = [];

    scene.traverse((child) => {
      if (!child.isMesh) return;
      const trimmedName = child.name ? child.name.trim() : '';
      const lowerName = trimmedName.toLowerCase();

      // 1. Exterior sky backdrop uses unclipped MeshBasicMaterial tinted for Day/Night
      if (lowerName.includes('backdrop')) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material && !Array.isArray(child.material)) {
          const sourceMat = child.material;
          const skyMap = sourceMat.map || sourceMat.emissiveMap || null;
          const skyMat = new THREE.MeshBasicMaterial({
            map: skyMap,
            color: new THREE.Color(isDarkModeRef.current ? '#283354' : '#ffd7ad'),
            side: sourceMat.side ?? THREE.DoubleSide,
            toneMapped: false,
          });
          child.material = skyMat;
          backdropMaterials.push(skyMat);
        }
        return;
      }

      // 2. Apply uploaded palette photo to the Art_Palette_Messy plane primitive
      const isPalettePlane =
        !Array.isArray(child.material) &&
        (child.material?.name === 'Abstract Painting 05' ||
          (findAncestorMatch(child, ['Art_Palette_Messy']) &&
            child.geometry?.getAttribute('position')?.count === 4));

      if (isPalettePlane) {
        if (!child.userData.paletteUvNormalized) {
          child.geometry = normalizeGeometryUvBounds(child.geometry);
          child.userData.paletteUvNormalized = true;
        }
        child.material = new THREE.MeshStandardMaterial({
          map: paletteTex,
          roughness: 0.42,
          metalness: 0.0,
          side: THREE.DoubleSide,
        });
      } else if (child.material) {
        // Clone once so procedural overrides, RGB strips, lamp shades, & hotspots don't mutate shared materials
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone();
      }

      const mats = child.material
        ? Array.isArray(child.material)
          ? child.material
          : [child.material]
        : [];

      // 3. Apply procedural Blender material overrides & special lighting hooks
      const isPcTowerPart =
        trimmedName === 'Tech_PC_Tower_Motherboard' ||
        trimmedName === 'Tech_PC_Tower_RTX3060';
      const isBedsideLamp = trimmedName === 'Brand_Lamp_Bedside';
      const isCeilingLamp = trimmedName === 'Art_CeilingLamp';

      for (const mat of mats) {
        if (!mat) continue;
        applyProceduralMaterialOverride(mat);

        if (
          isPcTowerPart &&
          (mat.name === 'RGB Glow' ||
            mat.name === 'PaletteMaterial013' ||
            mat.name === 'PaletteMaterial014' ||
            (mat.emissive && mat.emissive.r > 0.5 && mat.emissive.g > 0.5 && mat.emissive.b > 0.5))
        ) {
          mat.toneMapped = false;
          mat.emissiveIntensity = isDarkModeRef.current ? 2.4 : 1.4;
          pcRgbMaterials.push({
            material: mat,
            hueOffset: trimmedName === 'Tech_PC_Tower_Motherboard' ? 0.0 : 0.14,
          });
        }

        if (
          isBedsideLamp &&
          (mat.name === 'Orange Translucent Lamp Material' ||
            mat.name === 'PaletteMaterial003' ||
            (mat.emissive && mat.emissive.r > 0.1))
        ) {
          mat.emissive = new THREE.Color('#ff9c47');
          mat.emissiveIntensity = isDarkModeRef.current ? 2.2 : 0.0;
          mat.toneMapped = false;
          lampShadeMaterials.push(mat);
        }

        if (isCeilingLamp && mat.name === 'Washi Paper') {
          mat.emissive = new THREE.Color('#ffb870');
          mat.emissiveIntensity = isDarkModeRef.current ? 1.1 : 0.0;
          ceilingShadeMaterials.push(mat);
        }
      }

      // 4. Register interactive hotspot materials
      const isArtCanvas = trimmedName === 'Art_Canvas_WIP';
      for (const [stationId, hotspot] of Object.entries(STATION_HOTSPOTS)) {
        const targetName = findAncestorMatch(child, hotspot.objectNames);
        if (targetName) {
          for (const mat of mats) {
            if (isArtCanvas && mat && mat.map) {
              mat.emissiveMap = mat.map;
              mat.emissive = new THREE.Color('#fff7eb');
              mat.emissiveIntensity = isDarkModeRef.current ? 0.22 : 0.0;
            }
            if (mat && 'emissive' in mat) {
              hotspotMaterials.push({
                stationId,
                targetName,
                material: mat,
                isArtCanvas,
                baseEmissive: mat.emissive.clone(),
                baseIntensity: mat.emissiveIntensity ?? 1,
                highlightColor: hotspot.highlightColor,
                highlightIntensity: hotspot.highlightIntensity,
              });
            }
          }
          break;
        }
      }

      // 5. Configure glass transparency & shadow casting
      if (lowerName === 'arch_window_glass' || lowerName === 'tech_pc_tower_glass') {
        child.castShadow = false;
        child.receiveShadow = false;
        for (const mat of mats) {
          if (!mat) continue;
          mat.transparent = true;
          mat.opacity = 0.22;
          mat.roughness = 0.08;
          mat.depthWrite = false;
        }
      } else if (findAncestorMatch(child, ['Tech_Glass_IcedMatcha'])) {
        child.castShadow = false;
        child.receiveShadow = false;
        for (const mat of mats) {
          if (!mat) continue;
          if (mat.name === 'Electronic matte plastic' || mat.name === 'glass') {
            mat.color.set('#e8f1f5');
            mat.transparent = true;
            mat.opacity = 0.28;
            mat.roughness = 0.08;
            mat.metalness = 0;
            mat.depthWrite = false;
            mat.needsUpdate = true;
          } else if (mat.name === 'Ice Cube') {
            if ('transmission' in mat) mat.transmission = 0;
            mat.color.set('#eef8ff');
            mat.transparent = true;
            mat.opacity = 0.55;
            mat.roughness = 0.12;
            mat.depthWrite = false;
            mat.needsUpdate = true;
          }
        }
      } else if (lowerName.includes('glass')) {
        child.castShadow = false;
        child.receiveShadow = false;
      } else {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    hotspotMaterialsRef.current = hotspotMaterials;
    backdropMaterialsRef.current = backdropMaterials;
    lampShadeMaterialsRef.current = lampShadeMaterials;
    ceilingShadeMaterialsRef.current = ceilingShadeMaterials;
    pcRgbMaterialsRef.current = pcRgbMaterials;

    // Reposition art supply jars/bottles that sit outside the walls so they stand inside the box on Art_Wooden_Bookshelf.001
    const placeObjectByBounds = (objectName, targetX, targetBottomY, targetZ) => {
      const sanitizedName = THREE.PropertyBinding.sanitizeNodeName(objectName);
      const obj =
        nodes[objectName] ||
        nodes[sanitizedName] ||
        findObjectByTrimmedName(scene, objectName);
      const placementKey = `${targetX},${targetBottomY},${targetZ}`;
      if (!obj || obj.userData.placementKey === placementKey) return;

      obj.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(obj);
      if (box.isEmpty()) return;

      const center = new THREE.Vector3();
      box.getCenter(center);

      const delta = new THREE.Vector3(
        targetX - center.x,
        targetBottomY - box.min.y,
        targetZ - center.z
      );

      const nextWorldPos = new THREE.Vector3();
      obj.getWorldPosition(nextWorldPos);
      nextWorldPos.add(delta);

      if (obj.parent) {
        obj.parent.updateWorldMatrix(true, false);
        obj.parent.worldToLocal(nextWorldPos);
      }

      obj.position.copy(nextWorldPos);
      obj.updateMatrixWorld(true);
      obj.userData.placementKey = placementKey;
    };

    const bookshelfBoxFloorY = 1.82;
    const misplacedArtSupplies = [
      ['Art_RollingCart_3Tier.004', -3.05, bookshelfBoxFloorY, -3.86],
      ['Art_RollingCart_3Tier.005', -2.86, bookshelfBoxFloorY, -3.84],
      ['Art_RollingCart_3Tier.006', -2.67, bookshelfBoxFloorY, -3.86],
      ['Art_RollingCart_3Tier.007', -2.70, bookshelfBoxFloorY, -4.08],
      ['Art_RollingCart_3Tier.008', -2.90, bookshelfBoxFloorY, -4.10],
      ['Art_RollingCart_3Tier.009', -3.06, bookshelfBoxFloorY, -4.28],
    ];
    for (const [name, x, y, z] of misplacedArtSupplies) {
      placeObjectByBounds(name, x, y, z);
    }

    const resolveLightPos = (emptyName, fallbackMeshName, offset = [0, 0, 0]) => {
      const emptyNode = nodes[emptyName] || findObjectByTrimmedName(scene, emptyName);
      if (emptyNode) {
        const pos = new THREE.Vector3();
        emptyNode.updateWorldMatrix(true, false);
        emptyNode.getWorldPosition(pos);
        // If Blender transforms were applied at origin, fall back to the actual lamp mesh bounds
        if (pos.lengthSq() > 0.0001) {
          return [pos.x, pos.y, pos.z];
        }
      }

      const lampMesh = findObjectByTrimmedName(scene, fallbackMeshName);
      if (lampMesh) {
        lampMesh.updateWorldMatrix(true, true);
        const box = new THREE.Box3().setFromObject(lampMesh);
        if (!box.isEmpty()) {
          const center = new THREE.Vector3();
          box.getCenter(center);
          return [center.x + offset[0], center.y + offset[1], center.z + offset[2]];
        }
      }
      return null;
    };

    const positions = {
      nightstand: resolveLightPos('LightPos_Nightstand', 'Brand_Lamp_Bedside', [-0.15, 0.22, 0]),
      artCeiling: resolveLightPos('LightPos_ArtCeiling', 'Art_CeilingLamp', [0, -0.35, 0]),
    };

    if (onLightsLoaded) {
      onLightsLoaded(positions);
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [scene, nodes, onLightsLoaded, paletteTex]);

  // Adjust lamp shades, canvas lift, PC RGB intensity, & sky tint for Day vs Night mode
  useEffect(() => {
    for (const entry of hotspotMaterialsRef.current) {
      if (entry.isArtCanvas) {
        const artLift = isDarkMode ? 0.22 : 0.0;
        entry.baseIntensity = artLift;
        entry.material.emissiveIntensity = artLift;
      }
    }
    for (const mat of lampShadeMaterialsRef.current) {
      mat.emissiveIntensity = isDarkMode ? 2.2 : 0.0;
    }
    for (const mat of ceilingShadeMaterialsRef.current) {
      mat.emissiveIntensity = isDarkMode ? 1.1 : 0.0;
    }
    for (const entry of pcRgbMaterialsRef.current) {
      entry.material.emissiveIntensity = isDarkMode ? 2.4 : 1.4;
    }
    const skyTint = isDarkMode ? '#283354' : '#ffd7ad';
    for (const mat of backdropMaterialsRef.current) {
      if (mat.color) {
        mat.color.set(skyTint);
      }
    }
  }, [isDarkMode]);

  // Smoothly cycle ARGB colors on the highlighted mobo & case light strips
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (const entry of pcRgbMaterialsRef.current) {
      const hue = (t * 0.12 + entry.hueOffset) % 1;
      entry.material.emissive.setHSL(hue, 0.92, 0.56);
      entry.material.color.setHSL(hue, 0.85, 0.62);
    }
    if (pcRgbLightRef.current) {
      const hue = (t * 0.12 + 0.07) % 1;
      pcRgbLightRef.current.color.setHSL(hue, 0.9, 0.6);
    }
  });

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
        entry.material.emissiveIntensity = entry.isArtCanvas
          ? entry.baseIntensity + 0.16
          : entry.highlightIntensity;
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
    <group>
      <primitive
        object={scene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      <MonitorScreens
        nodes={nodes}
        isDarkMode={isDarkMode}
        isTechSettled={activeView === 'TECH' && settledSection === 'TECH'}
        isLoungeSettled={activeView === 'LOUNGE' && settledSection === 'LOUNGE'}
        onSelectTech={() => onSelectSection?.('TECH')}
        onOpenTechPortfolio={() => onOpenStationPortfolio?.('TECH')}
        onHoverTech={(hovering) => onHoverHotspot?.(hovering ? 'TECH' : null)}
        onSelectLounge={() => onSelectSection?.('LOUNGE')}
        onOpenLoungeReview={(reviewId) => onOpenStationPortfolio?.('LOUNGE', reviewId)}
        onHoverLounge={(hovering) => onHoverHotspot?.(hovering ? 'LOUNGE' : null)}
      />
      <pointLight
        ref={pcRgbLightRef}
        position={[-3.55, 1.98, 1.2]}
        intensity={isDarkMode ? 2.6 : 0.6}
        distance={2.4}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(ROOM_MODEL_URL);
useTexture.preload(PALETTE_TEXTURE_URL);
