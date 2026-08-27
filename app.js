/**
 * CyberBrasil 2067 - Interactive Logic & Audio Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // Audio State & Web Audio API Synthesizer
  let audioEnabled = true;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
  }

  // Play Cyberpunk Blip / Beep Sound
  function playSound(type) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'open') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {
      // Ignore audio context errors if muted by browser policy
    }
  }

  // Audio Controller Toggle Button
  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      const icon = audioToggle.querySelector('.audio-icon');
      const text = audioToggle.querySelector('.audio-text');
      
      if (audioEnabled) {
        icon.textContent = '🔊';
        text.textContent = 'SFX LIGADO';
        playSound('click');
      } else {
        icon.textContent = '🔇';
        text.textContent = 'SFX DESLIGADO';
      }
    });
  }

  // Attach hover sound to all buttons and interactive elements
  const interactiveElements = document.querySelectorAll('button, .nav-link, .logo-container, a');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
  });

  // Modal Dialog Handlers
  const screenshotModal = document.getElementById('screenshotModal');
  const wishlistModal = document.getElementById('wishlistModal');
  const newsModal = document.getElementById('newsModal');

  const openScreenshotBtn = document.getElementById('openScreenshotModal');
  const openWishlistBtn = document.getElementById('openWishlistModal');
  const openNewsBtn = document.getElementById('openNewsModal');

  const closeScreenshotBtn = document.getElementById('closeScreenshotModal');
  const closeWishlistBtn = document.getElementById('closeWishlistModal');
  const closeNewsBtn = document.getElementById('closeNewsModal');

  // Screenshot Slideshow Setup
  const screenshots = [
    'Screenshots/Group 23.png',
    'Screenshots/Group 24.png',
    'Screenshots/Group 25.png',
    'Screenshots/Group 26.png',
    'Screenshots/Group 27.png',
    'Screenshots/Group 28.png',
    'Screenshots/Group 29.png',
    'Screenshots/Group 30.png'
  ];
  let currentSlideIndex = 0;

  const slideshowImg = document.getElementById('slideshowImage');
  const slideshowCounter = document.getElementById('slideshowCounter');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const thumbnailsContainer = document.getElementById('slideshowThumbnails');

  // Build Thumbnails
  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = '';
    screenshots.forEach((src, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${idx + 1}">`;
      thumb.addEventListener('click', () => {
        playSound('click');
        goToSlide(idx);
      });
      thumbnailsContainer.appendChild(thumb);
    });
  }

  function goToSlide(index) {
    currentSlideIndex = (index + screenshots.length) % screenshots.length;
    if (slideshowImg) {
      slideshowImg.classList.add('fade-out');
      setTimeout(() => {
        slideshowImg.src = screenshots[currentSlideIndex];
        slideshowImg.classList.remove('fade-out');
      }, 120);
    }
    if (slideshowCounter) {
      slideshowCounter.textContent = `${String(currentSlideIndex + 1).padStart(2, '0')} / ${String(screenshots.length).padStart(2, '0')}`;
    }
    // Update active thumb
    if (thumbnailsContainer) {
      const thumbs = thumbnailsContainer.querySelectorAll('.thumb-item');
      thumbs.forEach((t, i) => {
        if (i === currentSlideIndex) {
          t.classList.add('active');
          t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          t.classList.remove('active');
        }
      });
    }
  }

  if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      playSound('click');
      goToSlide(currentSlideIndex - 1);
    });
  }

  if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
      playSound('click');
      goToSlide(currentSlideIndex + 1);
    });
  }

  function openModal(modal) {
    playSound('open');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    playSound('click');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openScreenshotBtn) openScreenshotBtn.addEventListener('click', () => openModal(screenshotModal));
  if (openWishlistBtn) openWishlistBtn.addEventListener('click', () => openModal(wishlistModal));
  if (openNewsBtn) openNewsBtn.addEventListener('click', () => openModal(newsModal));

  if (closeScreenshotBtn) closeScreenshotBtn.addEventListener('click', () => closeModal(screenshotModal));
  if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', () => closeModal(wishlistModal));
  if (closeNewsBtn) closeNewsBtn.addEventListener('click', () => closeModal(newsModal));

  // Close modal when clicking on background overlay
  [screenshotModal, wishlistModal, newsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Keyboard Navigation & Escape Key
  document.addEventListener('keydown', (e) => {
    if (screenshotModal && screenshotModal.classList.contains('open')) {
      if (e.key === 'ArrowLeft') {
        playSound('click');
        goToSlide(currentSlideIndex - 1);
      } else if (e.key === 'ArrowRight') {
        playSound('click');
        goToSlide(currentSlideIndex + 1);
      }
    }

    if (e.key === 'Escape') {
      [screenshotModal, wishlistModal, newsModal].forEach(modal => {
        if (modal && modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });

  // Navigation Links Active State Switching
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('click');
      navLinks.forEach(l => {
        l.classList.remove('active');
        const highlight = l.querySelector('.tab-highlight');
        if (highlight) highlight.remove();
      });

      link.classList.add('active');
      const highlight = document.createElement('span');
      highlight.className = 'tab-highlight';
      link.appendChild(highlight);
    });
  });

  // Newsletter Form Handler
  const newsForm = document.getElementById('newsForm');
  const newsFeedback = document.getElementById('newsFeedback');

  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSound('click');
      const emailInput = document.getElementById('newsEmail');
      const userEmail = emailInput.value.trim();

      if (userEmail) {
        newsFeedback.innerHTML = `✓ E-MAIL ${userEmail.toUpperCase()} REGISTRADO COM SUCESSO! BEM-VINDO À MATRIZ.`;
        newsFeedback.style.color = '#00FF66';
        emailInput.value = '';
        setTimeout(() => {
          closeModal(newsModal);
          newsFeedback.innerHTML = '';
        }, 3000);
      }
    });
  }
});
