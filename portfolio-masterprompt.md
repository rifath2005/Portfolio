# Portfolio Upgrade — Master Prompt Library

Merged from your two roadmaps into one path: **Next.js/React from the start** — every 
piece gets built once, directly in its final form, instead of built vanilla and ported 
later. Palette is **black/white/grey + one accent color**, swappable in a single place.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger + Flip (100% free for commercial use since GSAP 3.13 — no 
  Club GreenSock license needed for SplitText, Flip, or anything else below)
- Lenis for smooth scroll
- React Three Fiber + drei

## Palette
| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | Page background |
| `--bg-alt` | `#0A0A0A` | Card/section background |
| `--fg` | `#FFFFFF` | Primary text |
| `--fg-muted` | `#999999` | Secondary text |
| `--accent` | `#38BDF8` | Every interactive highlight — cursor, hover, glows, pulses |

Electric blue for the accent: reads as "AI/data," strong contrast on both black and 
white, glows well in WebGL. Every task below refers to it only as **"the accent"** — 
change this one value and the whole site follows. If you land on a different color 
later, this is the only line that needs to change.

## How to use this
Same rule as both originals: paste these one at a time into your coding assistant, 
working directly in your repo. Review and test each result before starting the next — 
several tasks (0.5's Magnetic component, 3.1's reveal pattern) get reused by later 
tasks, so getting them right early saves rework.

One thing dropped entirely: the "migrate to Next.js later" plan from your first 
roadmap's Section 7. That's moot now — we're doing the migration up front in Phase 0 
instead of porting vanilla code at the end.

---

## Phase 0 — Foundation
*(everything else depends on this)*

### 0.1 — Project setup
```
Set up a new Next.js (App Router) project with:
1. TypeScript configured
2. Tailwind CSS installed and configured
3. GSAP installed, with ScrollTrigger and Flip plugins registered (all GSAP plugins,
   including SplitText and Flip, are free for commercial use as of GSAP 3.13 — no
   Club GreenSock license needed)
4. @react-three/fiber and @react-three/drei installed
5. Lenis installed and wired up as a global smooth-scroll provider

Create a root layout.tsx that wraps children in the Lenis provider, sets a black
background + white text on the base HTML/body to prevent any flash of unstyled
content, and registers the GSAP plugins once on the client.
```
**Effort:** Quick win (half day)

### 0.2 — Design tokens
```
Configure Tailwind and global CSS variables as the single source of truth for the
whole redesign — no hardcoded colors, spacing, or timing anywhere else from this
point forward.

1. Colors (tailwind.config.ts + :root CSS vars so Three.js can read them too):
   --bg: #000000, --bg-alt: #0A0A0A, --fg: #FFFFFF, --fg-muted: #999999,
   --accent: #38BDF8
2. Spacing scale: --space-xs through --space-xl
3. Typography scale: --font-size-h1 through --font-size-body, plus font-weight tokens
4. Motion tokens: --ease-default, --duration-fast/medium/slow

Expose --accent as a plain hex CSS variable (not just a Tailwind class) specifically
so it can be read at runtime and converted to a THREE.Color for shader uniforms later.
```
**Effort:** Quick win (half day)

### 0.3 — Custom cursor
```
Build a custom cursor component that replaces the default browser cursor on desktop
only (detect touch/coarse-pointer devices and fall back to the native cursor there).

1. Two-part cursor: a 4px solid dot and a 10px outer ring, both following the mouse
   with lerp-based easing via requestAnimationFrame (no external libs) — the dot
   tracks tightly, the ring trails slightly behind for a sense of weight.
2. Use mix-blend-mode: difference on both parts so the cursor stays visible over any
   background without per-section color logic.
3. On hover over links/buttons: ring scales to 3x and shifts to the accent color,
   with a magnetic pull toward the element's center.
4. On hover over project cards specifically: show a small "View" label inside the ring.
5. Respect prefers-reduced-motion — disable the magnetic pull (keep the base cursor)
   if set.
```
**Effort:** Quick win (1 day)

