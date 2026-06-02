/* ============================================================
   PREETHI SIGHAVI — PORTFOLIO SCRIPT
   Features:
     - Sticky navbar with scroll class + active link tracking
     - Mobile hamburger menu toggle
     - Intersection Observer fade-in animations
     - Animated stat counters (hero section)
     - Scroll-to-top button
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. DOM REFERENCES
───────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const navToggle   = document.querySelector('.nav-toggle');
const navLinks    = document.querySelector('.nav-links');
const navAnchors  = document.querySelectorAll('.nav-links a');
const fadeEls     = document.querySelectorAll('.fade-in');
const statNums    = document.querySelectorAll('.stat-num');
const sections    = document.querySelectorAll('section[id]');

/* Inject scroll-to-top button */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.innerHTML = '↑';
document.body.appendChild(scrollTopBtn);


/* ─────────────────────────────────────────
   2. NAVBAR — scroll class & active links
───────────────────────────────────────── */
function onScroll() {
  /* Scrolled class for background opacity */
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  /* Scroll-to-top visibility */
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  /* Active nav link — highlight the section in view */
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) {
      a.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load


/* ─────────────────────────────────────────
   3. MOBILE NAV TOGGLE
───────────────────────────────────────── */
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

/* Close mobile nav when a link is clicked */
navAnchors.forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Close on outside click */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ─────────────────────────────────────────
   4. SCROLL-TO-TOP
───────────────────────────────────────── */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─────────────────────────────────────────
   5. FADE-IN ON SCROLL (Intersection Observer)
───────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger siblings slightly */
        const delay = i * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => fadeObserver.observe(el));


/* ─────────────────────────────────────────
   6. ANIMATED STAT COUNTERS
───────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400; // ms
  const start    = performance.now();

  /* Choose easing: ease-out */
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.floor(easeOut(progress) * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => counterObserver.observe(el));


/* ─────────────────────────────────────────
   7. SMOOTH ANCHOR SCROLLING (offset for fixed nav)
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
