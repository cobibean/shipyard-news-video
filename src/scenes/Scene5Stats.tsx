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
import type { ShipYardVideoFontSizes } from '../font-size-props';

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

export const Scene5Stats: React.FC<{
  fontSizes: ShipYardVideoFontSizes['scene5'];
}> = ({ fontSizes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Final fade (frames 250-270)
  const finalFade = interpolate(frame, [250, 270], [1, 0.85], {
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
      <Sequence from={0} durationInFrames={270} premountFor={1 * fps}>
        <Header fps={fps} fontSizes={fontSizes} />
      </Sequence>

      {/* Stat cards grid: frames 20-160 */}
      <Sequence from={20} durationInFrames={140} premountFor={1 * fps}>
        <StatGrid fps={fps} fontSizes={fontSizes} />
      </Sequence>

      {/* Whitepaper text: start slightly later so enlarged copy doesn't collide with cards */}
      <Sequence from={136} durationInFrames={74} premountFor={1 * fps}>
        <WhitepaperText fps={fps} fontSizes={fontSizes} />
      </Sequence>

      {/* "We spent it shipping.": frames 195-270 (75 frames = 2.5s) */}
      <Sequence from={195} durationInFrames={75} premountFor={1 * fps}>
        <ShippingText fps={fps} fontSizes={fontSizes} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Header: React.FC<{
  fps: number;
  fontSizes: ShipYardVideoFontSizes['scene5'];
}> = ({ fps, fontSizes }) => {
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

  // Fade out header when grid slides up (global frame 120+)
  const headerOpacity = interpolate(frame, [110, 125], [1, 0], {
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
          fontSize: fontSizes.header,
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
          width: 280,
          height: 4,
          backgroundColor: COLORS.primaryGreen,
          marginTop: 22,
          transform: `scaleX(${Math.max(0, Math.min(1, lineScaleX))})`,
          transformOrigin: 'center',
        }}
      />
    </div>
  );
};

const StatGrid: React.FC<{
  fps: number;
  fontSizes: ShipYardVideoFontSizes['scene5'];
}> = ({ fps, fontSizes }) => {
  const frame = useCurrentFrame();

  // Slide grid up at end of its Sequence (relative frame 100+, global 120+)
  const slideUp = interpolate(frame, [100, 125], [0, -300], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const gridOpacity = interpolate(frame, [100, 125], [1, 0], {
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
        gap: 36,
        opacity: gridOpacity,
      }}
    >
      {STATS.map((stat, i) => {
        const delay = i * 8; // Tighter stagger so last card isn't late

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

        // Slot machine spin: cycles fast through 0-9, decelerates, lands on target
        // Cards all start spinning together but stop in order: TL, TR, BL, BR
        const SPIN_BASE = 40; // Base spin duration (longer spin)
        const SPIN_STAGGER = 10; // Each card stops 10 frames after the previous
        const SPIN_CYCLES = 5;
        const spinStart = 3; // All start spinning at the same time
        const spinDuration = SPIN_BASE + i * SPIN_STAGGER; // 40, 50, 60, 70
        const spinElapsed = Math.max(0, frame - spinStart);
        const spinProgress = Math.min(1, spinElapsed / spinDuration);

        let displayValue: number;
        if (spinProgress >= 1) {
          displayValue = stat.value;
        } else {
          // Cubic ease-out: spins fast at start, decelerates naturally
          const eased = 1 - Math.pow(1 - spinProgress, 3);
          const totalStops = (SPIN_CYCLES + i) * 10 + stat.value;
          const currentStop = Math.floor(eased * totalStops);
          displayValue = currentStop % 10;
        }

        return (
          <div
            key={i}
            style={{
              width: 320,
              height: 210,
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
                fontSize: fontSizes.statValue,
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
                fontSize: fontSizes.statLabel,
                fontWeight: 600,
                color: COLORS.textSecondary,
                marginTop: 10,
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

const WhitepaperText: React.FC<{
  fps: number;
  fontSizes: ShipYardVideoFontSizes['scene5'];
}> = ({ fps, fontSizes }) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 12, 60, 80], [0, 1, 1, 0], {
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
        top: '56%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${translateY}px)`,
        textAlign: 'center',
        opacity: textOpacity,
      }}
    >
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: fontSizes.whitepaper,
          fontWeight: 400,
          color: COLORS.textSecondary,
          whiteSpace: 'nowrap',
          lineHeight: 1.4,
        }}
      >
        Most teams spend 8 days writing a whitepaper.
      </div>
    </div>
  );
};

const ShippingText: React.FC<{
  fps: number;
  fontSizes: ShipYardVideoFontSizes['scene5'];
}> = ({ fps, fontSizes }) => {
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
          fontSize: fontSizes.shipping,
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
              bottom: -8,
              left: 0,
              right: 0,
              height: 6,
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
