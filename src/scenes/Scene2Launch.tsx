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

const punchlines = ['No roadmap.', 'No pitch deck.', "No 'coming soon.'"];

export const Scene2Launch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === SHIP Logo (Frames 0-30): scale in with bouncy spring ===
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.8 },
  });

  const logoOpacity = interpolate(logoScale, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Logo fade out around frame 88-98
  const logoFadeOut = interpolate(frame, [88, 98], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === Punchlines (Frames 25-90): stagger spring in from left ===
  const punchlineData = punchlines.map((text, i) => {
    const startFrame = 25 + i * 12; // Tighter stagger: 25, 37, 49
    const prog = spring({
      frame: Math.max(0, frame - startFrame),
      fps,
      config: { damping: 14, stiffness: 200, mass: 0.6 },
    });

    const translateX = interpolate(prog, [0, 1], [-50, 0]);
    const opacity = interpolate(prog, [0, 0.4], [0, 1], {
      extrapolateRight: 'clamp',
    });

    // Fade out at frame 88-98 (gives last punchline ~39 frames / 1.3s of hold)
    const fadeOut = interpolate(frame, [88, 98], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return { text, translateX, opacity: opacity * fadeOut };
  });

  // === "Just a team that said" + highlight section (Frames 95-155) ===
  const introTextProgress = spring({
    frame: Math.max(0, frame - 100),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const introTextOpacity = interpolate(introTextProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const quoteProgress = spring({
    frame: Math.max(0, frame - 110),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const quoteOpacity = interpolate(quoteProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Highlight wipe effect on "build in public" using scaleX
  const highlightWipe = spring({
    frame: Math.max(0, frame - 118),
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.8 },
  });

  // Phase 2 visibility
  const phase2Visible = frame >= 95;
  const phase2FadeOut = interpolate(frame, [152, 168], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === Final transition (Frames 155-180) ===
  const exitScale = interpolate(frame, [155, 175], [1, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(frame, [168, 180], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        opacity: exitOpacity,
      }}
    >
      {/* Phase 1: Logo + Punchlines (Frames 0-80) */}
      <Sequence from={0} premountFor={1 * fps}>
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${exitScale})`,
          }}
        >
          {/* SHIP Logo */}
          <div
            style={{
              transform: `scale(${logoScale})`,
              opacity: logoOpacity * logoFadeOut,
              marginBottom: 40,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Img
              src={staticFile('ship-logo-no-background.png')}
              style={{
                width: 400,
                height: 'auto',
                filter: `drop-shadow(0 0 30px ${COLORS.primaryGreen}) drop-shadow(0 0 60px rgba(74, 222, 64, 0.3))`,
              }}
            />
          </div>

          {/* Punchlines */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {punchlineData.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: headingFont,
                  fontWeight: 700,
                  fontSize: 42,
                  color: COLORS.textPrimary,
                  transform: `translateX(${line.translateX}px)`,
                  opacity: line.opacity,
                  letterSpacing: '-0.5px',
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Phase 2: "Just a team that said" + highlight quote (Frames 95-155) */}
      {phase2Visible && (
        <Sequence from={95} premountFor={1 * fps}>
          <AbsoluteFill
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: phase2FadeOut,
              transform: `scale(${exitScale})`,
            }}
          >
            {/* "Just a team that said" */}
            <div
              style={{
                fontFamily: bodyFont,
                fontWeight: 400,
                fontSize: 28,
                color: COLORS.textSecondary,
                opacity: introTextOpacity,
                marginBottom: 20,
              }}
            >
              Just a team that said
            </div>

            {/* "'we're going to build in public'" with highlight wipe */}
            <div
              style={{
                fontFamily: headingFont,
                fontWeight: 700,
                fontSize: 48,
                color: COLORS.textPrimary,
                opacity: quoteOpacity,
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <span>&lsquo;we&rsquo;re going to </span>
              <span
                style={{
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {/* Green highlight background (wipe effect) */}
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: -6,
                    right: -6,
                    bottom: 0,
                    backgroundColor: COLORS.primaryGreen,
                    borderRadius: 4,
                    transform: `scaleX(${highlightWipe})`,
                    transformOrigin: 'left center',
                    zIndex: 0,
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    color:
                      highlightWipe > 0.3
                        ? COLORS.background
                        : COLORS.textPrimary,
                  }}
                >
                  build in public
                </span>
              </span>
              <span>&rsquo;</span>
            </div>
          </AbsoluteFill>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
