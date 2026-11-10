# How to Customize Your Template (Beginner's Guide)

Welcome! This guide is written in plain English for small business owners, freelancers, and designers who want to customize a Frontdoor template without needing a computer science degree.

Every template in Frontdoor is built with simple HTML and CSS. You do not need Node.js, npm, or terminal commands. A standard text editor like **Notepad** (Windows), **TextEdit** (Mac), or **VS Code** is all you need.

---

## Step 1: Open Your Files in a Text Editor

1. If you downloaded a ZIP file (e.g., `atelier.zip`), right-click and extract/unzip it to a folder on your computer.
2. Inside the folder, you will see three items:
   - `index.html` (the content and structure of your page)
   - `style.css` (the colors, fonts, and appearance of your page)
   - `images/` (a folder where you can place your own business photos)
3. Right-click on `index.html` and choose **Open With** > **Notepad** (or your favorite code editor).
4. Double-click `index.html` in your file explorer to also view the page live in your web browser. Whenever you save changes in your text editor, simply refresh your browser (`F5` or `Ctrl+R` / `Cmd+R`) to see the updates!

---

## Step 2: Change Your Business Name & Details

Inside `index.html`, every demo placeholder is clearly labeled with an HTML comment: `<!-- REPLACE -->`.

### A. Business Name & Tagline
Look near line 30 for the navigation bar:
```html
<!-- BEFORE -->
<!-- REPLACE: Brand Name -->
<a href="#top" class="brand-logo">ADAEZE <span>COUTURE</span></a>

<!-- AFTER (Your brand) -->
<a href="#top" class="brand-logo">BLESSING <span>DESIGNS</span></a>
```

### B. Nigerian Phone Number
Search for `07060725593`:
```html
<!-- BEFORE -->
<!-- REPLACE: Phone Number -->
<a href="tel:07060725593">Call Us: 07060725593</a>

<!-- AFTER -->
<a href="tel:08012345678">Call Us: 0801 234 5678</a>
```

### C. WhatsApp Links (Crucial Format!)
WhatsApp click-to-chat links use the international country code format **without** leading zeros, plus signs, or hyphens.
- Nigeria's country code is **234**.
- If your phone number is `0803 123 4567`, drop the first `0` and prepend `234`: `2348031234567`.
- Spaces in pre-filled messages are written as `%20`.

```html
<!-- BEFORE -->
<!-- REPLACE: WhatsApp Link -->
<a href="https://wa.me/2347060725593?text=Hello%20Adaeze%20Couture,%20I%20want%20to%20book%20a%20fitting">

<!-- AFTER -->
<a href="https://wa.me/2348031234567?text=Hello%20Blessing%20Designs,%20I%20want%20to%20book%20a%20fitting">
```

### D. Email Address & Location
Search for `ese.dev13@gmail.com`:
```html
<!-- REPLACE: Email Address -->
<a href="mailto:contact@blessingdesigns.ng">contact@blessingdesigns.ng</a>

<!-- REPLACE: City Location -->
<p>Plot 12, Nnebisi Road, Asaba, Delta State, Nigeria.</p>
```

---

## Step 3: Change Your Brand Colors & Fonts

Open `style.css` in your text editor. Right at the very top (lines 10–30), you will see the **EDIT YOUR BRAND HERE** block:

```css
:root {
  /* Brand Palette */
  --primary: #1A1A1A;             /* Your primary brand color */
  --accent: #B08D57;              /* Your brand accent / CTA color */
  --bg: #FFFFFF;                  /* Page background */
  --surface: #FAF7F2;             /* Card and section background */
  --text: #222222;                /* Main readable body text */
  --text-muted: #6B6864;          /* Secondary descriptive text */
}
```

To change to your company's signature colors:
- Replace `#1A1A1A` with your hex color code (e.g., `#1E3A8A` for navy or `#059669` for emerald green).
- Replace `#B08D57` with your button/accent color (e.g., `#F59E0B` for amber gold).
- Save `style.css` and refresh your browser. Your entire page updates instantly!

---

## Step 4: Replace Photos with Your Own

Every photo slot in Frontdoor uses a resilient CSS background layer with a branded gradient fallback.

### Option A: Local Photos (Recommended for Offline & Speed)
1. Copy your photos (e.g., `hero.jpg`, `item1.jpg`) into the template's `images/` folder.
2. Open `style.css` and locate the **Photo Slots** section near the top:
```css
/* Change this: */
--photo-hero: url("https://picsum.photos/seed/atelier-hero/1600/1000");

/* To this: */
--photo-hero: url("images/hero.jpg");
```
3. Repeat for any other photo slots (e.g., `--photo-item-1: url("images/dress1.jpg");`).

### Option B: Leave as Demo / Test Gradient
If you don't have photos ready yet, the template already has high-quality seeded demo photos from Picsum. If your internet is disconnected or an image URL is removed, the CSS automatically falls back to a smooth, branded gradient background. You will **never** see an ugly broken-image icon!

---

## Step 5: Add or Remove Sections

Because the HTML is semantic and modular, you can easily remove or duplicate any section:

- **To remove a section** (e.g., the FAQ): Simply delete everything from `<section id="faq">` down to `</section>`.
- **To update the navigation bar**: If you delete the FAQ section, also delete the `<li><a href="#faq" class="nav-link">FAQ</a></li>` line in `<header>` so the top link is removed.
- **To add a service card**: Duplicate one of the `<article class="service-card">...</article>` blocks and change the title and price.

---

## Step 6: Publish Your Website to the Internet

Once you are satisfied with your edits on your computer, choose one of these three easy hosting methods:

### Option 1: Netlify Drop (Easiest — Free, No Account Setup)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop your unzipped template folder onto the browser window.
3. Your website is live in 10 seconds with a free URL like `https://peaceful-sunflower-123.netlify.app`.
4. You can connect your own custom domain (e.g., `mybusiness.com.ng`) in the Netlify dashboard.

### Option 2: GitHub Pages (Free, Professional)
1. Create a free account at [github.com](https://github.com).
2. Create a new repository named `my-business-site`.
3. Upload your `index.html`, `style.css`, and `images/` folder.
4. Go to **Settings** > **Pages** > select **Deploy from a branch** > select `main` branch > click **Save**.
5. Your website is published at `https://<your-username>.github.io/my-business-site/`.

### Option 3: Traditional cPanel Hosting
1. Log into your web hosting cPanel (e.g., Whogohost, QServers, Namecheap, Bluehost).
2. Open **File Manager** and go to `public_html`.
3. Upload your files (`index.html`, `style.css`, and the `images/` folder).
4. Visit your domain in your browser—your website is live!

---

Congratulations! You now have a blazing-fast, mobile-ready, conversion-optimized landing page ready to welcome Nigerian customers.
