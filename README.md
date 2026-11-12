# Frontdoor HTML Templates

> **Ready-made, pure HTML5 & CSS3 landing page templates crafted for small businesses, entrepreneurs, and communities in Nigeria.**

<!-- Screenshot Note: Replace with actual capture of the gallery homepage showing live template previews -->
> *[Screenshot: Frontdoor Gallery homepage showing interactive template previews, category filters, and live demos]*

---

## What is Frontdoor HTML Templates?

**Frontdoor HTML Templates** is a collection of ten high-performance, conversion-focused landing pages designed specifically for the Nigerian commercial and education landscape. Every template is engineered with:

- **100% Pure HTML5 & CSS3**: Zero JavaScript, zero frameworks, zero CSS libraries (no Bootstrap, no Tailwind runtime), and zero icon font dependencies. Open `index.html` in any browser and everything works instantly.
- **WhatsApp-First Conversion**: Click-to-chat WhatsApp buttons with pre-filled, URL-encoded Nigerian messages on every service, product card, and package.
- **Layered Photo Resilience**: CSS background layers (`background: var(--photo), linear-gradient(...)`) ensure that if an image is missing, slow, or offline, a beautiful branded gradient displays with no broken-image icon.
- **Pure CSS Interactions**: Fixed top bars with smooth checkbox mobile hamburger menus, interactive multi-category filtering powered by CSS `:has()`, accessible dialog modals powered by CSS `:target`, interactive price list tabs, and native `<details>`/`<summary>` accordions.
- **Nigerian Demo Defaults**: Pre-configured with Nigerian phone formats (`07060725593`), international WhatsApp links (`https://wa.me/2347060725593`), Naira pricing (`₦`), and local context across Nigeria and worldwide.

---

## The Ten Templates

