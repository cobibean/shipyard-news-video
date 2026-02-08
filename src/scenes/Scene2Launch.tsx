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
import type { ShipYardVideoFontSizes } from '../font-size-props';

const { fontFamily: headingFont } = loadFont('normal', {
  weights: ['700'],
  subsets: ['latin'],
});
const { fontFamily: bodyFont } = loadInter('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

const punchlines = ['No roadmap.', 'No pitch deck.', "No 'coming soon.'"];

export const Scene2Launch: React.FC<{
  fontSizes: ShipYardVideoFontSizes['scene2'];
}> = ({ fontSizes }) => {
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

  // Logo fade out around frame 100-112
  const logoFadeOut = interpolate(frame, [100, 112], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === Punchlines (Frames 25-112): stagger spring in from left ===
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

    // Fade out at frame 100-112 (gives last punchline ~51 frames / 1.7s of hold)
    const fadeOut = interpolate(frame, [100, 112], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return { text, translateX, opacity: opacity * fadeOut };
  });

  // === "Just a team that said" + highlight section (Frames 108-195) ===
  const introTextProgress = spring({
    frame: Math.max(0, frame - 113),
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const introTextOpacity = interpolate(introTextProgress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // === Typewriter for quote (Frames 123-155) ===
  const quoteFullText = "\u2018we\u2019re going to build in public\u2019";
  const typewriterQuoteProgress = interpolate(frame, [123, 155], [0, quoteFullText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const quoteDisplayedChars = Math.floor(typewriterQuoteProgress);
  const quoteCursorVisible = frame >= 123 && frame <= 160 && Math.floor(frame / 8) % 2 === 0;

  // Highlight wipe effect on "build in public" using scaleX — starts after typewriter finishes
  const highlightWipe = spring({
    frame: Math.max(0, frame - 158),
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.8 },
  });

  // Phase 2 visibility
  const phase2Visible = frame >= 108;
  const phase2FadeOut = interpolate(frame, [185, 200], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === Final transition (Frames 195-225) ===
  const exitScale = interpolate(frame, [195, 215], [1, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(frame, [205, 225], [1, 0], {
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
              gap: 16,
            }}
          >
            {punchlineData.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: headingFont,
                  fontWeight: 700,
                  fontSize: fontSizes.punchline,
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

      {/* Phase 2: "Just a team that said" + highlight quote (Frames 108-195) */}
      {phase2Visible && (
        <Sequence from={108} premountFor={1 * fps}>
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
                fontSize: fontSizes.intro,
                color: COLORS.textSecondary,
                opacity: introTextOpacity,
                marginBottom: 28,
              }}
            >
              Just a team that said
            </div>

            {/* "'we're going to build in public'" with typewriter + highlight wipe */}
            {frame >= 123 && (
              <div
                style={{
                  fontFamily: headingFont,
                  fontWeight: 700,
                  fontSize: fontSizes.quote,
                  color: COLORS.textPrimary,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {(() => {
                  // Split quote into prefix / highlight / suffix
                  const prefix = '\u2018we\u2019re going to ';
                  const highlight = 'build in public';
                  const suffix = '\u2019';
                  const prefixLen = prefix.length;
                  const highlightEnd = prefixLen + highlight.length;

                  const displayedPrefix = prefix.slice(0, Math.min(quoteDisplayedChars, prefixLen));
                  const highlightChars = Math.max(0, quoteDisplayedChars - prefixLen);
                  const displayedHighlight = highlight.slice(0, Math.min(highlightChars, highlight.length));
                  const displayedSuffix = quoteDisplayedChars > highlightEnd ? suffix : '';

                  return (
                    <>
                      <span>{displayedPrefix}</span>
                      <span
                        style={{
                          position: 'relative',
                          display: 'inline-block',
                        }}
                      >
                        {/* Green highlight background (wipe effect) */}
                        {displayedHighlight.length > 0 && (
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
                        )}
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
                          {displayedHighlight}
                        </span>
                      </span>
                      <span>{displayedSuffix}</span>
                      <span
                        style={{
                          opacity: quoteCursorVisible ? 1 : 0,
                          color: COLORS.primaryGreen,
                          fontWeight: 700,
                        }}
                      >
                        |
                      </span>
                    </>
                  );
                })()}
              </div>
            )}
          </AbsoluteFill>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
