// Text Animation - Letter by letter effect
document.addEventListener('DOMContentLoaded', function() {
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
