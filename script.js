/* ==========================================================================
   NAVAJA NEGRA — interactions
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 500);
  });
  // Fallback in case 'load' fires slowly on file:// contexts
  setTimeout(() => loader.classList.add('loaded'), 2200);

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('[data-hover], a, button, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ---------- El Filo — scroll progress ---------- */
  const filoFill = document.getElementById('filoFill');
  const navbar = document.getElementById('navbar');
  const topFloat = document.getElementById('topFloat');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    filoFill.style.height = pct + '%';

    navbar.classList.toggle('scrolled', scrollTop > 60);
    topFloat.classList.toggle('show', scrollTop > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  topFloat.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navBurger.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  /* ---------- Hero parallax (light) ---------- */
  const heroPhotoSlot = document.querySelector('.hero-photo-slot');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroPhotoSlot.style.transform = `translateY(${y * 0.18}px) scale(1.04)`;
    }
  }, { passive: true });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stats ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const animateStat = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) + suffix : Math.round(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNumbers.forEach(el => statObserver.observe(el));

  /* ---------- Testimonials carousel ---------- */
  const testiTrack = document.getElementById('testiTrack');
  const testiSlides = testiTrack.children;
  const testiDotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;
  let testiTimer;

  for (let i = 0; i < testiSlides.length; i++) {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.setAttribute('data-hover', '');
    dot.addEventListener('click', () => goToTesti(i));
    testiDotsWrap.appendChild(dot);
  }
  const testiDots = testiDotsWrap.children;

  function goToTesti(i) {
    testiIndex = i;
    testiTrack.style.transform = `translateX(-${i * 100}%)`;
    [...testiDots].forEach((d, idx) => d.classList.toggle('active', idx === i));
    resetTestiTimer();
  }
  function nextTesti() {
    goToTesti((testiIndex + 1) % testiSlides.length);
  }
  function resetTestiTimer() {
    clearInterval(testiTimer);
    testiTimer = setInterval(nextTesti, 5000);
  }
  resetTestiTimer();

  /* ---------- Antes / Después slider ---------- */
  const compareSlider = document.getElementById('compareSlider');
  const compareAfter = document.getElementById('compareAfter');
  const compareHandle = document.getElementById('compareHandle');
  let dragging = false;

  const setComparePos = (clientX) => {
    const rect = compareSlider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    compareAfter.style.width = pct + '%';
    compareHandle.style.left = pct + '%';
  };

  compareSlider.addEventListener('mousedown', (e) => { dragging = true; setComparePos(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (dragging) setComparePos(e.clientX); });
  window.addEventListener('mouseup', () => dragging = false);

  compareSlider.addEventListener('touchstart', (e) => setComparePos(e.touches[0].clientX), { passive: true });
  compareSlider.addEventListener('touchmove', (e) => setComparePos(e.touches[0].clientX), { passive: true });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Booking form ---------- */
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.add('show');
    bookingForm.querySelector('button[type="submit"]').style.opacity = '0.6';
    bookingForm.querySelector('button[type="submit"]').style.pointerEvents = 'none';
    setTimeout(() => bookingForm.reset(), 300);
  });

  /* ---------- Ripple on buttons ---------- */
  document.querySelectorAll('.btn, .nav-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.style.position = 'relative';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Smooth anchor scroll offset for fixed navbar ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const y = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

});
