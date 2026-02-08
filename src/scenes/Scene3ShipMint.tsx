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

// NFT carousel config
const NFT_COUNT = 10;
const NFT_IMAGES = Array.from(
  { length: NFT_COUNT },
  (_, i) => `nft${i + 1}.png`,
);
const CARD_SIZE = 300;
const CARD_GAP = 32;
const CAROUSEL_TOTAL_WIDTH =
  NFT_COUNT * CARD_SIZE + (NFT_COUNT - 1) * CARD_GAP;

export const Scene3ShipMint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ============================================================
  // PHASE 1: EARLY ELEMENTS (Frames 0-168)
  // ============================================================

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

  // === Fade out early elements before emphasis (Frames 148-163) ===
  const earlyElementsFade = interpolate(frame, [148, 163], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ============================================================
  // PHASE 2: "NOT A MOCKUP" EMPHASIS (Frames 165-265)
  // ============================================================

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

  // Emphasis fade out before URL
  const emphasisFadeOut = interpolate(frame, [250, 265], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ============================================================
  // PHASE 3: URL + NFT CAROUSEL (Frames 260-470)
  // ============================================================

  // "shipmint.art" URL — springs in at 262
  const urlSpring = spring({
    frame: Math.max(0, frame - 262),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.6 },
  });

  const urlOpacity = interpolate(urlSpring, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Neon underline wipe
  const underlineWipe = spring({
    frame: Math.max(0, frame - 270),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });

  // URL + carousel fade out — starts just before scene fade
  const urlCarouselFade = interpolate(frame, [388, 412], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // NFT Carousel — continuous scroll right-to-left, 25% faster (frames 295-423)
  const carouselX = interpolate(
    frame,
    [295, 423],
    [width + 40, -(CAROUSEL_TOTAL_WIDTH + 40)],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Carousel fade in
  const carouselFadeIn = interpolate(frame, [295, 308], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ============================================================
  // SCENE FADE OUT — blends into next scene starting at frame 392
  // ============================================================

  const fadeOut = interpolate(frame, [392, 420], [1, 0], {
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
      {/* ===== PHASE 1: Early elements ===== */}

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

      {/* ===== PHASE 2: "Not a mockup" Emphasis ===== */}

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

      {/* ===== PHASE 3: URL + NFT Carousel ===== */}

      {/* "shipmint.art" URL — 50% bigger, positioned at top */}
      <Sequence from={260} premountFor={1 * fps}>
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            opacity: urlOpacity * urlCarouselFade,
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
                fontSize: 60,
                color: COLORS.neonGreen,
                letterSpacing: '2px',
                textShadow: `0 0 30px rgba(0, 255, 102, 0.6), 0 0 60px rgba(0, 255, 102, 0.2)`,
              }}
            >
              shipmint.art
            </div>
            {/* Neon green underline wipe */}
            <div
              style={{
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '100%',
                height: 4,
                backgroundColor: COLORS.neonGreen,
                transform: `scaleX(${underlineWipe})`,
                transformOrigin: 'left center',
                boxShadow: `0 0 12px ${COLORS.neonGreen}, 0 0 24px rgba(0, 255, 102, 0.5)`,
              }}
            />
          </div>
        </div>
      </Sequence>

      {/* NFT Carousel — organic right-to-left glide (Frames 295-465) */}
      <Sequence from={290} premountFor={1 * fps}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            opacity: carouselFadeIn * urlCarouselFade,
          }}
        >
          {NFT_IMAGES.map((img, i) => {
            const cardBaseX = carouselX + i * (CARD_SIZE + CARD_GAP);

            // Only render cards near visible range for performance
            if (cardBaseX < -CARD_SIZE - 80 || cardBaseX > width + 80) {
              return null;
            }

            // Organic vertical bobbing — dual-sine for natural feel
            const yBob =
              Math.sin(frame * 0.045 + i * 1.1) * 14 +
              Math.sin(frame * 0.025 + i * 2.3) * 6;

            // Subtle per-card tilt with gentle dynamic wobble
            const tilt =
              Math.sin(i * 2.1 + 0.3) * 2.2 +
              Math.sin(frame * 0.03 + i * 1.4) * 0.5;

            // Focus scale — cards near screen center appear larger (depth effect)
            const cardCenterX = cardBaseX + CARD_SIZE / 2;
            const screenCenter = width / 2;
            const distFromCenter = Math.abs(cardCenterX - screenCenter);
            const focusScale = interpolate(
              distFromCenter,
              [0, width / 2 + 200],
              [1.1, 0.88],
              { extrapolateRight: 'clamp' },
            );

            // Green glow pulse — unique phase per card
            const glowIntensity = interpolate(
              Math.sin(frame * 0.07 + i * 0.8),
              [-1, 1],
              [0.12, 0.38],
            );

            // Vertical center position
            const cardY = height / 2 - CARD_SIZE / 2 + 30;

            return (
              <div
                key={`nft-${i}`}
                style={{
                  position: 'absolute',
                  left: cardBaseX,
                  top: cardY + yBob,
                  width: CARD_SIZE,
                  height: CARD_SIZE,
                  transform: `rotate(${tilt}deg) scale(${focusScale})`,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `2px solid rgba(74, 222, 64, ${glowIntensity})`,
                  boxShadow: [
                    `0 0 ${18 * glowIntensity}px rgba(74, 222, 64, ${glowIntensity * 0.5})`,
                    `0 14px 40px rgba(0, 0, 0, 0.55)`,
                    `inset 0 0 0 1px rgba(255, 255, 255, 0.06)`,
                  ].join(', '),
                }}
              >
                <Img
                  src={staticFile(img)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            );
          })}
        </div>
      </Sequence>

    </AbsoluteFill>
  );
};
