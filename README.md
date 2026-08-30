# TrueScale PDF

A tiny offline-capable web app (PWA) that renders PDF pages at **true 1:1
physical scale**, so you can hold a real ruler against a tablet screen and
measure features on engineering drawings.

## How it works

- PDFs are defined in points (1 pt = 1/72"). Rendering at
  `scale = calibratedScreenPPI / 72` makes 1" in the document equal 1" of
  physical glass.
- OS-reported DPI is unreliable, so the app has a one-time **calibration
  screen**: match an on-screen 100 mm bar / bank-card outline against a real
  ruler or card, and the resulting PPI is stored in `localStorage`.
- Pinch zoom is disabled; panning is plain scroll, so the scale can't drift.
- A **Measure** tool (tap two points) reports distances in real drawing units
  straight from PDF coordinates — independent of screen calibration.
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
