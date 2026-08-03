/* =============================================================================
   Bushwacker Barber Shop — Site Data
   -----------------------------------------------------------------------------
   EVERYTHING the site displays lives in this one file. Edit here, nowhere else.

   >>> ITEMS MARKED "PLACEHOLDER" ARE PLACEHOLDERS. Replace before going live. <<<
   Service names are taken verbatim from the shop's Google Business listing.
   Prices and durations are estimates and MUST be confirmed by the shop.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   1. SHOP DETAILS  —  PLACEHOLDER: confirm every value in this block.
   -------------------------------------------------------------------------- */
const SHOP = {
  name: 'Bushwacker Barber Shop',
  tagline: 'Cut Clean. Walk Tall.',
  blurb:
    'A proper barber shop — hot towels, straight razors and a fade that holds ' +
    'its line all week. Walk-ins welcome, appointments always beat the wait.',

  phone: '(555) 555-0134',              // PLACEHOLDER
  phoneHref: '+15555550134',            // PLACEHOLDER
  email: 'hello@bushwackerbarber.com',  // PLACEHOLDER

  address: {
    line1: '1200 Marshall Ave',         // PLACEHOLDER
    line2: 'Suite B',                   // PLACEHOLDER
    city: 'Norwood',                    // PLACEHOLDER
    state: 'VA',                        // PLACEHOLDER
    zip: '24333'                        // PLACEHOLDER
  },

  // Used for the "Get Directions" button. Any maps URL works.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bushwacker+Barber+Shop',

  social: {
    instagram: 'https://instagram.com/',  // PLACEHOLDER
    facebook: 'https://facebook.com/',    // PLACEHOLDER
    google: 'https://www.google.com/maps/search/?api=1&query=Bushwacker+Barber+Shop'
  },

  /* Lobby hours shown on the site. Separate from barber schedules (section 4),
     which is what the booking engine actually reads. 24h "HH:MM", null = closed. */
  hours: [
    { day: 'Sunday',    open: null,    close: null  },
    { day: 'Monday',    open: '09:00', close: '18:00' },
    { day: 'Tuesday',   open: '09:00', close: '18:00' },
    { day: 'Wednesday', open: '09:00', close: '18:00' },
    { day: 'Thursday',  open: '09:00', close: '19:00' },
    { day: 'Friday',    open: '09:00', close: '19:00' },
    { day: 'Saturday',  open: '08:00', close: '16:00' }
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
   3. BARBERS  —  PLACEHOLDER: names, bios and photos.
   `photo` points at assets/images/. Missing files fall back to initials,
   so the site looks finished before the real photos land.
   `skills` lists service IDs. A barber is only offered for services they do.
   -------------------------------------------------------------------------- */
const BARBERS = [
  {
    id: 'marcus',
    name: 'Marcus',
    title: 'Master Barber · Owner',
    photo: 'assets/images/barber-marcus.jpg',
    bio: 'Twenty-two years behind the chair. Straight razor work is his religion.',
    specialties: ['Skin fades', 'Straight razor', 'Beard shaping'],
    skills: ['mens-cut', 'cut-shave', 'buzz-cut', 'stylish-cut', 'dry-cut', 'kids-cut',
             'razor-shave', 'head-shave', 'beard-trim', 'beard-cond', 'beard-oil']
  },
  {
    id: 'tony',
    name: 'Tony',
    title: 'Master Barber',
    photo: 'assets/images/barber-tony.jpg',
    bio: 'Fast hands, sharp lines. The go-to for a high & tight that stays crisp.',
    specialties: ['Hard parts', 'High & tight', 'Kids cuts'],
    skills: ['mens-cut', 'cut-shave', 'buzz-cut', 'stylish-cut', 'dry-cut', 'kids-cut',
             'razor-shave', 'head-shave', 'beard-trim', 'beard-oil']
  },
  {
    id: 'renae',
    name: 'Renae',
    title: 'Stylist & Color Specialist',
    photo: 'assets/images/barber-renae.jpg',
    bio: 'Color, grey blending and cuts that grow out as good as they go in.',
    specialties: ['Color', 'Grey blending', "Women's cuts"],
    skills: ['mens-cut', 'stylish-cut', 'dry-cut', 'womens-cut', 'womens-dry', 'kids-cut',
             'color-treat', 'hair-dying', 'root-touch', 'brow-tint', 'blow-dry',
             'brow-wax', 'facial-wax', 'womens-wax']
  },
  {
    id: 'cole',
    name: 'Cole',
    title: 'Barber',
    photo: 'assets/images/barber-cole.jpg',
    bio: 'Newest to the shop, first to say yes to a walk-in. Modern styles.',
    specialties: ['Textured crops', 'Taper fades', 'Beard trims'],
    skills: ['mens-cut', 'buzz-cut', 'stylish-cut', 'dry-cut', 'kids-cut',
             'beard-trim', 'beard-oil', 'head-shave', 'brow-wax', 'facial-wax']
  }
];

const BARBERS_BY_ID = {};
BARBERS.forEach(function (b) { BARBERS_BY_ID[b.id] = b; });

/* -----------------------------------------------------------------------------
   4. BARBER SCHEDULES — what the booking engine actually reads.
   Keys 0-6 = Sunday-Saturday. Omit a day (or use null) for a day off.
   `breaks` are blocked windows (lunch, standing appointments).
   -------------------------------------------------------------------------- */
const SCHEDULES = {
  marcus: {
    1: { start: '09:00', end: '18:00', breaks: [['12:30', '13:30']] },
    2: { start: '09:00', end: '18:00', breaks: [['12:30', '13:30']] },
    3: { start: '09:00', end: '18:00', breaks: [['12:30', '13:30']] },
    4: { start: '09:00', end: '19:00', breaks: [['13:00', '14:00']] },
    5: { start: '09:00', end: '19:00', breaks: [['13:00', '14:00']] },
    6: { start: '08:00', end: '16:00', breaks: [] }
  },
  tony: {
    2: { start: '09:00', end: '18:00', breaks: [['12:00', '13:00']] },
    3: { start: '09:00', end: '18:00', breaks: [['12:00', '13:00']] },
    4: { start: '10:00', end: '19:00', breaks: [['14:00', '15:00']] },
    5: { start: '10:00', end: '19:00', breaks: [['14:00', '15:00']] },
    6: { start: '08:00', end: '16:00', breaks: [] }
  },
  renae: {
    1: { start: '10:00', end: '18:00', breaks: [['13:00', '14:00']] },
    3: { start: '10:00', end: '18:00', breaks: [['13:00', '14:00']] },
    4: { start: '10:00', end: '19:00', breaks: [['13:00', '14:00']] },
    5: { start: '09:00', end: '17:00', breaks: [['12:30', '13:30']] },
    6: { start: '08:00', end: '15:00', breaks: [] }
  },
  cole: {
    1: { start: '11:00', end: '18:00', breaks: [] },
    2: { start: '11:00', end: '18:00', breaks: [['15:00', '15:30']] },
    3: { start: '09:00', end: '17:00', breaks: [['12:00', '12:30']] },
    4: { start: '11:00', end: '19:00', breaks: [] },
    5: { start: '11:00', end: '19:00', breaks: [] }
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
