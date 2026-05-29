# UI Builder

In-browser tool for composing reframed images with a Figma-derived "Creative Feature Container" overlay, exportable as standalone HTML + CSS + a cropped PNG. Also ships as a bookmarklet payload that mounts the editor as a shadow-DOM overlay on any page.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run build        # produces dist/ with both the SPA and embed.js
npm run preview      # serves dist/ on http://localhost:4173
```

`dist/embed.js` is a single self-contained IIFE (~95KB gzipped) that the bookmarklet loads.

## Bookmarklet

After deploying, save this as a bookmark (replace the host):

```js
javascript:(()=>{const s=document.createElement('script');s.src='https://YOUR-HOST/embed.js';document.head.appendChild(s)})()
```

Clicking the bookmark mounts the editor in a shadow-DOM overlay. Re-clicking toggles visibility; the ✕ button unmounts cleanly.

## Architecture

- React + Vite + TypeScript for the editor.
- Vanilla HTML + CSS for the export (no React runtime in the output).
- Single `ComposerState` via `useReducer` + context drives both the live preview and the export serializer, so what you see is exactly what you export.
- `src/styles/overlay.css` is the source of truth for overlay styling — imported as `?raw` by the exporter so the editor and the exported HTML use identical rules.

## Critical files

- [src/state.ts](src/state.ts) — reducer + context
- [src/components/ImageFrame.tsx](src/components/ImageFrame.tsx) — clipped frame + pan/zoom
- [src/components/Overlay.tsx](src/components/Overlay.tsx) — draggable chip + card unit
- [src/components/UploadProvider.tsx](src/components/UploadProvider.tsx) — file picker + drag-drop + @2x modal
- [src/lib/cropImage.ts](src/lib/cropImage.ts) — canvas-based image bake
- [src/lib/serializeHtml.ts](src/lib/serializeHtml.ts), [src/lib/serializeCss.ts](src/lib/serializeCss.ts) — export pipeline
- [src/embed.tsx](src/embed.tsx) — shadow-DOM mount for the bookmarklet
- [vite.embed.config.ts](vite.embed.config.ts) — IIFE build config
