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

      {/* Stacked layout: Arrow + Titles + Bullets (frames 0-160) */}
      <Sequence from={0} durationInFrames={170} premountFor={fps}>
        <StackedContent fps={fps} />
      </Sequence>

      {/* "Coordination. Not speculation." (frames 160-270) */}
      <Sequence from={160} durationInFrames={110} premountFor={fps}>
        <ClosingMessage fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Unified stacked layout: Arrow → $SHIP → subtitle → section header → bullets
const StackedContent: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // === Arrow springs in from left (frames 0-15) ===
  const arrowSpring = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 20,
  });
  const arrowX = interpolate(arrowSpring, [0, 1], [-120, 0]);
  const arrowOpacity = interpolate(arrowSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const arrowRotation = interpolate(arrowSpring, [0, 1], [-30, 0]);

  // === "$SHIP" H1 springs in (frames 5-20) ===
  const h1Spring = spring({
    fps,
    frame: frame - 5,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });
  const h1Scale = interpolate(h1Spring, [0, 1], [0.6, 1]);
  const h1Opacity = interpolate(h1Spring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // === "is the key to the system" H2 fades in (frames 14-24) ===
  const h2Spring = spring({
    fps,
    frame: frame - 14,
    config: { damping: 16, stiffness: 100 },
    durationInFrames: 18,
  });
  const h2Opacity = interpolate(h2Spring, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const h2Y = interpolate(h2Spring, [0, 1], [15, 0]);

  // === "$SHIP gives you:" H3 fades in (frames 24-34) ===
  const h3Spring = spring({
    fps,
    frame: frame - 24,
    config: { damping: 16, stiffness: 100 },
    durationInFrames: 18,
  });
  const h3Opacity = interpolate(h3Spring, [0, 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // === Fade everything out (frames 140-160) ===
  const contentFade = interpolate(frame, [140, 160], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: contentFade,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Arrow */}
        <div
          style={{
            transform: `translateX(${arrowX}px) rotate(${arrowRotation}deg)`,
            opacity: arrowOpacity,
            marginBottom: 12,
          }}
        >
          <Img
            src={staticFile('ship-arrow-no-background.png')}
            style={{
              width: 140,
              height: 'auto',
              filter: 'drop-shadow(0 0 16px rgba(74, 222, 64, 0.5))',
            }}
          />
        </div>

        {/* H1: $SHIP */}
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 88,
            fontWeight: 700,
            color: COLORS.primaryGreen,
            lineHeight: 1.1,
            textShadow:
              '0 0 40px rgba(74, 222, 64, 0.5), 0 0 80px rgba(74, 222, 64, 0.2)',
            transform: `scale(${h1Scale})`,
            opacity: h1Opacity,
            textAlign: 'center',
          }}
        >
          $SHIP
        </div>

        {/* H2: is the key to the system */}
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginTop: 6,
            opacity: h2Opacity,
            transform: `translateY(${h2Y}px)`,
            textAlign: 'center',
          }}
        >
          is the key to the system
        </div>

        {/* Divider line */}
        <div
          style={{
            width: 80,
            height: 2,
            backgroundColor: COLORS.primaryGreen,
            marginTop: 28,
            marginBottom: 28,
            opacity: h3Opacity,
            boxShadow: '0 0 8px rgba(74, 222, 64, 0.4)',
          }}
        />

        {/* H3: $SHIP gives you: */}
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.primaryGreen,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 20,
            opacity: h3Opacity,
            textAlign: 'center',
          }}
        >
          $SHIP gives you:
        </div>

        {/* Bullet points — stagger in */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {BULLETS.map((text, i) => {
            const bulletDelay = 32 + i * 10;
            const slideX = spring({
              fps,
              frame: frame - bulletDelay,
              config: { damping: 14, stiffness: 80 },
              durationInFrames: 20,
            });
            const translateX = interpolate(slideX, [0, 1], [200, 0]);
            const opacity = interpolate(slideX, [0, 0.5], [0, 1], {
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={i}
                style={{
                  fontFamily: bodyFont,
                  fontSize: 28,
                  color: COLORS.textPrimary,
                  transform: `translateX(${translateX}px)`,
                  opacity,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span
                  style={{
                    color: COLORS.primaryGreen,
                    fontSize: 24,
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
      </div>
    </AbsoluteFill>
  );
};

// Closing message: "Coordination. Not speculation." with highlight wipe
const ClosingMessage: React.FC<{ fps: number }> = ({ fps }) => {
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
