/* Mermaid Race Portal — main.js */
(function () {
  'use strict';

  /* =============================================
     MOBILE NAV TOGGLE
     ============================================= */
  const menuToggle = document.getElementById('menu-toggle');
  const headerNav  = document.getElementById('header-nav');
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = headerNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!menuToggle.contains(e.target) && !headerNav.contains(e.target)) {
        headerNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =============================================
     ACTIVE NAV LINK
     ============================================= */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.header-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });

  /* =============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* =============================================
     RACE COUNTDOWN TIMER
     ============================================= */
  document.querySelectorAll('[data-countdown]').forEach(function (el) {
    const target = new Date(el.dataset.countdown).getTime();
    if (isNaN(target)) return;
    function update() {
      const diff = target - Date.now();
      if (diff <= 0) { el.textContent = 'Registration is closed'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.innerHTML =
        '<span class="countdown"><span class="countdown-unit"><span class="countdown-num">' + d + '</span><span class="countdown-label">Days</span></span>' +
        '<span class="countdown-unit"><span class="countdown-num">' + pad(h) + '</span><span class="countdown-label">Hrs</span></span>' +
        '<span class="countdown-unit"><span class="countdown-num">' + pad(m) + '</span><span class="countdown-label">Min</span></span>' +
        '<span class="countdown-unit"><span class="countdown-num">' + pad(s) + '</span><span class="countdown-label">Sec</span></span></span>';
    }
    function pad(n) { return n < 10 ? '0' + n : n; }
    update();
    setInterval(update, 1000);
  });

  /* =============================================
     REGISTRATION FORM: STEP WIZARD
     ============================================= */
  var currentStep = 1;
  var totalSteps  = document.querySelectorAll('.reg-step').length;

  function updateSteps(active) {
    document.querySelectorAll('.reg-step').forEach(function (step, i) {
      step.classList.remove('is-active', 'is-complete');
      if (i + 1 < active) step.classList.add('is-complete');
      if (i + 1 === active) step.classList.add('is-active');
    });
  }

  /* =============================================
     FAQ ACCORDION — accessibility
     ============================================= */
  document.querySelectorAll('#faq-accordion button').forEach(function (btn) {
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* =============================================
     CONFIRMATION PAGE — Generate a stub conf #
     ============================================= */
  const confEl = document.querySelector('[data-conf-placeholder]');
  if (confEl) {
    const existing = new URLSearchParams(window.location.search).get('conf');
    if (!existing) {
      const num = 'MRM-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      confEl.textContent = num;
    }
  }

  /* =============================================
     LAZY IMAGES
     ============================================= */
  if ('IntersectionObserver' in window) {
    var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      });
    });
    lazyImgs.forEach(function (img) { observer.observe(img); });
  }

  /* =============================================
     BACK TO TOP BUTTON
     ============================================= */
  var btt = document.createElement('button');
  btt.textContent = '↑';
  btt.setAttribute('aria-label', 'Back to top');
  btt.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;width:44px;height:44px;border-radius:50%;background:var(--color-primary);color:#fff;border:none;cursor:pointer;font-size:1.25rem;box-shadow:0 4px 12px rgba(0,0,0,.15);opacity:0;transition:opacity .2s;z-index:999;';
  document.body.appendChild(btt);
  window.addEventListener('scroll', function () {
    btt.style.opacity = window.scrollY > 400 ? '1' : '0';
  }, { passive: true });
  btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

})();
