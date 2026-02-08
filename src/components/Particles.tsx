import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from 'remotion';

/**
 * Particles - Floating particle system with deterministic seeded positions.
 *
 * Renders 40-60 small circles that drift upward with slight horizontal sway.
 * All randomness is derived from a deterministic seed function (no Math.random).
 * Particles wrap around when they leave the viewport.
 */

// Deterministic pseudo-random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

interface ParticleData {
  id: number;
  /** Starting X position (0-1 fraction of width) */
  startX: number;
  /** Starting Y position (0-1 fraction of height) */
  startY: number;
  /** Radius in px */
  size: number;
  /** Opacity 0.2-0.8 */
  opacity: number;
  /** Vertical drift speed (pixels per frame) */
  speed: number;
  /** Horizontal sway amplitude (pixels) */
  swayAmplitude: number;
  /** Sway frequency multiplier */
  swayFrequency: number;
  /** Phase offset for sway */
  swayPhase: number;
}

interface ParticlesProps {
  /** Number of particles. Default 50 */
  count?: number;
  /** Particle color. Default #4ADE40 */
  color?: string;
  /** Base seed for deterministic generation. Default 42 */
  seed?: number;
  /** Speed multiplier. Default 1 */
  speedMultiplier?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 50,
  color = '#4ADE40',
  seed = 42,
  speedMultiplier = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Generate particle data once, deterministically
  const particles: ParticleData[] = useMemo(() => {
    const result: ParticleData[] = [];
    for (let i = 0; i < count; i++) {
      const baseSeed = seed * 1000 + i;
      result.push({
        id: i,
        startX: seededRandom(baseSeed + 1),
        startY: seededRandom(baseSeed + 2),
        size: interpolate(seededRandom(baseSeed + 3), [0, 1], [2, 6]),
        opacity: interpolate(seededRandom(baseSeed + 4), [0, 1], [0.2, 0.8]),
        speed: interpolate(seededRandom(baseSeed + 5), [0, 1], [0.3, 1.2]),
        swayAmplitude: interpolate(seededRandom(baseSeed + 6), [0, 1], [8, 30]),
        swayFrequency: interpolate(seededRandom(baseSeed + 7), [0, 1], [0.01, 0.04]),
        swayPhase: seededRandom(baseSeed + 8) * Math.PI * 2,
      });
    }
    return result;
  }, [count, seed]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p) => {
        // Vertical position: drift upward, wrap around
        const totalDrift = frame * p.speed * speedMultiplier;
        const rawY = p.startY * height - totalDrift;
        // Wrap: when particle goes above viewport, it reappears at the bottom
        const wrappedY = ((rawY % height) + height) % height;

        // Horizontal position: base + sinusoidal sway
        const swayX =
          Math.sin(frame * p.swayFrequency + p.swayPhase) * p.swayAmplitude;
        const x = p.startX * width + swayX;

        // Fade in/out near edges for smooth wrapping
        const edgeFade = interpolate(
          wrappedY,
          [0, 40, height - 40, height],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const currentOpacity = p.opacity * edgeFade;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: x - p.size / 2,
              top: wrappedY - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: currentOpacity,
              boxShadow: `0 0 ${p.size * 2}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
