---
name: Gedik Örme
description: A luxury sourcing desk where knitted-fabric samples are objects you handle.
colors:
  stone: "#e6e1d8"
  card: "#faf8f3"
  ink: "#23211e"
  brass: "#6f5524"
  brass-line: "#b69a63"
  muted: "#5b5750"
  line: "#cfc8ba"
typography:
  display:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, serif"
    fontSize: "4.5rem"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "0em"
  headline:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.1
  title:
    fontFamily: "Bodoni Moda, Bodoni 72, Didot, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.28em"
rounded:
  none: "0px"
spacing:
  sm: "24px"
  md: "48px"
  lg: "80px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.card}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "20px 32px"
  button-primary-hover:
    backgroundColor: "{colors.brass}"
  button-inverse:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px 32px"
  button-inverse-hover:
    backgroundColor: "{colors.brass-line}"
  sample-card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.none}"
---

# Design System: Gedik Örme

## Overview

**Creative North Star: "Numune Masası" (the Sample Desk)**

A pale stone desk, ivory sample cards, near-black ink type and brass hairlines. Fabric colour is the only saturation on the page, so the product is the one thing that is ever loud. Fabrics are presented as handled objects (pinked-edge swatches on cards that tilt and lift), not as a photo grid. Density is generous and editorial; sections are staggered rather than tiled.

The ground is a lit draped knit cloth rendered by a WebGL fragment shader (rendered once, redrawn on resize, static, with the stone gradient as fallback). Swatch texture is a procedural V-stitch SVG over a flat colour. Both are representative, not photographic, and every swatch is labelled as sample content until real photography replaces it.

**Key Characteristics:**
- Fabric colour is the only saturation; chrome is stone, ivory, ink and brass.
- Didone display serif with one italic word per headline; small tracked sans caps for labels.
- Square corners everywhere; the only edge ornament is the pinked (zigzag) fabric cut.
- Brass hairlines and double frames carry structure instead of boxes and shadows.
- Representative imagery is honest: labelled sample, procedural, replaceable.

## Colors

A restrained warm-neutral palette with a single metallic accent; no chromatic UI colour.

### Primary
- **Antique Brass** (`brass`): hover state on ink buttons and links, focus ring, process numerals, active locale.
- **Brass Hairline** (`brass-line`): rules, nav underline border, double frames, selection fill, link underlines, hover on inverse button. Too light for text on stone; use only as line or on ink.

