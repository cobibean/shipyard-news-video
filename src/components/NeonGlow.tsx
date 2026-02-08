import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

/**
 * NeonGlow - A wrapper component that adds an animated neon glow effect
 * around its children.
 *
 * Uses box-shadow and text-shadow driven by interpolate() on the current
 * frame to create a pulsing neon glow. The glow color is configurable.
 */

interface NeonGlowProps {
  children: React.ReactNode;
  /** Glow color. Default #4ADE40 */
  color?: string;
  /** Pulse speed factor (higher = faster). Default 1 */
  pulseSpeed?: number;
  /** Whether to apply text-shadow in addition to box-shadow. Default true */
  glowText?: boolean;
  /** Maximum blur radius in px. Default 30 */
  maxBlur?: number;
  /** CSS display property for the wrapper. Default 'inline-block' */
  display?: React.CSSProperties['display'];
}

/**
 * Converts a hex color like #4ADE40 to an rgba() string.
 */
function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  children,
  color = '#4ADE40',
  pulseSpeed = 1,
  glowText = true,
  maxBlur = 30,
  display = 'inline-block',
}) => {
  const frame = useCurrentFrame();

  // Create a smooth pulsing value between 0.4 and 1
  // Using two sine waves at different frequencies for organic feel
  const rawPulse =
    Math.sin(frame * 0.08 * pulseSpeed) * 0.6 +
    Math.sin(frame * 0.13 * pulseSpeed) * 0.4;

  const pulseIntensity = interpolate(rawPulse, [-1, 1], [0.4, 1]);

  // Build box-shadow layers with varying blur/spread for a rich neon effect
  const blur1 = maxBlur * 0.4 * pulseIntensity;
  const blur2 = maxBlur * 0.7 * pulseIntensity;
  const blur3 = maxBlur * pulseIntensity;
  const spread1 = 2 * pulseIntensity;
  const spread2 = 4 * pulseIntensity;

  const boxShadow = [
    `0 0 ${blur1}px ${spread1}px ${hexToRgba(color, 0.6 * pulseIntensity)}`,
    `0 0 ${blur2}px ${spread2}px ${hexToRgba(color, 0.3 * pulseIntensity)}`,
    `0 0 ${blur3}px ${spread2 * 1.5}px ${hexToRgba(color, 0.15 * pulseIntensity)}`,
    // Inner glow
    `inset 0 0 ${blur1 * 0.5}px ${spread1 * 0.5}px ${hexToRgba(color, 0.1 * pulseIntensity)}`,
  ].join(', ');

  // Text shadow for child text elements
  const textShadow = glowText
    ? [
        `0 0 ${blur1 * 0.5}px ${hexToRgba(color, 0.8 * pulseIntensity)}`,
        `0 0 ${blur2 * 0.5}px ${hexToRgba(color, 0.5 * pulseIntensity)}`,
        `0 0 ${blur3 * 0.5}px ${hexToRgba(color, 0.2 * pulseIntensity)}`,
      ].join(', ')
    : 'none';

  return (
    <div
      style={{
        display,
        boxShadow,
        textShadow,
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  );
};
