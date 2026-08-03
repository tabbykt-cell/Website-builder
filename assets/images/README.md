# Photos

The site is wired to these exact filenames. Any file that is missing renders a
styled branded placeholder (or the barber's initials) instead of a broken
image, so the site never looks unfinished.

## In place

Real shop photos, resized and compressed for mobile data — every one is under
400 KB.

| File | Where it shows | What it is |
|---|---|---|
| `hero.jpg` | Full-bleed background behind the homepage headline | The storefront sign |
| `gallery-1.jpg` | Gallery, large feature tile | Three men's cuts — beard trim, side part fade, kid's cut |
| `gallery-2.jpg` | Gallery | A young client in the barber chair |
| `gallery-3.jpg` | Gallery | Curled low updo |
| `gallery-4.jpg` | Gallery | Half-up style with loose curls |
| `gallery-5.jpg` | Gallery | Blonde updo, three angles |
| `barber-chris.jpg` | Chris's team card + booking picker | Chris at the chair, cropped to 4:5 |
| `barber-kelby.jpg` | Kelby's team card + booking picker | Kelby, cropped to 4:5 from a shop photo |
| `favicon.png` | Browser tab icon | The logo on the page's ink colour |

## Still needed

| File | Where it shows | Recommended size | Crop |
|---|---|---|---|
| `og-image.jpg` | Link preview when the site is shared on text / Facebook / iMessage | 1200 × 630 | Landscape |

Both barber photos were cropped from wider shop photos, so they are lower
resolution than a purpose-shot portrait. They read fine at card size; if
better headshots of Chris and Kelby turn up, overwrite the two files and
nothing else needs changing.

## Adding or changing photos

To swap a photo, overwrite the file and keep the name. To add more gallery
tiles, drop in `gallery-6.jpg` and add a matching line to `GALLERY` in
`assets/js/data.js` — the grid handles any number.

If the barber names change, rename the file **and** update the matching
`photo:` path in `data.js`.

- **Format:** `.jpg` for photos, `.png` only if transparency is needed.
- **File size:** keep every photo under ~400 KB. Most of this site's traffic is
  on phones, often on cell data — a 4 MB photo straight off a camera makes the
  page feel slow. Any image compressor (Squoosh, TinyJPG) handles this.
- **Orientation:** barber photos are cropped to portrait by CSS and gallery
  tiles to square, so anything roughly the right shape will look correct.

## One thing to check

Several of these photos show identifiable clients, including a child. Make sure
the shop has permission from each of them — or their parent — before the site
goes public. That is a normal release-form conversation, but it is worth having
before launch rather than after.
