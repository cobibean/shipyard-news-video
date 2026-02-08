import "./index.css";
import { Composition } from "remotion";
import { ShipYardVideo } from "./ShipYardVideo";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS, SCENE_FRAMES } from "./constants";

// Calculate total duration accounting for transition overlaps
// 5 transitions: 3 short (12 frames) + 2 medium (18 frames) = 72 frames of overlap
const TRANSITION_OVERLAP = 3 * 12 + 2 * 18; // 36 + 36 = 72

const TOTAL_DURATION =
  SCENE_FRAMES.coldOpen +
  SCENE_FRAMES.launch +
  SCENE_FRAMES.shipMint +
  SCENE_FRAMES.tokenUtility +
  SCENE_FRAMES.stats +
  SCENE_FRAMES.close -
  TRANSITION_OVERLAP;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShipYardNews"
        component={ShipYardVideo}
        durationInFrames={TOTAL_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
