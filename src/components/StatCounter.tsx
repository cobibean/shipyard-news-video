import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

/**
 * StatCounter - An animated number counter that counts from 0 to a target.
 *
 * Uses spring() for smooth easing from 0 to the target number.
 * Displays the number in bold white text with optional prefix/suffix.
 */

interface StatCounterProps {
  /** The target number to count up to */
  target: number;
  /** Frame at which counting begins. Default 0 */
  startFrame?: number;
  /** Number of frames over which the spring resolves. Default 60 */
  durationInFrames?: number;
  /** Prefix displayed before the number (e.g. "$"). Default '' */
  prefix?: string;
  /** Suffix displayed after the number (e.g. "+"). Default '' */
  suffix?: string;
  /** Font size in px. Default 80 */
  fontSize?: number;
  /** Number of decimal places. Default 0 */
  decimals?: number;
  /** Text color. Default white */
  color?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  target,
  startFrame = 0,
  durationInFrames = 60,
  prefix = '',
  suffix = '',
  fontSize = 80,
  decimals = 0,
  color = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Delay the spring until startFrame, then animate over durationInFrames
  const delayedFrame = Math.max(0, frame - startFrame);

  const springValue = spring({
    frame: delayedFrame,
    fps,
    config: {
      damping: 30,
      stiffness: 80,
      mass: 1,
    },
    durationInFrames,
  });

  // Current displayed number
  const currentNumber = interpolate(springValue, [0, 1], [0, target]);

  // Format the number
  const formattedNumber =
    decimals > 0
      ? currentNumber.toFixed(decimals)
      : Math.round(currentNumber).toLocaleString();

  // Slight scale pop at the start of animation
  const scale = interpolate(
    springValue,
    [0, 0.3, 1],
    [0.8, 1.05, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Opacity: invisible before startFrame, then fade in
  const opacity = frame < startFrame ? 0 : interpolate(
    springValue,
    [0, 0.15],
    [0, 1],
    { extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {prefix && (
        <span
          style={{
            fontFamily: 'monospace, sans-serif',
            fontSize: fontSize * 0.6,
            fontWeight: 700,
            color,
            marginRight: 4,
          }}
        >
          {prefix}
        </span>
      )}
      <span
        style={{
          fontFamily: 'monospace, sans-serif',
          fontSize,
          fontWeight: 900,
          color,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formattedNumber}
      </span>
      {suffix && (
        <span
          style={{
            fontFamily: 'monospace, sans-serif',
            fontSize: fontSize * 0.6,
            fontWeight: 700,
            color,
            marginLeft: 4,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};
