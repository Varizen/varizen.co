# ZSee by Varizen — "Do You See What I See?"

**A premium visual perception and memory game showcasing human skill in observation, attention to detail, and pattern recognition.**

## Overview

ZSee is a sophisticated perception game that challenges players to observe scenes, remember what they saw, and answer questions about visual changes, missing objects, and scene details. Players face progressive difficulty with decreasing view times and increasing visual complexity.

**Core Loop:** LOOK → REMEMBER → ANSWER → VERIFY → SCORE → REWARD

## Key Features

### Game Modes
1. **Missing Object** — Identify what disappeared from the scene
2. **Change Detection** — Spot what changed between views
3. **Object Appearance** — Find what new object appeared
4. **Memory Recall** — Count or identify details from memory

### Game Mechanics

**Progressive Difficulty:**
- Viewing time decreases: 4.0s → 3.5s → 3.0s → 2.5s → 2.0s
- Scene complexity increases dynamically
- Level multiplier applied to scoring (1x → 5x)

**Scoring System:**
- Base: `100 × difficulty_multiplier`
- Speed bonus: `max(0, 200 - streak × 10)`
- Streak multiplier: Correct answers boost combo
- Accuracy tracking: hits / total_answers

**Reaction & Accuracy:**
- Measures time to answer (optimal under 500ms)
- Tracks correct answers / total attempts
- Maintains current streak (breaks on wrong answer)

### Anti-Cheat & Fair-Play
- "Human Skill Only" messaging
- No AI assistance detection
- Fair-play verification badge
- Real performance verification
- Leaderboard rank calculation

