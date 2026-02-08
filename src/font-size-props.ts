import {z} from 'zod';

const fontSizeValue = z.number().min(8).max(220);

export const fontSizeSchema = z.object({
  scene1: z.object({
    title: fontSizeValue,
    subtitle: fontSizeValue,
  }),
  scene2: z.object({
    punchline: fontSizeValue,
    intro: fontSizeValue,
    quote: fontSizeValue,
  }),
  scene3: z.object({
    day1Title: fontSizeValue,
    day1Subtitle: fontSizeValue,
    liveBadge: fontSizeValue,
    typewriter: fontSizeValue,
    emphasisLead: fontSizeValue,
    emphasisMain: fontSizeValue,
    url: fontSizeValue,
  }),
  scene4: z.object({
    h1: fontSizeValue,
    h2: fontSizeValue,
    h3: fontSizeValue,
    bullet: fontSizeValue,
    bulletArrow: fontSizeValue,
    closing: fontSizeValue,
  }),
  scene5: z.object({
    header: fontSizeValue,
    statValue: fontSizeValue,
    statLabel: fontSizeValue,
    whitepaper: fontSizeValue,
    shipping: fontSizeValue,
  }),
  scene6: z.object({
    nowBuilding: fontSizeValue,
    polly: fontSizeValue,
    pollySubtitle: fontSizeValue,
    columnTitle: fontSizeValue,
    columnBody: fontSizeValue,
    weShipMain: fontSizeValue,
    weShipSub: fontSizeValue,
    url: fontSizeValue,
  }),
});

export const shipYardVideoSchema = z.object({
  fontSizes: fontSizeSchema,
});

export type ShipYardVideoProps = z.infer<typeof shipYardVideoSchema>;
export type ShipYardVideoFontSizes = z.infer<typeof fontSizeSchema>;

export const shipYardVideoDefaultProps: ShipYardVideoProps = {
  fontSizes: {
    scene1: {
      title: 148,
      subtitle: 50,
    },
    scene2: {
      punchline: 64,
      intro: 42,
      quote: 70,
    },
    scene3: {
      day1Title: 112,
      day1Subtitle: 42,
      liveBadge: 18,
      typewriter: 42,
      emphasisLead: 52,
      emphasisMain: 82,
      url: 86,
    },
    scene4: {
      h1: 124,
      h2: 48,
      h3: 34,
      bullet: 38,
      bulletArrow: 34,
      closing: 92,
    },
    scene5: {
      header: 68,
      statValue: 108,
      statLabel: 30,
      whitepaper: 48,
      shipping: 78,
    },
    scene6: {
      nowBuilding: 52,
      polly: 124,
      pollySubtitle: 42,
      columnTitle: 40,
      columnBody: 30,
      weShipMain: 92,
      weShipSub: 46,
      url: 40,
    },
  },
};
