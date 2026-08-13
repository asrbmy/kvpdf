# KVPDF

A fully client-side PDF editor — no server, no uploads. Everything runs in the browser using [pdf.js](https://mozilla.github.io/pdf.js/) (rendering + text layer) and [pdf-lib](https://pdf-lib.js.org/) (export).

**Live:** https://asrbmy.github.io/kvpdf
**Repo:** https://github.com/asrbmy/kvpdf

## Features

- Annotate: freehand highlighter, pen, text boxes, sticky-note comments
- Real text search and select-to-highlight (via pdf.js's text layer)
- Redaction — burns black boxes into the page permanently (flattens the page to an image so underlying text can't be recovered)
- Insert images and hand-drawn signatures (draggable, resizable)
- Shapes: rectangle, ellipse, line, arrow
- Fill existing PDF form fields, or draw your own fillable text/checkbox fields on any document (with required-field validation)
- Page tools: rotate, reorder, delete, merge in pages from another PDF, insert blank pages, multi-select bulk actions, extract a page range as its own PDF
- Watermarking, page-number stamping, and export-time page-size normalization (A4 / US Letter)
- Export quality toggle (standard vs. compressed)
- Undo/redo, keyboard shortcuts, and autosaved sessions (survives a refresh)

## Running locally

This is a single static HTML file — no build step.

```bash
git clone https://github.com/asrbmy/kvpdf.git
cd kvpdf
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to GitHub Pages

1. Push `index.html` to the root of the `main` branch (or a `docs/` folder).
2. In the repo settings, under **Pages**, set the source to that branch/folder.
3. It will be served at `https://asrbmy.github.io/kvpdf`.

## Known limitations

- **No password protection.** The pdf-lib engine this runs on doesn't support PDF encryption. Use `qpdf` or your OS's "Print to PDF" with a password for that.
- Rotated pages and redacted pages are flattened to a high-resolution image on export, so their text isn't selectable/searchable in the output (necessary for correctness in the rotated case, and by design for redaction).
- Very large PDFs may exceed the per-session autosave storage limit; autosave will disable itself and tell you if that happens.

## License

MIT (or your preference — update this section as needed).
