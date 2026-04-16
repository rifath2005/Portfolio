// Hamburger menu - Initialize immediately, not waiting for other scripts
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');
const menuOverlay = document.querySelector('.menu-overlay');

console.log('Menu elements found:', {
  hamburger: !!hamburger,
  navLinksContainer: !!navLinksContainer,
  menuOverlay: !!menuOverlay
});

/* ---- Contact Modal ---- */
const contactModal = document.getElementById('contactModal');
const contactBtn = document.querySelector('.contact-btn');
const modalOverlay = document.querySelector('.contact-modal-overlay');
const modalClose = document.querySelector('.contact-modal-close');

// Open modal when clicking Contact Me button
if (contactBtn && contactModal) {
  contactBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Opening contact modal');
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

// Close modal when clicking overlay
if (modalOverlay) {
  modalOverlay.addEventListener('click', function() {
    console.log('Closing modal via overlay');
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close modal when clicking close button
if (modalClose) {
  modalClose.addEventListener('click', function() {
    console.log('Closing modal via close button');
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
    console.log('Closing modal via Escape key');
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ---- Close Mobile Menu Function ---- */
function closeMobileMenu() {
  console.log('Closing menu...');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (navLinksContainer) navLinksContainer.classList.remove('active');
  if (menuOverlay) {
    menuOverlay.classList.remove('active');
    console.log('Overlay removed');
  }
  document.body.classList.remove('menu-open');
}

/* ---- Hamburger Menu Toggle ---- */
if (hamburger && navLinksContainer) {
  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isActive = hamburger.classList.contains('active');
    
    if (isActive) {
      // Close menu
      console.log('Closing menu via hamburger');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinksContainer.classList.remove('active');
      if (menuOverlay) {
        menuOverlay.classList.remove('active');
        console.log('Overlay hidden');
      }
      document.body.classList.remove('menu-open');
    } else {
      // Open menu
      console.log('Opening menu via hamburger');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      navLinksContainer.classList.add('active');
      if (menuOverlay) {
        menuOverlay.classList.add('active');
        console.log('Overlay shown, classes:', menuOverlay.className);
      }
      document.body.classList.add('menu-open');
    }
  }, false);

  // Close menu when clicking overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Overlay clicked');
      closeMobileMenu();
    }, false);
  }
}

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
    const allNavLinks = document.querySelectorAll('.nav__link, .nav-links a');
    allNavLinks.forEach((link) => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close mobile menu first
        if (typeof closeMobileMenu === 'function') {
          closeMobileMenu();
        }
        
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const id = href.slice(1);
          const sectionIds = ['hero', 'about', 'works', 'services', 'contact'];
          const sectionIndex = sectionIds.indexOf(id);
          if (sectionIndex >= 0) {
            // Small delay to allow menu to close smoothly
            setTimeout(() => {
              scrollToSection(sectionIndex);
            }, 400);
          }
        }
      }, false);
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
  
  /* ---- Contact Links - Ensure they work properly ---- */
  const contactLinks = document.querySelectorAll('.contact-link');
  
  console.log('Contact links found:', contactLinks.length);
  
  contactLinks.forEach((link, index) => {
    console.log(`Link ${index}:`, link.getAttribute('href'));
    
    // Add stagger animation on load
    link.style.opacity = '0';
    link.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
      link.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      link.style.opacity = '1';
      link.style.transform = 'translateX(0)';
    }, 200 + (index * 100));
    
    // Handle click with ripple effect
    link.addEventListener('click', function(e) {
      console.log('Contact link clicked:', this.getAttribute('href'));
      
      // Create visual ripple effect
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
      
      // Get the href
      const href = this.getAttribute('href');
      
      // Handle different link types
      if (href) {
        if (href.startsWith('mailto:')) {
          // Email link - let browser handle it
          console.log('Opening email client');
          window.location.href = href;
        } else if (href.startsWith('tel:')) {
          // Phone link - let browser handle it
          console.log('Opening phone dialer');
          window.location.href = href;
        } else if (href.startsWith('http')) {
          // External link - open in new tab
          console.log('Opening external link in new tab');
          window.open(href, '_blank', 'noopener,noreferrer');
          e.preventDefault();
        }
      }
    }, true); // Use capture phase to ensure we catch the event first
    
    // Add magnetic effect on hover (desktop only)
    if (window.innerWidth > 768) {
      link.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0, 0)';
      });
    }
  });
});
