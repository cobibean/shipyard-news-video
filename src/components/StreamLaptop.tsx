import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Video } from '@remotion/media';

/**
 * StreamLaptop - A laptop/monitor mockup that displays a video clip inside it.
 *
 * Draws a dark rounded rectangle bezel with a subtle gradient to simulate a
 * laptop screen. Uses the Video component from @remotion/media to play a
 * muted, trimmed clip inside the screen area. The laptop has a slight 3D
 * perspective transform (CSS perspective + rotateY). Sized ~800x500px.
 *
 * trimBefore/trimAfter are in frames. For a 24fps source, 2-3 seconds = 48-72 frames.
 */

interface StreamLaptopProps {
  /** Path to the video source (use staticFile() for public/ assets) */
  videoSrc: string;
  /** Frame of the source video to start from (at source fps). Default 0 */
  trimStartFrame?: number;
  /** Frame of the source video to end at (at source fps). Default 72 (3s at 24fps) */
  trimEndFrame?: number;
  /** Whether to loop the trimmed clip. Default true */
  loop?: boolean;
  /** Overall width of the laptop in px. Default 800 */
  width?: number;
  /** Overall height of the laptop in px. Default 500 */
  height?: number;
  /** rotateY degrees for 3D perspective. Default 8 */
  rotateY?: number;
  /** Optional entry animation start frame. Default 0 */
  entryFrame?: number;
}

export const StreamLaptop: React.FC<StreamLaptopProps> = ({
  videoSrc,
  trimStartFrame = 0,
  trimEndFrame = 72,
  loop = true,
  width = 800,
  height = 500,
  rotateY = 8,
  entryFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bezel dimensions
  const bezelPadding = 16;
  const bottomBarHeight = 30;
  const screenWidth = width - bezelPadding * 2;
  const screenHeight = height - bezelPadding * 2 - bottomBarHeight;

  // Entry animation: scale and opacity spring in
  const entryProgress = spring({
    frame: Math.max(0, frame - entryFrame),
    fps,
    config: {
      damping: 28,
      stiffness: 90,
      mass: 1,
    },
    durationInFrames: 30,
  });

  const entryScale = interpolate(entryProgress, [0, 1], [0.85, 1]);
  const entryOpacity = interpolate(entryProgress, [0, 1], [0, 1]);

  // Subtle breathing rotation for life-like feel
  const breathRotate = interpolate(
    Math.sin(frame * 0.02),
    [-1, 1],
    [-0.5, 0.5],
  );

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        perspective: 1200,
        opacity: entryOpacity,
        transform: `scale(${entryScale})`,
      }}
    >
      {/* Laptop body */}
      <div
        style={{
          width,
          height,
          borderRadius: 16,
          // Dark gradient bezel
          background:
            'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 60%, #0a0a14 100%)',
          boxShadow: [
            '0 8px 32px rgba(0, 0, 0, 0.6)',
            '0 2px 8px rgba(0, 0, 0, 0.4)',
            'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          ].join(', '),
          padding: bezelPadding,
          paddingBottom: bezelPadding + bottomBarHeight,
          position: 'relative',
          transform: `rotateY(${rotateY + breathRotate}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Screen area */}
        <div
          style={{
            width: screenWidth,
            height: screenHeight,
            borderRadius: 6,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#000000',
            boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.8)',
          }}
        >
          <Video
            src={videoSrc}
            muted
            loop={loop}
            trimBefore={trimStartFrame}
            trimAfter={trimEndFrame}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Screen reflection overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.01) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Bottom bar with webcam dot and hinge line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: bottomBarHeight + bezelPadding,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          {/* Camera dot */}
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#1a1a2e',
              boxShadow: 'inset 0 0 2px rgba(0,0,0,0.6)',
            }}
          />
        </div>

        {/* Top-center camera dot (above screen) */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 5,
            height: 5,
            borderRadius: '50%',
            backgroundColor: '#0d0d1a',
            boxShadow: 'inset 0 0 2px rgba(0,0,0,0.8)',
          }}
        />
      </div>

      {/* Laptop base / keyboard area (thin strip below) */}
      <div
        style={{
          width: width * 1.05,
          height: 12,
          borderRadius: '0 0 8px 8px',
          background:
            'linear-gradient(180deg, #1a1a2e 0%, #12121e 100%)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          transform: `rotateY(${rotateY + breathRotate}deg)`,
        }}
      />
    </div>
  );
};
