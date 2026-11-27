'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial, useTexture } from '@react-three/drei';
import { createAlignedScreenGeometry } from '@/lib/screenGeometry';
import { withBasePath } from '@/lib/assetPath';
import { loungeReviews } from '@/data/loungeReviews';

const LEFT_MONITOR_URLS = [
  withBasePath('/textures/monitors/kontexto-showcase.jpg'),
  withBasePath('/textures/monitors/imara-showcase.jpg'),
  withBasePath('/textures/monitors/see-cover.jpg'),
  withBasePath('/textures/monitors/anii-showcase.jpg'),
];

const RIGHT_MONITOR_URLS = [
  withBasePath('/textures/monitors/service-environment-2.jpg'),
  withBasePath('/textures/monitors/service-concept-art.jpg'),
  withBasePath('/textures/monitors/service-characters-2.jpg'),
  withBasePath('/textures/monitors/service-props.jpg'),
];

// Custom crossfade + subtle CRT scanline + optional gentle Ken Burns motion shader
const ScreenTransitionMaterial = shaderMaterial(
  {
    uTex1: null,
    uTex2: null,
    uMix: 1,
    uTime: 0,
    uHover: 0,
    uBrightness: 1,
    uKenBurns: 0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float uMix;
    uniform float uTime;
    uniform float uHover;
    uniform float uBrightness;
    uniform float uKenBurns;
    varying vec2 vUv;

    void main() {
      vec2 sampleUv = vUv;
      if (uKenBurns > 0.5) {
        float zoom = 1.05 + 0.03 * sin(uTime * 0.35);
        vec2 pan = vec2(sin(uTime * 0.22), cos(uTime * 0.18)) * 0.018;
        sampleUv = clamp((vUv - 0.5) / zoom + 0.5 + pan, 0.0, 1.0);
      }

      vec4 texA = texture2D(uTex1, sampleUv);
      vec4 texB = texture2D(uTex2, sampleUv);
      vec4 blended = mix(texA, texB, uMix);

      // Subtle CRT scanline shimmer
      float scanline = sin(vUv.y * 420.0 + uTime * 3.0) * 0.014;
      vec3 color = blended.rgb * uBrightness - scanline;
      color = mix(color, vec3(0.85, 1.0, 0.94), uHover * 0.16);
      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `
);

extend({ ScreenTransitionMaterial });

function createSlideTexture(drawFn, width = 640, height = 464) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  drawFn(ctx, width, height);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false; // Standard glTF UV orientation
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const CATEGORY_BADGE_HEX = {
  BOOKS: '#C7AF6E',
  GAMES: '#42AEA3',
  FILMS: '#D66370',
  CAMPAIGNS: '#AEE8A2',
  MUSIC: '#B497FF',
};

function buildIpadReviewSlides() {
  return loungeReviews
    .map((review, idx) =>
      createSlideTexture(
        (ctx, w, h) => {
          // Dark base canvas with subtle personal brand gradient ambient glow
          ctx.fillStyle = '#0C1014';
          ctx.fillRect(0, 0, w, h);

          const roseGlow = ctx.createRadialGradient(80, 40, 10, 80, 40, 320);
          roseGlow.addColorStop(0, 'rgba(214, 99, 112, 0.28)');
          roseGlow.addColorStop(1, 'rgba(12, 16, 20, 0)');
          ctx.fillStyle = roseGlow;
          ctx.fillRect(0, 0, w, h);

          const tealGlow = ctx.createRadialGradient(w - 70, h - 40, 10, w - 70, h - 40, 340);
          tealGlow.addColorStop(0, 'rgba(66, 174, 163, 0.28)');
          tealGlow.addColorStop(1, 'rgba(12, 16, 20, 0)');
          ctx.fillStyle = tealGlow;
          ctx.fillRect(0, 0, w, h);

          // Top brand-gradient hairline
          const topGrad = ctx.createLinearGradient(0, 0, w, 0);
          topGrad.addColorStop(0, '#D66370');
          topGrad.addColorStop(0.36, '#C7AF6E');
          topGrad.addColorStop(0.7, '#AEE8A2');
          topGrad.addColorStop(1, '#42AEA3');
          ctx.fillStyle = topGrad;
          ctx.fillRect(0, 0, w, 4);

          // Header strip
          ctx.fillStyle = 'rgba(17, 22, 28, 0.9)';
          ctx.fillRect(0, 4, w, 60);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 64);
          ctx.lineTo(w, 64);
          ctx.stroke();

          ctx.fillStyle = '#66D1C6';
          ctx.font = 'bold 14px monospace';
          ctx.fillText("LIVIE'S CULTURE LOUNGE", 32, 40);

          ctx.fillStyle = '#9CA3AF';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(
            `${review.channelCode || `CH-${String(idx + 1).padStart(2, '0')}`} / ${String(loungeReviews.length).padStart(2, '0')}`,
            w - 132,
            40
          );

          // Elevated dark glass card
          ctx.fillStyle = 'rgba(20, 26, 33, 0.92)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(26, 86, w - 52, h - 112, 18);
          ctx.fill();
          ctx.stroke();

          // Category badge
          const badgeColor = CATEGORY_BADGE_HEX[review.category] || '#42AEA3';
          ctx.fillStyle = badgeColor;
          ctx.beginPath();
          ctx.roundRect(50, 114, 126, 30, 8);
          ctx.fill();
          ctx.fillStyle = '#0C1014';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(review.category, 64, 134);

          ctx.fillStyle = '#9CA3AF';
          ctx.font = '14px monospace';
          ctx.fillText(review.year, w - 165, 134);

          // Title & creator
          ctx.fillStyle = '#F9FAFB';
          ctx.font = 'bold 30px sans-serif';
          const titleLines = wrapLines(ctx, review.title, w - 104).slice(0, 2);
          titleLines.forEach((line, i) => {
            ctx.fillText(line, 50, 184 + i * 36);
          });

          const afterTitleY = 184 + titleLines.length * 36;
          ctx.fillStyle = '#9CA3AF';
          ctx.font = '15px monospace';
          ctx.fillText(review.creator, 50, afterTitleY + 4);

          // Hook paragraph
          ctx.fillStyle = '#D1D5DB';
          ctx.font = '18px sans-serif';
          const hookLines = wrapLines(ctx, review.hook, w - 108).slice(0, 3);
          hookLines.forEach((line, i) => {
            ctx.fillText(line, 50, afterTitleY + 42 + i * 26);
          });

          // Footer divider + CTA
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(50, h - 82);
          ctx.lineTo(w - 50, h - 82);
          ctx.stroke();

          ctx.fillStyle = '#AEE8A2';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(
            review.tags
              .slice(0, 2)
              .map((t) => `#${t}`)
              .join('  '),
            50,
            h - 48
          );

          ctx.fillStyle = '#F08A95';
          ctx.font = 'bold 15px monospace';
          ctx.fillText('READ DIGEST →', w - 188, h - 48);
        },
        640,
        464
      )
    )
    .filter(Boolean);
}

