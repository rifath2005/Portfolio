Here is your step-by-step execution plan. I have broken down the entire roadmap into individual, copy-pasteable prompts. 

**How to use these:** Feed these prompts one by one into your AI coding assistant (Cursor, GitHub Copilot, ChatGPT, etc.) *within the context of your codebase*. Do not move to the next prompt until the current one is working perfectly. 

---

### Phase 0: Foundation & Architecture

*Before adding 3D and complex animations, the foundation must be solid and the scroll must be smooth.*

**Task 1: Migrate to Next.js + Setup**
```text
I want to upgrade my portfolio from plain HTML/CSS/JS to Next.js (App Router) to better demonstrate my full-stack capabilities and support React Three Fiber. 

Please set up a new Next.js project with the following:
1. TypeScript configured.
2. Tailwind CSS installed and configured (replace my vanilla CSS).
3. GSAP installed (register ScrollTrigger plugin).
4. @react-three/fiber and @react-three/drei installed.
5. Lenis for smooth scrolling installed and configured as a global provider.

Create a basic layout.tsx with a main tag that has smooth scrolling enabled via Lenis.
```

**Task 2: Global Theme & Color Tokens**
```text
Configure my Tailwind CSS and global CSS variables to strictly follow my Black & White + Copper accent theme. 

1. Define these color tokens in tailwind.config.ts:
   - Background: Pure Black (#000000) and Dark Gray (#0A0A0A)
   - Foreground: Pure White (#FFFFFF) and Light Gray (#999999)
   - Accent: Copper/Orange (#FFA500)
2. Ensure the base HTML has a black background and white text to prevent flashing.
3. Create a global CSS variable `--accent` mapped to the Copper color so I can use it in Three.js shaders later.
```

**Task 3: Custom Cursor & Magnetic Links**
```text
Create a custom cursor component and magnetic interaction logic to make the portfolio feel premium.

1. Custom Cursor: 
   - Hide the default cursor globally.
   - Create a small 10px white circle (outer ring) and a 4px dot (inner) that follow the mouse with a smooth lerp (use requestAnimationFrame).
   - When hovering over <a> or <button> elements, the outer ring scales up to 3x and blends to the Copper accent color.
2. Magnetic Links:
   - Create a reusable MagneticLink component.
   - On mousemove within a 50px radius, calculate the distance from the center and apply a transform: translate(X, Y) toward the cursor (max 15px).
   - On mouseleave, snap back to center with a spring-like ease.
```

---

### Phase 1: The Hero Section

*This is the most critical section. It must scream "AI Engineer" immediately.*

**Task 4: Three.js Neural Node Graph Background**
```text
Create a React Three Fiber canvas to serve as the Hero section background, representing an AI neural network.

1. Generate 1500 particles (nodes) using BufferGeometry and Points.
2. Generate connections (lines) between nodes that are within a specific distance threshold using LineSegments.
3. Write a custom ShaderMaterial for the points to make them soft glowing circles (not squares), colored white.
4. Connection lines should be very dim white/gray.
5. Animation: Nodes should gently float using sin(time + offset) in the vertex shader.
6. Mouse Interaction: Pass normalized mouse coordinates as a uniform. Nodes within a 0.2 radius of the mouse should be pushed away slightly or attracted, and the closest connections should pulse with my Copper accent color (#FFA500).
7. Ensure the Canvas has a transparent background so my HTML text overlays it.
```

**Task 5: Hero Text Reveal & Draggable Bulb Integration**
```text
Build the Hero UI overlaying the Three.js canvas, incorporating GSAP text reveals and my signature lightbulb theme toggle.

1. Text Reveal: Create a component that splits my name and title ("AI Engineer & Full-Stack Developer") into characters. Use GSAP ScrollTrigger or a simple intersection observer to stagger the reveal of each character from translateY: 100% to 0% with an expo.out ease.
2. Draggable Bulb: Migrate my hanging lightbulb CSS/JS logic to React. The bulb should hang from the top, and the user can drag it. 
3. Integration: When the bulb is "on" (dragged down), fire a state change that passes a uniform (e.g., uBulbOn = 1.0) to the Three.js Neural Node Graph, making the entire network pulse with the Copper accent instead of white.
```

---

### Phase 2: The About Section

*Clean, readable, and subtly animated.*

**Task 6: Line-by-Line Scroll Reveal**
```text
Create a text reveal component for my About section paragraphs.

1. Create a ScrollRevealText component that takes children (string paragraphs).
2. Split the text into lines (or individual words).
3. Wrap each line in an overflow: hidden div.
4. Use GSAP ScrollTrigger to animate each inner word from translateY: 100% and opacity: 0 to translateY: 0% and opacity: 1.
5. Stagger the animation by 0.05s per line.
6. Trigger the animation when the element is 20% inside the viewport.
7. Make sure to respect prefers-reduced-motion.
```

