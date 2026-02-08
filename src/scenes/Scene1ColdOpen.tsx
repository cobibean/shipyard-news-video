import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Sequence,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { COLORS } from '../constants';
import type { ShipYardVideoFontSizes } from '../font-size-props';

const { fontFamily: headingFont } = loadFont('normal', {
  weights: ['700'],
  subsets: ['latin'],
});
const { fontFamily: bodyFont } = loadInter('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

// Deterministic pseudo-random number generator
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Generate particle positions once (deterministic based on index)
function getParticles(count: number, width: number, height: number) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: seededRandom(i * 31 + 7) * width,
      y: seededRandom(i * 47 + 13) * height,
      size: seededRandom(i * 59 + 19) * 4 + 2,
      phaseOffset: seededRandom(i * 71 + 23) * Math.PI * 2,
      speed: seededRandom(i * 83 + 29) * 0.08 + 0.03,
    });
  }
  return particles;
}

export const Scene1ColdOpen: React.FC<{
  fontSizes: ShipYardVideoFontSizes['scene1'];
}> = ({ fontSizes }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const particles = React.useMemo(
    () => getParticles(18, width, height),
    [width, height],
  );

  // === Scanlines (Frames 0-15) ===
  const scanlineOpacity = interpolate(frame, [0, 15], [0, 0.15], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // === Glitch bars (Frames 15-25) ===
  const glitchActive = frame >= 15 && frame <= 25;

  // === "8 DAYS AGO..." text spring (Frames 25-45) ===
  const titleY = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });

  const titleScale = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.6 },
  });

  // Scale overshoot: goes to 1.05 then settles to 1.0
  const scaleValue = interpolate(titleScale, [0, 1], [0.8, 1.0]);
  const overshoot = frame >= 25 && frame <= 40
    ? interpolate(
        spring({
          frame: Math.max(0, frame - 28),
          fps,
          config: { damping: 6, stiffness: 400, mass: 0.4 },
        }),
        [0, 1],
        [1.05, 1.0],
      )
    : 1.0;

  const finalScale = scaleValue * overshoot;

  const titleTranslateY = interpolate(titleY, [0, 1], [-60, 0]);
  const titleOpacity = interpolate(titleY, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // === Typewriter effect (Frames 45-90) ===
  const subtitleText = 'we launched ShipYard on Pump.fun';
  const typewriterProgress = interpolate(frame, [45, 85], [0, subtitleText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayedText = subtitleText.slice(0, Math.floor(typewriterProgress));
  const cursorVisible = frame >= 45 && Math.floor(frame / 8) % 2 === 0;

  // === Fade out (Frames 120-135) ===
  const fadeOut = interpolate(frame, [120, 135], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        opacity: fadeOut,
      }}
    >
      {/* Radial gradient background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${COLORS.surface} 0%, ${COLORS.background} 70%)`,
        }}
      />

      {/* Floating green particles */}
      {particles.map((p, i) => {
        const pulsing = interpolate(
          Math.sin(frame * p.speed + p.phaseOffset),
          [-1, 1],
          [0.05, 0.4],
        );
        const driftY = Math.sin(frame * 0.02 + p.phaseOffset) * 15;
        const driftX = Math.cos(frame * 0.015 + p.phaseOffset * 0.7) * 10;

        return (
          <div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              left: p.x + driftX,
              top: p.y + driftY,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: COLORS.primaryGreen,
              opacity: pulsing,
              boxShadow: `0 0 ${p.size * 2}px ${COLORS.primaryGreen}`,
            }}
          />
        );
      })}

      {/* Scanlines overlay */}
      <AbsoluteFill style={{ opacity: scanlineOpacity, pointerEvents: 'none' }}>
        {Array.from({ length: Math.floor(height / 4) }).map((_, i) => (
          <div
            key={`scanline-${i}`}
            style={{
              position: 'absolute',
              top: i * 4,
              left: 0,
              width: '100%',
              height: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Glitch bars (Frames 15-25) */}
      {glitchActive && (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const seed = frame * 17 + i * 53;
            const barY = seededRandom(seed) * height;
            const barH = seededRandom(seed + 1) * 12 + 2;
            const barOpacity = seededRandom(seed + 2) * 0.6 + 0.1;
            const barOffset = (seededRandom(seed + 3) - 0.5) * 100;
            const isLime = seededRandom(seed + 4) > 0.5;

            return (
              <div
                key={`glitch-bar-${i}`}
                style={{
                  position: 'absolute',
                  top: barY,
                  left: barOffset,
                  width: '100%',
                  height: barH,
                  backgroundColor: isLime
                    ? `rgba(184, 255, 0, ${barOpacity})`
                    : `rgba(74, 222, 64, ${barOpacity})`,
                  mixBlendMode: 'screen',
                }}
              />
            );
          })}
        </AbsoluteFill>
      )}

      {/* Main content container */}
      <Sequence from={25} premountFor={1 * fps}>
        {/* "8 DAYS AGO..." — absolutely positioned so subtitle has no layout effect */}
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              transform: `translateY(${titleTranslateY}px) scale(${finalScale})`,
              opacity: titleOpacity,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: headingFont,
                fontWeight: 700,
                fontSize: fontSizes.title,
                color: COLORS.textPrimary,
                letterSpacing: '-2px',
                textShadow: `0 0 40px ${COLORS.primaryGreen}, 0 0 80px rgba(74, 222, 64, 0.38)`,
                lineHeight: 1.1,
              }}
            >
              8 DAYS AGO...
            </div>
          </div>
        </AbsoluteFill>

        {/* Typewriter subtitle — separate layer, positioned below the title */}
        {frame >= 45 && (
          <AbsoluteFill
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                marginTop: 290,
                fontFamily: bodyFont,
                fontWeight: 400,
                fontSize: fontSizes.subtitle,
                color: COLORS.textSecondary,
                letterSpacing: '0.5px',
                textAlign: 'center',
              }}
            >
              {displayedText}
              <span
                style={{
                  opacity: cursorVisible ? 1 : 0,
                  color: COLORS.primaryGreen,
                  fontWeight: 600,
                }}
              >
                |
              </span>
            </div>
          </AbsoluteFill>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
