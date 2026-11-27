import * as THREE from 'three';

const WORLD_UP = new THREE.Vector3(0, 1, 0);

/**
 * Clones a flat screen mesh geometry and recomputes edge-to-edge [0..1] planar
 * glTF UVs (top-left origin for flipY=false) aligned to the screen's face normal
 * and world up vector, fixing 90-degree rotated or cropped Blender UVs.
 */
export function createAlignedScreenGeometry(sourceGeometry) {
  if (!sourceGeometry) return null;

  const geometry = sourceGeometry.clone();
  const posAttr = geometry.getAttribute('position');
  if (!posAttr || posAttr.count === 0) return geometry;

  if (!geometry.getAttribute('normal')) {
    geometry.computeVertexNormals();
  }
  const normAttr = geometry.getAttribute('normal');

  const avgNormal = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  for (let i = 0; i < normAttr.count; i++) {
    tmp.fromBufferAttribute(normAttr, i);
    avgNormal.add(tmp);
  }
  if (avgNormal.lengthSq() < 1e-6) {
    avgNormal.set(0, 0, 1);
  } else {
    avgNormal.normalize();
  }

  // Screen right = worldUp x normal (points right from viewer facing into -normal)
  const right = new THREE.Vector3().crossVectors(WORLD_UP, avgNormal);
  if (right.lengthSq() < 1e-6) {
    right.set(1, 0, 0);
  } else {
    right.normalize();
  }
  const up = new THREE.Vector3().crossVectors(avgNormal, right).normalize();

  let minR = Infinity;
  let maxR = -Infinity;
  let minU = Infinity;
  let maxU = -Infinity;

  const rVals = new Float32Array(posAttr.count);
  const uVals = new Float32Array(posAttr.count);

  for (let i = 0; i < posAttr.count; i++) {
    tmp.fromBufferAttribute(posAttr, i);
    const r = tmp.dot(right);
    const u = tmp.dot(up);
    rVals[i] = r;
    uVals[i] = u;
    if (r < minR) minR = r;
    if (r > maxR) maxR = r;
    if (u < minU) minU = u;
    if (u > maxU) maxU = u;
  }

  const spanR = maxR - minR || 1;
  const spanU = maxU - minU || 1;
  const uvArray = new Float32Array(posAttr.count * 2);

  for (let i = 0; i < posAttr.count; i++) {
    uvArray[i * 2] = (rVals[i] - minR) / spanR;
    // flipY=false puts v=0 at the top edge and v=1 at the bottom edge
    uvArray[i * 2 + 1] = (maxU - uVals[i]) / spanU;
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
  geometry.attributes.uv.needsUpdate = true;
  return geometry;
}
