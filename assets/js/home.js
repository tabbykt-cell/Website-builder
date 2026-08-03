/* =============================================================================
   Bushwacker Barber Shop — Homepage rendering
   Builds services, barbers, gallery, reviews and hours from assets/js/data.js.
   ============================================================================= */

(function () {
  'use strict';

  const $ = App.$, esc = App.esc, icon = App.icon;

  /* --- open / closed pill in the hero ----------------------------------- */
  function renderStatus() {
    const badge = $('#statusBadge');
    const text = $('#statusText');
    if (!badge || !text) return;

    const status = Availability.shopStatus();
    text.textContent = status.text;
    badge.classList.toggle('is-open', status.open);
  }

  /* --- scrolling ticker --------------------------------------------------
     The track is duplicated so the -50% scroll animation loops seamlessly.
  ---------------------------------------------------------------------- */
  function renderTicker() {
    const track = $('#ticker');
    if (!track) return;

    const phrases = [
      'Straight Razor Shaves', 'Skin Fades', 'Hard Parts', 'Beard Work',
      'Hot Towel Finish', 'Walk-Ins Welcome', 'Kids Cuts', 'Color & Grey Blending'
    ];
    const half = phrases.map(function (p) {
      return '<span class="ticker__item">' + esc(p) + '</span>';
    }).join('');

    track.innerHTML = half + half;
  }

  /* --- services --------------------------------------------------------- */
  function renderServices() {
    const tabs = $('#svcTabs');
    const panels = $('#svcPanels');
    if (!tabs || !panels) return;

    tabs.innerHTML = SERVICE_CATEGORIES.map(function (cat, i) {
      return '<button class="svc-tab' + (i === 0 ? ' is-active' : '') + '"' +
             ' role="tab" aria-selected="' + (i === 0) + '"' +
             ' aria-controls="panel-' + esc(cat.id) + '" data-cat="' + esc(cat.id) + '">' +
             esc(cat.name) + '</button>';
    }).join('');

    panels.innerHTML = SERVICE_CATEGORIES.map(function (cat, i) {
      const items = cat.services.map(function (svc) {
        return '' +
          '<div class="svc-item' + (svc.featured ? ' is-featured' : '') + '">' +
            '<div class="svc-item__body">' +
              '<h3 class="svc-item__name">' + esc(svc.name) +
                (svc.featured ? '<span class="svc-item__tag">Popular</span>' : '') +
              '</h3>' +
              '<p class="svc-item__desc">' + esc(svc.desc) + '</p>' +
              '<div class="svc-item__meta">' +
                '<span>' + icon('i-clock') + esc(svc.mins) + ' min</span>' +
              '</div>' +
            '</div>' +
            '<div class="svc-item__right">' +
              '<div class="svc-item__price">$' + esc(svc.price) + '<small>from</small></div>' +
              '<a class="svc-book" href="book.html?service=' + encodeURIComponent(svc.id) + '">Book</a>' +
            '</div>' +
          '</div>';
      }).join('');

      return '<div class="svc-panel' + (i === 0 ? ' is-active' : '') + '"' +
             ' id="panel-' + esc(cat.id) + '" role="tabpanel" data-cat="' + esc(cat.id) + '">' +
             '<div class="svc-list">' + items + '</div></div>';
    }).join('');

    tabs.addEventListener('click', function (e) {
      const tab = e.target.closest('.svc-tab');
      if (!tab) return;

      App.$$('.svc-tab', tabs).forEach(function (t) {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
      App.$$('.svc-panel', panels).forEach(function (p) {
        p.classList.toggle('is-active', p.dataset.cat === tab.dataset.cat);
      });
    });
  }

  /* --- barbers -----------------------------------------------------------
     Each card shows a live "next available" read from the scheduling engine,
     based on that barber's first listed skill.
  ---------------------------------------------------------------------- */
  function renderBarbers() {
    const rail = $('#barberRail');
    if (!rail) return;

    rail.innerHTML = BARBERS.map(function (b) {
      const next = Availability.nextAvailable(b.id, b.skills[0], 14);
      const todayShift = Availability.getShift(b.id, Availability.dateKey(new Date()));

      const statusText = next
        ? 'Next: ' + next.dayLabel + ' ' + next.slot.label
        : 'Fully booked';

      const tags = b.specialties.map(function (s) {
        return '<span class="barber-card__tag">' + esc(s) + '</span>';
      }).join('');

      return '' +
        '<article class="barber-card">' +
          '<div class="barber-card__photo">' +
            '<img src="' + esc(b.photo) + '" alt="' + esc(b.name) + ', ' + esc(b.title) + '"' +
                 ' loading="lazy" data-fallback="initials" data-name="' + esc(b.name) + '">' +
            '<span class="barber-card__status' + (todayShift ? '' : ' is-off') + '">' +
              '<span class="dot"></span>' + esc(statusText) +
            '</span>' +
          '</div>' +
          '<div class="barber-card__body">' +
            '<h3 class="barber-card__name">' + esc(b.name) + '</h3>' +
            '<p class="barber-card__title">' + esc(b.title) + '</p>' +
            '<p class="barber-card__bio">' + esc(b.bio) + '</p>' +
            '<div class="barber-card__tags">' + tags + '</div>' +
            '<a class="btn btn--pine btn--sm btn--block" href="book.html?barber=' +
              encodeURIComponent(b.id) + '">Book with ' + esc(b.name) + '</a>' +
          '</div>' +
        '</article>';
    }).join('');

    App.watchImages(rail);
  }

  /* --- gallery ---------------------------------------------------------- */
  function renderGallery() {
    const grid = $('#galleryGrid');
    if (!grid) return;

    grid.innerHTML = GALLERY.map(function (img) {
      return '<figure class="gallery__item">' +
        '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '" loading="lazy"' +
        ' data-fallback="tile" data-label="' + esc(img.alt) + '">' +
        '</figure>';
    }).join('');

    App.watchImages(grid);
  }

  /* --- reviews ---------------------------------------------------------- */
  function renderReviews() {
    const rail = $('#reviewRail');
    if (!rail) return;

    rail.innerHTML = REVIEWS.map(function (r) {
      const stars = new Array(r.stars + 1).join('★');
      return '' +
        '<blockquote class="review">' +
          '<div class="review__stars" aria-label="' + esc(r.stars) + ' out of 5 stars">' + stars + '</div>' +
          '<p class="review__text">' + esc(r.text) + '</p>' +
          '<cite class="review__name">' + esc(r.name) + '</cite>' +
        '</blockquote>';
    }).join('');
  }

  /* --- hours ------------------------------------------------------------ */
  function renderHours() {
    const list = $('#hoursList');
    if (!list) return;

    const todayIndex = new Date().getDay();

    list.innerHTML = SHOP.hours.map(function (h, i) {
      const closed = !h.open;
      const time = closed
        ? 'Closed'
        : Availability.formatTime(Availability.toMins(h.open)) + ' – ' +
          Availability.formatTime(Availability.toMins(h.close));

      return '<div class="hours-row' + (i === todayIndex ? ' is-today' : '') + '">' +
        '<span class="hours-row__day">' + esc(h.day) + (i === todayIndex ? ' · Today' : '') + '</span>' +
        '<span class="hours-row__time' + (closed ? ' is-closed' : '') + '">' + esc(time) + '</span>' +
      '</div>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderStatus();
    renderTicker();
    renderServices();
    renderBarbers();
    renderGallery();
    renderReviews();
    renderHours();
  });
})();
