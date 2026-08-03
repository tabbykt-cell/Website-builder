/* =============================================================================
   Bushwacker Barber Shop - Site Data
   -----------------------------------------------------------------------------
   EVERYTHING the site displays lives in this one file. Edit here, nowhere else.

   Confirmed from the shop's sign, its Google Business listing and the owner:
   name, second name (The Refinery Room), address, phone, service names and
   the two barbers.

   >>> ITEMS MARKED "PLACEHOLDER" STILL NEED CONFIRMING BEFORE GOING LIVE. <<<
   ============================================================================= */

/* -----------------------------------------------------------------------------
   1. SHOP DETAILS
   -------------------------------------------------------------------------- */
const SHOP = {
  name: 'Bushwacker Barber Shop',

  /* The shop sign reads "BUSHWACKER BARBER SHOP / THE REFINERY ROOM".
     Treated here as a second name for the same business - if The Refinery
     Room is actually a separate salon side with its own staff, split the
     colour and waxing services out to those stylists in section 3. */
  secondName: 'The Refinery Room',

  tagline: 'Cut Clean. Walk Tall.',
  blurb:
    'A long-running barber shop in Broad Street Square - haircuts, beard ' +
    'trims and straight razor work. Walk-ins welcome and the wait is short.',

  phone: '(910) 331-4629',
  phoneHref: '+19103314629',
  email: 'hello@bushwackerbarber.com',  // PLACEHOLDER

  address: {
    line1: '801 E Broad Ave #11',
    line2: 'Broad Street Square',
    city: 'Rockingham',
    state: 'NC',
    zip: '28379'
  },

  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
           encodeURIComponent('Bushwacker Barber Shop, 801 E Broad Ave #11, Rockingham, NC 28379'),

  social: {
    instagram: 'https://instagram.com/',  // PLACEHOLDER
    facebook: 'https://facebook.com/',    // PLACEHOLDER
    google: 'https://www.google.com/maps/search/?api=1&query=' +
            encodeURIComponent('Bushwacker Barber Shop, 801 E Broad Ave #11, Rockingham, NC 28379')
  },

  /* PLACEHOLDER - only one data point is confirmed: the Google listing showed
     "Open - Closes 5 PM" on a Monday afternoon, so weekdays close at 5. The
     opening times and the weekend are assumptions. Get the real hours from
     the shop and correct this block and the schedules in section 4 together.
     24h "HH:MM", null = closed. */
  hours: [
    { day: 'Sunday',    open: null,    close: null    },
    { day: 'Monday',    open: '09:00', close: '17:00' },
    { day: 'Tuesday',   open: '09:00', close: '17:00' },
    { day: 'Wednesday', open: '09:00', close: '17:00' },
    { day: 'Thursday',  open: '09:00', close: '17:00' },
    { day: 'Friday',    open: '09:00', close: '17:00' },
    { day: 'Saturday',  open: '08:00', close: '14:00' }
  ]
};

/* -----------------------------------------------------------------------------
   2. SERVICES
   Names come straight from the Google listing. Duplicates on the listing
   ("Beard trim" / "Beard Trim") have been merged.
   `price` and `mins` are PLACEHOLDER estimates — confirm with the shop.
   -------------------------------------------------------------------------- */
