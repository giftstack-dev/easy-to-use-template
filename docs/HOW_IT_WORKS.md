# How It Works: Technical Architecture & CSS Engineering

This document provides a plain-English walkthrough of the file structure and the modern, pure CSS techniques powering **Frontdoor HTML Templates**.

---

## 1. Project Directory Anatomy

The project is structured with complete modularity so that each template can function both as part of the unified Frontdoor gallery and as an independent, standalone website.

```
/
├── index.html                  # Gallery homepage showcasing all 9 templates
├── gallery.css                 # Unified gallery stylesheet & iframe preview math
├── atelier/                    # Fashion & Bespoke Tailoring Template
│   ├── index.html              # Standalone landing page
│   ├── style.css               # Self-contained styles & brand tokens
│   └── images/README.txt       # Photo instructions
├── glow/                       # Beauty & Spa Studio Template
├── spice/                      # Food & Event Catering Template
├── covenant/                   # Church & Community Assembly Template
├── estate/                     # Real Estate Advisory Template
├── launch/                     # Tech Startup & SaaS Template (Dark Mode)
├── folio/                      # Freelancer Portfolio Template
├── pulse/                      # Athletic Performance Gym Template (Dark Mode)
├── graduate/                   # Developer & Graduate Portfolio Template (Printable CV)
├── downloads/                  # Directory containing generated template ZIP packages
├── tools/
│   └── package_templates.py    # Zero-dependency Python 3 ZIP packaging script
├── docs/
│   ├── HOW_TO_CUSTOMIZE.md     # Beginner user customization guide
│   ├── HOW_IT_WORKS.md         # This technical deep-dive
│   └── INTERVIEW_NOTES.md      # Engineering interview questions & answers
├── README.md                   # Project overview & documentation
├── LICENSE                     # MIT License (2026 Frontdoor HTML Templates)
├── .nojekyll                   # Prevents Jekyll preprocessing on GitHub Pages
└── .gitignore                  # Git exclusions
```

---

## 2. Deep Dive: The CSS Techniques

### Technique 1: The Mobile Menu Checkbox Hack
Traditional websites load hundreds of kilobytes of JavaScript libraries just to toggle a mobile hamburger menu. In Frontdoor, mobile menus are built entirely with a standard HTML checkbox:

```html
<!-- HTML Structure -->
<header class="top-nav">
  <a href="#top" class="brand-logo">ADAEZE COUTURE</a>

  <!-- 1. The hidden checkbox -->
  <input type="checkbox" id="nav-toggle" class="nav-toggle">
  
  <!-- 2. The visible hamburger icon styled via label -->
  <label for="nav-toggle" class="nav-toggle-label">
    <span></span>
    <span></span>
    <span></span>
  </label>

  <!-- 3. The sliding menu -->
  <ul class="nav-menu">
    <li><a href="#about" class="nav-link">About</a></li>
    <li><a href="#contact" class="nav-link">Contact</a></li>
  </ul>
</header>
```

```css
/* CSS Implementation */
/* Hide the native checkbox off-screen */
.nav-toggle {
  display: none;
}

/* On mobile viewports, the menu is initially collapsed */
@media (max-width: 860px) {
  .nav-menu {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* When the user taps the label, the checkbox becomes :checked */
  .nav-toggle:checked ~ .nav-menu {
    max-height: 380px; /* Slides open smoothly */
  }

  /* Animate hamburger lines into an 'X' */
  .nav-toggle:checked ~ .nav-toggle-label span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  .nav-toggle:checked ~ .nav-toggle-label span:nth-child(2) {
    opacity: 0;
  }
  .nav-toggle:checked ~ .nav-toggle-label span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
}
```
**Why this works:** The `<label for="nav-toggle">` natively toggles the checked state of `<input id="nav-toggle">` without any JavaScript event listeners. The CSS sibling combinator (`~`) detects `:checked` and applies the open state instantly.

---

### Technique 2: Multi-Category Filtering with the CSS `:has()` Selector
In the Atelier lookbook and the main Frontdoor gallery, visitors can filter items by clicking category tags (e.g., *Traditional*, *Bridal*, *Corporate*).

```html
<div class="lookbook-wrapper">
  <!-- Radio inputs share the same 'name' so only one can be checked at once -->
  <input type="radio" name="filter" id="cat-all" checked>
  <input type="radio" name="filter" id="cat-trad">
  <input type="radio" name="filter" id="cat-bridal">

  <div class="filter-controls">
    <label for="cat-all">All</label>
    <label for="cat-trad">Traditional</label>
    <label for="cat-bridal">Bridal</label>
  </div>

  <div class="lookbook-grid">
    <article class="card" data-cat="traditional">...</article>
    <article class="card" data-cat="bridal">...</article>
  </div>
</div>
```

```css
/* The parent container queries its own children with :has() */
.lookbook-wrapper:has(#cat-trad:checked) .card:not([data-cat~="traditional"]) {
  display: none;
}

.lookbook-wrapper:has(#cat-bridal:checked) .card:not([data-cat~="bridal"]) {
  display: none;
}
```
**Why this works:** The modern CSS `:has()` pseudo-class acts as a parent selector. When `#cat-trad` is `:checked`, the wrapper hides any card that does not contain `data-cat="traditional"`. When `#cat-all` is checked, no hide rules match, so all cards display. It is instantaneous, reactive, and requires 0 lines of JavaScript.

