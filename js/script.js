// Navigation and Scroll Effects
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  // Sticky Header Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled', 'shadow-md');
    } else {
      header.classList.remove('scrolled', 'shadow-md');
    }
  });

  // Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 50) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // Mobile Menu Toggle
  const closeMenuBtn = document.getElementById('close-menu-btn');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden');
    });
  }
  if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

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

    // Auto play
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      goToSlide(currentIndex);
    }, 5000);
  };

  initCarousel();

  // Theme Toggle Handler
  const themeCheckboxes = document.querySelectorAll('input[type="checkbox"][id="theme-checkbox"]');
  const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';

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

// Form Submission (Simulated)
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'Envoi en cours...';

    setTimeout(() => {
      btn.innerText = 'Message envoyé !';
      contactForm.reset();
      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}
