# Bushwacker Barber Shop — Website

A mobile-first website for Bushwacker Barber Shop, with an interactive
appointment-booking tool.

No build step, no framework, no dependencies. Plain HTML, CSS and JavaScript —
open `index.html` in a browser and it runs.

---

## Look at it

**Locally**

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. You can also just double-click `index.html`;
a local server only makes the URLs match production.

**On a phone, or to send to someone**

```bash
node tools/build-preview.js
```

Writes `dist/preview.html` — the whole site as one file, with the CSS,
JavaScript, logo and typefaces inlined and the booking tool folded in as a
second view. Nothing loads from the network, so it works offline, over email,
or from any host. `dist/preview-embed.html` is the same thing minus the
document skeleton, for hosts that supply their own.

The preview is for sharing. The real site is `index.html` + `book.html`.

**On the web** — see Deploying at the bottom.

---

## Files

```
index.html              Homepage
book.html               Booking tool
assets/
  css/styles.css        All styling (mobile-first, one file)
  js/
    data.js             ← EDIT HERE: shop details, services, barbers, schedules
    availability.js     Scheduling engine (slots, "any barber" matching)
    app.js              Header, drawer, dock, image fallbacks, toast
    home.js             Renders the homepage from data.js
    booking.js          The 4-step booking wizard
  img/logo.svg          Shield logo — pine tree and crossed razors
  images/               ← DROP PHOTOS HERE (see images/README.md)
tools/build-preview.js  Bundles everything into one shareable file
```

**Almost every change you will want to make is in `assets/js/data.js`.** Prices,
service names, barber names, hours, schedules, phone number, address and
reviews all live there. Nothing else needs to be touched to update content.

---

## The booking tool

Four steps, then a confirmation:

**1. Service** → **2. Barber** → **3. Date & time** → **4. Your details** → **Confirmed**

### Picking a barber

Two paths, exactly as requested:

- **Pick a specific barber.** Each barber shows their real soonest opening,
  computed live from their schedule. Barbers who do not perform the selected
  service are filtered out and named underneath so the list reads as complete.

- **"Any Barber".** The system finds every open start time across the whole
  qualified team and assigns one. It walks the day in order and hands each slot
  to whichever free barber has been assigned the fewest so far, ties going to
  whoever has the emptier day — so the offer spreads across chairs instead of
  stacking on whoever is listed first. Each time slot shows the barber it would
  assign, and confirming names them.

### What the engine accounts for

- Per-barber weekly schedules, including different hours on different days
- Days off
- Breaks and lunches
- Existing appointments
- Service duration — a 90-minute color needs a 90-minute gap, not a 15-minute one
- A 60-minute lead time on same-day bookings
- Shop-wide closure dates

### Deep links

Every "Book" button on the homepage carries the selection into the wizard:

- `book.html?service=cut-shave` — starts on the barber step
- `book.html?barber=marcus` — starts on the time step
- `book.html?service=razor-shave&barber=tony` — starts on the time step

---

## What is a demo and what is real

This was built as a working framework, so the parts that can be real are real.

**Real:** all scheduling logic, availability, conflict detection, barber
matching, duration handling, form validation, and the calendar (`.ics`) export.

**Stubbed:** delivery. Confirming a booking saves to the browser's
`localStorage` instead of sending it anywhere. The shop is not notified and
nothing is reserved — the booking page says so plainly, twice.

Bookings made during a demo do disappear from availability afterwards, which is
useful when showing it to someone. To reset, run `Availability.clearDemoBookings()`
in the browser console, or clear site data.

### Wiring it to a real booking system

Two functions, both in `assets/js/availability.js`:

| Function | Change it to |
|---|---|
| `getBookedIntervals(barberId, dateStr)` | Fetch that barber's real appointments and return `[[startMins, endMins], …]` |
| `saveBooking(booking)` | `POST` the booking to your API |

And in `assets/js/booking.js`, `submit()` has the exact `fetch()` call to swap
in, marked `REPLACE FOR PRODUCTION`. Everything else stays as-is.

If the shop already uses booking software (Square, Booksy, Vagaro, Schedulicity),
the faster route is to point the booking buttons at that provider's page and
keep this wizard as the front end only.

---

## Before this goes live

Things that need real information — all are marked `PLACEHOLDER` in `data.js`:

- [ ] **Phone number and email** — currently `(555) 555-0134`
- [ ] **Street address** — currently a placeholder on Marshall Ave
- [ ] **Barber names, bios and schedules** — currently Marcus, Tony, Renae, Cole
- [ ] **Prices** — estimated from typical shop rates, every one needs confirming
- [ ] **Service durations** — same
- [ ] **Photos** — see `assets/images/README.md`
- [ ] **Reviews** — swap the placeholders for real Google reviews
- [ ] **Social links** — Instagram and Facebook currently point at the homepages

Service *names* came from the shop's Google Business listing and are accurate.
Duplicate entries on the listing (`Beard trim` / `Beard Trim`) were merged, and
near-duplicates were grouped into four categories: Cuts, Shaves & Beard, Color
and Waxing.

---

## Design

Built mobile-first — base styles target phones, with tablet (≥640px) and
desktop (≥1024px) layered on top.

Mobile specifics:

- A sticky bottom dock with **Book Now** and **Call**, appearing once you scroll
  past the hero — the two things a phone visitor actually wants
- Slide-in drawer nav with focus trapping and escape-to-close
- Horizontal swipe rails for barbers, reviews and dates instead of cramped grids
- 44px+ tap targets throughout; 16px form inputs so iOS does not zoom on focus
- `env(safe-area-inset-*)` respected so nothing hides under the home indicator

**Palette** — dark shop interior, pine, brass and bone:

| | | |
|---|---|---|
| `#0d0f10` | Ink | Page background |
| `#1f3d31` / `#3d7c62` | Pine | Sections, accents |
| `#c8974a` / `#e2b76b` | Brass | Buttons, prices, highlights |
| `#f3efe6` | Bone | Text |
| `#a8443c` | Rust | Barber-pole stripe, warnings |

**Type** — Alfa Slab One (display), Oswald (headings and UI), Barlow (body),
loaded from Google Fonts with system fallbacks. The preview build inlines them
so it needs no network.

**Accessibility** — skip link, visible focus rings, ARIA on the tabs, stepper
and live regions, `prefers-reduced-motion` honoured, and semantic headings
throughout.

---

## Deploying

Any static host works. For GitHub Pages: **Settings → Pages → Deploy from
branch**, pick the branch and `/ (root)`. Netlify, Vercel and Cloudflare Pages
need no configuration either — there is nothing to build.
