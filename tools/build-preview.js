#!/usr/bin/env node
/* =============================================================================
   Build a single self-contained preview file.

     node tools/build-preview.js

   Reads the real site sources and writes dist/preview.html — one file with the
   CSS, JavaScript, logo and typefaces all inlined, and the booking tool folded
   in as a second view instead of a second document. Nothing loads from the
   network, so the file can be emailed, opened from a phone, or dropped on any
   host and it just works.

   This is for sharing a preview. The actual site is index.html + book.html.
   ============================================================================= */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const read = function (p) { return fs.readFileSync(path.join(ROOT, p), 'utf8'); };

/* -----------------------------------------------------------------------------
   Fonts — fetch the latin subsets and inline them as data URIs.
   The site links Google Fonts normally; a single portable file cannot.
   Cached in tools/.font-cache so repeat builds are offline and instant.
   -------------------------------------------------------------------------- */
const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2' +
  '?family=Bevan' +
  '&family=Oswald:wght@400;500;600' +
  '&family=Barlow:wght@400;500;600' +
  '&display=swap';

// Google serves woff2 only to browser user agents.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const CACHE_DIR = path.join(__dirname, '.font-cache');

function fetch(url, binary) {
  return new Promise(function (resolve, reject) {
    https.get(url, { headers: { 'User-Agent': UA } }, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(fetch(res.headers.location, binary));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(url + ' -> HTTP ' + res.statusCode));
      }
      const chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        const buf = Buffer.concat(chunks);
        resolve(binary ? buf : buf.toString('utf8'));
      });
    }).on('error', reject);
  });
}

async function cached(key, loader) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, key);
  if (fs.existsSync(file)) return fs.readFileSync(file);
  const buf = await loader();
  fs.writeFileSync(file, buf);
  return buf;
}

async function buildFontCss() {
  // Key the cache on the request URL so changing the families re-fetches
  // instead of quietly serving the previous build's typefaces.
  const key = 'fonts-' +
    crypto.createHash('sha1').update(FONT_CSS_URL).digest('hex').slice(0, 10) + '.css';

  const css = (await cached(key, function () {
    return fetch(FONT_CSS_URL, false).then(function (t) { return Buffer.from(t); });
  })).toString('utf8');

  // Split into @font-face blocks and keep only the basic-latin subsets —
  // Cyrillic and Vietnamese would roughly triple the file for no benefit.
  const blocks = css.split('@font-face').slice(1)
    .map(function (b) { return '@font-face' + b.split('}')[0] + '}'; })
    .filter(function (b) { return /U\+0000-00FF/.test(b); });

  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const url = (block.match(/https:\/\/fonts\.gstatic\.com[^)]+\.woff2/) || [])[0];
    if (!url) continue;

    const family = (block.match(/font-family:\s*'([^']+)'/) || [])[1] || '?';
    const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1] || '400';

    const buf = await cached(
      (family + '-' + weight).replace(/\s+/g, '-').toLowerCase() + '.woff2',
      function () { return fetch(url, true); }
    );

    out.push(block
      .replace(/src:[^;]+;/, "src: url(data:font/woff2;base64," + buf.toString('base64') + ") format('woff2');")
      .replace(/unicode-range:[^;]+;/, ''));

    console.log('  inlined ' + family + ' ' + weight + '  ' + Math.round(buf.length / 1024) + ' KB');
  }
  return out.join('\n');
}

/* -----------------------------------------------------------------------------
   Markup extraction
   -------------------------------------------------------------------------- */
/* The published preview has no <meta charset> of its own — the host supplies
   the document head. Escaping to pure ASCII makes the file immune to whatever
   encoding it ends up being served with. */
function asciiHtml(s) {
  return s.replace(/[\u0080-\uffff]/g, function (c) {
    return '&#x' + c.charCodeAt(0).toString(16) + ';';
  });
}

function asciiJs(s) {
  return s.replace(/[\u0080-\uffff]/g, function (c) {
    return '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0');
  });
}

/* Photos live in assets/images/ and are referenced by relative path. A single
   portable file has no such directory, so every image that exists on disk is
   swapped for a data URI. Paths with no file behind them (the barber portraits,
   until those are taken) are left alone so the page's own fallback still runs. */
function inlineImages(str) {
  const dir = path.join(ROOT, 'assets', 'images');
  if (!fs.existsSync(dir)) return str;

  fs.readdirSync(dir)
    .filter(function (f) { return /\.(jpe?g|png)$/i.test(f); })
    .forEach(function (file) {
      const ref = 'assets/images/' + file;
      if (str.indexOf(ref) === -1) return;
      const mime = /\.png$/i.test(file) ? 'image/png' : 'image/jpeg';
      const data = fs.readFileSync(path.join(dir, file)).toString('base64');
      str = str.split(ref).join('data:' + mime + ';base64,' + data);
    });
  return str;
}

function between(html, startRe, endMarker) {
  const start = html.search(startRe);
  if (start === -1) throw new Error('could not find ' + startRe);
  const end = html.indexOf(endMarker, start);
  if (end === -1) throw new Error('could not find ' + endMarker);
  return html.slice(start, end + endMarker.length);
}

