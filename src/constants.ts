// === Brand Colors ===
export const COLORS = {
  primaryGreen: '#4ADE40',
  darkGreen: '#1A3A1A',
  accentLime: '#B8FF00',
  background: '#0A0F0A',
  surface: '#141C14',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  accentPurple: '#D4A0D4',
  border: '#2A3A2A',
  neonGreen: '#00FF66',
  darkBg: '#050805',
} as const;

// === Video Config ===
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = 30;

// === Scene Durations (in seconds) ===
export const SCENE_DURATIONS = {
  coldOpen: 4.5,
  launch: 7.5,
  shipMint: 14,
  tokenUtility: 9,
  stats: 9,
  close: 11,
} as const;

// === Scene Durations in Frames ===
export const SCENE_FRAMES = {
  coldOpen: Math.round(SCENE_DURATIONS.coldOpen * VIDEO_FPS),
  launch: Math.round(SCENE_DURATIONS.launch * VIDEO_FPS),
  shipMint: Math.round(SCENE_DURATIONS.shipMint * VIDEO_FPS),
  tokenUtility: Math.round(SCENE_DURATIONS.tokenUtility * VIDEO_FPS),
  stats: Math.round(SCENE_DURATIONS.stats * VIDEO_FPS),
  close: Math.round(SCENE_DURATIONS.close * VIDEO_FPS),
} as const;

// Total duration
export const TOTAL_FRAMES =
  SCENE_FRAMES.coldOpen +
  SCENE_FRAMES.launch +
  SCENE_FRAMES.shipMint +
  SCENE_FRAMES.tokenUtility +
  SCENE_FRAMES.stats +
  SCENE_FRAMES.close;
