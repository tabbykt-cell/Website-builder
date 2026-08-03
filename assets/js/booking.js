/* =============================================================================
   Bushwacker Barber Shop — Booking Wizard  (DEMO FRAMEWORK)
   -----------------------------------------------------------------------------
   Steps: 1 Service -> 2 Barber -> 3 Date & Time -> 4 Details -> 5 Confirmation.

   The scheduling logic in availability.js is real. What is stubbed is delivery:
   confirming a booking writes to localStorage instead of a booking system.
   See submit() for the single place to swap in a real API call.
   ============================================================================= */

(function () {
  'use strict';

  const $ = App.$, $$ = App.$$, esc = App.esc, icon = App.icon;

  const LAST_STEP = 4;          // 5 is the confirmation screen
  const ANY = 'any';

  /* Current selection. One object, one source of truth. */
  const state = {
    step: 1,
    serviceId: null,
    barberId: null,             // 'any' or a barber id
    dateKey: null,
    slot: null,                 // { minutes, label, barberId, alternates }
    details: { name: '', phone: '', email: '', notes: '', remind: true },
    booking: null               // set once confirmed
  };

  /* --------------------------------------------------------------------------
     Helpers
     ----------------------------------------------------------------------- */
  function service() { return state.serviceId ? SERVICES_BY_ID[state.serviceId] : null; }

  /** Who is actually cutting: the chosen barber, or whoever the slot assigned. */
  function assignedBarber() {
    if (state.slot && state.slot.barberId) return BARBERS_BY_ID[state.slot.barberId];
    if (state.barberId && state.barberId !== ANY) return BARBERS_BY_ID[state.barberId];
    return null;
  }

  function prettyDate(key) {
    if (!key) return '';
    return Availability.parseDateKey(key).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  }

  function shortDate(key) {
    if (!key) return '';
    return Availability.parseDateKey(key).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric'
    });
  }

  function avatarMarkup(barber, cls) {
    return '<div class="' + (cls || 'opt__avatar') + '">' +
      '<img src="' + esc(barber.photo) + '" alt="" loading="lazy"' +
      ' data-fallback="initials" data-name="' + esc(barber.name) + '">' +
      '</div>';
  }

  /* --------------------------------------------------------------------------
     STEP 1 — Service
     ----------------------------------------------------------------------- */
  function renderServices() {
    const host = $('#serviceOptions');

    host.innerHTML = SERVICE_CATEGORIES.map(function (cat) {
      const opts = cat.services.map(function (svc) {
        const selected = state.serviceId === svc.id;
        return '' +
          '<button type="button" class="opt' + (selected ? ' is-selected' : '') + '"' +
                 ' data-service="' + esc(svc.id) + '" aria-pressed="' + selected + '">' +
            '<span class="opt__check">' + icon('i-check') + '</span>' +
            '<span class="opt__body">' +
              '<span class="opt__name">' + esc(svc.name) +
                (svc.featured ? '<span class="opt__flag">Popular</span>' : '') +
              '</span>' +
              '<span class="opt__meta">' + esc(svc.mins) + ' min · ' + esc(svc.desc) + '</span>' +
            '</span>' +
            '<span class="opt__price">$' + esc(svc.price) + '</span>' +
          '</button>';
      }).join('');

      return '<div class="opt-group">' +
        '<div class="opt-group__label">' + esc(cat.name) + '</div>' +
        '<div class="opt-list">' + opts + '</div>' +
      '</div>';
    }).join('');
  }

  function onServiceClick(e) {
    const btn = e.target.closest('[data-service]');
    if (!btn) return;

    const id = btn.dataset.service;
    const changed = state.serviceId !== id;
    state.serviceId = id;

    // A different service can mean a different set of qualified barbers and a
    // different duration, so anything downstream has to be re-picked.
    if (changed) {
      state.slot = null;
      const picked = state.barberId && state.barberId !== ANY
        ? BARBERS_BY_ID[state.barberId] : null;
      if (picked && picked.skills.indexOf(id) === -1) state.barberId = null;
    }

    renderServices();
    updateBar();
  }

  /* --------------------------------------------------------------------------
     STEP 2 — Barber (including the "any barber" auto-assign path)
     ----------------------------------------------------------------------- */
  function renderBarbers() {
    const host = $('#barberOptions');
    const svc = service();
    if (!svc) { host.innerHTML = ''; return; }

    const qualified = Availability.barbersForService(svc.id);

    // "Any barber" — soonest opening across the whole qualified team.
    const anyNext = Availability.nextAvailable(ANY, svc.id, 21);
    const anySelected = state.barberId === ANY;

    let html = '<div class="opt-group"><div class="opt-list">' +
      '<button type="button" class="opt opt--any' + (anySelected ? ' is-selected' : '') + '"' +
             ' data-barber="' + ANY + '" aria-pressed="' + anySelected + '">' +
        '<span class="opt__check">' + icon('i-check') + '</span>' +
        '<span class="opt__avatar">' + icon('i-shuffle') + '</span>' +
        '<span class="opt__body">' +
          '<span class="opt__name">Any Barber <span class="opt__flag">Fastest</span></span>' +
          '<span class="opt__meta">We match you with the first barber open for this service.</span>' +
          (anyNext
            ? '<span class="opt__note">Soonest: ' + esc(anyNext.dayLabel) + ' at ' + esc(anyNext.slot.label) + '</span>'
            : '<span class="opt__note is-off">Nothing open in the next 3 weeks</span>') +
        '</span>' +
      '</button>' +
    '</div></div>';

    // Individual barbers, each with their own soonest opening.
    const cards = qualified.map(function (b) {
      const next = Availability.nextAvailable(b.id, svc.id, 21);
      const selected = state.barberId === b.id;

      return '' +
        '<button type="button" class="opt' + (selected ? ' is-selected' : '') + '"' +
               ' data-barber="' + esc(b.id) + '" aria-pressed="' + selected + '">' +
          '<span class="opt__check">' + icon('i-check') + '</span>' +
          avatarMarkup(b) +
          '<span class="opt__body">' +
            '<span class="opt__name">' + esc(b.name) + '</span>' +
            '<span class="opt__meta">' + esc(b.title) + '</span>' +
            (next
              ? '<span class="opt__note">Soonest: ' + esc(next.dayLabel) + ' at ' + esc(next.slot.label) + '</span>'
              : '<span class="opt__note is-off">Booked out — try another barber</span>') +
          '</span>' +
        '</button>';
    }).join('');

    html += '<div class="opt-group">' +
      '<div class="opt-group__label">Or pick your barber</div>' +
      '<div class="opt-list">' + cards + '</div>' +
    '</div>';

    // Barbers who do not perform this service, shown so the list feels complete.
    const excluded = BARBERS.filter(function (b) { return qualified.indexOf(b) === -1; });
    if (excluded.length) {
      html += '<p style="font-size:12.5px;color:var(--muted-2);margin-top:-10px">' +
        esc(excluded.map(function (b) { return b.name; }).join(' and ')) +
        (excluded.length > 1 ? ' do not' : ' does not') +
        ' offer ' + esc(svc.name) + '.</p>';
    }

    host.innerHTML = html;
    App.watchImages(host);
  }

  function onBarberClick(e) {
    const btn = e.target.closest('[data-barber]');
    if (!btn) return;

    const id = btn.dataset.barber;
    if (state.barberId !== id) {
      state.barberId = id;
      state.slot = null;              // availability differs per barber
      state.dateKey = null;
    }
    renderBarbers();
    updateBar();
  }

  /* --------------------------------------------------------------------------
     STEP 3 — Date & time
     ----------------------------------------------------------------------- */
  function renderDates() {
    const rail = $('#dateRail');
    const svc = service();
    if (!svc || !state.barberId) { rail.innerHTML = ''; return; }

    const dates = Availability.getBookableDates(state.barberId, svc.id);

    // Default to the first day with an opening. Also re-home the selection if a
    // service or barber change left it pointing at a day that is now full.
    const current = dates.filter(function (d) { return d.key === state.dateKey; })[0];
    if (!state.dateKey || !current || !current.available) {
      const firstOpen = dates.filter(function (d) { return d.available; })[0];
      state.dateKey = firstOpen ? firstOpen.key : null;
    }

    rail.innerHTML = dates.map(function (d) {
      const selected = state.dateKey === d.key;
      // Density dots: a quick read on how busy that day is.
      const dots = d.available
        ? new Array(Math.min(3, Math.ceil(d.slotCount / 6)) + 1).join('<i></i>')
        : '';

      return '<button type="button" class="date-chip' +
             (selected ? ' is-selected' : '') +
             (d.available ? '' : ' is-full') + '"' +
             ' data-date="' + esc(d.key) + '"' +
             ' aria-label="' + esc(prettyDate(d.key)) + ', ' +
               (d.available ? d.slotCount + ' times open' : 'unavailable') + '">' +
        '<span class="date-chip__dow">' + esc(d.isToday ? 'Today' : d.dow) + '</span>' +
        '<span class="date-chip__num">' + esc(d.dayNum) + '</span>' +
        '<span class="date-chip__mon">' + esc(d.month) + '</span>' +
        '<span class="date-chip__dots">' + dots + '</span>' +
      '</button>';
    }).join('');

    const selectedChip = rail.querySelector('.date-chip.is-selected');
    if (selectedChip) selectedChip.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  function renderSlots() {
    const area = $('#slotArea');
    const svc = service();
    if (!svc || !state.barberId || !state.dateKey) { area.innerHTML = ''; return; }

    const slots = Availability.getAvailability(state.barberId, svc.id, state.dateKey);

    if (!slots.length) {
      area.innerHTML = '<div class="empty-state">' + icon('i-clock') +
        '<strong>Nothing open that day</strong>' +
        'Try another date above' +
        (state.barberId !== ANY ? ', or go back and choose <em>Any Barber</em>.' : '.') +
        '</div>';
      return;
    }

    // Group into morning / afternoon / evening so a long list stays scannable.
    const groups = [
      { label: 'Morning',   from: 0,        to: 12 * 60 },
      { label: 'Afternoon', from: 12 * 60,  to: 17 * 60 },
      { label: 'Evening',   from: 17 * 60,  to: 24 * 60 }
    ];

    let html = '';
    groups.forEach(function (g) {
      const inGroup = slots.filter(function (s) {
        return s.minutes >= g.from && s.minutes < g.to;
      });
      if (!inGroup.length) return;

      html += '<div class="slot-period">' + esc(g.label) + '</div><div class="slot-grid">';
      html += inGroup.map(function (s) {
        const selected = state.slot && state.slot.minutes === s.minutes;
        // With "Any Barber", show who the slot would be assigned to.
        const who = (state.barberId === ANY && BARBERS_BY_ID[s.barberId])
          ? '<small>' + esc(BARBERS_BY_ID[s.barberId].name) + '</small>' : '';

        return '<button type="button" class="slot' + (selected ? ' is-selected' : '') + '"' +
               ' data-slot="' + esc(s.minutes) + '" data-barber="' + esc(s.barberId) + '">' +
               esc(s.label) + who + '</button>';
      }).join('');
      html += '</div>';
    });

    area.innerHTML = html;
  }

  function renderStep3() {
    const svc = service();
    const sub = $('#timeSub');

    if (svc) {
      const who = state.barberId === ANY
        ? 'the first available barber'
        : (BARBERS_BY_ID[state.barberId] ? BARBERS_BY_ID[state.barberId].name : 'your barber');
      sub.textContent = svc.name + ' · ' + svc.mins + ' min with ' + who + '.';
    }
    renderDates();
    renderSlots();
  }

  function onDateClick(e) {
    const btn = e.target.closest('[data-date]');
    if (!btn) return;
    state.dateKey = btn.dataset.date;
    state.slot = null;
    renderDates();
    renderSlots();
    updateBar();
  }

  function onSlotClick(e) {
    const btn = e.target.closest('[data-slot]');
    if (!btn) return;

    const minutes = parseInt(btn.dataset.slot, 10);
    state.slot = {
      minutes: minutes,
      label: Availability.formatTime(minutes),
      barberId: btn.dataset.barber
    };

    renderSlots();
    updateBar();

    if (state.barberId === ANY) {
      const b = BARBERS_BY_ID[state.slot.barberId];
      if (b) App.toast('Matched with ' + b.name + ' at ' + state.slot.label);
    }
  }

  /* --------------------------------------------------------------------------
     STEP 4 — Details & summary
     ----------------------------------------------------------------------- */
  function summaryHtml(title) {
    const svc = service();
    const barber = assignedBarber();
    if (!svc || !state.slot) return '';

    const endMins = state.slot.minutes + svc.mins;
    const timeRange = state.slot.label + ' – ' + Availability.formatTime(endMins);

    const barberLine = barber
      ? esc(barber.name) + (state.barberId === ANY
          ? '<small>Auto-assigned — first available</small>'
          : '<small>' + esc(barber.title) + '</small>')
      : '—';

    return '' +
      '<div class="summary__head"><h3>' + esc(title || 'Your appointment') + '</h3></div>' +
      '<div class="summary__body">' +
        '<div class="summary-row">' +
          '<span class="summary-row__k">Service</span>' +
          '<span class="summary-row__v">' + esc(svc.name) + '<small>' + esc(svc.mins) + ' minutes</small></span>' +
        '</div>' +
        '<div class="summary-row">' +
          '<span class="summary-row__k">Barber</span>' +
          '<span class="summary-row__v">' + barberLine + '</span>' +
        '</div>' +
        '<div class="summary-row">' +
          '<span class="summary-row__k">When</span>' +
          '<span class="summary-row__v">' + esc(prettyDate(state.dateKey)) + '<small>' + esc(timeRange) + '</small></span>' +
        '</div>' +
        '<div class="summary-row">' +
          '<span class="summary-row__k">Where</span>' +
          '<span class="summary-row__v">' + esc(SHOP.address.line1) +
            '<small>' + esc(SHOP.address.city + ', ' + SHOP.address.state) + '</small></span>' +
        '</div>' +
        '<div class="summary-row summary-row--total">' +
          '<span class="summary-row__k">Total</span>' +
          '<span class="summary-row__v">$' + esc(svc.price) + '</span>' +
        '</div>' +
      '</div>';
  }

  function renderStep4() {
    $('#summaryCard').innerHTML = summaryHtml('Your appointment');
  }

  /* --- validation ------------------------------------------------------- */
  function setError(inputId, errorId, show) {
    const input = $('#' + inputId);
    const error = $('#' + errorId);
    if (input) input.setAttribute('aria-invalid', show ? 'true' : 'false');
    if (error) error.classList.toggle('is-shown', !!show);
  }

  function validateDetails(showErrors) {
    const name = $('#fName').value.trim();
    const phone = $('#fPhone').value.trim();
    const email = $('#fEmail').value.trim();

    const nameOk = name.length >= 2;
    // Deliberately loose: 10+ digits after stripping formatting.
    const phoneOk = phone.replace(/\D/g, '').length >= 10;
    const emailOk = email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (showErrors) {
      setError('fName', 'errName', !nameOk);
      setError('fPhone', 'errPhone', !phoneOk);
      setError('fEmail', 'errEmail', !emailOk);
    }
    return nameOk && phoneOk && emailOk;
  }

  /* --------------------------------------------------------------------------
     Submit
     ----------------------------------------------------------------------- */
  function submit() {
    if (!validateDetails(true)) {
      const bad = $('[aria-invalid="true"]');
      if (bad) { bad.focus(); bad.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      return;
    }

    const svc = service();
    const barber = assignedBarber();

    state.details = {
      name: $('#fName').value.trim(),
      phone: $('#fPhone').value.trim(),
      email: $('#fEmail').value.trim(),
      notes: $('#fNotes').value.trim(),
      remind: $('#fRemind').checked
    };

    const booking = {
      serviceId: svc.id,
      serviceName: svc.name,
      barberId: barber ? barber.id : null,
      barberName: barber ? barber.name : null,
      autoAssigned: state.barberId === ANY,
      date: state.dateKey,
      startTime: Availability.fromMins(state.slot.minutes),
      durationMins: svc.mins,
      price: svc.price,
      name: state.details.name,
      phone: state.details.phone,
      email: state.details.email,
      notes: state.details.notes,
      remind: state.details.remind
    };

    /* ---- REPLACE FOR PRODUCTION ------------------------------------------
       Swap this line for a POST to the booking system, then show the
       confirmation on a successful response:

         fetch('/api/appointments', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(booking)
         }).then(...)

       Until then the booking is stored locally, which is enough to make the
       demo behave correctly: the slot disappears from availability afterwards.
    ---------------------------------------------------------------------- */
    Availability.saveBooking(booking);

    booking.code = Availability.confirmationCode(booking);
    state.booking = booking;

    renderConfirmation();
    goTo(5);
  }

  function renderConfirmation() {
    const b = state.booking;
    const barber = assignedBarber();

    $('#confirmText').innerHTML =
      esc(b.name.split(' ')[0]) + ', your chair is held for <strong>' +
      esc(shortDate(b.date)) + ' at ' + esc(Availability.formatTime(Availability.toMins(b.startTime))) +
      '</strong>' + (barber ? ' with ' + esc(barber.name) : '') + '.';

    $('#confirmCode').textContent = b.code;
    $('#confirmSummary').innerHTML = summaryHtml('Appointment details');
  }

  /* --- calendar file ---------------------------------------------------- */
  function pad(n) { return String(n).padStart(2, '0'); }

  function icsStamp(dateKey, mins) {
    const d = Availability.parseDateKey(dateKey);
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' +
           pad(Math.floor(mins / 60)) + pad(mins % 60) + '00';
  }

  function downloadIcs() {
    const b = state.booking;
    if (!b) return;

    const start = Availability.toMins(b.startTime);
    const a = SHOP.address;
    const location = [a.line1, a.line2, a.city + ', ' + a.state + ' ' + a.zip]
      .filter(Boolean).join(', ');

    // Floating local time — no TZ conversion, which is what a walk-in wants.
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Bushwacker Barber Shop//Booking//EN',
      'BEGIN:VEVENT',
      'UID:' + b.code + '@bushwackerbarber',
      'DTSTAMP:' + icsStamp(b.date, start),
      'DTSTART:' + icsStamp(b.date, start),
      'DTEND:' + icsStamp(b.date, start + b.durationMins),
      'SUMMARY:' + b.serviceName + ' at ' + SHOP.name,
      'DESCRIPTION:' + b.serviceName +
        (b.barberName ? ' with ' + b.barberName : '') +
        '. Confirmation ' + b.code + '. (Demonstration booking.)',
      'LOCATION:' + location,
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bushwacker-appointment.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

    App.toast('Calendar file downloaded');
  }

  /* --------------------------------------------------------------------------
     Step navigation
     ----------------------------------------------------------------------- */
  function canAdvance() {
    switch (state.step) {
      case 1: return !!state.serviceId;
      case 2: return !!state.barberId;
      case 3: return !!state.slot;
      case 4: return validateDetails(false);
      default: return false;
    }
  }

  const BAR_COPY = {
    1: { title: 'Choose a service',  next: 'Continue' },
    2: { title: 'Choose a barber',   next: 'Continue' },
    3: { title: 'Pick a time',       next: 'Continue' },
    4: { title: 'Your details',      next: 'Confirm Booking' }
  };

  function updateBar() {
    const bar = $('#bookBar');
    const nextBtn = $('#nextBtn');
    const backBtn = $('#backBtn');

    if (state.step > LAST_STEP) { bar.style.display = 'none'; return; }
    bar.style.display = '';

    const copy = BAR_COPY[state.step];
    const svc = service();

    // Once a service is picked, the bar shows the running selection instead.
    let title = copy.title;
    let sub = 'Step ' + state.step + ' of ' + LAST_STEP;

    if (state.step > 1 && svc) {
      title = svc.name + ' · $' + svc.price;
      const bits = [];
      const barber = assignedBarber();
      if (barber) bits.push(barber.name);
      else if (state.barberId === ANY) bits.push('Any barber');
      if (state.slot) bits.push(shortDate(state.dateKey) + ' ' + state.slot.label);
      sub = bits.length ? bits.join(' · ') : sub;
    }

    $('#barTitle').textContent = title;
    $('#barSub').textContent = sub;
    nextBtn.textContent = copy.next;
    nextBtn.disabled = !canAdvance();
    backBtn.style.display = state.step === 1 ? 'none' : '';
  }

  function updateStepper() {
    $$('.stepper__step').forEach(function (node) {
      const n = parseInt(node.dataset.step, 10);
      node.classList.toggle('is-active', n === state.step);
      node.classList.toggle('is-done', n < state.step || state.step > LAST_STEP);
    });
    $('#stepper').style.display = state.step > LAST_STEP ? 'none' : '';
  }

  function goTo(step) {
    state.step = step;

    $$('.step').forEach(function (node) {
      node.classList.toggle('is-active', parseInt(node.dataset.step, 10) === step);
    });

    if (step === 2) renderBarbers();
    if (step === 3) renderStep3();
    if (step === 4) renderStep4();

    updateStepper();
    updateBar();

    const announce = $('#stepAnnounce');
    if (announce) {
      announce.textContent = step > LAST_STEP
        ? 'Booking confirmed'
        : 'Step ' + step + ' of ' + LAST_STEP + ': ' + BAR_COPY[step].title;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function next() {
    if (!canAdvance()) return;
    if (state.step === LAST_STEP) submit();
    else goTo(state.step + 1);
  }

  function back() {
    if (state.step > 1 && state.step <= LAST_STEP) goTo(state.step - 1);
  }

  /* --------------------------------------------------------------------------
     Deep links — book.html?service=mens-cut&barber=marcus
     ----------------------------------------------------------------------- */
  function applyQuery() {
    const params = new URLSearchParams(window.location.search);

    const svcId = params.get('service');
    if (svcId && SERVICES_BY_ID[svcId]) state.serviceId = svcId;

    const barberId = params.get('barber');
    if (barberId === ANY) {
      state.barberId = ANY;
    } else if (barberId && BARBERS_BY_ID[barberId]) {
      state.barberId = barberId;
      // A barber deep-link with no service: default to the first thing they do.
      if (!state.serviceId) state.serviceId = BARBERS_BY_ID[barberId].skills[0];
    }

    // Skip ahead past anything the link already answered.
    if (state.serviceId && state.barberId) return 3;
    if (state.serviceId) return 2;
    return 1;
  }

  /* --------------------------------------------------------------------------
     Boot
     ----------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    const tel = 'tel:' + SHOP.phoneHref;
    ['#demoCallLink', '#walkinCall'].forEach(function (sel) {
      const node = $(sel);
      if (node) node.href = tel;
    });

    renderServices();

    $('#serviceOptions').addEventListener('click', onServiceClick);
    $('#barberOptions').addEventListener('click', onBarberClick);
    $('#dateRail').addEventListener('click', onDateClick);
    $('#slotArea').addEventListener('click', onSlotClick);

    $('#nextBtn').addEventListener('click', next);
    $('#backBtn').addEventListener('click', back);
    $('#addToCalendar').addEventListener('click', downloadIcs);

    // Live-enable the confirm button as the form is filled in.
    ['fName', 'fPhone', 'fEmail'].forEach(function (id) {
      const input = $('#' + id);
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateDetails(true);
        updateBar();
      });
      input.addEventListener('blur', function () { validateDetails(true); });
    });

    // Enter submits from the details form rather than reloading the page.
    $('#detailsForm').addEventListener('submit', function (e) {
      e.preventDefault();
      next();
    });

    goTo(applyQuery());
  });
})();
