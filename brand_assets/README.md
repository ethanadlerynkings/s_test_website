# Nexten — brand assets

Drop files here, then tell me they're in and I'll wire them into site/index.html.

## What I need

| File | Why | Notes |
|---|---|---|
| `logo.svg` | Header + footer lockup, favicon | SVG strongly preferred (scales, recolors). PNG @2x works if that's all you have. |
| `logo-mark.svg` | Square icon only, no wordmark | Used at 32x32 in the nav and as the giant watermark in the lime CTA band. |
| `guidelines.pdf` | Exact hex codes, type, spacing | Any format — PDF, PNG, Figma export. |

## Colors I'm currently using (placeholders from the reference site)

These six tokens sit at the top of `site/index.html`. Swapping them re-skins the whole page:

    --color-ink:      #0a0b0a   dark background
    --color-ink-soft: #121413   elevated surface (cards, rows)
    --color-paper:    #f3f4ec   text on dark / light section background
    --color-lime:     #c8f02d   accent: buttons, labels, stats, signature
    --color-muted:    #8a8f86   secondary text
    --color-red:      #fb2c36   hero script signature only

If you'd rather just paste hex codes than upload a guidelines file, that's enough to get the palette right.
