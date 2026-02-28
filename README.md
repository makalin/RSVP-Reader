# RSVP Reader

[🇹🇷 Türkçe](README.tr.md)

Minimal **Rapid Serial Visual Presentation (RSVP)** web reader.  
Read any document **one word at a time**, centered on screen, with adjustable **WPM** — distraction-free and fast.

## What is RSVP?
RSVP (Rapid Serial Visual Presentation) displays words sequentially at a fixed focal point, reducing eye movement and enabling high reading speeds.

## Features

- **True RSVP mode** (1 word at a time)
- **WPM control** (100–1200+)
- **Play / Pause / Resume**
- **Seek backward / forward**
- **ORP (Optimal Recognition Point)** highlight
- **Punctuation-aware pauses**
- **Short-word compensation**
- **Chunk mode** (2–4 words, optional)
- **Fullscreen & minimal UI**
- **Keyboard-first controls**
- **Local-only** (no tracking, no uploads)

## Keyboard Shortcuts

| Key | Action |
|----|-------|
| Space | Play / Pause |
| ← / → | Seek backward / forward |
| Shift + ← / → | Large seek |
| ↑ / ↓ | Increase / Decrease WPM |
| F | Fullscreen |
| H | Toggle UI |
| R | Restart |

## How It Works

```

delay(ms) = 60000 / WPM
delay += punctuationPause
delay *= shortWordFactor

```

Text is tokenized once, then rendered with a single centered word for maximum performance.

## Supported Inputs

- Paste plain text
- `.txt`, `.md`, `.html`
- (Optional) `.pdf`, `.epub` via plugins

## Tech Stack

- Vite
- React + TypeScript
- CSS (no UI framework)
- Optional: `pdfjs-dist`, `epubjs`

## Project Structure

```

src/
reader/
Reader.tsx
rsvpEngine.ts
tokenizer.ts
ui/
Slider.tsx
styles/
reader.css

````

## Getting Started

```bash
npm install
npm run dev
````

Build:

```bash
npm run build
```

## Deploy to GitHub Pages

**Option A – Automatic (recommended)**

1. Push your repo to GitHub.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to the `main` branch; the workflow will build and deploy.

Your site will be at: `https://<username>.github.io/RSVP-Reader/`

**Option B – Deploy from your machine**

```bash
npm run deploy
```

Requires the repo to exist on GitHub. The first time you use GitHub Pages, enable it under **Settings → Pages** (Source: **Deploy from a branch**, branch: `gh-pages`).

**If your repo name is not `RSVP-Reader`:**  
Edit `vite.config.ts` and change the `base` path to `'/your-repo-name/'`.

## Design Philosophy

* One focal point
* No scrolling
* No visual noise
* Everything adjustable, nothing forced

## Roadmap

* Calibration mode
* Reading stats (ETA, completion)
* Language-aware tokenization
* Mobile-first controls
* PWA offline mode

## Privacy

* Runs entirely in-browser
* No analytics
* No network calls by default

## License

MIT
