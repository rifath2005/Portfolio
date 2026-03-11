document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelectorAll('.nav__link');
  
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinksMenu = document.querySelector('.nav-links');
  
  if (mobileMenuToggle && navLinksMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      navLinksMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const menuLinks = navLinksMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navLinksMenu.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !navLinksMenu.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navLinksMenu.classList.remove('active');
      }
    });
  }

  /* ---- Mobile menu toggle ---- */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    /* Close menu on escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* ---- Smooth scroll + close mobile menu when clicking nav link ---- */
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      link.addEventListener('click', (e) => {
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          if (navMenu && navMenu.classList.contains('is-open')) {
            navMenu.classList.remove('is-open');
            if (navToggle) {
              navToggle.setAttribute('aria-expanded', 'false');
              navToggle.setAttribute('aria-label', 'Open menu');
            }
          }
          const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
        }
      });
    }
  });

  /* ---- Scroll-reveal: init after loader completes for smooth flow ---- */
  function initReveal() {
    const sections = main ? main.querySelectorAll(':scope > section') : document.querySelectorAll('main > section');
    sections.forEach(section => section.classList.add('reveal-section'));

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -5% 0px',
      threshold: [0.1, 0.2]
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  if (document.body.classList.contains('loaded')) {
    initReveal();
  } else {
    window.addEventListener('loaderComplete', initReveal, { once: true });
  }

  /* ---- Parallax Scroll Effect ---- */
  function initParallax() {
    const hero = document.querySelector('.hero');
    const heroHeadline = document.querySelector('.main-headline');
    const heroPhoto = document.querySelector('.photo-container');
    const heroServices = document.querySelector('.services-list');
    const heroLocation = document.querySelector('.location-text');
    const sections = document.querySelectorAll('.section');
    
    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      // Hero section parallax
      if (hero) {
        const heroTop = hero.offsetTop;
        const heroHeight = hero.offsetHeight;
        const heroScroll = scrolled - heroTop;
        
        if (scrolled < heroHeight) {
          // Headline moves slower (0.3x speed)
          if (heroHeadline) {
            heroHeadline.style.transform = `translateY(${heroScroll * 0.3}px)`;
          }
          
          // Photo moves at normal speed with slight scale
          if (heroPhoto) {
            const scale = 1 + (heroScroll / heroHeight) * 0.1;
            heroPhoto.style.transform = `translateY(${heroScroll * 0.5}px) scale(${scale})`;
          }
          
          // Services list moves faster (0.7x speed)
          if (heroServices) {
            heroServices.style.transform = `translateY(${heroScroll * 0.7}px)`;
          }
          
          // Location text moves slower (0.2x speed)
          if (heroLocation) {
            heroLocation.style.transform = `translateY(${heroScroll * 0.2}px)`;
          }
        }
      }
      
      // Section parallax effects
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionScroll = scrolled - sectionTop + window.innerHeight;
        
        if (sectionScroll > 0 && sectionScroll < sectionHeight + window.innerHeight) {
          const progress = sectionScroll / (sectionHeight + window.innerHeight);
          
          // Different parallax speeds for different sections
          const speed = index % 2 === 0 ? 0.3 : -0.2;
          const translateY = (progress - 0.5) * 100 * speed;
          
          section.style.transform = `translateY(${translateY}px)`;
          
          // Fade effect based on scroll position
          const opacity = 1 - Math.abs(progress - 0.5) * 0.3;
          section.style.opacity = Math.max(0.7, opacity);
        }
      });
      
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    // Listen to scroll events
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial call
    updateParallax();
  }

  // Initialize parallax after loader completes
  if (document.body.classList.contains('loaded')) {
    initParallax();
  } else {
    window.addEventListener('loaderComplete', () => {
      setTimeout(initParallax, 100);
    }, { once: true });
  }
});