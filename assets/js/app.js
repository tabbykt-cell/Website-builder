/* =============================================================================
   Bushwacker Barber Shop — Shared behaviour
   Header, drawer, dock, image fallbacks, contact links, toast, reveals.
   Loaded on every page.
   ============================================================================= */

const App = (function () {
  'use strict';

  const $  = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  /** Escape user/data text before it goes anywhere near innerHTML. */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function icon(id, cls) {
    return '<svg class="' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  function initials(name) {
    return String(name).trim().split(/\s+/).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  }

  /* --- images -------------------------------------------------------------
     Photos have not been added to the repo yet. Rather than show broken
     images, swap in a branded placeholder (or a set of initials for people).
     Once the real files land in assets/images/ these never fire.
  ---------------------------------------------------------------------- */
  function handleImageError(img) {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';

    const mode = img.dataset.fallback || 'tile';

    if (mode === 'hidden') {          // hero — just let the gradient show
      img.style.display = 'none';
      return;
    }

    if (mode === 'initials') {        // person — show their initials
      const node = el('div', 'avatar-fallback', esc(initials(img.dataset.name || '?')));
      if (img.parentNode) img.parentNode.replaceChild(node, img);
      return;
    }

    const node = el('div', 'img-placeholder',            // gallery tile
      icon('i-image') + '<span>' + esc(img.dataset.label || 'Photo') + '</span>');
    if (img.parentNode) img.parentNode.replaceChild(node, img);
  }

  /** Wire up error handling, including images that already failed. */
  function watchImages(root) {
    $$('img[data-fallback]', root).forEach(function (img) {
      img.addEventListener('error', function () { handleImageError(img); });
      // complete + naturalWidth 0 => already failed before the listener attached
      if (img.complete && img.naturalWidth === 0) handleImageError(img);
    });
  }

  /* --- toast ------------------------------------------------------------ */
  let toastTimer = null;
  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove('is-shown'); }, 2800);
  }

  /* --- shop details ----------------------------------------------------- */
  function fillShopDetails() {
    const tel = 'tel:' + SHOP.phoneHref;
    const mailto = 'mailto:' + SHOP.email;
    const a = SHOP.address;
    const cityLine = a.city + ', ' + a.state + ' ' + a.zip;

    [['#headerCall', tel], ['#drawerCall', tel], ['#dockCall', tel],
     ['#heroPhone', tel]].forEach(function (pair) {
      const node = $(pair[0]);
      if (!node) return;
      node.href = pair[1];
      /* These links are an icon on small screens, so name the number for
         screen readers rather than leaving them as "link, phone". */
      node.setAttribute('aria-label', 'Call the shop on ' + SHOP.phone);
    });

    // Any element tagged .js-phone renders the number as readable text.
    $$('.js-phone').forEach(function (node) { node.textContent = SHOP.phone; });

    const setLink = function (sel, href, text) {
      const node = $(sel);
      if (!node) return;
      node.href = href;
      const span = node.querySelector('span');
      if (span) span.textContent = text;
      else if (text) node.textContent = text;
    };

    setLink('#visitPhone', tel, SHOP.phone);
    setLink('#visitEmail', mailto, SHOP.email);
    setLink('#footerPhone', tel, SHOP.phone);
    setLink('#footerEmail', mailto, SHOP.email);

    ['#visitDirections', '#footerDirections'].forEach(function (sel) {
      const node = $(sel);
      if (node) node.href = SHOP.mapsUrl;
    });

    const addr = $('#addressBlock');
    if (addr) {
      addr.innerHTML = '<strong>' + esc(SHOP.name) + '</strong>' +
        esc(a.line1) + (a.line2 ? '<br>' + esc(a.line2) : '') + '<br>' + esc(cityLine);
    }

    const drawerAddr = $('#drawerAddress');
    if (drawerAddr) {
      drawerAddr.innerHTML = esc(a.line1) + '<br>' + esc(cityLine) + '<br>' + esc(SHOP.phone);
    }

    const socials = $('#socialLinks');
    if (socials) {
      socials.innerHTML =
        '<a href="' + esc(SHOP.social.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon('i-instagram') + '</a>' +
        '<a href="' + esc(SHOP.social.facebook)  + '" target="_blank" rel="noopener" aria-label="Facebook">'  + icon('i-facebook')  + '</a>' +
        '<a href="' + esc(SHOP.social.google)    + '" target="_blank" rel="noopener" aria-label="Find us on Google Maps">' + icon('i-pin') + '</a>';
    }

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* --- header / drawer / dock ------------------------------------------- */
  function initChrome() {
    const header = $('#header');
    const drawer = $('#drawer');
    const menuBtn = $('#menuBtn');
    const dock = $('#dock');

    // Header background kicks in once you scroll; dock slides up past the hero.
    let ticking = false;
    const onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        const y = window.scrollY;
        if (header) header.classList.toggle('is-stuck', y > 24);
        if (dock) dock.classList.toggle('is-visible', y > 320);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!drawer || !menuBtn) return;

    let lastFocus = null;

    const openDrawer = function () {
      lastFocus = document.activeElement;
      drawer.hidden = false;
      // next frame so the transform transition actually runs
      window.requestAnimationFrame(function () { drawer.classList.add('is-open'); });
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      const first = drawer.querySelector('a, button');
      if (first) first.focus();
    };

    const closeDrawer = function () {
      drawer.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setTimeout(function () { drawer.hidden = true; }, 340);
      if (lastFocus) lastFocus.focus();
    };

    menuBtn.addEventListener('click', openDrawer);
    $$('[data-close-drawer]', drawer).forEach(function (node) {
      node.addEventListener('click', closeDrawer);
    });
    $$('.drawer__link', drawer).forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });

    // Trap focus inside the drawer while it is open.
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !drawer.classList.contains('is-open')) return;
      const items = $$('a[href], button:not([disabled])', drawer)
        .filter(function (n) { return n.offsetParent !== null; });
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* --- reveal on scroll ------------------------------------------------- */
  function initReveals() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    items.forEach(function (n) { io.observe(n); });
  }

  function init() {
    fillShopDetails();
    initChrome();
    initReveals();
    watchImages(document);
  }

  return {
    $: $, $$: $$, el: el, esc: esc, icon: icon, initials: initials,
    watchImages: watchImages, toast: toast, init: init
  };
})();

document.addEventListener('DOMContentLoaded', App.init);
