# Changelog

All notable changes to KVPDF are documented here. Dates reflect when each batch of work landed.

## [Unreleased]

### Added
- **Multiple documents at once (tabs)**: open several PDFs in parallel and switch between them. Deliberately scoped — underlying PDF sources are shared in one pool, but the autosave/restore system still only persists a single document, so only the active tab survives a page refresh right now. Disclosed via the tab's own tooltip, not just here.
- **Signature library**: save a drawn signature once and reuse it from a small gallery instead of redrawing it every time, persisted the same way autosave is.
- **Aggressive file-size compression**: a new export option that recompresses every page as an image, shrinking scan-heavy PDFs the existing "smaller file" option couldn't touch (that one only affects annotations, not images already embedded in the source PDF). Same disclosed trade-off as redaction/rotation: pages lose selectable text.
- **Image watermarks**: stamp an image (e.g. a logo) across every page, extending the existing text-watermark system rather than duplicating it.
- **Paste image from clipboard**: Ctrl+V an image directly onto the page.
- **Custom export page size**: arbitrary width/height in inches, millimeters, or points, alongside the existing A4/Letter presets.
- **Save As / rename on export**: an editable filename field instead of always `-edited.pdf`.
- **Zoom controls**, **drag-to-reorder pages**, **duplicate page**, **document properties editor** (Title/Author/Subject/Keywords), and a **real print button** with a dedicated print stylesheet that strips all app chrome and editing-only visual noise.

### Added (previous batch)
- **Find & redact by pattern**: scans the whole document (real text and anything OCR'd) for emails, phone numbers, SSNs, and Luhn-validated credit card numbers, or a custom regex — review every hit before committing, then redact for real via the existing true-rasterization redaction.
- **Structured table extraction**: clusters OCR word positions into a row/column grid and exports CSV. A positional heuristic, not a trained model — documented as such in the UI.
- **Virtualized rendering**: pages now build in two phases — an instant, correctly-sized placeholder for every page, then the expensive canvas+layers render only for pages near the viewport (via `IntersectionObserver`). Search, text extraction, and find-and-redact were all audited and fixed to stay correct regardless of what's visually rendered (search/extract use a lightweight background text prefetch; find-and-redact force-renders before scanning, since it needs real geometry).
- **Semantic search (experimental)**: an in-browser embedding model (transformers.js, lazy-loaded) indexes the document and ranks passages by meaning rather than exact keyword match. Clearly labeled experimental given its real first-use download size and inference cost.
- **Realtime collaboration (beta)**: a Yjs/WebRTC-based live-sync option alongside the existing polling-based "Basic" sync (kept as-is, not replaced). Falls back automatically to Basic sync if peers can't connect within 15 seconds. This is the one feature in the project that couldn't be verified with live browser testing — treat it as beta.

### Declined
- **True in-place PDF text editing** (rewriting `Tj`/`TJ` content-stream operators) — deliberately not built. Doing it wrong risks silent document corruption, which is a worse failure mode than not having the feature. See README for the reasoning.

### Fixed
- **Memory/listener leak**: `attachOverlayEvents()` was registering a new `window`-level `pointerup` listener on every page render instead of once. Since rotate/delete/reorder/undo/redo/watermark-apply all trigger a full re-render, this accumulated dangling listeners indefinitely. Refactored to a single permanent global handler driven by shared drag state (`state.drag`).
- Minor: the comment-popup "click outside to close" listener wasn't tracked/removed on subsequent opens; now explicitly cleaned up.

### Added
- **Mobile layout**: tool rail collapses to a horizontal bottom bar, the pages panel becomes a full-screen drawer, side panels and modals adapt to narrow viewports, and pages themselves now scale down (via CSS transform, computed against actual viewport width) instead of forcing horizontal scroll per page.
- **Accessibility pass**: `aria-label` on all icon-only buttons, `role="toolbar"` on the tool rail, `role="status"`/`aria-live` on toast notifications, `role="dialog"` + real focus-trapping + Escape-to-close + focus-return on all modals, `aria-pressed` state on tool buttons, `alt` text on inserted images, label association fixes on several form fields.
- Performance: JSZip and Tesseract.js now lazy-load on first actual use (OCR panel / batch mode / image export) instead of loading on every page visit regardless of whether those features are touched.
- GitHub Actions workflow for automatic Pages deployment on push to `main`.
- `CONTRIBUTING.md`, issue templates, and a PR template.

## [Feature-complete milestone]

A large batch landed together: OCR (Tesseract.js) with optional invisible-text embedding on export, PDF-to-PDF text comparison, a bookmarks/outline editor, extract-all-text and export-pages-as-images, real clickable link annotations, threaded comment replies, batch processing across multiple PDFs, offline support via a service worker, a named/jumpable undo history panel, remappable keyboard shortcuts, a light/dark theme toggle, and a password prompt for opening (viewing only) encrypted PDFs.

## [Core editor]

The original feature set: freehand highlight/pen drawing, real text search with select-to-highlight, text boxes and sticky notes, shapes (rectangle/ellipse/line/arrow), permanent redaction (flattens the page to an image so underlying text is actually destroyed), image insertion and hand-drawn signatures with drag/resize, form filling for existing PDF fields plus drawing your own fillable fields with required-field validation, page tools (reorder/rotate/delete/merge/insert blank/multi-select bulk actions/extract), watermarking, page numbering, export-time page-size normalization (A4/Letter), export quality/compression toggle, undo/redo, and autosaved sessions.

### Known, deliberate limitations (not bugs — see README for why)
- No password protection, and no editing/export of already-encrypted PDFs (pdf-lib has no encryption support at all).
- Redacted and rotated pages are flattened to a high-resolution image on export — necessary for redaction to actually work and for rotation to render correctly in all cases.
- PDF comparison is text-based, not a pixel-level visual diff.
- Collaboration is basic and polling-based (every few seconds via shared storage), not real-time — no live cursors.

---

*This changelog was reconstructed retroactively to reflect the project's actual development history. Going forward, please add entries here as part of any PR that changes user-facing behavior.*
