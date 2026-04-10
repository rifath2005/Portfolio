document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav__link, .nav-links a');

  /* ---- Full Page Scroll with Storytelling Effect ---- */
  function initFullPageScroll() {
    const sections = document.querySelectorAll('.hero, .section');
    let currentSection = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;
    let scrollAccumulator = 0;
    const scrollThreshold = 100; // Increased threshold - need more scroll to change section

    // Set initial section states - ENSURE HERO IS VISIBLE
    sections.forEach((section, index) => {
      section.style.position = 'fixed';
      section.style.top = '0';
      section.style.left = '0';
      section.style.width = '100%';
      section.style.minHeight = '100vh';
      section.style.opacity = index === 0 ? '1' : '0';
      section.style.transform = index === 0 ? 'translateY(0)' : 'translateY(100vh)';
      section.style.transition = 'all 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
      section.style.zIndex = index === 0 ? '10' : '1';
      section.style.visibility = index === 0 ? 'visible' : 'hidden';
      
      // Add section number indicator
      if (!section.querySelector('.section-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        indicator.textContent = `0${index + 1}`;
        section.appendChild(indicator);
      }
    });

    function scrollToSection(index) {
      if (index < 0 || index >= sections.length || isScrolling) return;
      
      isScrolling = true;
      const oldSection = currentSection;
      currentSection = index;

      // Hide old section
      sections[oldSection].style.transform = index > oldSection ? 'translateY(-100vh)' : 'translateY(100vh)';
      sections[oldSection].style.opacity = '0';
      
      setTimeout(() => {
        sections[oldSection].style.visibility = 'hidden';
      }, 600);

      // Show new section
      sections[index].style.visibility = 'visible';
      sections[index].style.transform = 'translateY(0)';
      sections[index].style.opacity = '1';
      sections[index].style.zIndex = '10';

      setTimeout(() => {
        sections[oldSection].style.zIndex = '1';
        isScrolling = false;
        scrollAccumulator = 0; // Reset accumulator
      }, 1200);
    }

    // Mouse wheel scroll with accumulator
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
      if (isScrolling) return;
      
      // Accumulate scroll delta
      scrollAccumulator += Math.abs(e.deltaY);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (scrollAccumulator >= scrollThreshold) {
          if (e.deltaY > 0) {
            scrollToSection(currentSection + 1);
          } else {
            scrollToSection(currentSection - 1);
          }
          scrollAccumulator = 0;
        } else {
          // Reset if not enough scroll
          scrollAccumulator = 0;
        }
      }, 150); // Increased delay for better control
    }, { passive: true });

    // Touch events for mobile
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;
      if (Math.abs(swipeDistance) > 80 && !isScrolling) { // Increased threshold
        if (swipeDistance > 0) {
          scrollToSection(currentSection + 1);
        } else {
          scrollToSection(currentSection - 1);
        }
      }
    }, { passive: true });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(currentSection - 1);
      }
    });

    // Navigation click
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const id = href.slice(1);
          const sectionIds = ['hero', 'about', 'works', 'services', 'contact'];
          const sectionIndex = sectionIds.indexOf(id);
          if (sectionIndex >= 0) {
            scrollToSection(sectionIndex);
          }
        }
      });
    });
  }

  /* ---- 3D Parallax Effect ---- */
  function init3DParallax() {
    const sections = document.querySelectorAll('.hero, .section');
    
    sections.forEach(section => {
      section.style.perspective = '1000px';
      section.style.transformStyle = 'preserve-3d';
    });

    let ticking = false;

    function update3DEffect() {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const rotateX = (progress - 0.5) * 5;
          
          const title = section.querySelector('.main-headline, .section__title, .about-title');
          const content = section.querySelector('.hero-middle, .work-grid, .services-grid, .contact-content');
          
          if (title) {
            title.style.transform = `translateZ(50px) rotateX(${rotateX * 0.5}deg)`;
            title.style.transformStyle = 'preserve-3d';
          }
          
          if (content) {
            content.style.transform = `translateZ(30px)`;
            content.style.transformStyle = 'preserve-3d';
          }
        }
      });
      
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(update3DEffect);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    update3DEffect();
  }

  /* ---- Initialize after loader ---- */
  function initEffects() {
    setTimeout(() => {
      initFullPageScroll();
      init3DParallax();
    }, 100);
  }

  if (document.body.classList.contains('loaded')) {
    initEffects();
  } else {
    window.addEventListener('loaderComplete', initEffects, { once: true });
  }
});
