(function () {
  /* ── Custom cursor (pointer devices only) ── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let rx = -100, ry = -100, tx = -100, ty = -100;

    document.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      dot.style.left = tx + 'px';
      dot.style.top  = ty + 'px';
    });

    (function lerp() {
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerp);
    })();

    const setView    = () => { ring.classList.add('view');    dot.classList.add('hidden'); };
    const setDefault = () => { ring.classList.remove('view', 'hover'); dot.classList.remove('hidden'); };
    const setHover   = () => ring.classList.add('hover');

    document.querySelectorAll('.work-card').forEach(el => {
      el.addEventListener('mouseenter', setView);
      el.addEventListener('mouseleave', setDefault);
    });
    document.querySelectorAll('a:not(.work-card), button').forEach(el => {
      el.addEventListener('mouseenter', setHover);
      el.addEventListener('mouseleave', setDefault);
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* ── Hamburger mobile nav (injected) ── */
  const topbar  = document.querySelector('.topbar');
  const navEl   = document.querySelector('.nav-links');
  if (topbar && navEl) {
    const btn = document.createElement('button');
    btn.className = 'hamburger';
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    topbar.appendChild(btn);

    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.setAttribute('aria-hidden', 'true');

    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    navEl.querySelectorAll('a').forEach(a => mobileNav.appendChild(a.cloneNode(true)));
    menu.appendChild(mobileNav);
    document.body.insertBefore(menu, topbar.nextSibling);

    const close = () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    btn.addEventListener('click', () => {
      const open = btn.classList.toggle('open');
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ── Nav scroll ── */
  if (topbar) {
    const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Work row: scroll-activate on touch devices ── */
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  /* ── iOS autoplay unlock (Low Power Mode / blocked autoplay) ── */
  const unlockVideos = () => {
    document.querySelectorAll('video[autoplay]').forEach(v => {
      if (v.paused) v.play().catch(function(){});
    });
  };
  document.addEventListener('touchstart', unlockVideos, { once: true, passive: true });
  document.addEventListener('click',      unlockVideos, { once: true });

  if (isTouchDevice) {
    const rows = document.querySelectorAll('.work-row');

    /* update hint text */
    const hint = document.querySelector('.work-foot .mono');
    if (hint) hint.textContent = 'Scroll to expand';

    if (rows.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          e.target.classList.toggle('is-active', e.isIntersecting);
        });
      }, {
        threshold: 0.55,
        rootMargin: '-18% 0px -18% 0px'
      });
      rows.forEach(r => obs.observe(r));
    }
  }
})();
