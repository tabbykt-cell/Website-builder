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
  email: 'bushwacker1225@gmail.com',

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
    /* Share link supplied by the shop. The mibextid tracking parameter it
       came with is stripped - it identifies the device that shared it and
       does not belong in a public link. If the page has a plain vanity URL
       (facebook.com/<name>), prefer that. */
    facebook: 'https://www.facebook.com/share/195idqe3C3/',
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

   PRICES. Four are legible on the chalkboards in the shop photo and are
   marked `fromBoard: true` below:

       Hair Cut ................................ $15
       Beard Trim .............................. $10
       Hair Cut + Beard Trim ................... $20
       Hair Cut + Hot Towel Straight Razor Shave $30

   (The $15 and $10 lines are partly hidden behind the barber's arm in the
   photo; the amounts are clear, the labels are inferred - worth double
   checking. The $20 combo and the $30 cut-and-shave are fully legible.)

   Every other price is a PLACEHOLDER estimate, scaled to sit sensibly around
   that $15 haircut. All of them still need confirming.

   `mins` are PLACEHOLDER throughout.
   -------------------------------------------------------------------------- */
const SERVICE_CATEGORIES = [
  {
    id: 'cuts',
    name: 'Cuts',
    icon: 'scissors',
    blurb: 'Fades, tapers, hard parts and everything in between.',
    services: [
      { id: 'mens-cut',     name: 'Hair Cut',            mins: 30, price: 15,
        desc: 'Fades, hard parts, high & tight, crew cuts, taper, edging.',
        fromBoard: true },
      { id: 'cut-beard',    name: 'Hair Cut + Beard Trim', mins: 45, price: 20,
        desc: 'The shop favourite - cut and beard shaped in one sitting.',
        featured: true, fromBoard: true },
      { id: 'cut-shave',    name: 'Hair Cut + Hot Towel Straight Razor Shave',
        mins: 60, price: 30,
        desc: 'Cut, then hot towel, warm lather and a straight razor finish.',
        featured: true, fromBoard: true },
      { id: 'buzz-cut',     name: 'Buzz Cut',            mins: 20, price: 12,
        desc: 'One guard, clean edge-up, in and out.' },
      { id: 'stylish-cut',  name: 'Stylish Cut',         mins: 45, price: 20,
        desc: 'Scissor-over-comb detail work and a finished style.' },
      { id: 'dry-cut',      name: 'Dry Cut',             mins: 25, price: 15,
        desc: 'No wash — straight to the chair.' },
      { id: 'womens-cut',   name: "Women's Cut",         mins: 45, price: 25,
        desc: 'Cut, wash and style.' },
      { id: 'womens-dry',   name: "Women's Dry Cut",     mins: 30, price: 20,
        desc: 'Dry cut and finish, no wash.' },
      { id: 'kids-cut',     name: "Kid's Cut (12 & under)", mins: 25, price: 12,
        desc: 'Patient hands, quick work.' }
    ]
  },
  {
    id: 'shaves',
    name: 'Shaves & Beard',
    icon: 'razor',
    blurb: 'Straight razor, hot towel, proper finish.',
    services: [
      { id: 'razor-shave',  name: 'Straight Razor Hot Towel Shave', mins: 40, price: 20,
        desc: 'Hot towel, warm lather, straight razor, cold finish.' },
      { id: 'head-shave',   name: 'Head Shave',          mins: 35, price: 18,
        desc: 'Full head, razor smooth.' },
      { id: 'beard-trim',   name: 'Beard Trim',          mins: 20, price: 10,
        desc: 'Shaped, lined and balanced to your jaw.',
        fromBoard: true },
      { id: 'beard-cond',   name: 'Beard Conditioning',  mins: 25, price: 15,
        desc: 'Deep condition, hot towel and beard oil finish.' },
      { id: 'beard-oil',    name: 'Beard Oil Treatment', mins: 15, price: 10,
        desc: 'Softens the wire, kills the itch.' }
    ]
  },
  {
    id: 'color',
    name: 'Color',
    icon: 'drop',
    blurb: 'Grey blending, full color and touch-ups.',
    services: [
      { id: 'color-treat',  name: 'Color Treatment',     mins: 75, price: 55,
        desc: 'Full color service, consultation included.' },
      { id: 'hair-dying',   name: 'Hair Dying',          mins: 90, price: 65,
        desc: 'Full application with wash and style.' },
      { id: 'root-touch',   name: 'Root Touch-Up',       mins: 45, price: 40,
        desc: 'Regrowth only, blended clean.' },
      { id: 'brow-tint',    name: 'Eyebrow Tinting',     mins: 20, price: 15,
        desc: 'Shade-matched and softened.' },
      { id: 'blow-dry',     name: 'Blow-Dry Style',      mins: 30, price: 20,
        desc: 'Wash and blow-out finish.' }
    ]
  },
  {
    id: 'waxing',
    name: 'Waxing',
    icon: 'leaf',
    blurb: 'Quick, clean detail work.',
    services: [
      { id: 'brow-wax',     name: 'Eyebrow Wax',         mins: 15, price: 10,
        desc: 'Shaped and cleaned up.' },
      { id: 'facial-wax',   name: 'Facial Wax',          mins: 20, price: 15,
        desc: 'Nose, ears, cheeks — your call.' },
      { id: 'womens-wax',   name: "Women's Facial Wax",  mins: 25, price: 20,
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
  'mens-cut', 'cut-beard', 'cut-shave', 'buzz-cut', 'stylish-cut', 'dry-cut',
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
    photo: 'assets/images/barber-chris.jpg',   // supplied by the shop
    bio: 'Cuts, fades and beard work. Walk-ins welcome.',    // PLACEHOLDER
    specialties: ['Fades', 'Beard work', 'Straight razor'],  // PLACEHOLDER
    skills: ALL_SERVICE_IDS
  },
  {
    id: 'kelby',
    name: 'Kelby',
    title: 'Barber',                                        // PLACEHOLDER
    photo: 'assets/images/barber-kelby.jpg',   // supplied by the shop
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
   5. GALLERY  -  real photos from the shop, in assets/images/.
   -------------------------------------------------------------------------- */
const GALLERY = [
  { src: 'assets/images/gallery-1.jpg', alt: "Men's cuts - beard trim, side part fade and a kid's cut" },
  { src: 'assets/images/gallery-2.jpg', alt: 'A young client in the barber chair' },
  { src: 'assets/images/gallery-3.jpg', alt: 'Curled low updo' },
  { src: 'assets/images/gallery-4.jpg', alt: 'Half-up style with loose curls' },
  { src: 'assets/images/gallery-5.jpg', alt: 'Blonde updo, three angles' }
];

/* -----------------------------------------------------------------------------
   6. REVIEWS  -  real Google reviews, quoted verbatim.

   Google truncates longer reviews behind a "more" link, so several of these
   end mid-sentence with an ellipsis - that is the actual visible text, not an
   edit. Do not complete them by hand.

   Two further five-star reviews (Andrew Leonhard, JAndrew Hill) are left out
   on purpose: both thank a barber by name who has since left the shop.
   Quoting them would send customers in asking for someone who is not there.
   Leave them out unless the quote is trimmed to drop the name.
   -------------------------------------------------------------------------- */
const REVIEWS = [
  { name: 'Nick Payne', stars: 5, when: '10 months ago',
    text: 'Professional laid back atmosphere. Clean friendly vibes And fair prices. My vote best barber shop in Richmond Co.' },

  { name: 'Dave C', stars: 5, when: '4 months ago',
    text: "It's a nice clean friendly place and great sence of humor, they also gave me the best flat top I gotten in long time" },

  { name: 'C High', stars: 5, when: 'a year ago',
    text: 'Great group of barbers. Walk in available and not much of a wait. 2nd time using and ready like the hospitality. They make you feel welcome and take time giving…' },

  { name: 'Miguel Wood', stars: 5, when: '8 months ago',
    text: "If you're looking for a barber who is punctual, skilled, and passionate about their craft, look no further. This shop is worth every penny. I walked out feeling sharp and…" },

  { name: 'Kimberly Fox', stars: 5, when: '5 months ago',
    text: 'What an amazing shop. They were closed and my son has a bit of communication problem yet he took my son in with only a few…' },

  { name: 'Bri Hunt', stars: 5, when: '3 years ago',
    text: 'I took my 3 boys to get their hair cut. Ages 6-2. He done a great job! Very patient with my boys. He took his time and now their hair looks great! Friendly environment,…' },

  { name: 'Archer Berzins', stars: 5, when: 'a year ago',
    text: "So satisfied with them it was a great experience. Had a bit longer hair so I was reluctant to go to a barber as opposed to a stylist but I couldn't have been more wrong. I…" },

  { name: 'Lori Nguyen', stars: 5, when: '4 years ago',
    text: 'I brought my 2 year old son here to have his first hair cut. Seriously the nicest people I have ever met. He took his time with my son and was very patient with him. I…' }
];
