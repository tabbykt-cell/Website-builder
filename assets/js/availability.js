/* =============================================================================
   Bushwacker Barber Shop — Availability Engine  (DEMO FRAMEWORK)
   -----------------------------------------------------------------------------
   Computes bookable time slots from barber schedules, existing appointments and
   service duration. Everything runs in the browser: "existing appointments" are
   generated deterministically from the date so the demo looks alive and behaves
   consistently, and confirmed demo bookings persist in localStorage.

   TO GO LIVE, replace exactly two functions:
     getBookedIntervals(barberId, dateStr)  -> fetch real appointments from API
     saveBooking(booking)                   -> POST the booking to the API
   Every other function is real scheduling logic and can stay as-is.
   ============================================================================= */

const Availability = (function () {
  'use strict';

  const SLOT_STEP_MINS = 15;   // booking grid granularity
  const BUFFER_MINS    = 0;    // clean-up time padded after each appointment
  const LEAD_TIME_MINS = 60;   // no bookings sooner than this from now
  const DAYS_BOOKABLE  = 21;   // how far ahead the date picker runs
  const STORAGE_KEY    = 'bushwacker.demoBookings.v1';

  /* --- time helpers ------------------------------------------------------ */

  function toMins(hhmm) {
    const p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function fromMins(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  /** 12-hour label, e.g. 570 -> "9:30 AM" */
  function formatTime(mins) {
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const suffix = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + suffix;
  }

  /** Local-timezone 'YYYY-MM-DD'. Never use toISOString() — it shifts to UTC. */
  function dateKey(date) {
    return date.getFullYear() + '-' +
           String(date.getMonth() + 1).padStart(2, '0') + '-' +
           String(date.getDate()).padStart(2, '0');
  }

  function parseDateKey(str) {
    const p = str.split('-');
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }

  function isSameDay(a, b) { return dateKey(a) === dateKey(b); }

  /** Stable hash so "existing appointments" don't reshuffle on every render. */
  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  /* --- demo persistence -------------------------------------------------- */

  function loadDemoBookings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  /** REPLACE FOR PRODUCTION: POST to the booking API instead of localStorage. */
  function saveBooking(booking) {
    const all = loadDemoBookings();
    all.push(booking);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) { /* private browsing — the demo still works, just not persisted */ }
    return booking;
  }

  function clearDemoBookings() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* --- booked time --------------------------------------------------------
     REPLACE FOR PRODUCTION: return real appointments as [startMins, endMins].
     Demo version = deterministic pseudo-bookings + this browser's own bookings.
  ------------------------------------------------------------------------ */
  function getBookedIntervals(barberId, dateStr) {
    const shift = getShift(barberId, dateStr);
    if (!shift) return [];

    const intervals = [];
    const seed = hashString(barberId + '|' + dateStr);

    // 2-5 pseudo-appointments per day, spread across the shift.
    const count = 2 + (seed % 4);
    const span = shift.end - shift.start;

    for (let i = 0; i < count; i++) {
      const r = hashString(barberId + dateStr + ':' + i);
      const offset = Math.floor((r % Math.max(span - 60, 1)) / SLOT_STEP_MINS) * SLOT_STEP_MINS;
      const start = shift.start + offset;
      const dur = [30, 45, 60][r % 3];
      intervals.push([start, start + dur]);
    }

    // Real bookings made in this browser during the demo.
    loadDemoBookings().forEach(function (b) {
      if (b.barberId === barberId && b.date === dateStr) {
        intervals.push([toMins(b.startTime), toMins(b.startTime) + b.durationMins]);
      }
    });

    return intervals;
  }

  /* --- schedule ---------------------------------------------------------- */

  /** The barber's working window for a date, or null if they are off. */
  function getShift(barberId, dateStr) {
    if (CLOSED_DATES.indexOf(dateStr) !== -1) return null;

    const schedule = SCHEDULES[barberId];
    if (!schedule) return null;

    const dow = parseDateKey(dateStr).getDay();
    const day = schedule[dow];
    if (!day) return null;

    return {
      start: toMins(day.start),
      end: toMins(day.end),
      breaks: (day.breaks || []).map(function (b) {
        return [toMins(b[0]), toMins(b[1])];
      })
    };
  }

  function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
  }

  /**
   * Every start time a barber can take a service of `durationMins` on a date.
   * Returns [{ minutes, label }] sorted ascending. Empty = fully booked or off.
   */
  function getSlotsFor(barberId, dateStr, durationMins) {
    const shift = getShift(barberId, dateStr);
    if (!shift) return [];

    const barber = BARBERS_BY_ID[barberId];
    if (!barber) return [];

    const blocked = shift.breaks.concat(getBookedIntervals(barberId, dateStr));
    const needed = durationMins + BUFFER_MINS;

    // Same-day bookings need lead time.
    const now = new Date();
    let earliest = shift.start;
    if (isSameDay(parseDateKey(dateStr), now)) {
      const cutoff = now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MINS;
      earliest = Math.max(earliest, Math.ceil(cutoff / SLOT_STEP_MINS) * SLOT_STEP_MINS);
    }

    const slots = [];
    for (let t = earliest; t + needed <= shift.end; t += SLOT_STEP_MINS) {
      const clash = blocked.some(function (iv) {
        return overlaps(t, t + needed, iv[0], iv[1]);
      });
      if (!clash) slots.push({ minutes: t, label: formatTime(t) });
    }
    return slots;
  }

  /** Barbers qualified to perform a service. */
  function barbersForService(serviceId) {
    return BARBERS.filter(function (b) {
      return b.skills.indexOf(serviceId) !== -1;
    });
  }

  /**
   * "Any Barber" resolution.
   * Returns every start time available from ANY qualified barber that day, each
   * tagged with the barber who would take it.
   *
   * Assignment walks the day in order and, at each time, hands the slot to
   * whichever free barber has been assigned the fewest so far — ties going to
   * whoever has the emptier day. That balances the offer across chairs instead
   * of stacking a whole day onto one barber, and it means the customer sees
   * genuinely different barbers as they scan down the times.
   */
  function getCombinedSlots(serviceId, dateStr, durationMins) {
    const candidates = barbersForService(serviceId);

    // Whole-day availability per barber, used as the tie-breaker.
    const dayLoad = {};
    const byTime = {};

    candidates.forEach(function (b) {
      const slots = getSlotsFor(b.id, dateStr, durationMins);
      dayLoad[b.id] = slots.length;
      slots.forEach(function (slot) {
        if (!byTime[slot.minutes]) byTime[slot.minutes] = [];
        byTime[slot.minutes].push(b.id);
      });
    });

    const assigned = {};
    candidates.forEach(function (b) { assigned[b.id] = 0; });

    return Object.keys(byTime)
      .map(function (k) { return parseInt(k, 10); })
      .sort(function (a, b) { return a - b; })
      .map(function (minutes) {
        const free = byTime[minutes];
        const pick = free.slice().sort(function (a, b) {
          if (assigned[a] !== assigned[b]) return assigned[a] - assigned[b];
          return dayLoad[b] - dayLoad[a];
        })[0];

        assigned[pick] += 1;

        return {
          minutes: minutes,
          label: formatTime(minutes),
          barberId: pick,                   // auto-assigned
          alternates: free.length - 1       // others who could also take it
        };
      });
  }

  /**
   * Unified entry point used by the booking UI.
   * barberId 'any' -> auto-assignment across the whole team.
   */
  function getAvailability(barberId, serviceId, dateStr) {
    const service = SERVICES_BY_ID[serviceId];
    if (!service) return [];

    if (barberId === 'any') {
      return getCombinedSlots(serviceId, dateStr, service.mins);
    }
    return getSlotsFor(barberId, dateStr, service.mins).map(function (s) {
      return { minutes: s.minutes, label: s.label, barberId: barberId, alternates: 0 };
    });
  }

  /** Rolling list of dates for the picker, each flagged with availability. */
  function getBookableDates(barberId, serviceId) {
    const out = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < DAYS_BOOKABLE; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = dateKey(d);
      const slots = serviceId ? getAvailability(barberId, serviceId, key) : [];
      out.push({
        date: d,
        key: key,
        dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: i === 0,
        slotCount: slots.length,
        available: slots.length > 0
      });
    }
    return out;
  }

  /** Soonest opening across the next N days — powers "Next available" badges. */
  function nextAvailable(barberId, serviceId, withinDays) {
    const limit = withinDays || DAYS_BOOKABLE;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < limit; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const key = dateKey(d);
      const slots = getAvailability(barberId, serviceId, key);
      if (slots.length) {
        return {
          date: d,
          dateKey: key,
          slot: slots[0],
          dayLabel: i === 0 ? 'Today'
                  : i === 1 ? 'Tomorrow'
                  : d.toLocaleDateString('en-US', { weekday: 'long' })
        };
      }
    }
    return null;
  }

  /** Is the shop open right now? Drives the header status pill. */
  function shopStatus() {
    const now = new Date();
    const today = SHOP.hours[now.getDay()];
    const mins = now.getHours() * 60 + now.getMinutes();

    if (!today.open) return { open: false, text: 'Closed today' };

    const open = toMins(today.open);
    const close = toMins(today.close);

    if (mins < open)   return { open: false, text: 'Opens ' + formatTime(open) };
    if (mins >= close) return { open: false, text: 'Closed' };
    if (close - mins <= 60) return { open: true, text: 'Closing at ' + formatTime(close) };
    return { open: true, text: 'Open until ' + formatTime(close) };
  }

  function confirmationCode(booking) {
    const h = hashString(booking.date + booking.startTime + booking.barberId + booking.name);
    return 'BW-' + String(h % 100000).padStart(5, '0');
  }

  return {
    SLOT_STEP_MINS: SLOT_STEP_MINS,
    toMins: toMins,
    fromMins: fromMins,
    formatTime: formatTime,
    dateKey: dateKey,
    parseDateKey: parseDateKey,
    getShift: getShift,
    getSlotsFor: getSlotsFor,
    getCombinedSlots: getCombinedSlots,
    getAvailability: getAvailability,
    getBookableDates: getBookableDates,
    barbersForService: barbersForService,
    nextAvailable: nextAvailable,
    shopStatus: shopStatus,
    saveBooking: saveBooking,
    loadDemoBookings: loadDemoBookings,
    clearDemoBookings: clearDemoBookings,
    confirmationCode: confirmationCode
  };
})();