function SlideScreenMesh({
  targetMesh,
  textures,
  intervalMs = 5500,
  isDarkMode = true,
  isSettled = false,
  nightBrightness = 1.08,
  dayBrightness = 0.92,
  kenBurns = false,
  onSelectStation,
  onOpenFromSlide,
  onHover,
}) {
  const matRef = useRef();
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const mixRef = useRef(1);

  const alignedGeometry = useMemo(
    () => createAlignedScreenGeometry(targetMesh?.geometry),
    [targetMesh]
  );

  useEffect(() => {
    return () => {
      alignedGeometry?.dispose();
    };
  }, [alignedGeometry]);

  // Auto-cycle slides cleanly with smooth shader damp crossfade
  useEffect(() => {
    if (!textures || textures.length <= 1) return;
    const timer = setInterval(() => {
      setPrevIndex(index);
      setIndex((i) => (i + 1) % textures.length);
      mixRef.current = 0;
    }, intervalMs);
    return () => clearInterval(timer);
  }, [index, textures, intervalMs]);

  useEffect(() => {
    if (!isSettled && hovered) {
      setHovered(false);
    }
  }, [isSettled, hovered]);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    mixRef.current = THREE.MathUtils.damp(mixRef.current, 1, 6, delta);
    matRef.current.uMix = mixRef.current;
    matRef.current.uTime += delta;
    matRef.current.uHover = THREE.MathUtils.damp(
      matRef.current.uHover,
      isSettled && hovered ? 1 : 0,
      10,
      delta
    );
    matRef.current.uBrightness = isDarkMode ? nightBrightness : dayBrightness;
    matRef.current.uKenBurns = kenBurns ? 1 : 0;
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    if (isSettled) {
      setHovered(true);
      onHover?.(true);
    } else {
      onHover?.(false);
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    if (e.delta > 5) return;
    e.stopPropagation();
    if (isSettled) {
      onOpenFromSlide?.(index);
      return;
    }
    onSelectStation?.();
  };

  if (!targetMesh || !alignedGeometry || !textures || textures.length === 0) return null;

  return (
    <mesh
      geometry={alignedGeometry}
      position={targetMesh.position}
      rotation={targetMesh.rotation}
      scale={targetMesh.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <screenTransitionMaterial
        ref={matRef}
        uTex1={textures[prevIndex % textures.length]}
        uTex2={textures[index % textures.length]}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function MonitorScreens({
  nodes,
  isDarkMode = true,
  isTechSettled = false,
  isLoungeSettled = false,
  onSelectTech,
  onOpenTechPortfolio,
  onHoverTech,
  onSelectLounge,
  onOpenLoungeReview,
  onHoverLounge,
}) {
  const leftMonitorTextures = useTexture(LEFT_MONITOR_URLS);
  const rightMonitorTextures = useTexture(RIGHT_MONITOR_URLS);
  const ipadSlides = useMemo(() => buildIpadReviewSlides(), []);

  useEffect(() => {
    [...leftMonitorTextures, ...rightMonitorTextures].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false; // Standard glTF UV orientation matching createAlignedScreenGeometry
      tex.anisotropy = 8;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
    });
  }, [leftMonitorTextures, rightMonitorTextures]);

  useEffect(() => {
    return () => {
      ipadSlides.forEach((tex) => tex.dispose());
    };
  }, [ipadSlides]);

  // Hide the original Blender placeholder screen meshes so there is no Z-fighting
  useEffect(() => {
    if (nodes?.Tech_Monitor_Left_Screen) nodes.Tech_Monitor_Left_Screen.visible = false;
    if (nodes?.Tech_Monitor_Right_Screen) nodes.Tech_Monitor_Right_Screen.visible = false;
    if (nodes?.Lounge_iPad_Screen) nodes.Lounge_iPad_Screen.visible = false;
    return () => {
      if (nodes?.Tech_Monitor_Left_Screen) nodes.Tech_Monitor_Left_Screen.visible = true;
      if (nodes?.Tech_Monitor_Right_Screen) nodes.Tech_Monitor_Right_Screen.visible = true;
      if (nodes?.Lounge_iPad_Screen) nodes.Lounge_iPad_Screen.visible = true;
    };
  }, [nodes]);

  return (
    <group name="Interactive_Screen_Displays">
      <SlideScreenMesh
        targetMesh={nodes?.Tech_Monitor_Left_Screen}
        textures={leftMonitorTextures}
        intervalMs={4800}
        isDarkMode={isDarkMode}
        isSettled={isTechSettled}
        kenBurns
        onSelectStation={onSelectTech}
        onOpenFromSlide={() => onOpenTechPortfolio?.()}
        onHover={onHoverTech}
      />
      <SlideScreenMesh
        targetMesh={nodes?.Tech_Monitor_Right_Screen}
        textures={rightMonitorTextures}
        intervalMs={6200}
        isDarkMode={isDarkMode}
        isSettled={isTechSettled}
        kenBurns
        onSelectStation={onSelectTech}
        onOpenFromSlide={() => onOpenTechPortfolio?.()}
        onHover={onHoverTech}
      />
      <SlideScreenMesh
        targetMesh={nodes?.Lounge_iPad_Screen}
        textures={ipadSlides}
        intervalMs={6000}
        isDarkMode={isDarkMode}
        isSettled={isLoungeSettled}
        nightBrightness={0.96}
        dayBrightness={0.86}
        onSelectStation={onSelectLounge}
        onOpenFromSlide={(slideIdx) => {
          const activeReview = loungeReviews[slideIdx % loungeReviews.length];
          onOpenLoungeReview?.(activeReview?.id || null);
        }}
        onHover={onHoverLounge}
      />
    </group>
  );
}

LEFT_MONITOR_URLS.forEach((url) => useTexture.preload(url));
RIGHT_MONITOR_URLS.forEach((url) => useTexture.preload(url));