const SERVICE_CATEGORIES = [
  {
    id: 'cuts',
    name: 'Cuts',
    icon: 'scissors',
    blurb: 'Fades, tapers, hard parts and everything in between.',
    services: [
      { id: 'mens-cut',     name: "Men's Haircut",       mins: 30, price: 30,
        desc: 'Fades, hard parts, high & tight, crew cuts, taper, edging.' },
      { id: 'cut-shave',    name: 'Cut & Shave',         mins: 60, price: 55,
        desc: 'Full haircut paired with a straight razor hot towel shave.',
        featured: true },
      { id: 'buzz-cut',     name: 'Buzz Cut',            mins: 20, price: 20,
        desc: 'One guard, clean edge-up, in and out.' },
      { id: 'stylish-cut',  name: 'Stylish Cut',         mins: 45, price: 40,
        desc: 'Scissor-over-comb detail work and a finished style.' },
      { id: 'dry-cut',      name: 'Dry Cut',             mins: 25, price: 25,
        desc: 'No wash — straight to the chair.' },
      { id: 'womens-cut',   name: "Women's Cut",         mins: 45, price: 45,
        desc: 'Cut, wash and style.' },
      { id: 'womens-dry',   name: "Women's Dry Cut",     mins: 30, price: 32,
        desc: 'Dry cut and finish, no wash.' },
      { id: 'kids-cut',     name: "Kid's Cut (12 & under)", mins: 25, price: 22,
        desc: 'Patient hands, quick work.' }
    ]
  },
  {
    id: 'shaves',
    name: 'Shaves & Beard',
    icon: 'razor',
    blurb: 'Straight razor, hot towel, proper finish.',
    services: [
      { id: 'razor-shave',  name: 'Straight Razor Hot Towel Shave', mins: 40, price: 40,
        desc: 'Hot towel, warm lather, straight razor, cold finish.',
        featured: true },
      { id: 'head-shave',   name: 'Head Shave',          mins: 35, price: 35,
        desc: 'Full head, razor smooth.' },
      { id: 'beard-trim',   name: 'Beard Trim',          mins: 20, price: 18,
        desc: 'Shaped, lined and balanced to your jaw.' },
      { id: 'beard-cond',   name: 'Beard Conditioning',  mins: 25, price: 25,
        desc: 'Deep condition, hot towel and beard oil finish.' },
      { id: 'beard-oil',    name: 'Beard Oil Treatment', mins: 15, price: 15,
        desc: 'Softens the wire, kills the itch.' }
    ]
  },
  {
    id: 'color',
    name: 'Color',
    icon: 'drop',
    blurb: 'Grey blending, full color and touch-ups.',
    services: [
      { id: 'color-treat',  name: 'Color Treatment',     mins: 75, price: 75,
        desc: 'Full color service, consultation included.' },
      { id: 'hair-dying',   name: 'Hair Dying',          mins: 90, price: 90,
        desc: 'Full application with wash and style.' },
      { id: 'root-touch',   name: 'Root Touch-Up',       mins: 45, price: 50,
        desc: 'Regrowth only, blended clean.' },
      { id: 'brow-tint',    name: 'Eyebrow Tinting',     mins: 20, price: 20,
        desc: 'Shade-matched and softened.' },
      { id: 'blow-dry',     name: 'Blow-Dry Style',      mins: 30, price: 30,
        desc: 'Wash and blow-out finish.' }
    ]
  },
  {
    id: 'waxing',
    name: 'Waxing',
    icon: 'leaf',
    blurb: 'Quick, clean detail work.',
    services: [
      { id: 'brow-wax',     name: 'Eyebrow Wax',         mins: 15, price: 15,
        desc: 'Shaped and cleaned up.' },
      { id: 'facial-wax',   name: 'Facial Wax',          mins: 20, price: 22,
        desc: 'Nose, ears, cheeks — your call.' },
      { id: 'womens-wax',   name: "Women's Facial Wax",  mins: 25, price: 28,
        desc: 'Brow, lip and chin detail.' }
    ]
  }
];

/* Flat lookup: SERVICES_BY_ID['mens-cut'] -> { ...service, category } */
const SERVICES_BY_ID = {};
SERVICE_CATEGORIES.forEach(function (cat) {
  cat.services.forEach(function (svc) {
    SERVICES_BY_ID[svc.id] = Object.assign({}, svc, {
      categoryId: cat.id,
      categoryName: cat.name
    });
  });
});

/* -----------------------------------------------------------------------------
   3. BARBERS
   Chris and Kelby are the shop's two barbers - confirmed by the owner.
   Titles, blurbs and specialties below are PLACEHOLDER wording written to be
   safely generic; replace with how Chris and Kelby actually describe
   themselves. `photo` points at assets/images/ - a missing file falls back to
   initials, so the site looks finished before the photos land.

   `skills` lists the service IDs a barber performs. Both currently do
   everything; if Chris and Kelby split the work - or if The Refinery Room's
   colour and waxing services are handled by different stylists - remove those
   IDs here and the booking tool stops offering that barber for them.
   -------------------------------------------------------------------------- */
const ALL_SERVICE_IDS = [
  'mens-cut', 'cut-shave', 'buzz-cut', 'stylish-cut', 'dry-cut',
  'womens-cut', 'womens-dry', 'kids-cut',
  'razor-shave', 'head-shave', 'beard-trim', 'beard-cond', 'beard-oil',
  'color-treat', 'hair-dying', 'root-touch', 'brow-tint', 'blow-dry',
  'brow-wax', 'facial-wax', 'womens-wax'
];

