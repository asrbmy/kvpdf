# Contributing to KVPDF

Thanks for considering it. This is a single-file, no-build-step app on purpose — that keeps the barrier to contributing low, but it also means a few conventions matter more than they would in a typical project.

## The one non-negotiable rule

**Nothing gets uploaded, ever.** No feature, however useful, gets merged if it requires sending a user's file to a server. That's the entire premise of the project. If your idea genuinely needs a backend, it's probably a great idea for a different project.

## Before you start

- For anything beyond a small fix, open an issue first describing what you want to do — saves you writing code that might not fit the project's direction.
- Check [`README.md`](README.md#known-limitations) for things that are *deliberately* not supported (password protection, true real-time collaboration, visual PDF diffing). If your PR tries to solve one of these, read why first — the constraints are usually a hard technical wall (e.g. pdf-lib has no encryption support), not an oversight.

## Local setup

No dependencies, no build step:

```bash
git clone https://github.com/asrbmy/kvpdf.git
cd kvpdf
python3 -m http.server 8000
# open http://localhost:8000
```

## Code conventions

- **Single file**: `index.html` contains all HTML, CSS, and JS. Keep it that way — don't introduce a bundler or split into modules. (If the file ever gets genuinely unwieldy, that's worth a discussion in an issue, not a unilateral restructure.)
- **Lazy-load anything heavy**: only `pdf.js` and `pdf-lib` load eagerly, because the app can't function at all without them. Everything else (JSZip, Tesseract.js, and any future large dependency) goes through the `loadScriptOnce()` pattern near the top of the script, fetched only when the relevant feature is actually used. See `loadJSZip()` / `loadTesseract()` for the pattern to copy.
- **Visual language**: dark theme with the existing CSS custom properties (`--bg`, `--panel`, `--accent`, etc.), IBM Plex Mono for UI chrome/labels, IBM Plex Sans for body text, the crop-mark motif on page corners. A light theme exists too (`[data-theme="light"]` overrides) — if you add new colored UI, make sure it has a sane light-mode value.
- **Accessibility**: icon-only buttons need both `title` and `aria-label`. New modals should follow the existing `.modal-overlay` pattern (it automatically gets focus-trapping, Escape-to-close, and focus-return — see `setupModalAccessibility()` — you don't need to reimplement this, just reuse the class).
- **Global listeners**: be careful with `window.addEventListener` or `document.addEventListener` inside any function that runs on every re-render (`renderPageBlock`, `renderAllPages`, `buildImageLayer`, etc.) — these accumulate if not deliberately deduplicated or scoped to elements that get destroyed together. If you need drag-style pointer tracking across a re-rendered element, follow the pattern in `attachOverlayEvents`/the global `pointerup` handler, which uses shared state on `state.drag` rather than a listener per render.

## Testing

There's no automated test suite (a single HTML file with heavy Canvas/PDF-rendering dependencies doesn't lend itself to one easily — contributions toward this are welcome). At minimum, before opening a PR:

1. Open `index.html` in an actual browser and click through the feature you changed.
2. Extract the inline `<script>` and run `node --check` on it to catch syntax errors.
3. Check the browser console for errors during normal use (open a PDF, try a few tools, export).

## Commit / PR expectations

- Keep PRs focused — one feature or fix per PR is much easier to review in a single-file project than a sprawling one.
- Fill out the PR template checklist honestly; it exists because these are the ways past changes have broken things.
- If you're adding a feature with a real limitation (like several existing ones), document it plainly in the UI and in the README rather than glossing over it — that honesty is part of what makes this project trustworthy.

## Questions

Open an issue, or start a discussion if the repo has Discussions enabled.
