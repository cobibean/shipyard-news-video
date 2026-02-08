import "./index.css";
import { Composition } from "remotion";
import { ShipYardVideo } from "./ShipYardVideo";
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_FPS,
  SCENE_FRAMES,
} from "./constants";
import { shipYardVideoSchema } from "./font-size-props";

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
        schema={shipYardVideoSchema}
        defaultProps={{
          fontSizes: {
            scene1: { title: 148, subtitle: 50 },
            scene2: { punchline: 64, intro: 74, quote: 105 },
            scene3: {
              day1Title: 112,
              day1Subtitle: 51,
              liveBadge: 24,
              typewriter: 45,
              emphasisLead: 82,
              emphasisMain: 143,
              url: 98,
            },
            scene4: {
              h1: 140,
              h2: 56,
              h3: 47,
              bullet: 43,
              bulletArrow: 34,
              closing: 92,
            },
            scene5: {
              header: 68,
              statValue: 108,
              statLabel: 30,
              whitepaper: 69,
              shipping: 78,
            },
            scene6: {
              nowBuilding: 62,
              polly: 124,
              pollySubtitle: 49,
              columnTitle: 40,
              columnBody: 34,
              weShipMain: 92,
              weShipSub: 46,
              url: 40,
            },
          },
        }}
      />
    </>
  );
};
