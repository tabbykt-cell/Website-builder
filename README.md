# Bushwacker Barber Shop — Website

A mobile-first website for Bushwacker Barber Shop (also signed *The Refinery
Room*) at 801 E Broad Ave #11, Broad Street Square, Rockingham NC, with an
interactive appointment-booking tool.

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

## What is confirmed, and what still is not

**Confirmed and in place**

- Shop name, and the second name *The Refinery Room* from the sign
- Address — 801 E Broad Ave #11, Broad Street Square, Rockingham NC 28379
- Phone — (910) 331-4629
- The two barbers — Chris and Kelby
- Service names, taken verbatim from the Google Business listing
- **Reviews** — eight real five-star Google reviews, quoted verbatim
- **Photos** — the storefront sign as the hero, plus five shop photos in the
  gallery. See `assets/images/README.md`
- **Four prices**, read off the chalkboards in the shop photo:

  | Service | Price |
  |---|---|
  | Hair Cut | $15 |
  | Beard Trim | $10 |
  | Hair Cut + Beard Trim | $20 |
  | Hair Cut + Hot Towel Straight Razor Shave | $30 |

  The $20 and $30 lines are fully legible. The $15 and $10 amounts are clear
  but their labels are partly hidden behind the barber's arm, so those two
  are worth double checking.

**Still needs real information** — every item is marked `PLACEHOLDER` in `data.js`:

- [ ] **The other 18 prices.** Estimated, but now scaled around the real $15
      haircut rather than a guess. All still need confirming.
- [ ] **Service durations.** Every one is an estimate. These matter more than
      they look — the booking engine uses them to size appointment slots.
- [ ] **Hours.** Only one data point is known: the listing read *"Closes 5 PM"*
      on a Monday afternoon, so weekdays are set to close at 5. Opening times
      and the weekend are assumptions. Fix `SHOP.hours` **and** `SCHEDULES`
      together — the first is what visitors read, the second is what the
      booking engine uses.
- [ ] **Barber schedules.** Which days and hours Chris and Kelby each work.
- [ ] **Barber titles, blurbs and specialties.** Currently deliberately generic
      wording rather than invented biography.
- [ ] **Barber photos** — `barber-chris.jpg` and `barber-kelby.jpg`
- [ ] **Email address** — currently `hello@bushwackerbarber.com`
- [ ] **Social links** — Instagram and Facebook point at the homepages

**Two open questions**

1. **Who is Steve?** Two five-star Google reviews thank a barber named Steve,
   who is not Chris or Kelby. Those two reviews are left out of `REVIEWS` for
   now — the other eight are in. Add them back once it is clear whether Steve
   still cuts there.
2. **Is The Refinery Room separate?** The sign reads BUSHWACKER BARBER SHOP /
   THE REFINERY ROOM. This is built as one business with two names. If The
   Refinery Room is a salon side with its own stylists, the colour and waxing
   services should be assigned to them — remove those IDs from Chris and
   Kelby's `skills` in `data.js` and the booking tool stops offering those two
   for them.

Duplicate entries on the Google listing (`Beard trim` / `Beard Trim`) were
merged, and the rest grouped into four categories: Cuts, Shaves & Beard, Color
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

**Palette** — taken directly from the shop sign: weathered plank boards in barn
red, cream and slate blue, rusted iron lettering, black pipe frame, brick wall.

| | | |
|---|---|---|
| `#16110f` | Ink | Page background — a warm near-black biased brown, like the charred brick |
| `#b0672f` / `#d68f4b` | Rust | The lettering. Buttons, prices, highlights |
| `#8b3a32` | Brick | Red plank. Stripe, warnings, errors |
| `#4e626b` / `#86a0aa` | Slate | Blue plank. Section bands, secondary buttons |
| `#efe7d9` | Cream | White plank. Text |

The diagonal stripe down the left of the hero repeats the sign's plank
sequence — red, cream, slate, cream. The logo is the sign itself: plank boards
in a pipe frame with a rusted slab `B`.

**Type** — Bevan (display), Oswald (headings and UI), Barlow (body), loaded
from Google Fonts with system fallbacks. Bevan is a wood-type slab serif,
chosen to echo the rusted metal letters on the sign. The preview build inlines
all three so it needs no network.

**Accessibility** — skip link, visible focus rings, ARIA on the tabs, stepper
and live regions, `prefers-reduced-motion` honoured, and semantic headings
throughout.

---

## Deploying

Any static host works. For GitHub Pages: **Settings → Pages → Deploy from
branch**, pick the branch and `/ (root)`. Netlify, Vercel and Cloudflare Pages
need no configuration either — there is nothing to build.