### 0.4 — Grain/noise overlay
```
Add a subtle animated film-grain overlay across the whole site for a premium,
textured feel.

1. A fixed-position, full-viewport component (canvas or CSS-generated noise),
   pointer-events: none so it never blocks clicks.
2. Opacity 3–5%, blend-mode: overlay.
3. If canvas-based, animate at a low frame rate (10–15fps) for subtle movement
   rather than static noise.
4. Must not cause scroll jank — profile it and drop the frame rate further if needed.

Build it as a standalone, toggleable component so it can be switched off per-section
later if it ever hurts contrast (footer, in particular — flag this now, revisit in
Phase 7).
```
**Effort:** Quick win (half day)

### 0.5 — Reusable Magnetic component
```
Build one reusable Magnetic component/hook that every other magnetic interaction in
this project will use — cursor, nav links, buttons, contact links, footer CTA. Do
not let later tasks reimplement this.

1. On mousemove within ~60px of the element's bounding box, translate the element
   toward the cursor by ~30% of the offset distance, capped at ~15px.
2. On mouseleave, spring back to translate(0,0) using GSAP (elastic.out or
   power2.out).
3. Expose it as a wrapper component (<Magnetic>) or a hook (useMagnetic(ref)) —
   your call on whichever fits this codebase better — so nothing downstream
   duplicates the math.
```
**Effort:** Quick win (1 day)

---

## Phase 1 — Hero

### 1.1 — Neural network WebGL background
```
Build a React Three Fiber canvas as the Hero section's background, representing an
AI neural network. It sits behind the existing hero text and the draggable lightbulb
(both remain real DOM elements layered on top of the canvas).

1. ~800–1500 points via BufferGeometry/Points (tune for performance — see point 6).
   Arrange them in a loose, organic lattice, not a rigid grid.
2. Connect nearby points with LineSegments where distance is below a threshold.
3. Custom ShaderMaterial for the points so they render as soft glowing circles, not
   squares — white/grey at rest, low opacity.
4. Idle animation: gentle per-point float using sin(time + offset) in the vertex
   shader, plus a very slow rotation of the whole point cloud.
5. Mouse interaction: pass normalized mouse position as a uniform. Points within a
   proximity radius brighten and scale up slightly; the closest connecting lines
   brighten to the accent color and pulse.
6. Performance: cap pixel ratio at 2, dispose geometries/materials on unmount, and
   pause the render loop via IntersectionObserver when the hero scrolls out of view.
7. Graceful degradation: if WebGL isn't supported, hide the canvas and show a static
   fallback background instead of erroring.

Structure this as a self-contained component (e.g., HeroScene.tsx) with a transparent
canvas background so the HTML text overlays cleanly.
```
**Effort:** Moderate (3–5 days) | **Dependencies:** 0.1, 0.2 (for the accent token)

### 1.2 — Draggable lightbulb: spring physics + shader sync
```
Migrate the hanging lightbulb theme-toggle to React and upgrade its physics.

1. Physics: replace any instant-snap drag logic with a simple spring simulation —
   track velocity, apply a spring force back to rest position, apply damping. On
   release, the bulb swings back with a natural, gradually-dampening pendulum
   oscillation, not an instant snap.
2. Keep the existing light/dark theme-toggle trigger intact — whatever currently
   fires the switch should still fire it.
3. New: when the bulb is "on," pass a uBulbOn uniform into the Hero neural-network
   shader from 1.1 so the entire network shifts from white toward the accent color
   while it's on, easing back when it's off — ties the two signature hero elements
   together instead of leaving them isolated.
4. Isolation: the bulb's DOM element and drag events must stay fully separate from
   the canvas's raycasting — dragging the bulb should never trigger hover/proximity
   effects on the neural network, and vice versa.

Show me the before/after of the drag handler.
```
**Effort:** Quick win–Moderate (2 days) | **Dependencies:** 1.1

### 1.3 — Hero text choreography
```
Rebuild the hero headline's entrance animation with GSAP.

1. Split the headline (and subheadline) into words or characters using GSAP's
   SplitText plugin (free for commercial use as of GSAP 3.13).
2. Animate each word/character with a staggered upward slide + fade-in, stagger of
   0.05–0.08s, ease: power3.out (or expo.out).
3. Subheadline and CTA button follow with a slight delay in the same timeline.
4. This must be sequenced in the same GSAP timeline as the loader fade-out, timed
   so the text finishes appearing right as the loader clears — not a separate,
   disconnected animation.

Show me the full timeline code.
```
**Effort:** Quick win (1 day)

---

## Phase 2 — Navigation

