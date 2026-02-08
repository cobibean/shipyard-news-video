import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
} from 'remotion';
import { Video } from '@remotion/media';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { COLORS } from '../constants';

const { fontFamily: headingFont } = loadFont('normal', {
  weights: ['700'],
  subsets: ['latin'],
});
const { fontFamily: bodyFont } = loadInter('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

export const Scene3ShipMint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === "DAY 1" text (Frames 0-30) ===
  const day1Spring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.7 },
  });

  const day1Scale = interpolate(day1Spring, [0, 1], [0.3, 1]);
  const day1Opacity = interpolate(day1Spring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const day1SubSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
  });

  const day1SubOpacity = interpolate(day1SubSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // === Laptop mockup (Frames 20-60): slides in from right ===
  const laptopSlide = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });

  const laptopTranslateX = interpolate(laptopSlide, [0, 1], [300, 0]);
  const laptopOpacity = interpolate(laptopSlide, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // === Stream clip window (Frames 30-50) ===
  const streamSlide = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const streamOpacity = interpolate(streamSlide, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const streamScale = interpolate(streamSlide, [0, 1], [0.6, 1]);

  // === Typewriter text (Frames 60-120) ===
  const line1 = 'ShipMint \u2014 use AI to generate images';
  const line2 = 'and mint them as 1/1 NFTs on Solana';

  const line1Progress = interpolate(frame, [60, 90], [0, line1.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line2Progress = interpolate(frame, [92, 118], [0, line2.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const displayedLine1 = line1.slice(0, Math.floor(line1Progress));
  const displayedLine2 = line2.slice(0, Math.floor(line2Progress));
  const cursorOnLine1 = frame >= 60 && frame < 92;
  const cursorOnLine2 = frame >= 92 && frame < 120;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;

  // === Fade out early elements before emphasis (Frames 150-168) ===
  // Typewriter finishes at frame 118 → 32 frames (1s+) read time before fade starts
  const earlyElementsFade = interpolate(frame, [150, 168], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === "Not a mockup" emphasis (Frames 165-215) ===
  const emphasisFlash = frame >= 165 && frame <= 170
    ? interpolate(frame, [165, 167, 170], [0, 1, 0.7], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const emphasis1Spring = spring({
    frame: Math.max(0, frame - 167),
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.6 },
  });

  const emphasis1Opacity = interpolate(emphasis1Spring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // "A working product." in green with spring scale
  const workingSpring = spring({
    frame: Math.max(0, frame - 182),
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.7 },
  });

  const workingScale = interpolate(workingSpring, [0, 1], [0.5, 1]);
  const workingOpacity = interpolate(workingSpring, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // === Emphasis fade out before URL (Frames 200-215) ===
  const emphasisFadeOut = interpolate(frame, [200, 215], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === "shipmint.art" URL (Frames 210-255) ===
  const urlSpring = spring({
    frame: Math.max(0, frame - 212),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
  });

  const urlOpacity = interpolate(urlSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Neon underline wipe
  const underlineWipe = spring({
    frame: Math.max(0, frame - 220),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });

  // === Fade out (Frames 255-285) ===
  const fadeOut = interpolate(frame, [255, 285], [1, 0], {
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
      {/* Flash overlay for emphasis */}
      {emphasisFlash > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(74, 222, 64, ${emphasisFlash * 0.15})`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* DAY 1 header - top left */}
      <Sequence from={0} premountFor={1 * fps}>
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 80,
            transform: `scale(${day1Scale})`,
            opacity: day1Opacity * earlyElementsFade,
            transformOrigin: 'left top',
          }}
        >
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 80,
              color: COLORS.primaryGreen,
              letterSpacing: '-2px',
              lineHeight: 1,
              textShadow: `0 0 30px rgba(74, 222, 64, 0.5)`,
            }}
          >
            DAY 1
          </div>
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 28,
              color: COLORS.textPrimary,
              marginTop: 8,
              opacity: day1SubOpacity,
            }}
          >
            Shipped the first app
          </div>
        </div>
      </Sequence>

      {/* Laptop mockup - right half */}
      <Sequence from={20} premountFor={1 * fps}>
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: '50%',
            transform: `translateY(-50%) translateX(${laptopTranslateX}px)`,
            opacity: laptopOpacity * earlyElementsFade,
            perspective: 1000,
          }}
        >
          <div
            style={{
              transform: 'rotateY(-5deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Monitor bezel */}
            <div
              style={{
                width: 750,
                height: 470,
                backgroundColor: '#1A1A2E',
                borderRadius: 16,
                padding: 16,
                boxShadow: `0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(74, 222, 64, 0.1)`,
              }}
            >
              {/* Screen inner area */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#0D0D1A',
                }}
              >
                <Img
                  src={staticFile('shipmint-ui-screenshot.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>
            {/* Monitor stand */}
            <div
              style={{
                width: 120,
                height: 30,
                backgroundColor: '#1A1A2E',
                margin: '0 auto',
                borderRadius: '0 0 8px 8px',
              }}
            />
            <div
              style={{
                width: 200,
                height: 8,
                backgroundColor: '#1A1A2E',
                margin: '0 auto',
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </Sequence>

      {/* Stream clip window - left side */}
      <Sequence from={30} premountFor={1 * fps}>
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 220,
            opacity: streamOpacity * earlyElementsFade,
            transform: `scale(${streamScale})`,
            transformOrigin: 'left top',
          }}
        >
          <div
            style={{
              width: 250,
              height: 250,
              borderRadius: 12,
              border: `3px solid ${COLORS.primaryGreen}`,
              overflow: 'hidden',
              boxShadow: `0 0 20px rgba(74, 222, 64, 0.3), 0 10px 30px rgba(0, 0, 0, 0.5)`,
            }}
          >
            <Video
              src={staticFile('fake-stream-cobi-clip.mp4')}
              muted
              loop
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          {/* Live indicator */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: 'rgba(255, 0, 0, 0.85)',
              color: '#FFFFFF',
              fontFamily: bodyFont,
              fontWeight: 600,
              fontSize: 12,
              padding: '3px 8px',
              borderRadius: 4,
              letterSpacing: '1px',
            }}
          >
            LIVE
          </div>
        </div>
      </Sequence>

      {/* Typewriter description text (Frames 60-120) */}
      <Sequence from={60} premountFor={1 * fps}>
        <div
          style={{
            position: 'absolute',
            left: 80,
            bottom: 220,
            maxWidth: 600,
            opacity: earlyElementsFade,
          }}
        >
          <div
            style={{
              fontFamily: bodyFont,
              fontWeight: 400,
              fontSize: 28,
              color: COLORS.textPrimary,
              lineHeight: 1.6,
            }}
          >
            <div>
              {displayedLine1}
              {cursorOnLine1 && (
                <span
                  style={{
                    opacity: cursorBlink ? 1 : 0,
                    color: COLORS.primaryGreen,
                    fontWeight: 600,
                  }}
                >
                  |
                </span>
              )}
            </div>
            {frame >= 92 && (
              <div>
                {displayedLine2}
                {cursorOnLine2 && (
                  <span
                    style={{
                      opacity: cursorBlink ? 1 : 0,
                      color: COLORS.primaryGreen,
                      fontWeight: 600,
                    }}
                  >
                    |
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Sequence>

      {/* "Not a mockup" emphasis section (Frames 165-215) */}
      <Sequence from={165} premountFor={1 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: emphasisFadeOut,
          }}
        >
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 36,
              color: COLORS.textSecondary,
              opacity: emphasis1Opacity,
              textAlign: 'center',
              letterSpacing: '-0.5px',
            }}
          >
            Not a mockup. Not a waitlist.
          </div>
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 56,
              color: COLORS.primaryGreen,
              marginTop: 16,
              transform: `scale(${workingScale})`,
              opacity: workingOpacity,
              textAlign: 'center',
              textShadow: `0 0 30px rgba(74, 222, 64, 0.5)`,
            }}
          >
            A working product.
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* "shipmint.art" URL (Frames 210-255) */}
      <Sequence from={210} premountFor={1 * fps}>
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: urlOpacity,
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <div
              style={{
                fontFamily: headingFont,
                fontWeight: 700,
                fontSize: 40,
                color: COLORS.neonGreen,
                letterSpacing: '1px',
                textShadow: `0 0 20px rgba(0, 255, 102, 0.5)`,
              }}
            >
              shipmint.art
            </div>
            {/* Neon green underline wipe */}
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                left: 0,
                width: '100%',
                height: 3,
                backgroundColor: COLORS.neonGreen,
                transform: `scaleX(${underlineWipe})`,
                transformOrigin: 'left center',
                boxShadow: `0 0 10px ${COLORS.neonGreen}, 0 0 20px rgba(0, 255, 102, 0.4)`,
              }}
            />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
