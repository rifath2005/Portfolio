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

  // Track mouse movement
  const handleMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // Animate orbit based on mouse position + auto-rotation
  function animateOrbit() {
    // Auto-rotation speed (negative for opposite direction)
    autoRotation -= 2.5; // Degrees per frame (faster spin)

    // Smooth interpolation for mouse
    target.x += (mouse.y * 0.6 - target.x) * 0.05;
    target.y += (mouse.x * 0.6 - target.y) * 0.05;

    // Calculate rotation angles
    const phi = Math.PI / 2 - target.x; // Vertical angle
    const theta = target.y + Math.PI; // Horizontal angle

    // Apply rotation with mouse influence + auto-rotation
    if (loaderOrbitInner) {
      const rotateX = (phi * 180 / Math.PI) - 45; // Base angle 45deg tilt
      const rotateY = (theta * 180 / Math.PI) + autoRotation;
      
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
        
        body.classList.remove('loading');
        body.classList.add('loaded');
        window.dispatchEvent(new Event('loaderComplete'));
      }
    });

    // Orbit and percentage exit (orbit keeps spinning during fade out)
    exitTimeline.to([loaderOrbit, loaderPercent], {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.in',
    });

    // Fade out loader background
    exitTimeline.to(
      loaderElement,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out',
      },
      '-=0.4'
    );

    // Fade in portfolio
    exitTimeline.to(
      '.portfolio',
      {
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
      },
      '-=0.5'
    );

    // Animate hero section sliding up from below
    exitTimeline.from(
      '.hero',
      {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
      },
      '-=0.8'
    );

    // Animate brand name
    exitTimeline.from(
      '.brand-name',
      {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      },
      '-=1.3'
    );

    // Animate nav links with stagger
    exitTimeline.from(
      '.nav__link',
      {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power4.out',
      },
      '-=1.2'
    );

    // Animate hero title
    exitTimeline.from(
      '.hero__title',
      {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      },
      '-=1.0'
    );

    // Animate hero content
    exitTimeline.from(
      '.hero__content, .hero__description',
      {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out',
      },
      '-=0.9'
    );
  }

  updateProgress();
});