### 2.1 — Scroll-aware nav
```
Make the nav hide on scroll-down and reappear on scroll-up, with a background shift
after the hero.

1. Track scroll direction off Lenis's scroll event (not a raw window scroll
   listener, since Lenis owns the scroll now) — throttle appropriately.
2. Nav translates up and out of view on scroll down, slides back in on scroll up,
   via a smooth CSS/GSAP transition (~0.3s ease).
3. After scrolling past 100vh, nav background shifts from transparent to
   semi-transparent black with backdrop-filter: blur(10px).
4. At scroll position 0, always show the nav regardless of direction.
5. Leave the existing letter-flip hover animation on nav links untouched — and wrap
   both nav links and any nav CTA buttons in the Magnetic component from 0.5.
```
**Effort:** Quick win (1 day) | **Dependencies:** 0.1 (Lenis), 0.5 (Magnetic)

---

## Phase 3 — About

### 3.1 — Line-by-line scroll reveal
```
Build a ScrollRevealText component for the About section's paragraphs, replacing
whatever fade-in it currently has.

1. Split each paragraph into lines (or words), wrapping each in an overflow: hidden
   container.
2. Animate each inner line from translateY: 100%, opacity: 0 to translateY: 0%,
   opacity: 1 via GSAP ScrollTrigger, staggered ~0.05s apart.
3. Trigger when the section is ~20% into the viewport (start: "top 80%").
4. If there's a background element or image in this section, give it a subtle
   parallax (translateY tied to scroll progress) that moves at a different speed
   than the text.
5. Play once — use toggleActions so it doesn't replay on scroll-back-up.
6. Respect prefers-reduced-motion (skip straight to the final state).
```
**Effort:** Moderate (2 days) | **Dependencies:** 0.1

---

## Phase 4 — Experience

### 4.1 — Timeline with scroll-scrubbed line
```
Build a vertical timeline for the Experience section.

1. Layout: a 1px vertical line (dim grey) down the center or slightly offset. Each
   entry gets an 8px accent-colored circle marker on the line, with year, role,
   company, and one impact sentence, alternating left/right of the line.
2. Use GSAP ScrollTrigger's scrub option to "draw" the line downward in sync with
   scroll progress as the section moves through the viewport.
3. Stagger each entry's fade-in + slide-up (translateY: 30px → 0) by ~0.1s as the
   line reaches its position — reuse the exact easing/timing values from 3.1's
   About reveal for a cohesive feel.
```
**Effort:** Quick win–Moderate (1–2 days) | **Dependencies:** 3.1 (reuses its pattern)

### 4.2 — Consider pinning (optional)
```
Evaluate whether the Experience section would benefit from a pinned scroll effect —
the section stays fixed while entries scroll/cycle through internally, then unpins.
Implement with ScrollTrigger's pin: true only if there are 3+ experience entries.
If there are fewer, skip it and tell me why it's not worth it at this length.
```
**Effort:** Moderate (2–3 days) | **Dependencies:** 4.1

---

## Phase 5 — Works / Projects
**Highest-priority section in both original plans — this is what a recruiter or engineer will actually spend time on.**

### 5.1 — Full-width immersive project cards
```
Rebuild the project showcase as full-width, immersive cards (replacing any grid of
static cards).

1. Layout: a vertical stack of full-width cards, aspect-ratio 16:9 or a fixed ~70vh
   height, overflow: hidden.
2. Media: each card supports a background video (muted, looped, autoplay) or
   animated WebP/GIF showing an actual screen-capture of the project UI — I'll
   provide these assets. Media starts desaturated (grayscale(100%)) and transitions
   to full color on hover, matching the grayscale-to-color pattern already used
   elsewhere on the site.
3. On hover (desktop): media brightens/scales slightly (scale 1.1), card content
   lifts, a gradient overlay (bottom-up black) keeps text readable, and a 2px
   bottom border scales from 0 to 100% width in the accent color.
4. Parallax hover: on mousemove over the card, translate the background media
   opposite the cursor offset (~15px strength) via GSAP; snap back on mouseleave.
5. Bottom-left text: project name (large), subtitle, tech-stack pills. Keep the
   existing metric callouts (e.g., "Latency Drop: -60%") but present them as a
   hover overlay on desktop.
6. Mobile/touch: no hover, so autoplay previews at reduced quality/framerate, or
   use a static hero frame with a "tap to preview" affordance. Metrics stay visible
   in a compact always-on format instead of a hover overlay.

Structure as a reusable card component populated from a data array — I'll supply
entries for all 3 projects (MCP Auto, Notinq CMS, Brevity AI).
```
**Effort:** Moderate (1 week incl. asset prep) | **Dependencies:** 0.1, 0.2

