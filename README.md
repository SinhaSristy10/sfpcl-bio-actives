# SFPCL — SF BioActives

A standalone build of the SF BioActives section, split out of the full
`sfpcl1a.webflow.io` Webflow export. It contains only the BioActives pages and
the assets they actually use.

## Pages

| URL | File |
| --- | --- |
| `/bio-actives` | `bio-actives.html` — overview |
| `/bio-actives/food` | `bio-actives/food.html` — food ingredients |
| `/bio-actives/aquaculture-agriculture-feed` | `bio-actives/aquaculture-agriculture-feed.html` — aquaculture / agriculture / feed |

Clean, extensionless URLs come from `.htaccess` (Apache / LiteSpeed). Without
it the pages still work, but only at their `.html` addresses.

## Layout

```
bio-actives.html              overview
bio-actives/                  the two category pages
assets/
  bio-actives.css             all BioActives styling (the `ba-` prefix)
  bio-actives.js              in-page anchor scrolling
  bio-actives/                product photography, institution logos
  videos/                     two MP4s + their poster frames
  webflow-shared.css          shared site header/footer styling
  webflow-site.js             Webflow runtime
  webflow.achunk.*.js         19 chunks the runtime loads on demand
  site-fonts.css              Nunito (400 / 600 / 700)
  site-nunito-*.ttf
.htaccess                     extensionless URLs + staging noindex
```

## Things worth knowing before you edit

These are the traps in this codebase. All of them fail silently.

- **`.ba-wrap` is `min(93.06%, 1272px)`.** That reproduces the site header and
  footer container exactly (`.header-section-2` at 3% padding wrapping
  `.main-header-container` at `min(99%, 1272px)`). Do not add a narrower
  override in a media query — this one formula is correct at every width.
- **The site header is 120px tall at rest but shrinks to 92px once scrolled.**
  Every sticky offset and `scroll-margin-top` here is tuned to that.
- **Product rows must keep exactly two grid children.** Chrome clamps a sticky
  grid item to the grid *container*, not to its own row, so a third child means
  the pinned image hovers and the new row slides underneath it. Full-width media
  (the videos) goes *after* the row as a sibling, with `.no-divider` on the row.
- **Never put a `transform` or `translate` on `.ba-product`.** A transformed
  ancestor becomes the containing block and kills the sticky image and title.
- **Do not set `html { scroll-behavior: smooth }`.** Jumps here run to ~3,500px
  and the browser's duration-by-distance smooth scroll reads as lag.
  `bio-actives.js` replaces it with a fixed ~460ms glide.
- **Watch CSS specificity against the base rules.** `.ba p { margin: 0 0 20px }`
  is `(0,1,1)` and will beat a single-class rule like `.ba-validation-note`.
  Two of these have already bitten: link colours and a centred paragraph.

## Outbound links

The shared header and footer link to ~35 pages that are not part of this
project. They now point at absolute URLs on `https://www.sahyadrifarms.com`
rather than 404ing. If this build is ever merged back into the full site,
those can go back to relative paths.

## Videos

Both MP4s were re-encoded for web (h264 crf 24, `+faststart`) — the AlgaVita
source was 91 MB at 5.3 Mbps. They use `preload="none"` with `.webp` posters,
so a page load costs ~80 KB of poster and no video bytes until play.

## Local preview

Any static server works, but it must send `video/mp4` for the MP4s:

```bash
npx serve .
```
