# _test_website

Landing page builds for **Nexten** — an Illinois creative and technology agency.

Two design directions live side by side. Each is a single self-contained
`index.html` with its own static server, no build step and no framework.

| Directory | Port | Direction |
|---|---|---|
| [`site/`](site/) | 3002 | Lime `#c8f02d` on near-black, Bricolage Grotesque display, rounded pills |
| [`site-v2/`](site-v2/) | 3003 | Copper `#b87333` on near-black, Cinzel serif display, zero border-radius, animated WebGL backdrop |

## Running locally

```bash
npm install          # only needed for the Puppeteer tooling below
node site/serve.mjs      # http://localhost:3002
node site-v2/serve.mjs   # http://localhost:3003
```

Each `serve.mjs` is a dependency-free static file server; the pages themselves
need nothing but a browser.

## site-v2: Silk shader backdrop

[`site-v2/silk.js`](site-v2/silk.js) renders a flow shader on a fullscreen
triangle in a plain WebGL1 context — no libraries.

- Palette `#02010A → #04052E → #3D2C8D → #916BBF`
- `devicePixelRatio` capped at 2
- The render loop pauses while the tab is hidden and resumes the clock where it
  left off
- `prefers-reduced-motion: reduce` draws a single static frame
- Falls back cleanly: if WebGL is unavailable the canvas removes itself
- Context loss is handled and the scene rebuilds on restore

The canvas is fixed behind all page content. Because the sections below the
hero have opaque backgrounds, the shader currently reads through the hero only.
Making those bands translucent (e.g. `rgba(15,15,14,.82)`) turns it into a
full-page backdrop.

## Tooling

Puppeteer helpers used while building — capture a page, slice tall screenshots
into readable tiles, and diff measured geometry between two renders.

```bash
node screenshot.mjs http://localhost:3003
node slice.mjs input.png outdir 1100
```

## Status

Pre-launch. Still placeholder and pending real assets:

- Logo, favicon and brand guidelines — drop files in
  [`brand_assets/`](brand_assets/README.md)
- Phone number and contact email
- Case study imagery and copy (currently `placehold.co` blocks)
- Testimonial attributions
