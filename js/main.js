/* ── Dastardly & Muttley — Main JS ── */

(function () {
  'use strict';

  /* ── CURSOR ── */
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let rx = -100, ry = -100, tx = -100, ty = -100;

    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      cursorDot.style.left  = tx + 'px';
      cursorDot.style.top   = ty + 'px';
    });

    (function lerp() {
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(lerp);
    })();

    const setView    = () => { cursorRing.classList.add('view'); cursorDot.classList.add('hidden'); };
    const setDefault = () => { cursorRing.classList.remove('view', 'hover'); cursorDot.classList.remove('hidden'); };
    const setHover   = () => cursorRing.classList.add('hover');

    document.querySelectorAll('.work-card').forEach(el => {
      el.addEventListener('mouseenter', setView);
      el.addEventListener('mouseleave', setDefault);
    });
    document.querySelectorAll('a:not(.work-card), button').forEach(el => {
      el.addEventListener('mouseenter', setHover);
      el.addEventListener('mouseleave', setDefault);
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1'; cursorRing.style.opacity = '1';
    });
  }

  /* ── NAV — hero-mode on dark hero, scrolled on light bg ── */
  const nav  = document.getElementById('main-nav');
  const hero = document.getElementById('hero');

  if (nav) {
    const onScroll = () => {
      const scrolled = window.scrollY > 50;
      nav.classList.toggle('scrolled', scrolled);
      /* If this page has a dark hero and we haven't scrolled past it,
         keep light text on nav. Once scrolled, scrolled class takes over. */
      if (hero) {
        nav.classList.toggle('hero-mode', !scrolled);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE NAV ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── ACCORDION ── */
  document.querySelectorAll('.acc-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-trigger')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── SCROLL FADE-IN ── */
  const fuEls = document.querySelectorAll('.fu');
  if (fuEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    fuEls.forEach(el => obs.observe(el));
  }

  /* ── TEXT SCRAMBLE ── */
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function scramble(el) {
    const original    = el.textContent;
    let frame         = 0;
    const totalFrames = original.length * 3;
    const interval    = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        const revealAt = i * 3;
        if (frame >= revealAt + 3) return ch;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      frame++;
      if (frame > totalFrames) { el.textContent = original; clearInterval(interval); }
    }, 30);
  }

  const scrambleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { setTimeout(() => scramble(e.target), 100); scrambleObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.scramble').forEach(el => scrambleObs.observe(el));

  /* ── MAGNETIC BUTTONS ── */
  document.querySelectorAll('.btn, .btn-inv, .btn-outline, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.35;
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── WORK CARD TILT ── */
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x*6}deg) rotateX(${-y*6}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── ACTIVE NAV LINK ── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (
      (href === 'index.html' && (path === '' || path === 'index.html')) ||
      (href !== 'index.html' && path.includes(href.replace('.html', '')))
    ) {
      a.classList.add('active');
    }
  });

})();