### Neutral
- **Pale Stone** (`stone`): the desk ground (the html fallback gradient runs #ece8e1 to #dcd6cb, the shader samples the same family).
- **Ivory Card** (`card`): sample cards, process band (at 90% opacity), mobile menu, text on ink.
- **Ink** (`ink`): body text, primary button, RFQ band and footer ground.
- **Warm Grey** (`muted`): secondary text and captions.
- **Parchment Line** (`line`): quiet dividers inside menus.

### Named Rules
**The Only Saturation Rule.** No chromatic colour exists outside fabric swatches. Never add a colour accent to UI.

**The Brass Is a Line Rule.** `brass-line` draws rules and frames; `brass` (darker) is the only brass allowed on text.

## Typography

**Display Font:** Bodoni Moda (normal and italic, latin and latin-ext, via next/font) with Bodoni 72, Didot, serif
**Body Font:** Jost (latin and latin-ext) with system-ui, sans-serif

**Character:** High-contrast Didone against a geometric sans in small tracked caps. Both subsets carry Turkish ğ ü ş ı İ ö ç.

### Hierarchy
- **Display** (400, 3rem mobile / 4.5rem desktop, 1.04): hero h1, balanced; one word in italic via `em`.
- **Headline** (400, 2.25rem / 3rem, default leading): section h2; RFQ h2 rises to 3.75rem.
- **Title** (400, 1.5rem): category and process names; wordmark is 1.25rem/1.75rem with 0.18em tracking, uppercase.
- **Body** (400, 1.125rem, relaxed, ink at 80% or `muted`): lead copy capped at 34ch to 48ch.
- **Label** (400, 0.75rem, 0.28em tracking, uppercase): nav, buttons, links, sample codes. Small card captions drop to 0.6rem/0.18em on mobile.

### Named Rules
**The One Italic Rule.** One italic word per headline; italic Bodoni also carries process numerals and swatch spec lines.

## Layout

Single column container, max 90rem, horizontal padding 24px mobile and 48px from md. Sections are separated by large vertical rhythm (py 48 to 128px). The hero is a 1fr / 1.15fr split with the sample desk at right. The categories section is a 12-column grid with deliberately offset tops (mt-16, mt-10) and mixed swatch ratios (16/10, 4/5, 1/1, 16/6), so it never reads as a tile row. Process steps stagger downward (0, 40, 80px). Story is a centred 2xl column. Under 768px, columns collapse and nav becomes a native details menu.

## Elevation & Depth

Hybrid. Depth is real: cards sit in CSS perspective (1600px) over a lit cloth. UI chrome is otherwise flat with hairlines. Shadows are soft, warm and long-offset, never hard.

### Shadow Vocabulary
- **Desk card** (`box-shadow: 0 30px 50px -18px rgba(60,50,30,.35)`): sample cards on the desk.
- **Menu** (`0 24px 40px -16px rgba(60,50,30,.4)`): mobile menu panel.
- **Stacked swatch on ink** (`0 20px 30px -12px rgba(0,0,0,.6)`): swatches in the RFQ band.

### Named Rules
**The Handled Object Rule.** Cards tilt toward the pointer (up to about 7 and 9 degrees), the hovered or focused card lifts 40px and peels its bottom-right corner (34px). Reduced motion removes tilt and shortens transitions to near zero. Motion uses `cubic-bezier(0.22, 1, 0.36, 1)` at 300 to 500ms.

## Shapes

Square. Radius is zero throughout. Fabric edges are pinked (zigzag clip-path, 2% teeth at 4% pitch). Cards and the RFQ band carry a brass-line hairline frame inset 7px (a double frame). Buttons are solid rectangles; secondary actions are text with a brass-line underline.

## Components

### Buttons
- **Primary:** solid ink, ivory label text, padding 20px 32px, hover to brass over 200ms.
- **Inverse (on ink):** ivory fill, ink text, hover to brass-line.
- **Secondary:** tracked label with 1px brass-line bottom border and 6px padding, hover text to brass.
- **Focus:** 2px brass outline, 3px offset, on all focusable elements.

### Sample Card (signature)
Ivory figure with hairline frame, a pinked knit swatch inset 6.5% (bottom 21%), caption with code, "ÖRNEK/SAMPLE" label and an italic spec line. Placed absolutely with fixed rotation and perspective offsets per card. Swatch colour is inline; texture is the V-stitch SVG with a soft-light highlight gradient.

### Navigation
Spaced Didone wordmark left; tracked-caps links right over a brass-line bottom rule; TR / EN switch with the current locale in brass; the quote link is medium weight with a brass underline. Hover goes to brass. Mobile uses a native details disclosure with an ivory panel and an ink quote button.


### Forms (inquiry and contact)
Fields are underlined, not boxed: a tracked-caps label above, display-serif input text, a `brass-line` hairline that becomes `brass` on focus, square corners, and the global 2px brass focus ring stays. Optional fields say "isteğe bağlı / optional" beside the label instead of marking required ones with asterisks. The consent control is a square 24px box with a drawn check; the submit button is the primary ink button.

**Errors never use colour.** Per the Only Saturation Rule, an error is ink text with a drawn circle-exclamation mark, a 2px ink underline on the field, and an ink-ruled summary above the form that takes focus and links to each field. Failure notes (delivery, rate limit, network) use the same ruled block. Success is an ivory card with the double hairline frame and the reference code in italic Didone figures.

### Footer
Ink ground, ivory text, wordmark at 1.875rem, brass-line labels, three columns (1.4fr 1fr 1fr), faint ivory top rule for the legal line.

## Do's and Don'ts

### Do:
- **Do** keep chrome to stone, ivory, ink and brass; let swatch colour be the only saturation.
- **Do** label every placeholder swatch as sample content and keep the texture procedural until real photos arrive.
- **Do** use hairline brass frames and rules for structure.
- **Do** offset and stagger grid items; vary swatch aspect ratios.
- **Do** honour reduced motion on every transform and transition.

### Don't:
- **Don't** use rounded corners, pills or card grids with equal tiles.
- **Don't** use hard offset shadows; keep shadows soft and warm.
- **Don't** put `brass-line` on text over stone.
- **Don't** introduce handwriting fonts, mono type, or a second accent colour.
- **Don't** present procedural swatches as real product photography.
