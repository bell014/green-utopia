// Navigation and Scroll Effects
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // Optimized Scroll Handlers
  const revealElements = document.querySelectorAll('.reveal');
  let isScrolling = false;
  const handleScroll = () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        // Sticky Header Effect
        if (window.scrollY > 50) {
          header.classList.add('scrolled', 'shadow-md');
        } else {
          header.classList.remove('scrolled', 'shadow-md');
        }

        // Reveal Animations
        revealElements.forEach(el => {
          const elementTop = el.getBoundingClientRect().top;
          if (elementTop < window.innerHeight - 50) {
            el.classList.add('active');
          }
        });
        isScrolling = false;
      });
      isScrolling = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

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
  // Carousel Logic
  const initCarousel = () => {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn = document.querySelector('.carousel-btn-next');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const dotsContainer = document.querySelector('.carousel-indicators');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.carousel-dot'));

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

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
      });
    }

    // Auto play with safety clear
    const startAutoPlay = () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
      }, 5000);
    };

    let autoPlayInterval;
    startAutoPlay();

    // Touch / Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoPlayInterval); // Pause on interact
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      // Restart autoplay with safety
      startAutoPlay();
    }, { passive: true });

    const handleSwipe = () => {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        // Swiped Left -> Next
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
      }
      if (touchEndX > touchStartX + threshold) {
        // Swiped Right -> Prev
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
      }
    };
  };

  initCarousel();

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
