// Loader with GSAP animations and mouse-controlled orbit
document.addEventListener('DOMContentLoaded', () => {
  const loaderPercent = document.getElementById('loader-percent');
  const loaderElement = document.getElementById('loader');
  const loaderOrbit = document.querySelector('.loader__orbit');
  const loaderOrbitInner = document.querySelector('.loader__orbit-inner');
  const body = document.body;

  // Mouse tracking for orbit control
  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let animationFrameId = null;
  let autoRotation = 0; // Auto-rotation angle
  const ROTATION_SPEED = 1.5; // Constant rotation speed (degrees per frame) - FIXED SPEED

  // Track mouse movement - normalized for all devices
  const handleMouseMove = (e) => {
    // Normalize mouse position to -1 to 1 range (device independent)
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // Animate orbit based on mouse position + auto-rotation
  function animateOrbit() {
    // CONSTANT auto-rotation speed (independent of mouse speed or DPI)
    autoRotation += ROTATION_SPEED; // Fixed degrees per frame

    // Smooth interpolation for mouse (only affects tilt, not rotation speed)
    target.x += (mouse.y * 0.3 - target.x) * 0.05; // Reduced influence
    target.y += (mouse.x * 0.3 - target.y) * 0.05; // Reduced influence

    // Calculate rotation angles
    const phi = Math.PI / 2 - target.x; // Vertical angle (tilt)
    const theta = target.y; // Horizontal angle (slight influence)

    // Apply rotation with CONSTANT speed + mouse tilt
    if (loaderOrbitInner) {
      const rotateX = (phi * 180 / Math.PI) - 45; // Base angle 45deg tilt
      const rotateY = autoRotation + (theta * 10); // Constant rotation + slight mouse influence
      
      loaderOrbitInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }

    animationFrameId = requestAnimationFrame(animateOrbit);
  }

  // Start mouse-controlled animation
  if (loaderOrbitInner) {
    loaderOrbitInner.classList.add('mouse-controlled');
    animateOrbit();
  }

  // INTRO ANIMATION: Orbit fades in
  if (loaderOrbit && loaderPercent) {
    gsap.set(loaderOrbit, { scale: 0.8, opacity: 0 });
    gsap.set(loaderPercent, { opacity: 0 });

    const introTimeline = gsap.timeline();
    
    introTimeline.to(loaderOrbit, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      delay: 0.5,
      ease: 'power4.out',
    });

    introTimeline.to(
      loaderPercent,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
      },
      '-=0.5'
    );
  }

  // Loading simulation: 0% → 100% over ~5s (extended by 2 seconds)
  let progress = 0;
  const duration = 5000; // Changed from 3000 to 5000ms
  const startTime = Date.now();

  function updateProgress() {
    const elapsed = Date.now() - startTime;
    progress = Math.min((elapsed / duration) * 100, 100);
    
    if (loaderPercent) {
      loaderPercent.textContent = `${Math.round(progress)}%`;
    }

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      setTimeout(completeLoading, 500);
    }
  }

  // EXIT ANIMATION: Loader leaves, portfolio appears
  function completeLoading() {
    const exitTimeline = gsap.timeline({
      onComplete: () => {
        // Stop mouse animation at the very end
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('mousemove', handleMouseMove);
        
        // Remove loader from DOM
        if (loaderElement) {
          loaderElement.style.display = 'none';
        }
        
        body.classList.remove('loading');
        body.classList.add('loaded');
        
        // Dispatch event AFTER loader is completely hidden
        setTimeout(() => {
          window.dispatchEvent(new Event('loaderComplete'));
        }, 100);
      }
    });

    // Orbit and percentage exit
    exitTimeline.to([loaderOrbit, loaderPercent], {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.in',
    });

    // Fade out loader background
    exitTimeline.to(
      loaderElement,
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power4.out',
      },
      '-=0.3'
    );

    // Fade in portfolio - ENSURE IT STARTS FROM HERO SECTION
    exitTimeline.to(
      '.portfolio',
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
      },
      '-=0.2'
    );
  }

  updateProgress();
});
