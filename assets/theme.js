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
      container.querySelectorAll('.best-sellers__panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      container.querySelector(`#tab-panel-${tab.dataset.tab}`)?.classList.add('active');
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
  const header = document.getElementById('Header');
  if (header) {
    const pill         = document.getElementById('HeaderPill');
    const pillMenuBtn  = document.getElementById('HeaderPillMenu');
    const mainMenuBtn  = document.getElementById('MobileMenuToggle');
    const isCompact    = header.dataset.compact === 'true';
    const threshold    = parseInt(header.dataset.compactThreshold, 10) || 80;
    let   lastY        = window.scrollY;
    let   ticking      = false;

    // Pill hamburger delegates to existing mobile toggle
    if (pillMenuBtn && mainMenuBtn) {
      pillMenuBtn.addEventListener('click', () => mainMenuBtn.click());
    }

    function updateHeader() {
      const currentY   = window.scrollY;
      const goingDown  = currentY > lastY;

      // Always show shadow when scrolled
      header.classList.toggle('scrolled', currentY > 10);

      if (isCompact) {
        if (currentY <= threshold) {
          // At top — full header
          header.classList.remove('is-compact', 'is-hidden');
          if (pill) pill.setAttribute('aria-hidden', 'true');
        } else if (goingDown) {
          // Scrolling down — hide header
          header.classList.remove('is-compact');
          header.classList.add('is-hidden');
          if (pill) pill.setAttribute('aria-hidden', 'true');
        } else {
          // Scrolling up — show compact pill
          header.classList.remove('is-hidden');
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
  // SMOOTH FADE IN on scroll
  // ============================================
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .fade-in.visible { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
      '.product-card, .featured-collections__item, .story-card, .instagram-feed__item, .footer__trust-item'
    ).forEach((el, i) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      observer.observe(el);
    });
  }

});
