// Text Animation - Letter by letter effect
document.addEventListener('DOMContentLoaded', function() {
  
  // ===== HERO HEADLINE ANIMATION - Waterfall Hook Effect =====
  function initHeadlineAnimation() {
    const mainHeadline = document.querySelector('.main-headline');
    
    if (mainHeadline && !mainHeadline.dataset.animated) {
      const text = mainHeadline.textContent;
      const letters = text.split('');
      
      // Clear the headline
      mainHeadline.innerHTML = '';
      mainHeadline.style.opacity = '1';
      
      // Create letter spans
      letters.forEach((letter, index) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'headline-letter';
        letterSpan.textContent = letter === ' ' ? '\u00A0' : letter;
        letterSpan.style.display = 'inline-block';
        letterSpan.style.transform = 'translateY(150%)';
        letterSpan.style.opacity = '0';
        mainHeadline.appendChild(letterSpan);
      });
      
      mainHeadline.dataset.animated = 'true';
      
      // Calculate center and create waterfall hook effect
      const letterElements = mainHeadline.querySelectorAll('.headline-letter');
      const totalLetters = letterElements.length;
      const center = Math.floor(totalLetters / 2);
      
      // Start animation after a delay (wait for loader to complete)
      setTimeout(() => {
        letterElements.forEach((letter, index) => {
          // Calculate distance from center
          const distanceFromCenter = Math.abs(index - center);
          
          // Center letters animate first, others follow based on distance
          const delay = distanceFromCenter * 50; // 50ms per step from center
          
          setTimeout(() => {
            letter.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out';
            letter.style.transform = 'translateY(0)';
            letter.style.opacity = '1';
          }, delay);
        });
      }, 600); // Wait 600ms after loader completes
    }
  }
  
  // Wait for loader to complete before starting headline animation
  if (document.body.classList.contains('loaded')) {
    initHeadlineAnimation();
  } else {
    window.addEventListener('loaderComplete', () => {
      setTimeout(initHeadlineAnimation, 100);
    }, { once: true });
  }
  
  // ===== ABOUT TITLE ANIMATION =====
  const aboutTitle = document.querySelector('#about > h2');
  
  if (aboutTitle && !aboutTitle.dataset.animated) {
    const text = aboutTitle.textContent;
    const words = text.split(' ');
    
    // Clear the title
    aboutTitle.innerHTML = '';
    
    // Wrap each word and letter
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      
      word.split('').forEach((letter, letterIndex) => {
        const letterSpan = document.createElement('span');
        letterSpan.className = 'letter';
        letterSpan.textContent = letter;
        letterSpan.style.display = 'inline-block';
        letterSpan.style.transform = 'translate3d(0px, 100px, 0px)';
        letterSpan.style.opacity = '0';
        wordSpan.appendChild(letterSpan);
      });
      
      aboutTitle.appendChild(wordSpan);
      
      // Add space between words
      if (wordIndex < words.length - 1) {
        aboutTitle.appendChild(document.createTextNode(' '));
      }
    });
    
    aboutTitle.dataset.animated = 'true';
  }
  
  // Intersection Observer for scroll animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const letters = entry.target.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
          setTimeout(() => {
            letter.style.transition = 'transform 0.8s cubic-bezier(0.11, 0.82, 0.39, 0.92), opacity 0.8s cubic-bezier(0.11, 0.82, 0.39, 0.92)';
            letter.style.transform = 'translate3d(0px, 0px, 0px)';
            letter.style.opacity = '1';
          }, index * 60);
        });
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });
  
  if (aboutTitle) {
    observer.observe(aboutTitle);
  }
});