### 5.2 — Animated metric counters
```
Add a count-up animation to each card's key metric (e.g., "Latency Drop: -60%",
"Query Latency: 50ms").

1. AnimatedCounter component using GSAP tweening (gsap.to with onUpdate, numeric
   value) from 0 to the target.
2. Trigger via ScrollTrigger when the card enters the viewport, only once, ease:
   expo.out, ~1.5s duration.
3. Format per metric type via a config object (percentages get "%", ms values get
   "ms", etc.) so new metrics can be added without touching the animation logic.
4. Style: large, bold, accent-colored number above its label.
```
**Effort:** Quick win (2–3 days) | **Dependencies:** 5.1

### 5.3 — In-card mini visualizations
```
Add a small, always-present Three.js scene inside each project card, absolutely
positioned behind the text overlay, to reinforce the engineering story at a glance
while scrolling — separate from the deeper case-study visualization in 5.5.

Build a generic ProjectScene component accepting a "type" prop:
1. type="flow" (MCP Auto — webhook/event orchestration): ~100 small spheres moving
   along curved paths (CatmullRomCurve3). On card hover, particles speed up and
   shift to the accent color.
2. type="shatter" (Brevity AI — privacy/PII): a slowly rotating icosahedron. On
   card hover, explode its vertices outward (or swap to wireframe + fade) to read
   as "shattering/cloaking" data, reforming on mouse-leave.
3. type="grid" (Notinq CMS — content system): a soft, slowly-drifting grid of small
   planes/nodes suggesting structured content blocks; on hover, nodes briefly align
   into a tidier grid pattern in the accent color, then relax back — same visual
   language as the other two, reading as "organizing content" instead of "flow" or
   "shatter."

Keep each variant cheap (low poly count, capped pixel ratio) since these run
continuously while the list is in view, not just on demand.
```
**Effort:** Moderate (3–4 days) | **Dependencies:** 5.1

### 5.4 — Case study expand view
```
Add a click-to-expand interaction: clicking a card transitions it into a full
case-study view.

1. Use GSAP's Flip plugin to animate the card expanding from its grid position into
   the full detail view, so the transition feels continuous rather than a jarring
   open.
2. Given this is now Next.js, recommend and implement whichever fits better: (a) a
   client-side modal state, simplest to build, or (b) a real dynamic route
   (/works/[slug]) with the Flip transition on navigation — better for deep-linking
   and back-button behavior. Make the call and tell me why.
3. Detail view includes: title, full description, problem/approach/outcome (I'll
   provide copy), tech-stack tags, larger media, links to live demo/repo, and the
   metrics from 5.2 reused at a larger size.
4. Close via an explicit close button, Escape key, or click-outside.
```
**Effort:** Moderate (1 week) | **Dependencies:** 5.1, 5.2

### 5.5 — Architecture visualization (MCP Auto case study)
```
Build a node-graph visualization for the MCP Auto case study, showing its
webhook/event orchestration architecture — this is the single highest-value visual
for AI-engineer positioning, so give it the most polish in this list.

1. 5–8 nodes (Webhook Receiver, Event Queue, Processor, Database,
   Output/Notification, etc.) as small spheres/icosahedrons in a left-to-right or
   circular flow layout, built with drei's primitives where they simplify things.
2. Connect nodes with curved tube geometry or line segments.
3. Animate a small accent-colored point traveling along each connection on a loop,
   simulating live event flow.
4. On hover over a node: show a tooltip via drei's <Html> component (name + a
   relevant metric, e.g., "Processor — 50ms avg latency") — no manual 3D-to-screen
   projection needed, drei handles it.
5. White/grey by default; accent color only for the traveling pulse and hover state.
6. Limited-angle OrbitControls (not full free rotation) so it feels interactive
   without letting people get lost.
7. Fixed-size canvas (~600×400 or a responsive equivalent) that fits inside the
   case-study layout, not full-viewport.

Build as a reusable component (ArchitectureViz.tsx) since I'll want a similar
visualization for future projects.
```
**Effort:** Moderate–Significant (1–1.5 weeks) | **Dependencies:** 5.4

