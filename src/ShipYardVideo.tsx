import { AbsoluteFill, interpolate, staticFile, useVideoConfig } from 'remotion';
import { Audio } from '@remotion/media';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';

import { Scene1ColdOpen } from './scenes/Scene1ColdOpen';
import { Scene2Launch } from './scenes/Scene2Launch';
import { Scene3ShipMint } from './scenes/Scene3ShipMint';
import { Scene4TokenUtility } from './scenes/Scene4TokenUtility';
import { Scene5Stats } from './scenes/Scene5Stats';
import { Scene6Close } from './scenes/Scene6Close';
import { SCENE_FRAMES } from './constants';

export const ShipYardVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  const shortTransition = Math.round(0.4 * fps); // 12 frames
  const medTransition = Math.round(0.6 * fps); // 18 frames

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0F0A' }}>
      {/* Background music — fade in over 1s, fade out over 2s */}
      <Audio
        src={staticFile('hitslab-no-copyright-music-hip-hop-379510.mp3')}
        volume={(f) =>
          interpolate(
            f,
            [0, 1 * fps, durationInFrames - 2 * fps, durationInFrames],
            [0, 0.35, 0.35, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
        }
      />

      <TransitionSeries>
        {/* Scene 1: Cold Open */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.coldOpen}>
          <Scene1ColdOpen />
        </TransitionSeries.Sequence>

        {/* Fade to Scene 2 */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: shortTransition })}
        />

        {/* Scene 2: The Launch */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.launch}>
          <Scene2Launch />
        </TransitionSeries.Sequence>

        {/* Wipe to Scene 3 */}
        <TransitionSeries.Transition
          presentation={wipe({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: medTransition })}
        />

        {/* Scene 3: ShipMint Reveal */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.shipMint}>
          <Scene3ShipMint />
        </TransitionSeries.Sequence>

        {/* Fade to Scene 4 */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: shortTransition })}
        />

        {/* Scene 4: Token Utility */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.tokenUtility}>
          <Scene4TokenUtility />
        </TransitionSeries.Sequence>

        {/* Slide to Scene 5 */}
        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={linearTiming({ durationInFrames: medTransition })}
        />

        {/* Scene 5: Stats Montage */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.stats}>
          <Scene5Stats />
        </TransitionSeries.Sequence>

        {/* Fade to Scene 6 */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: shortTransition })}
        />

        {/* Scene 6: Close + CTA */}
        <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES.close}>
          <Scene6Close />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
