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
  const teaserModal = document.getElementById('teaserModal');
  const wishlistModal = document.getElementById('wishlistModal');
  const newsModal = document.getElementById('newsModal');

  const openTeaserBtn = document.getElementById('openTeaserModal');
  const openWishlistBtn = document.getElementById('openWishlistModal');
  const openNewsBtn = document.getElementById('openNewsModal');
  const wishlistFromVideoBtn = document.getElementById('wishlistFromVideo');

  const closeTeaserBtn = document.getElementById('closeTeaserModal');
  const closeWishlistBtn = document.getElementById('closeWishlistModal');
  const closeNewsBtn = document.getElementById('closeNewsModal');

  function openModal(modal) {
    playSound('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    playSound('click');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    
    // Stop video iframe playback when closing teaser modal
    if (modal === teaserModal) {
      const iframe = document.getElementById('teaserIframe');
      if (iframe) {
        const src = iframe.src;
        iframe.src = src; // Reload iframe to stop video playback
      }
    }
  }

  openTeaserBtn.addEventListener('click', () => openModal(teaserModal));
  openWishlistBtn.addEventListener('click', () => openModal(wishlistModal));
  openNewsBtn.addEventListener('click', () => openModal(newsModal));
  
  if (wishlistFromVideoBtn) {
    wishlistFromVideoBtn.addEventListener('click', () => {
      closeModal(teaserModal);
      setTimeout(() => openModal(wishlistModal), 200);
    });
  }

  closeTeaserBtn.addEventListener('click', () => closeModal(teaserModal));
  closeWishlistBtn.addEventListener('click', () => closeModal(wishlistModal));
  closeNewsBtn.addEventListener('click', () => closeModal(newsModal));

  // Close modal when clicking on background overlay
  [teaserModal, wishlistModal, newsModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [teaserModal, wishlistModal, newsModal].forEach(modal => {
        if (modal.classList.contains('open')) {
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