---

### Phase 3: The Works Section (The Biggest Upgrade)

*Moving from static cards to immersive showcases.*

**Task 7: Full-Width Immersive Project Card Layout**
```text
Rebuild my project showcase. I currently have a static grid; I want full-width, immersive cards with a parallax hover effect.

1. Layout: Create a vertical stack of full-width cards. Each card should have aspect-ratio: 16/9 or a fixed height of 70vh, with overflow: hidden.
2. Structure per card:
   - Absolute positioned background image.
   - Gradient overlay (bottom-up black gradient for text readability).
   - Bottom-left positioned text: Project Name (large), Subtitle, and tech stack pills.
   - A 2px bottom border that scales from 0 to 100% width on hover, colored in my Copper accent.
3. Parallax Hover: On mousemove over the card, calculate the cursor's offset from the center. Use GSAP to smoothly translate the background image in the opposite direction of the cursor (parallax strength ~15px) and scale the image to 1.1. On mouseleave, snap back to center.
```

**Task 8: Animated Metric Counters**
```text
Add metric counters to my project cards to highlight the impact of my work (e.g., "Latency Drop: -60%", "Query Latency: 50ms").

1. Isolate the numbers in my project data (e.g., "60", "50").
2. Create an AnimatedCounter component.
3. Use GSAP ScrollTrigger to detect when the card enters the viewport.
4. Animate the number from 0 to its target value over 1.5 seconds using an expo.out ease.
5. Append the appropriate prefix/suffix ("-", "%", "ms") after the animation completes or during.
```

**Task 9: Three.js Mini-Visualizations in Project Cards**
```text
I want to add small, interactive Three.js scenes specific to each project inside the project cards to prove my AI/Engineering skills visually.

Create a generic ProjectScene component that accepts a "type" prop. Implement two types for now:
1. type="flow" (For MCP Auto - Webhook/Event Orchestration): A particle flow visualization. 100 small spheres moving rapidly along curved paths (using CatmullRomCurve3). On card hover, the particles speed up and turn Copper.
2. type="shatter" (For Brevity AI - Privacy): A rotating Icosahedron geometry. On card hover, use GSAP to explode the vertices outward (or just swap to a wireframe and fade opacity) to represent "shattering" or "cloaking" data, then reform on mouse leave.

Render these canvases absolutely positioned behind the text overlay of the immersive project cards.
```

---

### Phase 4: Skills & Experience

*Visualizing full-stack capability.*

**Task 10: Three.js 3D Skill Solar System**
```text
Replace my current tech marquee with an interactive 3D Skill Solar System using React Three Fiber.

1. Data: Group my skills into 3 orbital rings: AI/ML (radius 3), Frontend (radius 5), Backend (radius 7).
2. Scene Setup: Render small spheres (skill nodes) positioned along the circumferences of these rings. Add a central glowing sphere representing "Me".
3. Animation: Make each ring slowly rotate at different speeds around the Y-axis.
4. Interactivity: Add OrbitControls so the user can drag and rotate the entire system. Add hover detection (using Drei's Hover component or Raycaster) so when a node is hovered, it scales up 1.5x and displays an HTML tooltip (using Drei's Html component) with the tech name.
5. Color: All nodes white. The AI/ML ring connections/nodes should have a subtle Copper tint to emphasize my primary positioning.
```

**Task 11: Animated Experience Timeline**
```text
Build a vertical timeline for my Experience section with staggered scroll animations.

1. Layout: A vertical 1px line in the center (or slightly offset) in dim gray.
2. Entries: For each experience, display a 8px Copper circle on the line, with the Year, Role, Company, and 1 impact sentence alternating left/right of the line.
3. Animation: Use GSAP ScrollTrigger to scrub a "draw" effect on the vertical line as the user scrolls. Each entry should fade in and slide up (from translateY: 30px) with a 0.1s stagger as the line reaches their position.
```

---

### Phase 5: Final Polish

**Task 12: Scroll Progress Bar & Page Polish**
```text
Add final polish elements to make the portfolio feel premium and complete.

1. Scroll Progress: Add a position: fixed div at the very top of the viewport (z-index: 9999). Height 2px, background: Copper (#FFA500). Its width should dynamically update based on window.scrollY / total scrollable height.
2. Section Dividers: Between major sections (Hero, About, Works, Skills, Contact), add a horizontal line that animates its width from 0% to 100% using GSAP ScrollTrigger when it enters the viewport.
3. Footer CTA: Create a large typographic "Let's Build Something" CTA at the bottom. Apply a magnetic hover effect to the entire text block, and on hover, change the text color to Copper.
```