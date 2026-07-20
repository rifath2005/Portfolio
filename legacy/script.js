// ============================================================================
// PORTFOLIO INTERACTIVITY
// ============================================================================

// --- Element References ---
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');
const menuOverlay = document.querySelector('.menu-overlay');

// --- Theme Toggle - Hanging Bulb ---
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
      
      // Add swing animation if motion is not reduced
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        bulbWrapper.classList.add('swinging');
        setTimeout(() => {
          bulbWrapper.classList.remove('swinging');
        }, 1000);
      }
    }
  });

  // Toggle theme on keyboard press (Enter / Space)
  themeBulb.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.body.classList.toggle('dark-theme');
      
      // Save preference
      if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
      
      // Add swing animation if motion is not reduced
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced) {
        bulbWrapper.classList.add('swinging');
        setTimeout(() => {
          bulbWrapper.classList.remove('swinging');
        }, 1000);
      }
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
      const ropeLength = 100 + currentY * 0.5;
      const controlX = 2 + currentX * 0.5;
      const controlY = ropeLength * 0.5 + Math.abs(currentX) * 0.2;
      
      const newPath = `M 2 0 Q ${controlX} ${controlY} ${2 + currentX * 0.8} ${ropeLength}`;
      ropePath.setAttribute('d', newPath);
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

// --- Contact Modal with Focus Trap ---
const contactModal = document.getElementById('contactModal');
const contactBtns = document.querySelectorAll('.contact-btn');
const modalOverlay = document.querySelector('.contact-modal-overlay');
const modalClose = document.querySelector('.contact-modal-close');
const portfolioMain = document.querySelector('main');
let lastActiveElement = null;

function openModal() {
  if (!contactModal) return;
  lastActiveElement = document.activeElement;
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Accessibility: hide background content from screen readers
  if (portfolioMain) portfolioMain.setAttribute('aria-hidden', 'true');
  
  // Focus the close button
  if (modalClose) modalClose.focus();
  
  // Add focus trap
  contactModal.addEventListener('keydown', trapFocus);
}

function closeModal() {
  if (!contactModal) return;
  contactModal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Restore background content for screen readers
  if (portfolioMain) portfolioMain.removeAttribute('aria-hidden');
  
  // Remove focus trap
  contactModal.removeEventListener('keydown', trapFocus);
  
  // Return focus to the trigger button
  if (lastActiveElement) lastActiveElement.focus();
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  
  const focusableElements = contactModal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  if (e.shiftKey) {
    // Shift+Tab: if on first element, wrap to last
    if (document.activeElement === firstFocusable) {
      lastFocusable.focus();
      e.preventDefault();
    }
  } else {
    // Tab: if on last element, wrap to first
    if (document.activeElement === lastFocusable) {
      firstFocusable.focus();
      e.preventDefault();
    }
  }
}

// Open modal
if (contactBtns.length > 0 && contactModal) {
  contactBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openModal();
    });
  });
}

// Close modal: overlay click
if (modalOverlay && contactModal) {
  modalOverlay.addEventListener('click', closeModal);
}

// Close modal: close button
if (modalClose && contactModal) {
  modalClose.addEventListener('click', closeModal);
}

// Close modal: Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && contactModal && contactModal.classList.contains('active')) {
    closeModal();
  }
});

// --- Close Mobile Menu ---
function closeMobileMenu() {
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (navLinksContainer) navLinksContainer.classList.remove('active');
  if (menuOverlay) menuOverlay.classList.remove('active');
  document.body.classList.remove('menu-open');
}

// --- Hamburger Menu Toggle ---
if (hamburger && navLinksContainer) {
  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isActive = hamburger.classList.contains('active');
    
    if (isActive) {
      closeMobileMenu();
    } else {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      navLinksContainer.classList.add('active');
      if (menuOverlay) menuOverlay.classList.add('active');
      document.body.classList.add('menu-open');
    }
  }, false);

  // Close menu when clicking overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
    }, false);
  }
}

// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {

  // --- Smooth Scroll Navigation ---
  function initSmoothScroll() {
    const allNavLinks = document.querySelectorAll('.nav__link, .nav-links a');
    allNavLinks.forEach((link) => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof closeMobileMenu === 'function') {
          closeMobileMenu();
        }
        
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.slice(1);
          let targetElement;
          
          if (targetId === 'hero' || targetId === '') {
            targetElement = document.querySelector('.hero');
          } else {
            targetElement = document.getElementById(targetId);
          }
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }, false);
    });
  }

  // --- Nav blur on scroll ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, { passive: true });
  }

  // --- Scroll progress indicator ---
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });

  // --- Scroll-triggered section reveals ---
  function initScrollReveals() {
    const revealElements = document.querySelectorAll(
      '.work-card, .service-block, .contact-link, .contact-intro, .section__title, .bio-text'
    );
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach((el, index) => {
      el.classList.add('reveal-on-scroll');
      el.style.transitionDelay = `${(index % 4) * 80}ms`;
      revealObserver.observe(el);
    });
  }

  // --- Initialize after loader ---
  function initEffects() {
    setTimeout(() => {
      initSmoothScroll();
      initScrollReveals();
      initHeroSpotlight();
      initStatsCounters();
      initContactForm();
    }, 100);
  }

  if (document.body.classList.contains('loaded')) {
    initEffects();
  } else {
    window.addEventListener('loaderComplete', initEffects, { once: true });
  }
  
  // --- Contact Links ---
  const contactLinks = document.querySelectorAll('.contact-link');
  
  contactLinks.forEach((link, index) => {
    // Stagger animation on load
    link.style.opacity = '0';
    link.style.transform = 'translateX(-30px)';
    
    setTimeout(() => {
      link.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      link.style.opacity = '1';
      link.style.transform = 'translateX(0)';
    }, 200 + (index * 100));
    
    // Handle click — clean version without DOM-manipulating ripple
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href) {
        if (href.startsWith('mailto:')) {
          window.location.href = href;
        } else if (href.startsWith('tel:')) {
          window.location.href = href;
        } else if (href.startsWith('http')) {
          window.open(href, '_blank', 'noopener,noreferrer');
          e.preventDefault();
        }
      }
    }, true);
  });

  // --- Obfuscated Email Decoding ---
  const obfuscatedEmails = document.querySelectorAll('.obfuscated-email');
  obfuscatedEmails.forEach(el => {
    const user = el.getAttribute('data-user');
    const domain = el.getAttribute('data-domain');
    if (user && domain) {
      const email = `${user}@${domain}`;
      
      const decodeEmail = (e) => {
        el.setAttribute('href', `mailto:${email}`);
        
        // Update label text if present inside the element
        const label = el.querySelector('.email-text');
        if (label && label.textContent === 'Click to reveal') {
          label.textContent = email;
        }
      };
      
      el.addEventListener('mouseenter', decodeEmail);
      el.addEventListener('focus', decodeEmail);
      el.addEventListener('click', decodeEmail);
    }
  });
});

// --- Hero Spotlight Mouse Tracker ---
function initHeroSpotlight() {
  const heroSection = document.querySelector('.hero');
  const heroSpotlight = document.querySelector('.hero-spotlight');

  if (heroSection && heroSpotlight) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroSpotlight.style.setProperty('--x', `${x}px`);
      heroSpotlight.style.setProperty('--y', `${y}px`);
    }, { passive: true });
  }
}

// --- Animated Statistics Counters ---
function initStatsCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1500; // 1.5 seconds
        const stepTime = Math.max(Math.floor(duration / target), 20);
        
        const timer = setInterval(() => {
          count++;
          entry.target.textContent = count;
          if (count >= target) {
            entry.target.textContent = target;
            clearInterval(timer);
          }
        }, stepTime);
        
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  statNumbers.forEach(num => statsObserver.observe(num));
}

// --- Contact Form Submission Handling ---
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);
    const action = contactForm.getAttribute('action');
    
    try {
      if (action.includes('YOUR_FORM_ID')) {
        // Fallback for demo mode
        await new Promise(resolve => setTimeout(resolve, 1200));
        showFormToast('Message Sent (Demo Mode)! Update Formspree ID.');
        contactForm.reset();
      } else {
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          showFormToast('Message Sent Successfully!');
          contactForm.reset();
        } else {
          showFormToast('Oops! Problem submitting form.');
        }
      }
    } catch (error) {
      showFormToast('Network error. Please try again.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormToast(message) {
  // Clear any existing toasts first
  const existingToasts = document.querySelectorAll('.form-toast');
  existingToasts.forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'form-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('visible');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}
