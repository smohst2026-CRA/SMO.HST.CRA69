/* ====================================================
   portal.js — SMO HST v2 (shared UI)
   - Mobile menu
   - Language switch (TH/EN, localStorage persisted)
   - Tab switching (for tabbed sections)
   - Filter chips + search (tools page)
   ==================================================== */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('navLinks');
  if (menuBtn && nav) {
    // สร้างพื้นหลังทึบสำหรับเมนูมือถือ
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function openMenu() {
      nav.classList.add('open');
      backdrop.classList.add('show');
      const icon = menuBtn.querySelector('i');
      if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-xmark'); }
    }
    function closeMenu() {
      nav.classList.remove('open');
      backdrop.classList.remove('show');
      const icon = menuBtn.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    }
    menuBtn.addEventListener('click', () => {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    backdrop.addEventListener('click', closeMenu);
    // ปิดเมนูเมื่อกดลิงก์ (มือถือ/แท็บเล็ต)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { if (window.innerWidth <= 1024) closeMenu(); });
    });
    // ปิดเมนูด้วยปุ่ม Esc
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Language switch (shared with v1 storage key) ---------- */
  const stored = localStorage.getItem('smo_lang');
  const defaultLang = stored === 'en' ? 'en' : 'th';
  setLang(defaultLang);

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang-btn');
      setLang(lang);
      localStorage.setItem('smo_lang', lang);
    });
  });

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'th');
    document.querySelectorAll('[data-lang-btn]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === lang);
    });
  }

  /* ---------- Active nav link based on path ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navLinks a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) a.classList.add('active');
  });

  /* ---------- Tabs (Ticket-style) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(bar => {
    const target = bar.getAttribute('data-tabs');
    bar.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-tab');
        bar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll(`[data-panel-of="${target}"]`).forEach(p => {
          p.classList.toggle('hidden', p.getAttribute('data-panel') !== key);
        });
      });
    });
  });

  /* ---------- Filter chips + search (tools page) ---------- */
  const filterBar = document.getElementById('toolFilter');
  const searchInput = document.getElementById('toolSearch');
  const toolCards = document.querySelectorAll('[data-tool]');
  let activeCat = 'all';

  function applyFilter() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    toolCards.forEach(card => {
      const cat = card.getAttribute('data-tool') || 'all';
      const text = (card.innerText || '').toLowerCase();
      const catOk = activeCat === 'all' || cat === activeCat || cat.includes(activeCat);
      const textOk = !q || text.includes(q);
      card.style.display = (catOk && textOk) ? '' : 'none';
    });
  }
  if (filterBar) {
    filterBar.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCat = chip.getAttribute('data-cat') || 'all';
        applyFilter();
      });
    });
  }
  if (searchInput) searchInput.addEventListener('input', applyFilter);

  /* ---------- Compact slide banner ---------- */
  (function initSlideBanner() {
    const banner = document.getElementById('slideBanner');
    if (!banner) return;
    const slides = banner.querySelectorAll('.slide-item');
    const dots = banner.querySelectorAll('.slide-dot');
    const prev = banner.querySelector('.slide-prev');
    const next = banner.querySelector('.slide-next');
    if (slides.length < 2) return;

    let current = 0;
    const INTERVAL = 5000;
    let timer = null;

    function show(idx) {
      idx = ((idx % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      current = idx;
    }
    function nextSlide() { show(current + 1); }
    function start() { stop(); timer = setInterval(nextSlide, INTERVAL); }
    function stop() { if (timer) clearInterval(timer); }

    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); start(); }));
    prev && prev.addEventListener('click', () => { show(current - 1); start(); });
    next && next.addEventListener('click', () => { show(current + 1); start(); });

    // pause on hover (desktop)
    banner.addEventListener('mouseenter', stop);
    banner.addEventListener('mouseleave', start);

    // touch swipe
    let tx = 0;
    banner.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; stop(); }, { passive: true });
    banner.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
      start();
    });

    show(0);
    start();
  })();

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = 1;
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.tool-card, .dept-card, .num-item, .member-card, .announce').forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      io.observe(el);
    });
  }
})();
