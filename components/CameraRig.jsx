'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

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
  LOUNGE: { pos: [3.3, 2.3, 4.1], target: [2.05, 0.75, 2.18], fov: 42 },
};

const UP_VECTOR = new THREE.Vector3(0, 1, 0);
const LOOK_MATRIX = new THREE.Matrix4();

function setFallbackPose(key, outPos, outQuat, outFov) {
  const fallback = FALLBACK_CAMERAS[key] || FALLBACK_CAMERAS.OVERVIEW;
  outPos.set(...fallback.pos);
  const targetVec = new THREE.Vector3(...fallback.target);
  LOOK_MATRIX.lookAt(outPos, targetVec, UP_VECTOR);
  outQuat.setFromRotationMatrix(LOOK_MATRIX);
  outFov.current = fallback.fov;
}

export default function CameraRig({ activeView = 'OVERVIEW', activeSection }) {
  const { camera } = useThree();
  const { cameras, scene } = useGLTF('/models/room.glb');

  const rawSection = activeSection ?? activeView ?? 'OVERVIEW';
  const normalizedSection =
    typeof rawSection === 'string' ? rawSection.trim().toUpperCase() : 'OVERVIEW';

  // Stage 1: Wide pullback anchor (Cam_Overview)
  const pullbackPos = useRef(new THREE.Vector3(...FALLBACK_CAMERAS.OVERVIEW.pos));
  const pullbackQuat = useRef(new THREE.Quaternion());
  const pullbackFov = useRef(FALLBACK_CAMERAS.OVERVIEW.fov);

  // Stage 2: Final target station camera
  const finalPos = useRef(new THREE.Vector3(...FALLBACK_CAMERAS.OVERVIEW.pos));
  const finalQuat = useRef(new THREE.Quaternion());
  const finalFov = useRef(FALLBACK_CAMERAS.OVERVIEW.fov);

  // State machine: "pullback" -> "zoomin"
  const phase = useRef('zoomin');
  const prevSection = useRef(normalizedSection);
  const hasSnappedInitial = useRef(false);

  useEffect(() => {
    const readBlenderCam = (sectionKey, outPos, outQuat, outFov) => {
      const camName = CAMERA_MAP[sectionKey] || CAMERA_MAP.OVERVIEW;
      const targetLower = camName.toLowerCase();
      let cam = cameras?.find((c) => c.name?.trim().toLowerCase() === targetLower);
      if (!cam && scene) {
        scene.traverse((obj) => {
          if (!cam && obj.name?.trim().toLowerCase() === targetLower) {
            cam = obj;
          }
        });
      }

      if (!cam) {
        setFallbackPose(sectionKey, outPos, outQuat, outFov);
        return false;
      }

      cam.updateWorldMatrix(true, false);
      cam.getWorldPosition(outPos);
      cam.getWorldQuaternion(outQuat);
      if (cam.fov) outFov.current = cam.fov;
      return true;
    };

    readBlenderCam('OVERVIEW', pullbackPos.current, pullbackQuat.current, pullbackFov);
    readBlenderCam(normalizedSection, finalPos.current, finalQuat.current, finalFov);

    if (!hasSnappedInitial.current) {
      hasSnappedInitial.current = true;
      camera.position.copy(finalPos.current);
      camera.quaternion.copy(finalQuat.current);
      if (camera.isPerspectiveCamera) {
        camera.fov = finalFov.current;
        camera.updateProjectionMatrix();
      }
      phase.current = 'zoomin';
      prevSection.current = normalizedSection;
      return;
    }

    if (normalizedSection === 'OVERVIEW') {
      phase.current = 'zoomin';
    } else if (prevSection.current !== normalizedSection) {
      phase.current = 'pullback';
    }

    prevSection.current = normalizedSection;
  }, [normalizedSection, cameras, scene, camera]);

  useFrame((_, delta) => {
    const isPullingBack = phase.current === 'pullback';
    const targetPos = isPullingBack ? pullbackPos.current : finalPos.current;
    const targetQuat = isPullingBack ? pullbackQuat.current : finalQuat.current;
    const targetFov = isPullingBack ? pullbackFov.current : finalFov.current;

    // Pullback moves briskly (5.0), final zoom-in settles smoothly (3.5)
    const speed = Math.min(delta * (isPullingBack ? 5.0 : 3.5), 1);

    camera.position.lerp(targetPos, speed);
    camera.quaternion.slerp(targetQuat, speed);

    if (camera.isPerspectiveCamera && Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, speed);
      camera.updateProjectionMatrix();
    }

    // Transition from pullback to zoom-in once within 1.8m of overview shot
    if (isPullingBack) {
      const dist = camera.position.distanceTo(pullbackPos.current);
      if (dist < 1.8) {
        phase.current = 'zoomin';
      }
    }
  });

  return null;
}
