// Navigation and Scroll Effects
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // --- Advanced Scroll Setup (Lenis + GSAP) ---

  // 1. Initialize Lenis (Virtual Scroll)
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Sticky Header Logic (compatible with Lenis)
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled', 'shadow-md');
    } else {
      header.classList.remove('scrolled', 'shadow-md');
    }
  };
  // Hook into Lenis scroll event
  lenis.on('scroll', handleScroll);

  // 3. Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // 4. Reveal Animations (Fast & Snappy)
  // Clean, time-based animation for immediate feedback
  ScrollTrigger.batch(".reveal", {
    onEnter: (batch) => {
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.05, // Rapid fire stagger
        duration: 0.4, // Fast duration
        ease: "power2.out",
        overwrite: true
      });
    },
    start: "top 90%", // Triggers almost immediately upon entering viewport
    once: true
  });

  // Set initial state for reveal elements
  gsap.set(".reveal", {
    autoAlpha: 0,
    y: 30 // Subtle slide distance
  });

  // 5. Parallax Effect for Images (Optional Premium Feel)
  // Targets any image within a .reveal section that isn't the logo
  const parallaxImages = document.querySelectorAll('section img:not(.logo-img)');
  parallaxImages.forEach(img => {
    gsap.to(img, {
      yPercent: 10, // Move image slightly slower
      ease: "none",
      scrollTrigger: {
        trigger: img,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // 6. Hero Video Scroll Animation
  const heroContainer = document.querySelector('#hero-video-container');
  if (heroContainer) {
    gsap.to(heroContainer, {
      width: "100%",
      borderRadius: "0px",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "+=400",
        scrub: 1
      }
    });
  }

  // Mobile Menu Toggle
  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('label-check');
  const closeMenuBtn = document.getElementById('close-menu-btn');

  const closeMenu = () => {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.add('closing');
      mobileMenu.classList.remove('active');

      // Delay overflow removal for smoother transition
      setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
        mobileMenu.classList.remove('closing');
      }, 600); // Matches the 0.6s transition in CSS
    }
    if (mobileMenuToggle) {
      mobileMenuToggle.checked = false;
    }
  };

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('change', function () {
      if (this.checked) {
        mobileMenu.classList.remove('closing');
        mobileMenu.classList.add('active');
        document.body.classList.add('overflow-hidden');
      } else {
        closeMenu();
      }
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }

  // Close menu on link click
  const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Active Link Highlight
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref && currentPath.endsWith(linkHref)) {
      link.classList.add('active', 'text-accent');
    }
  });

  // Cookie Consent (Simulated)
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookies) {
    if (!localStorage.getItem('cookies-accepted')) {
      cookieBanner.classList.remove('hidden');
    }
    acceptCookies.addEventListener('click', () => {
      cookieBanner.classList.add('hidden');
      localStorage.setItem('cookies-accepted', 'true');
    });
  }
  // Carousel Logic - Supports Multiple Carousels
  const initCarousels = () => {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
      const nextBtn = carousel.querySelector('.carousel-btn-next');
      const prevBtn = carousel.querySelector('.carousel-btn-prev');
      const dotsContainer = carousel.querySelector('.carousel-indicators');

      if (!track || slides.length === 0) return;

      let currentIndex = 0;
      let autoPlayInterval;

      // Clear existing dots if any (to prevent duplicates if re-initialized)
      if (dotsContainer) dotsContainer.innerHTML = '';

      // Create dots
      if (dotsContainer) {
        slides.forEach((_, i) => {
          const dot = document.createElement('div');
          dot.classList.add('carousel-dot');
          if (i === 0) dot.classList.add('active');
          dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoPlay();
          });
          dotsContainer.appendChild(dot);
        });
      }

      const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];

      const updateDots = (index) => {
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      };

      const goToSlide = (index) => {
        currentIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        updateDots(index);
      };

      const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
      };

      const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
      };

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetAutoPlay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetAutoPlay();
        });
      }

      // Auto play logic
      const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
      };

      const stopAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
      };

      const resetAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
      };

      startAutoPlay();

      // Touch / Swipe Support
      let touchStartX = 0;
      let touchEndX = 0;

      track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
      }, { passive: true });

      const handleSwipe = () => {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
          nextSlide();
        }
        if (touchEndX > touchStartX + threshold) {
          prevSlide();
        }
      };
    });
  };

  initCarousels();

  // Theme Toggle Handler
  const themeCheckboxes = document.querySelectorAll('input[type="checkbox"][id="theme-checkbox"]');
  const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'dark';

  themeCheckboxes.forEach(cb => {
    cb.checked = currentTheme === 'dark';
    cb.addEventListener('change', function () {
      const newTheme = this.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      // Synchronize other checkboxes
      themeCheckboxes.forEach(other => {
        if (other !== this) other.checked = this.checked;
      });
    });
  });

  // Video Cycling Logic
  const philosophyVideo = document.getElementById('philosophy-video');
  const videoSource = document.getElementById('video-source');

  if (philosophyVideo && videoSource) {
    const isFrench = document.documentElement.lang === 'fr';
    const videos = [
      isFrench ? '../assets/animation home page 1.mp4' : 'assets/animation home page 1.mp4',
      isFrench ? '../assets/animation home page 2.mp4' : 'assets/animation home page 2.mp4'
    ];
    let currentVideoIndex = 0;

    const updateVideo = (index) => {
      // Fade out the video before switching
      gsap.to(philosophyVideo, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          currentVideoIndex = index;
          videoSource.src = videos[currentVideoIndex];
          philosophyVideo.load();

          // Wait for the new video data to be ready before fading back in
          philosophyVideo.onloadeddata = () => {
            philosophyVideo.play();
            gsap.to(philosophyVideo, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.inOut"
            });
          };
        }
      });
    };



    // Arrow Controls
    const prevBtn = document.getElementById('video-prev');
    const nextBtn = document.getElementById('video-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateVideo((currentVideoIndex - 1 + videos.length) % videos.length);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateVideo((currentVideoIndex + 1) % videos.length);
      });
    }
  }

  // Force GIF Restart for Header Logo
  const headerLogo = document.querySelector('.logo-img');
  if (headerLogo) {
    const originalSrc = headerLogo.src.split('?')[0];
    headerLogo.src = originalSrc + '?t=' + Date.now();
  }
});

