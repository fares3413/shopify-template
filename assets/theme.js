/* ============================================
   LUXE STORE THEME - theme.js
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // ANNOUNCEMENT BAR
  // ============================================
  const announceBar = document.getElementById('AnnouncementBar');
  if (announceBar) {
    const messages = announceBar.querySelectorAll('.announcement-bar__message');
    const prev = announceBar.querySelector('.announcement-bar__prev');
    const next = announceBar.querySelector('.announcement-bar__next');
    let current = 0;
    let autoTimer;

    function showMessage(idx) {
      messages.forEach(m => m.classList.remove('active'));
      current = (idx + messages.length) % messages.length;
      messages[current].classList.add('active');
    }

    function startAuto() {
      if (messages.length <= 1) return;
      autoTimer = setInterval(() => showMessage(current + 1), 4000);
    }

    prev?.addEventListener('click', () => { clearInterval(autoTimer); showMessage(current - 1); startAuto(); });
    next?.addEventListener('click', () => { clearInterval(autoTimer); showMessage(current + 1); startAuto(); });
    startAuto();
  }

  // ============================================
  // HEADER — Search
  // ============================================
  const searchToggle = document.getElementById('SearchToggle');
  const searchOverlay = document.getElementById('SearchOverlay');
  const searchClose = document.getElementById('SearchClose');
  const searchInput = searchOverlay?.querySelector('.header__search-input');

  searchToggle?.addEventListener('click', () => {
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput?.focus(), 50);
  });
  searchClose?.addEventListener('click', () => searchOverlay.classList.remove('open'));
  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) searchOverlay.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') searchOverlay?.classList.remove('open');
  });

  // ============================================
  // HEADER — Mobile menu
  // ============================================
  const mobileMenuBtn = document.getElementById('MobileMenuToggle');
  const mobileNav = document.getElementById('MobileNav');

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
    mobileNav.setAttribute('aria-hidden', (!isOpen).toString());
  });

  // ============================================
  // CART DRAWER
  // ============================================
  const cartDrawer = document.getElementById('CartDrawer');
  const cartToggle = document.getElementById('CartToggle');
  const cartClose = document.getElementById('CartClose');
  const cartOverlay = document.getElementById('CartOverlay');

  function openCart() {
    cartDrawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cartToggle?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // Cart item quantity update
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action="decrease"], [data-action="increase"]');
    if (!btn) return;
    const key = btn.dataset.key;
    const action = btn.dataset.action;
    const qtyEl = btn.closest('.cart-item')?.querySelector('.cart-item__qty-num');
    if (!qtyEl) return;
    let qty = parseInt(qtyEl.textContent);
    qty = action === 'increase' ? qty + 1 : Math.max(0, qty - 1);
    await updateCartItem(key, qty);
  });

  // Cart item remove
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.cart-item__remove');
    if (!btn) return;
    await updateCartItem(btn.dataset.key, 0);
  });

  async function updateCartItem(key, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      const cart = await res.json();
      updateCartCount(cart.item_count);
      location.reload();
    } catch (err) { console.error(err); }
  }

  function updateCartCount(count) {
    const countEl = document.querySelector('.header__cart-count');
    if (countEl) {
      countEl.textContent = count;
      countEl.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Add to cart intercept (ajax)
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[action="/cart/add"]') || e.target.closest('#ProductForm');
    if (!form) return;
    e.preventDefault();
    const formData = new FormData(form);
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn?.textContent;
    if (btn) { btn.disabled = true; btn.textContent = 'Adding...'; }

    try {
      const res = await fetch('/cart/add.js', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.id) {
        const cartRes = await fetch('/cart.js');
        const cart = await cartRes.json();
        updateCartCount(cart.item_count);
        openCart();
      }
    } catch (err) { console.error(err); }
    finally {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
    }
  });

  // Hero Slider — handled by inline script in sections/hero-slider.liquid

  // ============================================
  // PRODUCT DETAILS ACCORDION
  // Moved from inline script in product-details-accordion.liquid
  // Uses class selectors so it works for every section instance on a page
  // ============================================
  document.querySelectorAll('.pda-list').forEach(function (list) {
    list.addEventListener('click', function (e) {
      var btn = e.target.closest('.pda-toggle');
      if (!btn) return;
      var item   = btn.closest('.pda-item');
      var isOpen = item.classList.contains('pda-item--open');
      list.querySelectorAll('.pda-item').forEach(function (el) {
        el.classList.remove('pda-item--open');
        var b = el.querySelector('.pda-toggle');
        b.setAttribute('aria-expanded', 'false');
        b.querySelector('.pda-icon').textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('pda-item--open');
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.pda-icon').innerHTML = '&times;';
      }
    });
  });

  // ============================================
  // COUNTDOWN TIMER
  // Moved from inline script in countdown-timer.liquid
  // Reads target date from data-target on .cd-timer element
  // ============================================
  document.querySelectorAll('.cd-timer[data-target]').forEach(function (timerEl) {
    function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }
    var targetRaw = timerEl.getAttribute('data-target');
    if (!targetRaw) return;
    var targetDate = new Date(targetRaw.trim());
    if (isNaN(targetDate.getTime())) { console.warn('[Countdown] Invalid date:', targetRaw); return; }
    var wrap      = timerEl.closest('.countdown-timer');
    if (!wrap) return;
    var daysEl    = wrap.querySelector('[id^="cd-days-"]');
    var hoursEl   = wrap.querySelector('[id^="cd-hours-"]');
    var minutesEl = wrap.querySelector('[id^="cd-minutes-"]');
    var secondsEl = wrap.querySelector('[id^="cd-seconds-"]');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    function tick() {
      var diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00';
        clearInterval(cdTimer);
        return;
      }
      var t = Math.floor(diff / 1000);
      daysEl.textContent    = pad(Math.floor(t / 86400));
      hoursEl.textContent   = pad(Math.floor((t % 86400) / 3600));
      minutesEl.textContent = pad(Math.floor((t % 3600) / 60));
      secondsEl.textContent = pad(t % 60);
    }
    tick();
    var cdTimer = setInterval(tick, 1000);
  });

  // ============================================
  // PROGRESSIVE VIDEO SLIDER
  // Moved from inline script in progressive-video-slider.liquid
  // Section HTML must have: data-total-slides="N" data-speed="MS"
  // ============================================
  document.querySelectorAll('.pvs-section[data-total-slides]').forEach(function (pvs) {
    var totalSlides = parseInt(pvs.dataset.totalSlides, 10);
    if (totalSlides < 2) return;
    var track    = pvs.querySelector('.pvs-track');
    var dotsWrap = pvs.querySelector('.pvs-dots');
    var prevBtn  = pvs.querySelector('.pvs-nav--prev');
    var nextBtn  = pvs.querySelector('.pvs-nav--next');
    var pauseBtn = pvs.querySelector('.pvs-pause');
    if (!track) return;
    var slides    = Array.from(track.querySelectorAll('.pvs-slide'));
    var dots      = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.pvs-dot')) : [];
    var current   = 0;
    var isPlaying = true;
    var speed     = parseInt(pvs.dataset.speed || '4000', 10);
    var pvsTimer;
    function updateSlides(newIndex) {
      var prev = current;
      current  = (newIndex + totalSlides) % totalSlides;
      slides.forEach(function (slide, i) {
        slide.classList.remove('pvs-slide--active', 'pvs-slide--next', 'pvs-slide--exiting');
        if (i === current) {
          slide.classList.add('pvs-slide--active');
        } else if (i === (current + 1) % totalSlides) {
          slide.classList.add('pvs-slide--next');
        } else if (i === prev) {
          slide.classList.add('pvs-slide--exiting');
          setTimeout(function () { slide.classList.remove('pvs-slide--exiting'); }, 700);
        }
      });
      dots.forEach(function (d, i) { d.classList.toggle('pvs-dot--active', i === current); });
    }
    function startPvsTimer() {
      clearInterval(pvsTimer);
      if (isPlaying) pvsTimer = setInterval(function () { updateSlides(current + 1); }, speed);
    }
    if (nextBtn) nextBtn.addEventListener('click', function () { updateSlides(current + 1); startPvsTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { updateSlides(current - 1); startPvsTimer(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { updateSlides(i); startPvsTimer(); });
    });
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        isPlaying = !isPlaying;
        pauseBtn.setAttribute('aria-label', isPlaying ? 'Pause slideshow' : 'Play slideshow');
        pauseBtn.dataset.playing = isPlaying;
        pauseBtn.querySelector('.pvs-icon-pause').style.display = isPlaying ? '' : 'none';
        pauseBtn.querySelector('.pvs-icon-play').style.display  = isPlaying ? 'none' : '';
        startPvsTimer();
      });
    }
    pvs.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { updateSlides(current - 1); startPvsTimer(); }
      if (e.key === 'ArrowRight') { updateSlides(current + 1); startPvsTimer(); }
    });
    startPvsTimer();
  });

  // ============================================
  // SCROLL COLLAGE — tile entrance reveal
  // Moved from inline script in scroll-collage.liquid
  // Targets all .sc-tile elements on the page
  // ============================================
  if ('IntersectionObserver' in window) {
    var collageObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          collageObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.sc-tile').forEach(function (tile) { collageObs.observe(tile); });
  }

  // ============================================
  // TESTIMONIALS SLIDER
  // ============================================
  document.querySelectorAll('[id^="TestimonialsSlider"]').forEach(slider => {
    const section = slider.closest('section') || slider.parentElement;
    const slides = slider.querySelectorAll('.testimonials__slide');
    const dots = section.querySelectorAll('.testimonials__dot');
    const prevBtn = section.querySelector('.testimonials__nav--prev');
    const nextBtn = section.querySelector('.testimonials__nav--next');
    let current = 0;
    let timer;

    if (slides.length <= 1) return;

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      dots[current]?.setAttribute('aria-selected', 'false');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
      dots[current]?.setAttribute('aria-selected', 'true');
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));
    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

    function resetTimer() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 6000); }
    resetTimer();
  });

  // ============================================
  // BEST SELLERS TABS
  // ============================================
  document.querySelectorAll('.best-sellers__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const container = tab.closest('.best-sellers');
      container.querySelectorAll('.best-sellers__tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      // Hide all panels (hidden attribute = zero layout cost)
      container.querySelectorAll('.best-sellers__panel').forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = container.querySelector(`#tab-panel-${tab.dataset.tab}`);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }
    });
  });

  // ============================================
  // FEATURED PRODUCT — thumbnail switcher
  // ============================================
  document.querySelectorAll('[id^="ProductThumbs"]').forEach(thumbContainer => {
    const sectionId = thumbContainer.id.replace('ProductThumbs-', '');
    const mainImage = document.getElementById(`MainProductImage-${sectionId}`);
    const thumbs = thumbContainer.querySelectorAll('.featured-product__thumb');

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const img = thumb.querySelector('img');
        if (img && mainImage) {
          mainImage.src = img.src.replace('_120x', '_900x').replace('_60x', '_900x');
          mainImage.srcset = '';
        }
      });
    });
  });

  // ============================================
  // COLLECTION — sort
  // ============================================
  const sortSelect = document.getElementById('SortBy');
  sortSelect?.addEventListener('change', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', sortSelect.value);
    window.location.href = url.toString();
  });

  // ============================================
  // PRODUCT RECOMMENDATIONS — lazy load
  // ============================================
  const recSection = document.getElementById('ProductRecommendations');
  if (recSection) {
    const productId = recSection.dataset.productId;
    const baseUrl = recSection.dataset.url;
    const grid = document.getElementById('RecommendationsGrid');
    if (productId && baseUrl && grid) {
      fetch(`${baseUrl}?product_id=${productId}&limit=4`)
        .then(r => r.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const newGrid = doc.querySelector('#RecommendationsGrid');
          if (newGrid && newGrid.children.length > 0) {
            grid.innerHTML = newGrid.innerHTML;
          } else {
            recSection.style.display = 'none';
          }
        })
        .catch(() => recSection.style.display = 'none');
    }
  }

  // ============================================
  // STICKY HEADER — scroll shadow + compact pill
  // ============================================
  const header      = document.getElementById('Header');
  // Sticky lives on the Shopify section wrapper — target that for transforms
  const headerWrap  = document.getElementById('shopify-section-header') || header;
  if (header) {
    const pill        = document.getElementById('HeaderPill');
    const pillMenuBtn = document.getElementById('HeaderPillMenu');
    const mainMenuBtn = document.getElementById('MobileMenuToggle');
    const isCompact   = header.dataset.compact === 'true';
    const threshold   = parseInt(header.dataset.compactThreshold, 10) || 80;
    let   lastY       = window.scrollY;
    let   ticking     = false;

    if (pillMenuBtn && mainMenuBtn) {
      pillMenuBtn.addEventListener('click', () => mainMenuBtn.click());
    }

    function updateHeader() {
      const currentY  = window.scrollY;
      const goingDown = currentY > lastY;

      header.classList.toggle('scrolled', currentY > 10);

      if (isCompact) {
        if (currentY <= threshold) {
          // At top — full header, nothing hidden
          headerWrap.classList.remove('is-hidden');
          header.classList.remove('is-compact', 'is-hidden');
          if (pill) pill.setAttribute('aria-hidden', 'true');
        } else if (goingDown) {
          // Scrolling down — slide entire section off top
          headerWrap.classList.add('is-hidden');
          header.classList.remove('is-compact');
          if (pill) pill.setAttribute('aria-hidden', 'true');
        } else {
          // Scrolling up — slide section back, show compact pill
          headerWrap.classList.remove('is-hidden');
          header.classList.add('is-compact');
          if (pill) pill.setAttribute('aria-hidden', 'false');
        }
      }

      lastY   = currentY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
    }, { passive: true });

    updateHeader();
  }

  // ============================================
  // PRO SCROLL-REVEAL SYSTEM
  // ============================================
  if ('IntersectionObserver' in window) {

    // ── Inject base animation styles (only applies when JS runs) ──
    const revealCSS = document.createElement('style');
    revealCSS.id = 'luxe-reveal-styles';
    revealCSS.textContent = `
      [data-reveal] {
        opacity: 0;
        transform: translateY(22px);
        transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1),
                    transform 0.65s cubic-bezier(0.4,0,0.2,1);
        will-change: opacity, transform;
      }
      [data-reveal].is-revealed {
        opacity: 1;
        transform: translateY(0);
        will-change: auto;
      }
      [data-reveal-item] {
        opacity: 0;
        transform: translateY(22px);
        transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1),
                    transform 0.55s cubic-bezier(0.4,0,0.2,1);
        will-change: opacity, transform;
      }
      [data-reveal-item].is-revealed {
        opacity: 1;
        transform: translateY(0);
        will-change: auto;
      }
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1),
                    transform 0.6s cubic-bezier(0.4,0,0.2,1);
      }
      .fade-in.visible { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) {
        [data-reveal], [data-reveal-item], .fade-in {
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(revealCSS);

    // ── Single-element reveal ──────────────────────────────────────
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
        if (delay) {
          setTimeout(() => entry.target.classList.add('is-revealed'), delay);
        } else {
          entry.target.classList.add('is-revealed');
        }
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

    // ── Stagger container reveal ───────────────────────────────────
    // Parent: data-reveal-stagger (optional data-stagger-delay="100")
    // Children: data-reveal-item
    const staggerObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const items = entry.target.querySelectorAll('[data-reveal-item]');
        const stepMs = parseInt(entry.target.dataset.staggerDelay || '100', 10);
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('is-revealed'), i * stepMs);
        });
        staggerObs.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal-stagger]').forEach(el => staggerObs.observe(el));

    // ── Legacy .fade-in (product cards, story cards, etc.) ────────
    const legacyObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          legacyObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
      '.product-card, .featured-collections__item, .story-card, .instagram-feed__item, .footer__trust-item'
    ).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${(i % 5) * 90}ms`;
      legacyObs.observe(el);
    });
  }

});
