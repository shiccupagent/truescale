# TrueScale PDF

A tiny offline-capable web app (PWA) that renders PDF pages at **true 1:1
physical scale**, so you can hold a real ruler against a tablet screen and
measure features on engineering drawings — plus on-screen machinist tools.

**Live:** https://truescale-seven.vercel.app (canonical:
https://truescale.shiccup.com once the Cloudflare CNAME
`truescale → cname.vercel-dns.com`, DNS-only/grey cloud, is added — same
pattern as studio.shiccup.com; the domain is already attached to the Vercel
project).

## How it works

- PDFs are defined in points (1 pt = 1/72"). Rendering at
  `scale = calibratedScreenPPI / 72` makes 1" in the document equal 1" of
  physical glass.
- OS-reported DPI is unreliable, so the app has a one-time **calibration
  screen**: match an on-screen 100 mm bar / bank-card outline against a real
  ruler or card, and the resulting PPI is stored in `localStorage`.
- Pinch zoom is disabled; panning is plain scroll, so the scale can't drift.
- **Machinist tools**, all reading real drawing units straight from PDF
  coordinates (independent of screen calibration): tap-two-points **Distance**
  (with Δx/Δy), three-tap **Angle** protractor, three-tap **Circle** gauge
  (radius/diameter from any arc), and a draggable, rotatable **virtual
  machinist ruler** overlay (snaps at 45°; tap its handle to step 45°). The
  ruler's inch edge switches between 1/16 fractions and decimal
  tenths/fiftieths — with true 0.010″ ("10 thou") ticks whenever the zoom can
  physically resolve them — plus a cm/mm edge. Readouts speak machining
  language ("1.245″ = 1″ + 245 thou"). Undo/Clear and a plain-English help
  screen included.
- A **Drawing scale** selector (1:2, 2:1, …) converts tool readouts to real
  part size when the sheet says the drawing isn't 1:1; angles are never
  scaled. Persisted per document.
- **Offline library:** every opened PDF is stored in IndexedDB on the device
  and reopens automatically at the last page — after the first visit the app,
  and the books in it, need no network at all.
- **Night mode** (inverts the page for dim rooms), fullscreen, and a screen
  wake lock while reading.
- PDF.js is vendored (`vendor/`, pdfjs-dist 3.11.174 legacy build) and a
  service worker caches the app shell, so it works with no network after the
  first load. PDFs are opened from the device via the file picker and never
  leave it.

## Modes

- **1:1 true scale** — the measuring mode.
- **2:1** — doubled, for tiny details (halve your ruler readings).
- **Fit width** — reading mode, explicitly labeled *not to scale*.

## Dev

Static files, no build. Serve the directory
(`python3 -m http.server`) and open `index.html`. Add `?dev=1` to auto-load a
`sample.pdf` placed next to the app (gitignored).
