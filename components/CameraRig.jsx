'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { withBasePath } from '@/lib/assetPath';

const ROOM_MODEL_URL = withBasePath('/models/room.glb');

const CAMERA_MAP = {
  OVERVIEW: 'Cam_Overview',
  TECH: 'Cam_Tech',
  ART: 'Cam_Art',
  BRAND: 'Cam_Brand',
  LOUNGE: 'Cam_Lounge',
};

// Fallback 27mm-equivalent poses calibrated to worldMainBedroom.glb bounds
// used automatically whenever exported Blender cameras are absent from the GLB.
const FALLBACK_CAMERAS = {
  OVERVIEW: { pos: [8.2, 6.4, 8.8], target: [-0.2, 1.8, -0.3], fov: 42 },
  TECH: { pos: [-1.1, 2.75, 1.35], target: [-3.35, 2.15, 3.45], fov: 42 },
  ART: { pos: [-0.9, 2.55, -0.45], target: [-3.15, 2.2, -1.65], fov: 42 },
  BRAND: { pos: [1.8, 2.8, 0.4], target: [1.85, 2.0, -3.7], fov: 42 },
  LOUNGE: { pos: [2.95, 2.25, 3.75], target: [1.69, 0.78, 1.72], fov: 42 },
};

const FORWARD_BASE = new THREE.Vector3(0, 0, -1);
const TEMP_QUAT = new THREE.Quaternion();
const TEMP_FORWARD = new THREE.Vector3();

function setFallbackPose(key, outPos, outTarget, outFov) {
  const fallback = FALLBACK_CAMERAS[key] || FALLBACK_CAMERAS.OVERVIEW;
  outPos.set(...fallback.pos);
  outTarget.set(...fallback.target);
  outFov.current = fallback.fov;
}

function getResponsiveFov(baseFov, width, height) {
  if (!width || !height) return baseFov;
  const aspect = width / height;
  if (aspect >= 1) return baseFov;
  // Widen vertical FOV on portrait mobile viewports so horizontal room/station framing isn't cropped
  const clampedScale = Math.max(0.56, aspect * 1.15);
  const rad = THREE.MathUtils.degToRad(baseFov);
  const expanded = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(rad / 2) / clampedScale));
  return Math.min(72, Math.max(baseFov, expanded));
}

/**
 * Resolves a Blender-exported glTF camera, accounting for Blender's
 * `<CamName>_Orientation` child node that carries the actual lens transform.
 */
function findBlenderCamera(cameras, scene, camName) {
  const targetLower = camName.trim().toLowerCase();
  const orientationLower = `${targetLower}_orientation`;

  // 1. Check gltf.cameras array (matches direct name, _Orientation name, or parent name)
  const fromCameras = cameras?.find((c) => {
    const name = c.name?.trim().toLowerCase();
    const parentName = c.parent?.name?.trim().toLowerCase();
    return (
      name === targetLower ||
      name === orientationLower ||
      parentName === targetLower
    );
  });
  if (fromCameras) return fromCameras;

  // 2. Fallback to scene traversal if not in gltf.cameras
  if (!scene) return null;
  let matchedNode = null;
  scene.traverse((obj) => {
    const name = obj.name?.trim().toLowerCase();
    if (name === orientationLower) {
      matchedNode = obj;
    } else if (!matchedNode && name === targetLower) {
      matchedNode = obj;
    }
  });

  if (!matchedNode) return null;

  // If we matched the parent Empty/Group, prefer its _Orientation or child Camera node
  const childCamera = matchedNode.children?.find(
    (ch) =>
      ch.isCamera ||
      ch.name?.trim().toLowerCase() === orientationLower
  );
  return childCamera || matchedNode;
}