### 5.6 — Live PII-detection demo (Brevity AI case study)
```
Build a small interactive demo inside the Brevity AI case study: visitors type/paste
text and see PII highlighted live, simulating the real Chrome extension.

1. Client-side regex matching for common PII types (email, phone, credit-card-like,
   SSN-like patterns) — label this clearly as a demo simulation, not the actual
   extension model.
2. Detected spans get a <mark>-style highlight in the accent color, with a small
   label showing the detected type on hover.
3. A live "detections found" counter that updates as the user types.
4. Optional stretch, only after the base version works well: a small drei-based
   panel beside the input showing detected items as glowing nodes that pulse in on
   detection.

Start with the regex version. Separately, tell me what it'd take to upgrade to a
real transformers.js model running in-browser.
```
**Effort:** Significant (1–2 weeks full version, less regex-only) | **Dependencies:** 5.4

---

## Phase 6 — Skills (optional addition)
*Doesn't map to an existing section in your original vanilla build — only worth doing if you actually want to replace your current tech marquee with something heavier.*

### 6.1 — 3D skill "solar system"
```
Replace the tech marquee with an interactive 3D skill visualization using React
Three Fiber.

1. Group skills into 3 orbital rings by category (e.g., AI/ML at radius 3, Frontend
   at radius 5, Backend at radius 7), plus a central glowing sphere representing you.
2. Small spheres along each ring's circumference represent individual skills. Each
   ring rotates slowly at a different speed.
3. OrbitControls so the whole system can be dragged/rotated. Hover a node (via
   Raycaster or drei's hover helpers) to scale it 1.5x and show a drei <Html>
   tooltip with the skill name.
4. White nodes by default; give the AI/ML ring a subtle accent tint to emphasize
   that positioning.
```
**Effort:** Moderate (3–5 days) | **Dependencies:** 0.1, 0.2

---

## Phase 7 — Contact / Footer

### 7.1 — Enhanced magnetic contact links
```
Audit the contact section's links to use the shared Magnetic component from 0.5
instead of any duplicate/inconsistent magnetic code.

1. Add an accent-colored glow/underline that draws in on hover, synced with the
   magnetic movement timing.
2. Give social icons (if present) the same hover treatment for consistency.
```
**Effort:** Quick win (half day) | **Dependencies:** 0.5

### 7.2 — Footer & final polish pass
```
Final polish pass across the whole page:

1. Footer: apply design tokens from 0.2 (no hardcoded values), add a fade/slide-in
   via ScrollTrigger when it enters the viewport, and give any "back to top"
   element a smooth-scroll (via Lenis) + Magnetic hover. Double-check the grain
   overlay from 0.4 isn't hurting contrast here specifically, since the footer
   often has a different background treatment — turn it off locally if it does.
2. Scroll progress bar: a fixed, 2px, accent-colored bar at the very top of the
   viewport, width driven by scroll position / total scrollable height.
3. Section dividers: a horizontal line between major sections that animates
   0%→100% width via ScrollTrigger as it enters the viewport.
4. Footer CTA: a large "Let's Build Something" (or your preferred line) typographic
   CTA, wrapped in the Magnetic component, shifting to the accent color on hover.
```
**Effort:** Quick win–Moderate (1 day) | **Dependencies:** 0.2, 0.4, 0.5

---

## Suggested execution order

| Order | Tasks | Focus |
|---|---|---|
| 1 | 0.1 → 0.2 → 0.3 → 0.4 → 0.5 | Foundation — stack, tokens, cursor, grain, magnetic utility |
| 2 | 1.1 → 1.2 → 1.3 | Hero — validates the R3F pipeline early, biggest first impression |
| 3 | 2.1 → 3.1 | Quick nav/about wins |
| 4 | 5.1 → 5.2 → 5.3 → 5.4 | Works section — biggest visible upgrade |
| 5 | 4.1 → 4.2 | Experience timeline (reuses 3.1's pattern) |
| 6 | 5.5 → 5.6 | Architecture viz + live demo — highest AI-signal value, most effort |
| 7 | 6.1 | Skills solar system (optional) |
| 8 | 7.1 → 7.2 | Contact/footer + final polish |

---

Want me to also draft the actual problem/approach/outcome copy for the three case
studies in 5.4, based on the metrics you've already got?