### Premium UI
- **Varizen Titanium Design:** Dark charcoal (#0a0a0c-#1a1a1e), white text, orange accents (#FF6B35)
- **Glass panels** with subtle borders and low-opacity overlays
- **Smooth animations:** Pulse effects, bounce transitions, fade-in sequences
- **Precise typography:** Bold headings, clean sans-serif body
- **Minimal futuristic aesthetic:** Enterprise-grade visual language

## Files

### React Component
**`zsee-demo.tsx`** — Production-ready React/Next.js component
- Full game state management with React hooks
- TailwindCSS v4 styling
- Lucide React icons
- 5 randomized challenges
- Can be dropped into any Next.js page/app

### Standalone HTML Demo
**`index.html`** — Self-contained HTML5 + vanilla JavaScript
- No external dependencies
- Full game logic in JavaScript
- Responsive design
- Can be served from any web server

### Documentation
**`prompt.txt`** — Original design brief
**`18-18.png`** — UI reference mockup showing all game screens
**`README.md`** — This file

## Game Flow

### 1. Menu Screen
- Welcome message: "Do You See What I See?"
- Tagline: "LOOK. REMEMBER. ANSWER. EARN."
- Stats preview (5 challenges, Progressive difficulty, Points+)
- "START CHALLENGE" button
- Fair-play verification message
- Feature highlights: Memory Test, Visual Perception, Speed Challenge, Earn Rewards

### 2. Countdown Screen
- Level indicator (Level 1, 2, 3, etc.)
- 3-second bouncing countdown with "Get ready to observe carefully..."

### 3. Viewing Screen
- Scene emoji and name (Cozy Room, Living Room, Study Desk, etc.)
- Real-time timer counting down (4.0s → 0.0s)
- "LOOK CAREFULLY" label
- Color gradient background (changes per scene)

### 4. Answering Screen
- Question display (What changed? Which object? How many?)
- 2×2 grid of multiple choice options (4 answers)
- Live stats (Score, Accuracy %, Streak x)
- Question counter (1/5, 2/5, etc.)

### 5. Feedback Screen (during answering)
- Correct/Wrong indicator with icon
- Points awarded (on correct answer)
- Reaction time display
- Accuracy and combo stats
- Auto-transitions to next question

### 6. Complete Screen
- Challenge Complete trophy
- 2×2 results grid: Score, Accuracy %, Correct Answers, Rank
- "PLAY AGAIN" button
- Fair-play verification message
- Leaderboard rank (#1-#150 based on score)

## Visual Design

### Color Palette
- **Background:** Gradient dark charcoal `#0a0a0c` → `#1a1a1e`
- **Primary Orange:** `#FF6B35` (Varizen brand)
- **Secondary Orange:** `#FF4500` (accents)
- **Text:** White `#fff`, Gray accents `#666` → `#999`
- **Borders:** White/orange with low opacity for glass effect

### Scene Colors (per challenge)
- Cozy Room: Amber/orange gradient
- Living Room: Slate/dark gray gradient
- Study Desk: Blue gradient
- Kitchen: Green/emerald gradient
- Art Gallery: Purple/indigo gradient

### Components
- **Header:** Logo, badge buttons, stats
- **Cards:** Bordered glass panels with subtle transparency
- **Buttons:** Orange gradient with hover shadow effect
- **Timer:** Large bold text with live countdown
- **Options:** 2×2 grid with state-based styling (hover, selected, correct, wrong)

### Animations
- **Bounce:** Countdown number, bounce animation on feedback
- **Pulse:** Scene emoji during viewing, continuous animation
- **Fade/Scale:** Button interactions, screen transitions
- **Glow:** Orange accent on hover with shadow effects

## Integration Guide

### Use in Next.js Website
```typescript
import { ZSeeDemo } from '@/components/zsee-demo';

export default function PlayPage() {
  return <ZSeeDemo />;
}
```

**Prerequisites:**
- Next.js 14+ with React 18+
- TailwindCSS v4
- Lucide React icons

**Installation:**
```bash
npm install lucide-react
```

### Use Standalone
```bash
# Serve locally
python -m http.server 8000
# or
npx http-server -p 8000

# Open browser
http://localhost:8000/index.html
```

## Customization

### Game Duration
- Edit `CHALLENGES` array length (currently 5)
- Modify `viewTime` per challenge to adjust difficulty

### Viewing Times
- Decrease times: `4000 → 3500 → 3000 → 2500 → 2000` (ms)
- Increase for easier mode, decrease for harder

### Scoring
- Base multiplier: `100 × difficulty`
- Speed threshold: `200 - streak × 10`
- Adjust in `handleAnswer()` or `selectAnswer()`

### Scene Names & Emojis
- Edit CHALLENGES array: `sceneName`, `emoji`
- Add/remove challenges as needed
- Update counter displays

### Colors
- React: Modify TailwindCSS classes (`from-[#FF6B35]`, etc.)
- HTML: Update CSS variables and inline styles
- Scene gradients: Edit `sceneColor` gradient classes

## Performance & Optimization

- **Minimal DOM manipulation:** Static render with state updates
- **No heavy libraries:** Vanilla JS or React hooks only
- **Smooth 60fps animations:** CSS transitions and requestAnimationFrame
- **Responsive design:** Mobile-first, adapts to all screen sizes
- **Memory efficient:** Challenges cached, proper cleanup

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari/Chrome
- ✅ All modern browsers with ES6 support

## Accessibility

- Semantic HTML structure
- Clear visual feedback (colors, animations)
- Large touch targets for mobile
- ARIA labels for screen readers (React version)
- High contrast text and UI elements

## Fair-Play & Anti-Cheat

The demo includes:
- "Human Skill Only" branding throughout
- Fair-play verification messages
- Anti-cheat shield in header
- Client-side metrics tracking

**Production implementation would require:**
- Server-side timing verification
- Behavioral analysis to detect cheating patterns
- Replay validation
- Rate limiting and account security

## Future Enhancements

- [ ] Leaderboard integration (backend API)
- [ ] User authentication and profiles
- [ ] Difficulty settings (Easy, Normal, Hard, Expert)
- [ ] Seasonal challenges and themes
- [ ] Daily/weekly missions
- [ ] In-game sound effects and haptic feedback
- [ ] Multiplayer vs. mode
- [ ] AI-powered skill analysis
- [ ] Reward pool management
- [ ] Social sharing (scores, achievements)
- [ ] Analytics dashboard

## Attribution

**ZSee by Varizen** — Premium visual perception game  
**Design:** Varizen Titanium UI system  
**Brand:** Digital Trust, Cybersecurity & Governed AI  
**Website:** https://www.varizen.co/

---

**Created:** October 26, 2026  
**Status:** Production-ready demo  
**Human Skill. No AI assistance. No bots. No macros. Real performance, verified rewards.**