| Template | Industry / Domain | Demo Brand | Key Techniques & Features |
| :--- | :--- | :--- | :--- |
| **Atelier** | Fashion & Tailoring | *Adaeze Couture* | 12-item lookbook, CSS `:has()` category filter (Traditional, Bridal, Corporate, Casual, Kids), CSS `:target` lightbox, 4-step bespoke process. |
| **Glow** | Beauty Sanctuary & Spa | *Glow Sanctuary Spa* | CSS price list tabs in Naira (Hair, Makeup, Nails, Spa), specialist therapist team cards, verified client reviews. |
| **Spice** | Food & Event Catering | *Mama Put & Co* | 5 menu tabs (Rice, Grills, Small Chops, Drinks, Party Packs), 3 all-inclusive event feasts in Naira, ordering steps. |
| **Covenant** | Church & Faith Community | *Covenant Grace Chapel* | Service timetable header banner, upcoming conference cards, bank account giving block, confidential pastoral WhatsApp prayer request. |
| **Estate** | Real Estate Advisory | *Lekki Prime Estates* | Featured luxury listings in Naira (Ikoyi, Lekki Phase 1, Chevron), title verification guarantees (Governor's Consent, C of O), 4-step buying workflow. |
| **Launch** | Tech Startup (Dark Mode) | *Launchpad* | Deep interstellar dark palette, pure CSS interactive dashboard mockup with live bar charts & transactions, 3-tier Naira pricing table, waitlist. |
| **Folio** | Freelancer Portfolio | *Damilola Vance* | Senior brand & UI/UX product designer portfolio, case study cards with tags, interactive skills matrix, career timeline, project booking. |
| **Pulse** | High-Energy Gym (Dark) | *Pulse Fitness Lekki* | Industrial asphalt dark mode with athletic lime accents, Monday–Saturday weekly class schedule table, membership tiers in Naira, free trial CTA. |
| **Graduate** | Developer & Graduate CV | *Chinedu Okafor* | Personal developer portfolio, 3 featured projects with GitHub & live links, grouped skill chips, career timeline, education, and instant print-to-PDF one-page CV layout. |
| **Varsity** | University & Results Portal | *Greenfield State University* | Complete university website + AES-GCM-256 encrypted student results portal with 5-point/4-point GPA &amp; CGPA engine, carryover tracking, Target Planner, pickers (no broken filters), printable watermarked statements of result, and single-file or sharded CSV-to-ZIP builder. |

---

## How to Run Locally

You do **not** need Node.js, npm, Vite, or any build server to run or view this project.

1. Clone or download this repository to your computer.
2. Double-click `/index.html` to open the main gallery in any web browser (Chrome, Safari, Firefox, Edge, or mobile browsers).
3. To view or test an individual template standalone, open its folder (e.g., `/atelier/index.html` or `/pulse/index.html`) directly.

---

## How to Deploy on GitHub Pages

You can host the entire gallery or any individual template on GitHub Pages completely free:

1. Create a new repository on GitHub (e.g., `frontdoor-templates`).
2. Push this repository's files to the `main` branch.
3. On GitHub, navigate to **Settings** > **Pages** (in the left sidebar).
4. Under **Build and deployment** > **Branch**:
   - Select `main`
   - Select `/ (root)` folder
   - Click **Save**.
5. Within 60 seconds, GitHub will provide your live URL: `https://<your-username>.github.io/<repo-name>/`.
6. Because all asset links, stylesheets, and navigation links use clean relative paths, the site works flawlessly in root domains or subdirectories. The included `.nojekyll` file ensures GitHub Pages serves all files without Jekyll interference.

---

## Packaging Templates (`tools/package_templates.py`)

A zero-dependency Python 3 utility using only the standard library (`zipfile`, `pathlib`, `argparse`, `sys`) is provided to bundle standalone ZIP packages into the `/downloads/` directory:

```bash
# 1. Verify template completeness (checks that index.html & style.css exist in all 10 folders)
python3 tools/package_templates.py --check

# 2. Package all 10 templates into standalone downloads/{template}.zip archives
python3 tools/package_templates.py
```

Each generated ZIP contains:
- `index.html` (the standalone landing page)
- `style.css` (the self-contained styles with brand variables)
- `images/README.txt` (instructions for adding local business photos)
- `HOW_TO_USE.txt` (friendly plain-English instructions for non-technical clients)

---

## Design Decisions & Architectural Philosophy

### 1. Why Zero JavaScript?
- **Speed on Mobile Networks**: Over 85% of Nigerian web traffic arrives via mobile phones over variable 3G/4G cellular connections. Removing JavaScript bundles means pages load in under 400ms, with zero parse/compile overhead and zero layout shift.
- **Zero Maintenance & Cost**: Small business owners don't want to maintain npm packages, manage Node version updates, or debug hydration bugs. A static HTML file from 2026 will still render perfectly in 2046.
- **Universal Hosting**: Static HTML files can be hosted on GitHub Pages, Netlify drop, Cloudflare Pages, Amazon S3, or any basic cPanel shared hosting for ₦0.

### 2. How the CSS-Only Techniques Work
- **Mobile Menu (Checkbox Hack)**: A hidden `<input type="checkbox" id="nav-toggle">` paired with `<label for="nav-toggle">`. When tapped, `:checked ~ .nav-menu` expands with a smooth CSS transition.
- **Category Filter (`:has()`)**: Radio buttons control the active filter category. CSS rules like `.lookbook-wrapper:has(#cat-trad:checked) .lookbook-card:not([data-cat~="traditional"]) { display: none; }` toggle visible items with zero scripting.
- **Lightbox Dialogs (`:target`)**: Thumbnail links point to an anchored ID (`<a href="#lightbox-1">`). The modal overlay is styled with `.lightbox:target { display: flex; }` and a close link `<a href="#lookbook">✕</a>` resets the anchor.
- **Accordions (`<details>` & `<summary>`)**: Native HTML5 disclosure widgets with custom CSS rotating plus icons (`details[open] summary::after { transform: rotate(45deg); }`). Accessible out of the box with keyboard navigation.
- **Scroll-Driven Animation with Safe Fallback**: Modern CSS `@supports (animation-timeline: view())` provides scroll-triggered entrance reveals in browsers that support it, while falling back gracefully to 100% visible content in standard browsers.

---

## Documentation

- [`docs/HOW_TO_CUSTOMIZE.md`](docs/HOW_TO_CUSTOMIZE.md) — Step-by-step beginner guide to editing business details, brand colors, photos, and WhatsApp links.
- [`docs/HOW_IT_WORKS.md`](docs/HOW_IT_WORKS.md) — Comprehensive technical walkthrough of the CSS architecture, file structure, and accessibility techniques.
- [`docs/INTERVIEW_NOTES.md`](docs/INTERVIEW_NOTES.md) — 10 common technical interview questions and concise engineering answers about this project.

---

## License

MIT License &copy; 2026 Frontdoor HTML Templates. See [`LICENSE`](LICENSE) for full details.
