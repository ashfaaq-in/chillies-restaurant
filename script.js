/* ═══════════════════════════════════════════════
   CHILLIES RESTAURANT — JAVASCRIPT
   Interactions, Animations & Dynamic Behavior
═══════════════════════════════════════════════ */

'use strict';

// ── DOM READY ──
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParticles();
  initScrollReveal();
  initCountUp();
  initMenuTabs();
  initTestimonials();
  initPlaceholderImages();
  setMinDate();
});

/* ══════════════════════════════════
   1. NAVBAR
══════════════════════════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  // Scroll behavior
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // Smooth anchor scroll + close mobile on nav link click
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════
   2. HERO PARTICLES
══════════════════════════════════ */
function initHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = window.innerWidth < 600 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1.5;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}

/* ══════════════════════════════════
   3. SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if they have delay classes
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════
   4. COUNT-UP ANIMATION
══════════════════════════════════ */
function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const suffix  = el.dataset.suffix  || '';
  const decimal = parseInt(el.dataset.decimal) || 0;
  const duration = 2200;
  const start   = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 4); // ease-out quart
    const value    = target * ease;

    el.textContent = decimal
      ? value.toFixed(decimal) + suffix
      : Math.floor(value).toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = decimal ? target.toFixed(decimal) + suffix : target.toLocaleString() + suffix;
  }

  requestAnimationFrame(update);
}

/* ══════════════════════════════════
   5. MENU TABS
══════════════════════════════════ */
function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = 'panel-' + tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ══════════════════════════════════
   6. TESTIMONIALS SLIDER
══════════════════════════════════ */
function initTestimonials() {
  const track  = document.getElementById('testimonials-track');
  const dotsEl = document.getElementById('testimonials-dots');
  const prev   = document.getElementById('testimonial-prev');
  const next   = document.getElementById('testimonial-next');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;

  // Cards visible based on viewport
  function getVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  let current = 0;
  let visible = getVisible();
  const maxIndex = () => Math.max(0, total - visible);

  // Build dots
  function buildDots() {
    dotsEl.innerHTML = '';
    const dotCount = maxIndex() + 1;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('t-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  }, { passive: true });

  // Auto-play
  let autoplay = setInterval(() => goTo((current + 1) > maxIndex() ? 0 : current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo((current + 1) > maxIndex() ? 0 : current + 1), 5000); });

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      visible = getVisible();
      current = Math.min(current, maxIndex());
      buildDots();
      goTo(current);
    }, 200);
  });

  buildDots();
  goTo(0);
}

/* ══════════════════════════════════
   7. PLACEHOLDER IMAGES (Menu Cards)
══════════════════════════════════ */
function initPlaceholderImages() {
  const placeholders = document.querySelectorAll('.menu-card-img-placeholder');
  placeholders.forEach(el => {
    const label = el.dataset.label || '';
    const color = el.dataset.color || '#1a2235';

    // Generate SVG gradient background with dish name
    el.style.background = `
      linear-gradient(135deg, ${color}, ${shadeColor(color, -20)})
    `;

    // Add decorative emoji based on label keywords
    const emoji = getDishEmoji(label);
    const inner = document.createElement('div');
    inner.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px;
    `;
    inner.innerHTML = `
      <span style="font-size: 2rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5))">${emoji}</span>
      <span style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 0.9rem; color: rgba(245,197,24,0.7); text-align: center; line-height: 1.3;">${label}</span>
    `;
    el.appendChild(inner);
  });
}

function getDishEmoji(label) {
  const lower = label.toLowerCase();
  if (lower.includes('biryani') || lower.includes('rice')) return '🍚';
  if (lower.includes('chicken')) return '🍗';
  if (lower.includes('fish') || lower.includes('seafood')) return '🐟';
  if (lower.includes('prawn')) return '🦐';
  if (lower.includes('veg') || lower.includes('gobi') || lower.includes('manchurian')) return '🥗';
  if (lower.includes('kappa') || lower.includes('tapioca')) return '🥥';
  if (lower.includes('tandoori') || lower.includes('mixed')) return '🔥';
  if (lower.includes('soup')) return '🍲';
  if (lower.includes('wings') || lower.includes('lollipop')) return '🍖';
  return '🍽️';
}

function shadeColor(hex, percent) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/* ══════════════════════════════════
   8. RESERVATION FORM
══════════════════════════════════ */
function handleReservation(e) {
  e.preventDefault();

  const btn = document.getElementById('reserve-submit-btn');
  btn.disabled = true;
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" class="spin">
      <circle cx="12" cy="12" r="10" stroke-dasharray="30 10"/>
    </svg>
    Processing...
  `;
  btn.style.opacity = '0.7';

  // Collect form data (frontend only)
  const data = {
    name:      document.getElementById('reserve-name').value,
    phone:     document.getElementById('reserve-phone').value,
    date:      document.getElementById('reserve-date').value,
    time:      document.getElementById('reserve-time').value,
    guests:    document.getElementById('reserve-guests').value,
    occasion:  document.getElementById('reserve-occasion').value,
    notes:     document.getElementById('reserve-notes').value,
  };

  console.log('Reservation data:', data);

  // Simulate async
  setTimeout(() => {
    document.getElementById('reserve-form').style.display = 'none';
    document.getElementById('reserve-success').style.display = 'block';

    // Scroll to success
    document.getElementById('reserve-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1500);
}

// Set min date for reservation calendar
function setMinDate() {
  const dateInput = document.getElementById('reserve-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

/* ══════════════════════════════════
   9. PARALLAX HERO (subtle)
══════════════════════════════════ */
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════
   10. ACTIVE NAV HIGHLIGHT (on scroll)
══════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ══════════════════════════════════
   11. GALLERY LIGHTBOX (simple)
══════════════════════════════════ */
(function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');

  // Create lightbox elements
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.95);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s ease;
    cursor: zoom-out;
    padding: 20px;
  `;

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width: 90vw; max-height: 88vh;
    object-fit: contain; border-radius: 12px;
    box-shadow: 0 20px 80px rgba(0,0,0,0.8);
    transform: scale(0.9);
    transition: transform 0.35s ease;
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = `
    position: fixed; top: 24px; right: 28px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: white; font-size: 1.2rem;
    width: 44px; height: 44px; border-radius: 50%;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  `;

  overlay.appendChild(lightboxImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  const open = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    overlay.style.pointerEvents = 'auto';
    overlay.style.opacity = '1';
    lightboxImg.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    lightboxImg.style.transform = 'scale(0.9)';
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;
    item.addEventListener('click', () => open(img.src, img.alt));
  });

  overlay.addEventListener('click', e => { if (e.target !== lightboxImg) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ══════════════════════════════════
   12. Spin utility (used in form)
══════════════════════════════════ */
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  .spin { animation: spin360 1s linear infinite; }
  @keyframes spin360 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .nav-link.active { color: var(--gold) !important; }
  .nav-link.active::after { width: 100% !important; }
`;
document.head.appendChild(spinStyle);