/** Icon <symbol>s from both pages, deduped — book.html adds a few of its own. */
function mergedSprite(indexHtml, bookHtml) {
  const grab = function (html) {
    const svg = between(html, /<svg width="0" height="0"/, '</svg>\n');
    return svg.match(/<symbol[\s\S]*?<\/symbol>/g) || [];
  };
  const seen = new Set();
  const symbols = [];
  grab(indexHtml).concat(grab(bookHtml)).forEach(function (sym) {
    const id = (sym.match(/id="([^"]+)"/) || [])[1];
    if (id && !seen.has(id)) { seen.add(id); symbols.push(sym); }
  });
  return '<svg width="0" height="0" style="position:absolute" aria-hidden="true" ' +
         'focusable="false">\n' + symbols.join('\n') + '\n</svg>';
}

async function build() {
  console.log('Building single-file preview…');

  const indexHtml = read('index.html');
  const bookHtml = read('book.html');

  const fontCss = await buildFontCss();
  const siteCss = read('assets/css/styles.css');
  const logoSvg = read('assets/img/logo.svg')
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Inline the logo so the file has zero external requests.
  const logoUri = 'data:image/svg+xml;base64,' + Buffer.from(logoSvg).toString('base64');

  // Every markup fragment goes through the same pass: ASCII-escape it, and
  // swap the logo file reference for an inline data URI.
  const prep = function (s) {
    return inlineImages(asciiHtml(s).split('assets/img/logo.svg').join(logoUri));
  };

  const sprite = prep(mergedSprite(indexHtml, bookHtml));
  const header = prep(between(indexHtml, /<header class="header"/, '</header>'));
  const drawer = prep(between(indexHtml, /<div class="drawer"/, '</div>\n</div>'));
  const homeMain = prep(between(indexHtml, /<main id="main">/, '</main>'));
  const footer = prep(between(indexHtml, /<footer class="footer">/, '</footer>'));
  const dock = prep(between(indexHtml, /<div class="dock"/, '</div>'));

  // The booking page's <main id="main"> would collide with the homepage's, so
  // it becomes the second view container instead.
  const bookView = prep(between(bookHtml, /<main id="main" class="booking-page">/, '</main>'))
    .replace('<main id="main" class="booking-page">', '<div id="view-book" class="booking-page">')
    .replace(/<\/main>$/, '</div>');

  const bookBar = prep(between(bookHtml, /<div class="book-bar"/, '</div>\n</div>'));

  const js = inlineImages(asciiJs([
    'assets/js/data.js',
    'assets/js/availability.js',
    'assets/js/app.js',
    'assets/js/home.js',
    'assets/js/booking.js'
  ].map(read).join('\n\n')));

  // Meta first: without an explicit viewport a phone lays the page out at a
  // 980px desktop width and scales it down, which defeats the whole design.
  const head = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0d0f10">
<title>Bushwacker Barber Shop</title>`;

  const body = `<style>
${fontCss}
${siteCss}

/* ---- preview shell: two views in one document ---- */
#view-book { display: none; padding-top: calc(var(--header-h) + env(safe-area-inset-top)); }
body.is-booking #view-home { display: none; }
body.is-booking #view-book { display: block; }
body.is-booking .dock { display: none; }
body:not(.is-booking) .book-bar { display: none; }
</style>

<a class="skip-link" href="#main">Skip to content</a>
${sprite}
${header}
${drawer}

<div id="view-home">
${homeMain}
${footer}
</div>

${bookView}

${bookBar}
${dock}
<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script>
window.BOOKING_MANUAL_BOOT = true;
${js}

/* -----------------------------------------------------------------------------
   Preview router. The real site navigates between index.html and book.html;
   here both live in one document, so links are intercepted and swapped to a
   view change instead of a page load.
   -------------------------------------------------------------------------- */
(function () {
  var booted = false;

  function showBooking(search) {
    if (!booted) { window.Booking.bind(); booted = true; }
    document.body.classList.add('is-booking');
    window.Booking.start(search || '');
    window.scrollTo(0, 0);
  }

  function showHome() {
    document.body.classList.remove('is-booking');
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (href.indexOf('book.html') === 0) {
      e.preventDefault();
      var q = href.indexOf('?');
      showBooking(q === -1 ? '' : href.slice(q));
    } else if (href.indexOf('index.html') === 0) {
      e.preventDefault();
      showHome();
      var hash = href.indexOf('#');
      if (hash !== -1) {
        var target = document.querySelector(href.slice(hash));
        if (target) target.scrollIntoView();
      }
    }
  });

  // app.js and home.js still boot themselves on DOMContentLoaded, which has not
  // fired yet — this script is inline and runs during parsing.
})();
</script>`;

  fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });

  // Standalone document — the file to email, open from a phone, or host.
  const full = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' + head +
               '\n</head>\n<body>\n' + body + '\n</body>\n</html>\n';
  fs.writeFileSync(path.join(ROOT, 'dist', 'preview.html'), full);
  console.log('Wrote dist/preview.html        ' + Math.round(full.length / 1024) + ' KB');

  // Body-only fragment, for hosts that supply their own document skeleton.
  const embed = head + '\n' + body + '\n';
  fs.writeFileSync(path.join(ROOT, 'dist', 'preview-embed.html'), embed);
  console.log('Wrote dist/preview-embed.html  ' + Math.round(embed.length / 1024) + ' KB');
}

build().catch(function (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
});