---

### Technique 3: The Pure CSS Lightbox via `:target`
When a user clicks "View Details" on a lookbook item, a full-screen modal opens showing the high-resolution photo and WhatsApp order button.

```html
<!-- Trigger link pointing to an element ID fragment -->
<a href="#lightbox-1" class="open-btn">View Details</a>

<!-- Modal markup matching the anchor ID -->
<div id="lightbox-1" class="lightbox">
  <div class="lightbox-dialog">
    <!-- Close button points back to section anchor, clearing the fragment -->
    <a href="#lookbook" class="lightbox-close">✕</a>
    <div class="lightbox-media"></div>
    <div class="lightbox-content">...</div>
  </div>
</div>
```

```css
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.88);
  display: none; /* Hidden by default */
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

/* When the URL in the browser matches #lightbox-1, :target activates! */
.lightbox:target {
  display: flex;
}
```
**Why this works:** When a visitor clicks `<a href="#lightbox-1">`, the browser updates the URL hash to `#lightbox-1`. CSS recognizes that the element with `id="lightbox-1"` is now the document `:target` and applies `display: flex`. When the user clicks the close link `<a href="#lookbook">✕</a>`, the hash changes to `#lookbook`, `:target` on the modal deactivates, and the modal vanishes smoothly.

---

### Technique 4: Native `<details>` and `<summary>` Accordions
Frequently Asked Questions (FAQ) sections traditionally required accordion plugins or React state. Frontdoor uses standard HTML5 disclosure elements:

```html
<details class="faq-item" open>
  <summary class="faq-summary">How long does bespoke tailoring take?</summary>
  <div class="faq-body">Standard turnaround is 7 to 10 business days...</div>
</details>
```

```css
.faq-summary {
  cursor: pointer;
  list-style: none; /* Removes default browser triangle */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Hide WebKit triangle */
.faq-summary::-webkit-details-marker {
  display: none;
}

/* Add custom smooth plus icon */
.faq-summary::after {
  content: '+';
  font-size: 1.5rem;
  transition: transform 0.25s ease;
}

/* When the item is expanded, rotate plus into an 'x' */
.faq-item[open] .faq-summary::after {
  transform: rotate(45deg);
}
```
**Why this works:** The `<details>` element is natively supported in 100% of modern browsers, works with screen readers without ARIA hacks, and supports keyboard navigation (`Space` or `Enter` to expand). Adding the `open` attribute makes the first item expanded by default.

---

### Technique 5: Layered Photo Fallbacks (Zero Broken Images)
On variable mobile networks, external photos can fail to load. In Frontdoor, every image slot uses a CSS multi-layer background:

```css
:root {
  --photo-hero: url("https://picsum.photos/seed/atelier-hero/1600/1000");
}

.hero-photo {
  /* Layer 1: The photo URL (top)
     Layer 2: A branded linear gradient (fallback underneath) */
  background-image: var(--photo-hero), linear-gradient(135deg, var(--primary), var(--accent));
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```
**Why this works:** CSS renders background images in stack order from top to bottom. If `var(--photo-hero)` fails to download, is blocked by privacy filters, or is deleted, the browser simply falls back to the beautiful branded gradient beneath it. There is never an empty white box, never an ugly browser broken-image icon, and the page layout remains 100% intact.

---

### Technique 6: Scroll-Driven Animations with Safe Fallback
In cutting-edge browsers (Chrome/Edge 115+), sections reveal themselves as the user scrolls down the page. Frontdoor wraps this feature in `@supports`:

```css
/* By default, all content is 100% visible immediately (Zero-latency policy) */
.scroll-fade {
  opacity: 1;
  transform: none;
}

/* Only enable scroll-driven animation if the browser natively supports it */
@supports (animation-timeline: view()) {
  .scroll-fade {
    animation: scrollIn linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 30%;
  }

  @keyframes scrollIn {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```
**Why this works:** If a visitor uses Safari, Firefox, or an older mobile browser that does not yet support `animation-timeline: view()`, the `@supports` block is ignored. The visitor immediately sees full content with zero delays or invisible text bugs.

---

### Technique 7: Scaled iFrame Previews in the Gallery
The main gallery displays interactive live previews of all 9 templates inside cards without loading heavy full-scale pages:

```css
.card-thumb-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background-color: #E2E8F0;
}

.card-thumb-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  /* Make the iframe 4x larger (1440px equivalent) */
  width: 400%;
  height: 400%;
  /* Scale it down to 25% to fit the thumbnail box */
  transform: scale(0.25);
  transform-origin: 0 0;
  border: 0;
  pointer-events: none; /* Prevent scroll capture inside thumbnails */
}
```
**Why this works:** The iframe renders the actual live HTML file at a desktop resolution (400% width), and `transform: scale(0.25)` shrinks the rasterized output to fit the card thumbnail. This provides an authentic pixel-for-pixel preview of the live template.

---

### Technique 8: Accessibility & Reduced Motion
Every interactive element features visible `:focus-visible` outlines for keyboard users, and motion animations respect system settings:

```css
/* High-visibility focus indicators */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* Complete reduced motion compliance */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
If a user with vestibular motion sensitivity has reduced motion enabled in Windows, macOS, iOS, or Android, all scrolling, pulses, and transform transitions are neutralized instantly.
