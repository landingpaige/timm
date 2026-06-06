/* Tim MacDonough Painting Company — script.js */

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });

  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ---------- Sticky header shadow ---------- */
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 8
      ? '0 2px 20px rgba(14,29,58,0.14)'
      : '0 1px 4px rgba(14,29,58,0.06)';
  }, { passive: true });
}

/* ---------- Smooth scroll (offset for sticky header) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Animated counters in stats band ---------- */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isZero = target === 0;

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    /* ease-out cubic */
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = isZero ? '0' : Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statEls = document.querySelectorAll('.stat-num[data-target]');
if (statEls.length && 'IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.target, 10));
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => statsObserver.observe(el));
}

/* ---------- Contact form ---------- */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

if (form && successMsg) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#dc2626';
        valid = false;
      }
    });

    if (!valid) {
      form.querySelector('[required][style*="dc2626"]')?.focus();
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending to Tim…';

    /* Replace with your real form endpoint or Netlify/Formspree */
    setTimeout(() => {
      form.reset();
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send It to Tim';
    }, 900);
  });
}

/* ---------- Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Scroll-in fade for cards ---------- */
const fadeTargets = document.querySelectorAll(
  '.service-card, .review-card, .area-card, .about-value, .process-step, .stat-item'
);

if ('IntersectionObserver' in window && fadeTargets.length) {
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  fadeTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.45s ease ${(i % 4) * 0.07}s, transform 0.45s ease ${(i % 4) * 0.07}s`;
    fadeObserver.observe(el);
  });
}