export default function CameraRig({
  activeView = 'OVERVIEW',
  activeSection,
  onArriveSection,
}) {
  const { camera, size } = useThree();
  const { cameras, scene } = useGLTF(ROOM_MODEL_URL);
  const controlsRef = useRef();
  const onArriveRef = useRef(onArriveSection);

  useEffect(() => {
    onArriveRef.current = onArriveSection;
  }, [onArriveSection]);

  const rawSection = activeSection ?? activeView ?? 'OVERVIEW';
  const normalizedSection =
    typeof rawSection === 'string' ? rawSection.trim().toUpperCase() : 'OVERVIEW';

  // Stage 1: Wide pullback anchor (Cam_Overview)
  const pullbackPos = useRef(new THREE.Vector3(...FALLBACK_CAMERAS.OVERVIEW.pos));
  const pullbackTarget = useRef(new THREE.Vector3(...FALLBACK_CAMERAS.OVERVIEW.target));
  const pullbackFov = useRef(FALLBACK_CAMERAS.OVERVIEW.fov);

  // Stage 2: Final target station camera
  const finalPos = useRef(new THREE.Vector3(...FALLBACK_CAMERAS.OVERVIEW.pos));
  const finalTarget = useRef(new THREE.Vector3(...FALLBACK_CAMERAS.OVERVIEW.target));
  const finalFov = useRef(FALLBACK_CAMERAS.OVERVIEW.fov);

  // State machine: "idle" (360° free orbit), "pullback", or "zoomin"
  const phase = useRef('idle');
  const isFirstLoad = useRef(true);
  const hasNotifiedArrive = useRef(false);

  useEffect(() => {
    const readCamAndLookAt = (sectionKey, outPos, outTarget, outFov) => {
      const camName = CAMERA_MAP[sectionKey] || CAMERA_MAP.OVERVIEW;
      const cam = findBlenderCamera(cameras, scene, camName);

      if (!cam) {
        setFallbackPose(sectionKey, outPos, outTarget, outFov);
        return false;
      }

      // Ensure full ancestor + _Orientation world matrix is up to date
      cam.updateWorldMatrix(true, false);
      cam.getWorldPosition(outPos);

      // Project a look-at pivot point 3.5m in front of the camera lens forward axis
      cam.getWorldQuaternion(TEMP_QUAT);
      TEMP_FORWARD.copy(FORWARD_BASE).applyQuaternion(TEMP_QUAT);
      outTarget.copy(outPos).addScaledVector(TEMP_FORWARD, 3.5);

      if (cam.fov) outFov.current = cam.fov;
      return true;
    };

    readCamAndLookAt('OVERVIEW', pullbackPos.current, pullbackTarget.current, pullbackFov);
    readCamAndLookAt(normalizedSection, finalPos.current, finalTarget.current, finalFov);
    pullbackFov.current = getResponsiveFov(pullbackFov.current, size.width, size.height);
    finalFov.current = getResponsiveFov(finalFov.current, size.width, size.height);

    if (isFirstLoad.current) {
      // Snap immediately on initial mount so the camera doesn't start over the lounge table
      camera.position.copy(finalPos.current);
      if (camera.isPerspectiveCamera) {
        camera.fov = finalFov.current;
        camera.updateProjectionMatrix();
      }
      if (controlsRef.current) {
        controlsRef.current.target.copy(finalTarget.current);
        controlsRef.current.update();
      } else {
        camera.lookAt(finalTarget.current);
      }
      isFirstLoad.current = false;
      phase.current = 'idle';
      hasNotifiedArrive.current = true;
      onArriveRef.current?.(normalizedSection);
    } else {
      hasNotifiedArrive.current = false;
      phase.current = normalizedSection === 'OVERVIEW' ? 'zoomin' : 'pullback';
    }
  }, [normalizedSection, cameras, scene, camera, size.width, size.height]);

  useFrame((_, delta) => {
    if (phase.current === 'idle' || !controlsRef.current) return;

    const isPullingBack = phase.current === 'pullback';
    const destPos = isPullingBack ? pullbackPos.current : finalPos.current;
    const destTarget = isPullingBack ? pullbackTarget.current : finalTarget.current;
    const destFov = isPullingBack ? pullbackFov.current : finalFov.current;

    // Pullback moves briskly (5.0), final zoom-in settles smoothly (3.5)
    const speed = Math.min(delta * (isPullingBack ? 5.0 : 3.5), 1);

    camera.position.lerp(destPos, speed);
    controlsRef.current.target.lerp(destTarget, speed);

    if (camera.isPerspectiveCamera && Math.abs(camera.fov - destFov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, destFov, speed);
      camera.updateProjectionMatrix();
    }

    controlsRef.current.update();

    const dist = camera.position.distanceTo(destPos);
    const targetDist = controlsRef.current.target.distanceTo(destTarget);
    if (isPullingBack && dist < 1.8) {
      phase.current = 'zoomin';
    } else if (!isPullingBack) {
      if (!hasNotifiedArrive.current && dist < 0.35 && targetDist < 0.35) {
        hasNotifiedArrive.current = true;
        onArriveRef.current?.(normalizedSection);
      }
      if (dist < 0.05 && targetDist < 0.05) {
        // Arrived! Unlock controls for full 360° manual orbiting
        phase.current = 'idle';
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      // Full 360° horizontal spin + unrestricted vertical viewing like Blender
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      minDistance={1.0}
      maxDistance={25.0}
      // Cancel auto-glide immediately if the user grabs the canvas to drag manually
      onStart={() => {
        const wasZoomingIn = phase.current === 'zoomin';
        phase.current = 'idle';
        if (
          wasZoomingIn &&
          !hasNotifiedArrive.current &&
          camera.position.distanceTo(finalPos.current) < 3.0
        ) {
          hasNotifiedArrive.current = true;
          onArriveRef.current?.(normalizedSection);
        }
      }}
    />
  );
}
