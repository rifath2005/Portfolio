# 💡 Theme Toggle - Hanging Bulb Feature

## Overview
An interactive hanging light bulb that toggles between light and dark themes with realistic physics.

## How It Works

### Visual States

**Light Theme (Default)**
- Bulb: **ON** (white/bright)
- Filament: Visible
- Glow: Active
- Background: White
- Text: Black

**Dark Theme**
- Bulb: **OFF** (dark gray/unlit)
- Filament: Hidden
- Glow: None
- Background: Black
- Text: White

## Interactions

### 1. Click to Toggle Theme
- Click the bulb to switch between light/dark
- Smooth color transition (0.4s)
- Theme preference saved to localStorage
- Bulb swings when clicked

### 2. Drag to Swing
- Click and drag the bulb around
- Realistic pendulum physics
- Rope rotates with movement
- Springs back to center when released
- Doesn't change theme (only clicking does)

### 3. Hover Effect
- Cursor changes to grab/grabbing
- Visual feedback on interaction

## Technical Details

### Positioning
- Fixed position in navbar
- Right side: 150px from right edge
- Hangs from top of screen
- Mobile: 80px from right, smaller size

### Physics
- Pendulum swing animation
- Gravity simulation
- Smooth spring-back motion
- Rotation follows drag angle

### Theme System
Uses CSS custom properties (variables):
```css
--bg-primary: Background color
--bg-secondary: Secondary background
--text-primary: Main text color
--text-secondary: Secondary text
--border-color: Border colors
```

### What Changes in Dark Theme

**Inverted:**
- ✅ All backgrounds (white → black)
- ✅ All text (black → white)
- ✅ Borders
- ✅ Navigation
- ✅ Buttons
- ✅ Sections
- ✅ Modal
- ✅ Contact links

**Unchanged:**
- ❌ Person's photo (stays grayscale)
- ❌ Images
- ❌ Icons

## Browser Support

### LocalStorage
- Theme preference persists across sessions
- Automatically loads saved theme on page load

### Touch Support
- Works on mobile devices
- Touch drag enabled
- Responsive sizing

## Customization

### Change Bulb Position
In `style.css`:
```css
.theme-toggle-container {
  right: 150px; /* Adjust horizontal position */
}

.bulb-wrapper {
  top: 100px; /* Adjust vertical position */
}
```

### Change Bulb Size
```css
.bulb {
  width: 50px;  /* Adjust width */
  height: 70px; /* Adjust height */
}
```

### Change Swing Speed
In `script.js`:
```javascript
bulbWrapper.style.transition = 'transform 0.8s ...'; // Adjust duration
```

### Change Theme Transition Speed
In `style.css`:
```css
body {
  transition: background-color 0.4s ease; /* Adjust speed */
}
```

## Mobile Responsive

### Tablet/Mobile (<768px)
- Bulb size: 35x50px (smaller)
- Position: 80px from right
- Top: 70px (closer to navbar)
- Touch-friendly drag area

## Accessibility

### Keyboard Support
- Can be enhanced with keyboard controls
- Tab navigation possible
- Enter/Space to toggle

### Screen Readers
- Add aria-label for better accessibility
- Announce theme changes

### Reduced Motion
- Respects prefers-reduced-motion
- Can disable swing animations

## Performance

### Optimizations
- CSS transitions (GPU accelerated)
- Transform instead of position changes
- Minimal repaints
- LocalStorage for persistence

### Smooth Animations
- 60fps swing motion
- Hardware acceleration
- Cubic-bezier easing

## Future Enhancements

### Possible Additions
1. Sound effects (click, swing)
2. Particle effects when toggling
3. Multiple bulb colors
4. Auto theme based on time of day
5. Keyboard shortcuts (Ctrl+Shift+L)
6. Smooth color gradient transitions
7. Custom theme colors

## Troubleshooting

### Bulb Not Visible
- Check z-index conflicts
- Verify fixed positioning
- Check if hidden by other elements

### Theme Not Persisting
- Check localStorage support
- Verify browser settings
- Check for private/incognito mode

### Drag Not Working
- Check pointer-events
- Verify event listeners attached
- Check for conflicting scripts

### Colors Not Changing
- Verify CSS variables defined
- Check .dark-theme class applied
- Inspect transition properties

---

**Status**: ✅ Fully implemented
**Theme**: Light (default) / Dark (toggle)
**Interaction**: Click to toggle, Drag to swing
**Persistence**: LocalStorage
**Mobile**: Fully responsive
