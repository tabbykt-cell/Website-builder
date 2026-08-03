# Photos — drop them here

The site is already wired to these exact filenames. Add the files, refresh, done.
**No code changes needed.** Any file that is missing renders a styled branded
placeholder instead of a broken image, so the site never looks unfinished.

## Required filenames

| File | Where it shows | Recommended size | Crop |
|---|---|---|---|
| `hero.jpg` | Full-bleed background behind the homepage headline | 1920 × 1280 | Landscape. Keep the subject in the upper-middle — the bottom 40% sits under a dark gradient and the headline. The storefront sign shot works well here. |
| `gallery-1.jpg` | Gallery, large feature tile | 1400 × 900 | Landscape 16:10 |
| `gallery-2.jpg` … `gallery-6.jpg` | Gallery grid | 800 × 800 | **Square** |
| `barber-chris.jpg` | Team card + booking picker | 800 × 1000 | Portrait 4:5, face in the top third |
| `barber-kelby.jpg` | " | 800 × 1000 | " |

If the barber names change, rename the file **and** update the matching `photo:`
path in `assets/js/data.js`.

## Also worth adding

| File | Used for |
|---|---|
| `og-image.jpg` | Link preview when the site is shared on text / Facebook / iMessage. 1200 × 630. |
| `favicon.png` | Browser tab icon. 512 × 512. The site currently falls back to `assets/img/logo.svg`. |

## Notes

- **Format:** `.jpg` for photos, `.png` only if transparency is needed.
- **File size:** keep every photo under ~400 KB. Most of this site's traffic is
  on phones, often on cell data — a 4 MB photo straight off a camera will make
  the page feel slow. Any image compressor (Squoosh, TinyJPG) handles this.
- **Orientation:** the barber photos are cropped to portrait and the gallery
  tiles to square by CSS, so anything roughly the right shape will look correct.
- **Rights:** only use photos the shop owns or has permission to use.
