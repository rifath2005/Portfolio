// Hamburger menu - Initialize immediately, not waiting for other scripts
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');
const menuOverlay = document.querySelector('.menu-overlay');

console.log('Menu elements found:', {
  hamburger: !!hamburger,
  navLinksContainer: !!navLinksContainer,
  menuOverlay: !!menuOverlay
});

/* ---- Theme Toggle - Hanging Bulb ---- */
const bulbWrapper = document.getElementById('bulbWrapper');
const themeBulb = document.getElementById('themeBulb');
const bulbRope = document.querySelector('.bulb-rope');

let isDragging = false;
let startX, startY, currentX = 0, currentY = 0;
let swingAngle = 0;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
}

// Toggle theme on click
if (themeBulb) {
  themeBulb.addEventListener('click', function(e) {
    if (!isDragging) {
      document.body.classList.toggle('dark-theme');
      
      // Save preference
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
      
      // Add swing animation
      bulbWrapper.classList.add('swinging');
      setTimeout(() => {
        bulbWrapper.classList.remove('swinging');
      }, 1000);
    }
  });
}

// Dragging functionality
if (bulbWrapper) {
  bulbWrapper.addEventListener('mousedown', startDrag);
  bulbWrapper.addEventListener('touchstart', startDrag);
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('touchmove', drag);
  
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

function startDrag(e) {
  isDragging = true;
  const touch = e.touches ? e.touches[0] : e;
  startX = touch.clientX - currentX;
  startY = touch.clientY - currentY;
  bulbWrapper.style.transition = 'none';
}

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  const touch = e.touches ? e.touches[0] : e;
  currentX = touch.clientX - startX;
  currentY = touch.clientY - startY;
  
  // Limit movement
  const maxMove = 120;
  currentX = Math.max(-maxMove, Math.min(maxMove, currentX));
  currentY = Math.max(-30, Math.min(maxMove, currentY));
  
  // Calculate swing angle
  swingAngle = Math.atan2(currentX, 100) * (180 / Math.PI);
  
  // Apply transform to bulb
  bulbWrapper.style.transform = `translate(calc(-50% + ${currentX}px), ${currentY}px)`;
  
  // Update rope path to create curved effect
  if (bulbRope) {
    const ropePath = bulbRope.querySelector('#ropePath');
    if (ropePath) {
      // Calculate rope length based on pull distance
      const ropeLength = 100 + currentY * 0.5; // Extend rope when pulled down
      
      // Create curved path using quadratic bezier
      // Control point creates the curve effect
      const controlX = 2 + currentX * 0.5; // Curve follows horizontal movement
      const controlY = ropeLength * 0.5 + Math.abs(currentX) * 0.2; // Curve depth
      
      const newPath = `M 2 0 Q ${controlX} ${controlY} ${2 + currentX * 0.8} ${ropeLength}`;
      ropePath.setAttribute('d', newPath);
      
      // Update rope height
      bulbRope.setAttribute('height', ropeLength);
      bulbRope.setAttribute('viewBox', `0 0 4 ${ropeLength}`);
    }
  }
}

function stopDrag() {
  if (!isDragging) return;
  isDragging = false;
  
  // Animate back to center
  bulbWrapper.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  bulbWrapper.style.transform = 'translateX(-50%)';
  
  // Animate rope back to straight
  if (bulbRope) {
    const ropePath = bulbRope.querySelector('#ropePath');
    if (ropePath) {
      // Smooth transition back to straight line
      setTimeout(() => {
        ropePath.style.transition = 'd 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        ropePath.setAttribute('d', 'M 2 0 Q 2 50 2 100');
        bulbRope.setAttribute('height', '100');
        bulbRope.setAttribute('viewBox', '0 0 4 100');
        
        setTimeout(() => {
          ropePath.style.transition = '';
        }, 800);
      }, 50);
    }
  }
  
  currentX = 0;
  currentY = 0;
  swingAngle = 0;
}

/* ---- Contact Modal ---- */
const contactModal = document.getElementById('contactModal');
const contactBtn = document.querySelector('.contact-btn');
const modalOverlay = document.querySelector('.contact-modal-overlay');
const modalClose = document.querySelector('.contact-modal-close');

console.log('Contact Modal Elements:', {
  contactModal: !!contactModal,
  contactBtn: !!contactBtn,
  modalOverlay: !!modalOverlay,
  modalClose: !!modalClose
});

// Open modal when clicking Contact Me button
if (contactBtn && contactModal) {
  console.log('Setting up contact button click handler');
  contactBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Contact button clicked! Opening modal...');
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Modal classes:', contactModal.className);
  });
} else {
  console.error('Contact button or modal not found!', { contactBtn, contactModal });
}

// Close modal when clicking overlay
if (modalOverlay && contactModal) {
  modalOverlay.addEventListener('click', function() {
    console.log('Closing modal via overlay');
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close modal when clicking close button
if (modalClose && contactModal) {
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

  /* ---- Simple Smooth Scroll Navigation (Static Page) ---- */
  function initSmoothScroll() {
    // Navigation click - smooth scroll to sections
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
          const targetId = href.slice(1);
          let targetElement;
          
          // Handle special case for hero section
          if (targetId === 'hero' || targetId === '') {
            targetElement = document.querySelector('.hero');
          } else {
            targetElement = document.getElementById(targetId);
          }
          
          if (targetElement) {
            // Smooth scroll to target
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, false);
    });
  }

  /* ---- Initialize after loader ---- */
  function initEffects() {
    setTimeout(() => {
      initSmoothScroll();
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
