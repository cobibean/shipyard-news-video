# ShipYard News Headline Video — Implementation Plan

## Format
- 1920x1080 (landscape, Twitter/YouTube)
- 30fps
- ~45 seconds total (~1350 frames)

## Brand Colors (extracted from assets)
- Primary Green: #4ADE40 (neon/lime green from SHIP logo)
- Dark Green: #1A3A1A (deep forest from banner bg)
- Accent Yellow-Green: #B8FF00 (bright lime from arrow highlights)
- Background: #0A0F0A (near-black with green tint, from W3M site)
- Surface: #141C14 (dark card backgrounds)
- Text Primary: #FFFFFF
- Text Secondary: #9CA3AF
- Accent Purple: #D4A0D4 (from ShipMint "Mint Your Favorites" text)
- Border/Outline: #2A3A2A

## Fonts (from W3M site analysis)
- Headlines: Space Grotesk (bold, modern, techy)
- Body: Inter (clean, readable)

## Architecture
```
src/
├── Root.tsx                    # Composition definition
├── ShipYardVideo.tsx          # Main composition wrapper with TransitionSeries
├── scenes/
│   ├── Scene1ColdOpen.tsx     # "8 DAYS AGO..." glitch slam
│   ├── Scene2Launch.tsx       # $SHIP on Pump.fun + 3D token
│   ├── Scene3ShipMint.tsx     # ShipMint reveal + stream clip in laptop
│   ├── Scene4TokenUtility.tsx # $SHIP utility bullets with highlights
│   ├── Scene5Stats.tsx        # Fast stat counter montage
│   └── Scene6Close.tsx        # Polly + CTA + logos
├── components/
│   ├── AnimatedText.tsx       # Reusable text slam/typewriter/highlight
│   ├── GlitchEffect.tsx      # CSS glitch overlay
│   ├── Particles.tsx          # Floating particle system
│   ├── NeonGlow.tsx           # Glow effect wrapper
│   ├── StreamLaptop.tsx       # Laptop mockup with video inside
│   ├── StatCounter.tsx        # Animated counting number
│   └── TokenSpin.tsx          # 3D spinning token (ThreeCanvas)
├── constants.ts               # Colors, fonts, timing constants
└── index.css                  # Tailwind + global styles
```

## Scene Breakdown

### Scene 1: Cold Open (0-4s, frames 0-120)
- Black screen → scanline glitch
- "8 DAYS AGO..." slams in with spring bounce + screen shake
- "we launched ShipYard on Pump.fun" typewriter below
- Green particle burst on impact
- SFX: Impact boom, glitch static

### Scene 2: The Launch (4-10s, frames 120-300)
- SHIP logo scales in with spring animation
- 3D token rotates in ThreeCanvas with green glow
- Text: "No roadmap. No pitch deck."
- "Just a team that ships." highlight wipe on "ships"
- Light leak transition out

### Scene 3: ShipMint Reveal (10-18s, frames 300-540)
- Laptop mockup slides in from right
- Stream clip plays inside laptop (2-3s of the 6s clip, muted)
- ShipMint UI screenshot overlays
- Text: "Day 1: Shipped the first app"
- "shipmint.art" with neon underline
- Fade transition

### Scene 4: Token Utility (18-26s, frames 540-780)
- $SHIP arrow swoops across screen
- Bullet points fly in staggered:
  → "Access to every mini-course"
  → "Built into the apps"
  → "Fund builder grants"
- "Coordination. Not speculation." with highlight on "Coordination"
- Green pulse background

### Scene 5: Stats Montage (26-34s, frames 780-1020)
- Fast counter animations
- "8 DAYS" / "1 APP SHIPPED" / "1 TOKEN LIVE" / "1 BOT BUILT"
- Grid layout, numbers count up rapidly
- "Most teams spend 8 days writing a whitepaper."
- "We spent it shipping." slam with glow

### Scene 6: Close + CTA (34-45s, frames 1020-1350)
- "Now building: POLLY" with Polymarket reference
- "The muscle → The brain" split text
- "We ship every week."
- SHIP logo + W3M logo side by side
- "shipmint.art | web3matters.xyz"
- "Follow the process or join it." final text
- Fade to black with green glow
