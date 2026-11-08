'use client';

import React, { useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';

/**
 * Camera Framing & POV Extreme Close-Up Glides:
 * - OVERVIEW:
 *   Adjusted z-angle / look-at elevation so the top part of the back and left walls
 *   is no longer clipped by the top edge of the canvas:
 *   - pos: [7.8, 6.2, 8.8]
 *   - target: [0.0, 1.4, 0.0] (shifts focal center upward into the room vertical midpoint)
 *   - zoom: 84 (re-calibrated so all 4 edges fit neatly within the canvas without cropping top walls)
 *
 * - TECH (Workstation Desk & Dual Monitors):
 *   Extreme close-up POV sitting in the desk chair facing screens.
 *
 * - ART (Easel & Stretched Canvas):
 *   Extreme close-up POV sitting on the painter's stool facing painting surface.
 *
 * - BRAND (Daybed Workspace & Strategy Proofs):
 *   Extreme close-up POV perched on daybed edge facing proofs and lamp.
 *
 * - LOUNGE (Coffee Table & Publications):
 *   Extreme close-up POV seated at lounge rug gazing at coffee table publications.
 */
export const CAMERA_STATIONS = {
  OVERVIEW: {
    pos: [7.8, 6.2, 8.8],
    target: [0.0, 1.4, 0.0],
    zoom: 84, // Balanced zoom with elevated target so upper walls aren't cropped
  },
  TECH: {
    pos: [-2.45, 1.35, -0.1],
    target: [-3.3, 1.25, -0.25],
    zoom: 240,
  },
  ART: {
    pos: [-0.6, 1.62, -2.4],
    target: [-0.6, 1.65, -3.75],
    zoom: 230,
  },
  BRAND: {
    // Daybed at [2.9, 0, -1.8], proofs & zines spread across [2.9, 0.8, -1.5].
    // Closer camera elevated above the bed looking down directly onto the editorial proofs & mattress:
    pos: [2.3, 2.5, -0.6],
    target: [2.9, 0.75, -1.5],
    zoom: 260, // Closer intimate downward-facing angle over the bed surface
  },
  LOUNGE: {
    pos: [0.0, 1.2, 2.3],
    target: [0.0, 0.26, 1.2],
    zoom: 230,
  },
};

export default function CameraRig({ activeView = 'OVERVIEW' }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (!controlsRef.current) return;
    const key = typeof activeView === 'string' ? activeView.toUpperCase() : 'OVERVIEW';
    const st = CAMERA_STATIONS[key] || CAMERA_STATIONS.OVERVIEW;

    // Smoothly fly camera to face the station's main object
    controlsRef.current.setLookAt(
      st.pos[0],
      st.pos[1],
      st.pos[2],
      st.target[0],
      st.target[1],
      st.target[2],
      true
    );

    // Smoothly zoom in to the close-up framing
    if (controlsRef.current.camera && controlsRef.current.camera.isOrthographicCamera) {
      controlsRef.current.zoomTo(st.zoom, true);
    }
  }, [activeView]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.75}
      draggingSmoothTime={0.2}
      // Keep user orbit locked so only our station navigation guides the view
      azimuthRotateSpeed={0}
      polarRotateSpeed={0}
      dollySpeed={0}
      truckSpeed={0}
    />
  );
}
