import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: headingFont } = loadFont('normal', {
  weights: ['700'],
  subsets: ['latin'],
});
const { fontFamily: bodyFont } = loadInter('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

const COLORS = {
  primaryGreen: '#4ADE40',
  background: '#0A0F0A',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
};

const BULLETS = [
  'Access to every mini-course we publish',
  'Built into the apps we ship',
  'Will fund builder grants',
];

export const Scene4TokenUtility: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated gradient background
  const gradientX = interpolate(frame, [0, 270], [30, 70], {
    extrapolateRight: 'clamp',
  });
  const gradientY = interpolate(frame, [0, 270], [60, 40], {
    extrapolateRight: 'clamp',
  });

  // Global fade out (frames 240-270)
  const globalOpacity = interpolate(frame, [240, 270], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        overflow: 'hidden',
        opacity: globalOpacity,
      }}
    >
      {/* Animated gradient overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, rgba(74, 222, 64, 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* PHASE 1: Arrow swoop + "$SHIP is the key" title (frames 0-100) */}
      <Sequence from={0} durationInFrames={100} premountFor={fps}>
        <Phase1ArrowAndTitle fps={fps} />
      </Sequence>

      {/* PHASE 2: Bullet points (frames 65-175) */}
      <Sequence from={65} durationInFrames={110} premountFor={fps}>
        <Phase2Bullets fps={fps} />
      </Sequence>

      {/* PHASE 3: "Coordination. Not speculation." (frames 155-270) */}
      <Sequence from={155} durationInFrames={115} premountFor={fps}>
        <Phase3MainMessage fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// PHASE 1: Arrow swoops in, "$SHIP is the key to the system" appears, then both fade
const Phase1ArrowAndTitle: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Arrow swoop from bottom-left
  const swoopProgress = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: 25,
  });
  const arrowX = interpolate(swoopProgress, [0, 1], [-200, width * 0.55]);
  const arrowY = interpolate(swoopProgress, [0, 1], [height + 100, height * 0.22]);
  const rotation = interpolate(swoopProgress, [0, 1], [-45, 0]);

  // Title springs in
  const titleScale = spring({
    fps,
    frame: frame - 10,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: 25,
  });
  const titleOpacity = interpolate(frame, [10, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade everything out (frames 72-95 of this sequence)
  const fadeOut = interpolate(frame, [72, 95], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Arrow */}
      <Img
        src={staticFile('ship-arrow-no-background.png')}
        style={{
          position: 'absolute',
          width: 180,
          height: 'auto',
          left: arrowX,
          top: arrowY,
          transform: `rotate(${rotation}deg)`,
          filter: 'drop-shadow(0 0 20px rgba(74, 222, 64, 0.5))',
        }}
      />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${titleScale})`,
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 100,
            fontWeight: 700,
            color: COLORS.primaryGreen,
            lineHeight: 1.1,
            textShadow: '0 0 40px rgba(74, 222, 64, 0.5), 0 0 80px rgba(74, 222, 64, 0.2)',
          }}
        >
          $SHIP
        </div>
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginTop: 16,
          }}
        >
          is the key to the system
        </div>
      </div>
    </AbsoluteFill>
  );
};

// PHASE 2: Three bullet points fly in staggered, then fade
const Phase2Bullets: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out (frames 85-105 of this sequence)
  const fadeOut = interpolate(frame, [85, 105], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn * fadeOut,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Small header */}
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.primaryGreen,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          $SHIP gives you:
        </div>

        {BULLETS.map((text, i) => {
          const delay = i * 12;
          const slideX = spring({
            fps,
            frame: frame - delay,
            config: { damping: 14, stiffness: 80 },
            durationInFrames: 20,
          });
          const translateX = interpolate(slideX, [0, 1], [300, 0]);
          const opacity = interpolate(slideX, [0, 0.5], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                fontFamily: bodyFont,
                fontSize: 32,
                color: COLORS.textPrimary,
                transform: `translateX(${translateX}px)`,
                opacity,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span
                style={{
                  color: COLORS.primaryGreen,
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                →
              </span>
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// PHASE 3: "Coordination. Not speculation." with highlight wipe
const Phase3MainMessage: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const messageScale = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: 25,
  });

  const messageOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Highlight wipe on "Coordination" — delayed slightly after text appears
  const highlightProgress = spring({
    fps,
    frame,
    config: { damping: 200 },
    delay: 12,
    durationInFrames: 25,
  });
  const highlightScaleX = Math.max(0, Math.min(1, highlightProgress));

  // Pulsing glow on the text
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.3, 0.7],
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: messageOpacity,
      }}
    >
      <div
        style={{
          transform: `scale(${messageScale})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 64,
            fontWeight: 700,
            color: COLORS.textPrimary,
            lineHeight: 1.2,
            textShadow: `0 0 ${30 * glowIntensity}px rgba(74, 222, 64, ${glowIntensity * 0.5})`,
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                left: -10,
                right: -10,
                top: '50%',
                height: '1.15em',
                transform: `translateY(-50%) scaleX(${highlightScaleX})`,
                transformOrigin: 'left center',
                backgroundColor: 'rgba(74, 222, 64, 0.25)',
                borderRadius: 8,
                zIndex: 0,
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>
              Coordination.
            </span>
          </span>{' '}
          Not speculation.
        </div>
      </div>
    </AbsoluteFill>
  );
};