// Form Submission with Backend Integration
// --- Modal & Loader Logic ---

const loaderHTML = `
<div class="loader">
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
    <div class="circle"></div>
</div>`;

function createModal() {
  if (document.getElementById('successModal')) return;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'successModal';
  modalOverlay.className = 'modal-overlay';

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">
        <span class="material-symbols-outlined" style="font-size: 40px;">check</span>
      </div>
      <h3 class="modal-title" id="modalTitle">Success</h3>
      <p class="modal-text" id="modalMessage">Your submission was successful.</p>
      <button class="modal-close-btn" id="modalCloseBtn">Close</button>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Close handlers
  const closeBtn = modalOverlay.querySelector('#modalCloseBtn');
  closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

function showModal(title, message, btnText) {
  createModal();
  const modal = document.getElementById('successModal');
  const titleEl = modal.querySelector('#modalTitle');
  const msgEl = modal.querySelector('#modalMessage');
  const btnEl = modal.querySelector('#modalCloseBtn');

  titleEl.innerText = title;
  msgEl.innerText = message;
  btnEl.innerText = btnText;

  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function showLoader(btn) {
  btn.dataset.originalText = btn.innerText;
  btn.style.width = getComputedStyle(btn).width; // Lock width to prevent jumping
  btn.style.height = getComputedStyle(btn).height; // Lock height
  btn.innerHTML = loaderHTML;
  btn.disabled = true;
}

function hideLoader(btn) {
  btn.innerHTML = btn.dataset.originalText || 'Submit';
  btn.disabled = false;
  // Unlock dimensions (optional, but good for responsiveness if text changes)
  btn.style.width = '';
  btn.style.height = '';
}

// Main Contact Form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');

    // Gather Data
    const formData = new FormData(contactForm);
    const updates = {
      fullName: formData.get('fullName'),
      company: formData.get('company'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      expertise: formData.get('expertise'),
      message: formData.get('message')
    };

    // UI Loading State
    showLoader(btn);

    try {
      const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

      const API_URL = isLocal
        ? 'http://localhost:3000/submit-form'
        : 'https://api.greenutopia.eu/submit-form';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        hideLoader(btn);
        contactForm.reset();

        const isFrench = document.documentElement.lang === 'fr';
        showModal(
          isFrench ? 'Bien reçu !' : 'Thank You!',
          isFrench ? 'Nous avons bien reçu votre message. Notre équipe reviendra vers vous très prochainement.' : 'We have received your message. Our team will get back to you shortly.',
          isFrench ? 'Fermer' : 'Close'
        );
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error(error);
      hideLoader(btn);
      const isFrench = document.documentElement.lang === 'fr';
      alert(isFrench ? 'Une erreur est survenue.' : 'An error occurred.');
    }
  });
}

// Newsletter Subscription Form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button');

    // Gather Data
    const formData = new FormData(newsletterForm);
    const email = formData.get('email');

    if (!email) return;

    // UI Loading State
    showLoader(btn);

    try {
      const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';

      const API_URL = isLocal
        ? 'http://localhost:3000/subscribe'
        : 'https://api.greenutopia.eu/subscribe';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        hideLoader(btn);
        newsletterForm.reset();

        const isFrench = document.documentElement.lang === 'fr';
        showModal(
          isFrench ? 'Bienvenue !' : 'Welcome!',
          isFrench ? 'Merci de votre inscription à notre newsletter.' : 'Thank you for subscribing to our newsletter.',
          isFrench ? 'Fermer' : 'Close'
        );
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error(error);
      hideLoader(btn);
      const isFrench = document.documentElement.lang === 'fr';
      alert(isFrench ? 'Une erreur est survenue.' : 'An error occurred.');
    }
  });
}
