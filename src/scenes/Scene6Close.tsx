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
  neonGreen: '#00FF66',
};

export const Scene6Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade to black over last 30 frames (300-330)
  const finalFade = interpolate(frame, [300, 330], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Green vignette that remains
  const vignetteOpacity = interpolate(frame, [260, 300, 320, 330], [0, 0.15, 0.15, 0.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill style={{ opacity: finalFade }}>
        {/* Polly intro: frames 0-125 */}
        <Sequence from={0} durationInFrames={125} premountFor={1 * fps}>
          <PollyIntro fps={fps} />
        </Sequence>

        {/* Two columns (Muscle / Brain): frames 55-165 */}
        <Sequence from={55} durationInFrames={110} premountFor={1 * fps}>
          <TwoColumns fps={fps} />
        </Sequence>

        {/* "We ship every week." + "Follow the process or join it.": frames 110-240 */}
        <Sequence from={110} durationInFrames={130} premountFor={1 * fps}>
          <WeShipText fps={fps} />
        </Sequence>

        {/* Logos + URLs: frames 190-330 */}
        <Sequence from={190} durationInFrames={140} premountFor={1 * fps}>
          <LogosAndLinks fps={fps} />
        </Sequence>
      </AbsoluteFill>

      {/* Green vignette overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(74, 222, 64, ${vignetteOpacity}) 100%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

const PollyIntro: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // "NOW BUILDING:" springs in
  const nowBuildingSpring = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 100 },
    durationInFrames: 20,
  });
  const nowBuildingOpacity = interpolate(nowBuildingSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const nowBuildingY = interpolate(nowBuildingSpring, [0, 1], [30, 0]);

  // "POLLY" slams in with bounce spring
  const pollySpring = spring({
    fps,
    frame,
    config: { damping: 10, stiffness: 120 },
    delay: 10,
    durationInFrames: 20,
  });
  const pollyScale = interpolate(pollySpring, [0, 1], [0.3, 1]);
  const pollyOpacity = interpolate(pollySpring, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Subtitle fades in: frames 25-38 relative (appears sooner)
  const subtitleOpacity = interpolate(frame, [25, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade everything out at end of this Sequence
  const sectionFade = interpolate(frame, [90, 115], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: headingFont,
          fontSize: 36,
          fontWeight: 700,
          color: COLORS.primaryGreen,
          letterSpacing: 4,
          transform: `translateY(${nowBuildingY}px)`,
          opacity: nowBuildingOpacity,
        }}
      >
        NOW BUILDING:
      </div>
      <div
        style={{
          fontFamily: headingFont,
          fontSize: 90,
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginTop: 8,
          transform: `scale(${pollyScale})`,
          opacity: pollyOpacity,
        }}
      >
        POLLY
      </div>
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.textSecondary,
          marginTop: 16,
          opacity: subtitleOpacity,
        }}
      >
        A Polymarket trading bot
      </div>
    </div>
  );
};

const TwoColumns: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // Left column slides in from left
  const leftSpring = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: 25,
  });
  const leftX = interpolate(leftSpring, [0, 1], [-200, 0]);
  const leftOpacity = interpolate(leftSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Right column slides in from right
  const rightSpring = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80 },
    delay: 8,
    durationInFrames: 25,
  });
  const rightX = interpolate(rightSpring, [0, 1], [200, 0]);
  const rightOpacity = interpolate(rightSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade out at end of Sequence (relative frame ~80-100 = global 135-155)
  const sectionFade = interpolate(frame, [80, 100], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 80,
        opacity: sectionFade,
      }}
    >
      {/* LEFT: The Muscle */}
      <div
        style={{
          transform: `translateX(${leftX}px)`,
          opacity: leftOpacity,
          borderLeft: `4px solid ${COLORS.primaryGreen}`,
          paddingLeft: 20,
          maxWidth: 340,
        }}
      >
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.primaryGreen,
            marginBottom: 10,
          }}
        >
          THE MUSCLE
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.textPrimary,
            lineHeight: 1.4,
          }}
        >
          Deterministic data pipeline + backtesting
        </div>
      </div>

      {/* RIGHT: The Brain */}
      <div
        style={{
          transform: `translateX(${rightX}px)`,
          opacity: rightOpacity,
          borderLeft: `4px solid ${COLORS.primaryGreen}`,
          paddingLeft: 20,
          maxWidth: 340,
        }}
      >
        <div
          style={{
            fontFamily: headingFont,
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.primaryGreen,
            marginBottom: 10,
          }}
        >
          THE BRAIN
        </div>
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.textPrimary,
            lineHeight: 1.4,
          }}
        >
          Reasoning engine, always on, learning
        </div>
      </div>
    </div>
  );
};

const WeShipText: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // "We ship every week." springs in with scale
  const mainSpring = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 100 },
    durationInFrames: 20,
  });
  const mainScale = interpolate(mainSpring, [0, 1], [0.6, 1]);
  const mainOpacity = interpolate(mainSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Green glow pulsing
  const glowIntensity = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [8, 24]
  );

  // "Follow the process or join it." fades in
  // Relative frame 40 = global frame 150
  const subTextOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out the whole section at end (relative 110-130 = global 220-240)
  const sectionFade = interpolate(frame, [110, 130], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '38%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          fontFamily: headingFont,
          fontSize: 64,
          fontWeight: 700,
          color: COLORS.textPrimary,
          transform: `scale(${mainScale})`,
          opacity: mainOpacity,
          textShadow: `0 0 ${glowIntensity}px rgba(74, 222, 64, 0.5)`,
        }}
      >
        We ship every week.
      </div>
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 32,
          fontWeight: 400,
          color: COLORS.textSecondary,
          marginTop: 24,
          opacity: subTextOpacity,
        }}
      >
        Follow the process or join it.
      </div>
    </div>
  );
};

const LogosAndLinks: React.FC<{ fps: number }> = ({ fps }) => {
  const frame = useCurrentFrame();

  // SHIP logo springs in from below
  const shipLogoSpring = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: 25,
  });
  const shipLogoY = interpolate(shipLogoSpring, [0, 1], [50, 0]);
  const shipLogoOpacity = interpolate(shipLogoSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // W3M logo springs in from below (slightly delayed)
  const w3mLogoSpring = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80 },
    delay: 8,
    durationInFrames: 25,
  });
  const w3mLogoY = interpolate(w3mLogoSpring, [0, 1], [50, 0]);
  const w3mLogoOpacity = interpolate(w3mLogoSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // URL text fades in
  const urlOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle scale up for confident ending
  const endScale = interpolate(frame, [0, 30, 130], [0.95, 1, 1.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${endScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 36,
      }}
    >
      {/* Logo row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 60,
        }}
      >
        <Img
          src={staticFile('ship-logo-no-background.png')}
          style={{
            width: 280,
            height: 'auto',
            transform: `translateY(${shipLogoY}px)`,
            opacity: shipLogoOpacity,
            filter: 'drop-shadow(0 0 20px rgba(74, 222, 64, 0.3))',
          }}
        />
        <Img
          src={staticFile('W3M-logo-no-background.png')}
          style={{
            width: 110,
            height: 'auto',
            transform: `translateY(${w3mLogoY}px)`,
            opacity: w3mLogoOpacity,
          }}
        />
      </div>

      {/* URL text */}
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.primaryGreen,
          opacity: urlOpacity,
          letterSpacing: 2,
          textShadow: `0 0 12px rgba(0, 255, 102, 0.4)`,
        }}
      >
        web3matters.xyz | shipmint.art
      </div>
    </div>
  );
};