const BARBERS = [
  {
    id: 'chris',
    name: 'Chris',
    title: 'Barber',                                        // PLACEHOLDER
    photo: 'assets/images/barber-chris.jpg',
    bio: 'Cuts, fades and beard work. Walk-ins welcome.',    // PLACEHOLDER
    specialties: ['Fades', 'Beard work', 'Straight razor'],  // PLACEHOLDER
    skills: ALL_SERVICE_IDS
  },
  {
    id: 'kelby',
    name: 'Kelby',
    title: 'Barber',                                        // PLACEHOLDER
    photo: 'assets/images/barber-kelby.jpg',
    bio: 'Cuts, fades and beard work. Walk-ins welcome.',    // PLACEHOLDER
    specialties: ['Fades', 'Kids cuts', 'Beard trims'],      // PLACEHOLDER
    skills: ALL_SERVICE_IDS
  }
];

const BARBERS_BY_ID = {};
BARBERS.forEach(function (b) { BARBERS_BY_ID[b.id] = b; });

/* -----------------------------------------------------------------------------
   4. BARBER SCHEDULES - what the booking engine actually reads.
   PLACEHOLDER: these follow the shop hours in section 1, which are themselves
   mostly assumed. Replace with each barber's real days and times.
   Keys 0-6 = Sunday-Saturday. Omit a day (or use null) for a day off.
   `breaks` are blocked windows (lunch, standing appointments).
   -------------------------------------------------------------------------- */
const SCHEDULES = {
  chris: {
    1: { start: '09:00', end: '17:00', breaks: [['12:00', '13:00']] },
    2: { start: '09:00', end: '17:00', breaks: [['12:00', '13:00']] },
    3: { start: '09:00', end: '17:00', breaks: [['12:00', '13:00']] },
    4: { start: '09:00', end: '17:00', breaks: [['12:00', '13:00']] },
    5: { start: '09:00', end: '17:00', breaks: [['12:00', '13:00']] },
    6: { start: '08:00', end: '14:00', breaks: [] }
  },
  kelby: {
    1: { start: '09:00', end: '17:00', breaks: [['13:00', '14:00']] },
    2: { start: '09:00', end: '17:00', breaks: [['13:00', '14:00']] },
    3: { start: '10:00', end: '17:00', breaks: [] },
    4: { start: '09:00', end: '17:00', breaks: [['13:00', '14:00']] },
    5: { start: '09:00', end: '17:00', breaks: [['13:00', '14:00']] },
    6: { start: '08:00', end: '14:00', breaks: [] }
  }
};

/* Shop-wide closures — nobody books these dates. Format: 'YYYY-MM-DD'. */
const CLOSED_DATES = [
  // '2026-12-25',
];

/* -----------------------------------------------------------------------------
   5. GALLERY  —  drop real photos at these paths (see assets/images/README.md).
   Missing files render a branded placeholder tile instead of a broken image.
   -------------------------------------------------------------------------- */
const GALLERY = [
  { src: 'assets/images/gallery-1.jpg', alt: 'Skin fade, finished' },
  { src: 'assets/images/gallery-2.jpg', alt: 'Hot towel straight razor shave' },
  { src: 'assets/images/gallery-3.jpg', alt: 'The shop floor' },
  { src: 'assets/images/gallery-4.jpg', alt: 'Beard shape-up' },
  { src: 'assets/images/gallery-5.jpg', alt: 'Hard part and taper' },
  { src: 'assets/images/gallery-6.jpg', alt: 'Barber chairs and mirrors' }
];

/* -----------------------------------------------------------------------------
   6. REVIEWS  —  PLACEHOLDER: swap for real Google reviews.
   -------------------------------------------------------------------------- */
const REVIEWS = [
  { name: 'D. Harmon',  stars: 5, text: 'Best fade I have had in this town, full stop. Marcus took his time and the line was razor sharp.' },
  { name: 'J. Ruiz',    stars: 5, text: 'Got the cut and shave. Hot towel, straight razor, the whole thing. Walked out feeling brand new.' },
  { name: 'A. Whitley', stars: 5, text: 'Renae fixed a color another shop wrecked. Honest about what she could do and it came out perfect.' },
  { name: 'S. Boone',   stars: 5, text: 'Took my two boys in on a Saturday. In and out, both cuts clean, no fuss.' }
];
