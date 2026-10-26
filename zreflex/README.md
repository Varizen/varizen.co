# ZReflex by Varizen — Human Skill Reaction Game Demo

**A polished, animated demo showcasing ZReflex: a premium reaction-game product by Varizen, emphasizing human skill, fair-play, and anti-cheat verification.**

## Overview

ZReflex is a real-time skill challenge that tests and rewards human reaction speed and accuracy. Players tap glowing targets as they appear on screen for 30 seconds, with difficulty ramping throughout the game. The experience includes:

- **Fast, smooth animations** with realistic tap feedback
- **Glowing, pulsing targets** that spawn randomly across the game area
- **Dynamic scoring** with multiplier bonuses for combos and difficulty
- **Live stats** tracking score, combo, reaction time, and difficulty
- **Comprehensive end-game report** showing accuracy, reaction time, leaderboard rank, and anti-cheat verification
- **Premium Varizen Titanium design** with dark charcoal, white, and orange #FF6B35 accents
- **Glass panels and minimal futuristic UI** consistent with Varizen brand

## Features

### Game Flow
1. **Idle State** → Player clicks "PLAY. REACT. IMPROVE." button
2. **3-Second Countdown** → "Get ready to react..." with bouncing countdown
3. **Playing Phase** (30 seconds)
   - Random orange targets spawn and pulse
   - Players tap targets as quickly as possible
   - Score increases with combo multipliers and difficulty scaling
   - Difficulty increases every 10 seconds
4. **Leaderboard Rank** calculated based on final score
5. **Challenge Complete** → Full stats display, anti-cheat badge, play-again option

### Mechanics

**Scoring:**
- Base points: `100 - (reaction_time_ms × 0.2)`
- Multiplier: `difficulty × (1 + combo × 0.1)`
- Combos break on missed targets (clicking empty area)

**Difficulty:**
- Starts at 1x
- Increases every 10 seconds: 1x → 2x → 3x → etc.
- Target spawn interval decreases: `max(300ms, 1000ms - difficulty × 50ms)`

**Reaction Time:**
- Measured from target spawn to tap
- Displayed on final screen as average of all hits

**Accuracy:**
- Calculated as: `(hits / total_taps) × 100%`
- Includes misses (clicking empty area)

## Files

### React Component (TypeScript)
**`zreflex-demo.tsx`** — Production-ready React component for Next.js integration
- Full game state management with React hooks
- Smooth animations and transitions
- Lucide React icons
- TailwindCSS v4 styling
- Can be integrated into `src/app/` or used in any Next.js page

### Standalone HTML Demo
**`index.html`** — Self-contained HTML5 + CSS + JavaScript demo
- No dependencies required
- Can be served directly from any web server
- Full game logic in vanilla JavaScript
- Responsive design (full-screen immersive experience)

### Documentation
**`prompt1.txt`** — Original design brief
**`README.md`** — This file

## Visual Design

### Color Palette
- **Background:** Dark charcoal `#0a0a0c` to `#1a1a1e` with gradient
- **Primary Orange:** Varizen orange `#FF6B35` with accent `#FF4500`
- **Text:** White `#ffffff` with gray accents `#666` to `#999`
- **Borders:** White/orange with low opacity for glass effect

### Components
- **Header:** Logo, "Human Skill Only" badge, "Anti-Cheat Verified" shield
- **Game Area:** Grid background, radial gradient glow
- **Targets:** 4rem × 4rem rounded squares with glowing orange gradient and pulsing animation
- **Live Stats:** Top-right floating badges (Score, Combo, Time)
- **Modals:** Countdown and Game Over screens with backdrop blur
- **Footer:** Tagline "PLAY. REACT. IMPROVE. EARN. — ZReflex by Varizen"

### Animations
- **Pulse:** Targets pulse in/out (opacity) continuously
- **Scale:** Targets scale down to 0.3 and fade out when hit
- **Bounce:** Countdown text bounces during countdown phase
- **Hover:** Targets glow brighter on hover with scale boost
- **Transitions:** Smooth CSS transitions on all interactive elements

## Integration

### Use in Next.js Website
1. Copy `zreflex-demo.tsx` to `src/components/`
2. Import in your page/layout:
   ```typescript
   import { ZReflexDemo } from '@/components/zreflex-demo';
   
   export default function PlayPage() {
     return <ZReflexDemo />;
   }
   ```
3. Ensure TailwindCSS v4 and Lucide React are installed:
   ```bash
   npm install lucide-react
   ```

### Use Standalone
1. Serve `index.html` directly:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   ```
2. Open in browser: `http://localhost:8000/index.html`

## Customization

### Game Duration
Edit the `playing` phase check (currently 30 seconds):
- **React:** Line ~100 in `zreflex-demo.tsx` — `if (elapsed > 30)`
- **HTML:** Line ~400 in `index.html` — `if (elapsed > 30)`

### Difficulty Scaling
Adjust spawn rate calculation:
- **React:** `Math.max(300, 1000 - difficulty * 50)` (line ~90)
- **HTML:** Same calculation in `spawnLoop()` function

### Colors
- **React:** Update TailwindCSS classes (`from-[#FF6B35]`, `bg-[#0a0a0c]`, etc.)
- **HTML:** Modify CSS variables or hardcoded color values

### Target Size
- **React:** Change `w-16 h-16` classes to desired size
- **HTML:** Modify `.target { width/height }` in CSS

## Performance Notes

- Targets are removed from DOM after 2 seconds (hit or missed)
- Game loop uses `requestAnimationFrame` for smooth 60fps rendering
- Spawn loop decoupled from render loop for independent control
- No memory leaks; proper cleanup on game end

## Fair-Play & Anti-Cheat

The demo displays:
- "Human Skill Only — No AI, Bots or Macros"
- "Anti-Cheat Verified" badge in header
- Fair-Play verification banner on game over screen
- Client-side metrics (reaction time, accuracy, difficulty) for demonstration

*Note: Production implementation would require server-side validation, timing verification, and behavior analysis to prevent cheating.*

## Browser Compatibility

- **React Component:** All modern browsers (Chrome, Firefox, Safari, Edge)
- **HTML Demo:** Modern browsers with ES6 support (2016+)
- **Mobile:** Fully responsive; touch events work (targets clickable on mobile)

## Future Enhancements

- [ ] Leaderboard API integration (backend required)
- [ ] User authentication and score persistence
- [ ] Difficulty selection (Easy, Normal, Hard)
- [ ] Seasonal challenges and rewards
- [ ] In-game sound effects and haptic feedback
- [ ] Mobile app version (React Native or Flutter)
- [ ] AI-powered skill analysis and recommendations
- [ ] Multiplayer vs. mode (real-time competitive)
- [ ] Visual themes and customization shop

## Attribution

**ZReflex by Varizen** — Premium human-skill reaction game.  
**Design:** Varizen Titanium UI system  
**Brand:** Digital Trust, Cybersecurity & Governed AI  
**Website:** https://www.varizen.co/

---

**Created:** October 26, 2026  
**Status:** Production-ready demo
