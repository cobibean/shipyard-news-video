import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

/**
 * GlitchEffect - A visual glitch overlay with scanlines and RGB shift.
 *
 * Uses a deterministic pseudo-random function seeded by the frame number
 * to drive pulsing glitch intensity. Renders colored horizontal bars that
 * shift position per frame, plus a chromatic aberration overlay with
 * red/cyan offset shadows.
 */

// Deterministic pseudo-random number generator (no Math.random)
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface GlitchEffectProps {
  /** Overall intensity multiplier, 0-1. Default 1 */
  intensity?: number;
  /** Number of scanlines rendered. Default 80 */
  scanlineCount?: number;
  /** Number of colored glitch bars. Default 6 */
  barCount?: number;
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  intensity = 1,
  scanlineCount = 80,
  barCount = 6,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // Pulsing glitch intensity: peaks every ~15 frames, with baseline noise
  const pulse = interpolate(
    Math.sin(frame * 0.4) + Math.sin(frame * 0.17),
    [-2, 2],
    [0.05, 1],
  );
  const glitchStrength = pulse * intensity;

  // Decide if this frame is a "heavy glitch" frame (roughly 15% of frames)
  const isHeavyGlitch = seededRandom(frame * 7) > 0.85;
  const effectiveStrength = isHeavyGlitch ? glitchStrength * 2.5 : glitchStrength;

  // --- Scanlines ---
  const scanlines: React.ReactNode[] = [];
  for (let i = 0; i < scanlineCount; i++) {
    const y = (i / scanlineCount) * height;
    const lineOpacity = interpolate(
      seededRandom(frame * 3 + i * 17),
      [0, 1],
      [0.01, 0.08 * effectiveStrength],
    );
    scanlines.push(
      <div
        key={`scanline-${i}`}
        style={{
          position: 'absolute',
          top: y,
          left: 0,
          width: '100%',
          height: 2,
          backgroundColor: `rgba(255, 255, 255, ${lineOpacity})`,
        }}
      />,
    );
  }

  // --- Colored glitch bars ---
  const bars: React.ReactNode[] = [];
  for (let i = 0; i < barCount; i++) {
    const seed = frame * 13 + i * 37;
    const barY = seededRandom(seed) * height;
    const barHeight = seededRandom(seed + 1) * 20 + 2;
    const barOffset = (seededRandom(seed + 2) - 0.5) * 60 * effectiveStrength;
    const barOpacity = interpolate(
      effectiveStrength,
      [0, 1],
      [0, 0.3],
    ) * seededRandom(seed + 3);

    // Alternate colors: red, cyan, green
    const colors = [
      'rgba(255, 0, 60, ',
      'rgba(0, 255, 220, ',
      'rgba(74, 222, 64, ',
    ];
    const color = colors[i % colors.length];

    bars.push(
      <div
        key={`bar-${i}`}
        style={{
          position: 'absolute',
          top: barY,
          left: barOffset,
          width: '100%',
          height: barHeight,
          backgroundColor: `${color}${barOpacity})`,
          mixBlendMode: 'screen',
        }}
      />,
    );
  }

  // --- Chromatic aberration (red / cyan offset overlays) ---
  const chromaOffset = interpolate(
    effectiveStrength,
    [0, 1],
    [0, 6],
  );
  // Additional jitter on heavy glitch frames
  const jitterX = isHeavyGlitch
    ? (seededRandom(frame * 19) - 0.5) * 12
    : 0;

  const chromaOpacity = interpolate(
    effectiveStrength,
    [0, 1],
    [0, 0.12],
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Scanlines */}
      {scanlines}

      {/* Glitch bars */}
      {bars}

      {/* Red channel offset (chromatic aberration) */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(255, 0, 0, 1)',
          opacity: chromaOpacity,
          transform: `translateX(${chromaOffset + jitterX}px) translateY(${chromaOffset * 0.5}px)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Cyan channel offset (chromatic aberration) */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(0, 255, 255, 1)',
          opacity: chromaOpacity,
          transform: `translateX(${-chromaOffset + jitterX}px) translateY(${-chromaOffset * 0.5}px)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Horizontal shift block (occasional large displacement) */}
      {isHeavyGlitch && (
        <div
          style={{
            position: 'absolute',
            top: seededRandom(frame * 23) * height * 0.8,
            left: 0,
            width: '100%',
            height: seededRandom(frame * 29) * 40 + 10,
            backgroundColor: `rgba(74, 222, 64, ${chromaOpacity * 0.6})`,
            transform: `translateX(${(seededRandom(frame * 31) - 0.5) * 80}px)`,
            mixBlendMode: 'screen',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
