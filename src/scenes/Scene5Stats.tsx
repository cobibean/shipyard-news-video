import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
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
  surface: '#141C14',
  borderGreen: '#2A3A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
};

interface StatCard {
  value: number;
  label: string;
}

const STATS: StatCard[] = [
  { value: 8, label: 'DAYS' },
  { value: 1, label: 'APP SHIPPED' },
  { value: 1, label: 'TOKEN LIVE' },
  { value: 1, label: 'BOT BUILT' },
];

export const Scene5Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Final fade (frames 220-240)
  const finalFade = interpolate(frame, [220, 240], [1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        overflow: 'hidden',
        opacity: finalFade,
      }}
    >
      {/* Header: "THE RECEIPTS" */}
      <Sequence from={0} durationInFrames={240} premountFor={1 * fps}>
        <Header fps={fps} />
      </Sequence>

      {/* Stat cards grid: frames 20-180 */}
      <Sequence from={20} durationInFrames={160} premountFor={1 * fps}>
        <StatGrid fps={fps} />
      </Sequence>

      {/* Whitepaper text: frames 140-180 */}
      <Sequence from={140} durationInFrames={40} premountFor={1 * fps}>
        <WhitepaperText fps={fps} />
      </Sequence>

      {/* "We spent it shipping.": frames 180-240 */}
      <Sequence from={180} durationInFrames={60} premountFor={1 * fps}>
        <ShippingText fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // Header slams in with spring
  const headerSpring = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 20,
  });

  const headerY = interpolate(headerSpring, [0, 1], [-80, 0]);
  const headerScale = interpolate(headerSpring, [0, 1], [1.4, 1]);

  // Green line wipe
  const lineScaleX = spring({
    fps,
    frame,
    config: { damping: 20, stiffness: 80 },
    delay: 8,
    durationInFrames: 15,
  });

  // Fade out header when grid slides up (global frame 140+)
  const headerOpacity = interpolate(frame, [130, 145], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: headerOpacity,
      }}
    >
      <div
        style={{
          fontFamily: headingFont,
          fontSize: 48,
          fontWeight: 700,
          color: COLORS.primaryGreen,
          transform: `translateY(${headerY}px) scale(${headerScale})`,
          letterSpacing: 4,
        }}
      >
        THE RECEIPTS
      </div>
      <div
        style={{
          width: 200,
          height: 3,
          backgroundColor: COLORS.primaryGreen,
          marginTop: 16,
          transform: `scaleX(${Math.max(0, Math.min(1, lineScaleX))})`,
          transformOrigin: 'center',
        }}
      />
    </div>
  );
};

const StatGrid: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // Slide grid up at end of its Sequence (relative frame 120+, global 140+)
  const slideUp = interpolate(frame, [120, 140], [0, -300], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const gridOpacity = interpolate(frame, [120, 140], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${slideUp}px)`,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 28,
        opacity: gridOpacity,
      }}
    >
      {STATS.map((stat, i) => {
        const delay = i * 12;

        // Card scale-in spring
        const cardSpring = spring({
          fps,
          frame: frame - delay,
          config: { damping: 14, stiffness: 100 },
          durationInFrames: 20,
        });
        const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);
        const cardOpacity = interpolate(cardSpring, [0, 0.5], [0, 1], {
          extrapolateRight: 'clamp',
        });

        // Number count-up using spring
        const countSpring = spring({
          fps,
          frame: frame - delay - 5,
          config: { damping: 18, stiffness: 60 },
          durationInFrames: 30,
        });
        const displayValue = Math.round(
          interpolate(countSpring, [0, 1], [0, stat.value])
        );

        return (
          <div
            key={i}
            style={{
              width: 260,
              height: 160,
              backgroundColor: COLORS.surface,
              border: `1px solid ${COLORS.borderGreen}`,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${cardScale})`,
              opacity: cardOpacity,
            }}
          >
            <div
              style={{
                fontFamily: headingFont,
                fontSize: 80,
                fontWeight: 700,
                color: COLORS.textPrimary,
                lineHeight: 1,
              }}
            >
              {displayValue}
            </div>
            <div
              style={{
                fontFamily: bodyFont,
                fontSize: 20,
                fontWeight: 600,
                color: COLORS.textSecondary,
                marginTop: 8,
                letterSpacing: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const WhitepaperText: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 12, 30, 40], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textY = spring({
    fps,
    frame,
    config: { damping: 16, stiffness: 80 },
    durationInFrames: 15,
  });
  const translateY = interpolate(textY, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${translateY}px)`,
        textAlign: 'center',
        opacity: textOpacity,
      }}
    >
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 32,
          fontWeight: 400,
          color: COLORS.textSecondary,
          maxWidth: 700,
          lineHeight: 1.4,
        }}
      >
        Most teams spend 8 days writing a whitepaper.
      </div>
    </div>
  );
};

const ShippingText: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // Spring scale in
  const scaleSpring = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: 20,
  });
  const scale = interpolate(scaleSpring, [0, 1], [0.7, 1]);

  const textOpacity = interpolate(scaleSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Green underline wipe beneath "shipping."
  const underlineProgress = spring({
    fps,
    frame,
    config: { damping: 20, stiffness: 60 },
    delay: 12,
    durationInFrames: 20,
  });
  const underlineScaleX = Math.max(0, Math.min(1, underlineProgress));

  // Green glow pulsing
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [8, 20]
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        textAlign: 'center',
        opacity: textOpacity,
      }}
    >
      <div
        style={{
          fontFamily: headingFont,
          fontSize: 52,
          fontWeight: 700,
          color: COLORS.textPrimary,
          textShadow: `0 0 ${glowIntensity}px rgba(74, 222, 64, 0.6)`,
          position: 'relative',
          display: 'inline-block',
        }}
      >
        We spent it{' '}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          shipping.
          <span
            style={{
              position: 'absolute',
              bottom: -6,
              left: 0,
              right: 0,
              height: 4,
              backgroundColor: COLORS.primaryGreen,
              borderRadius: 2,
              transform: `scaleX(${underlineScaleX})`,
              transformOrigin: 'left center',
            }}
          />
        </span>
      </div>
    </div>
  );
};
