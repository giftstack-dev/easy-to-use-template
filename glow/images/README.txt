HOW TO ADD PHOTOS TO GLOW SANCTUARY SPA & STUDIO
==================================================
1. Save your photos in this folder (e.g., hero.jpg, hair.jpg, nails.jpg, etc.).
2. Open style.css in the parent folder.
3. Locate the "PHOTO SLOTS" section near the top.
4. Replace the Picsum demo URL with your local photo file:
   For example, change:
     --photo-hero: url("https://picsum.photos/seed/glow-hero/1600/1000");
   to:
     --photo-hero: url("images/hero.jpg");
5. Because every photo slot uses a CSS background layer with a branded gradient,
   your page will always look polished even before you add custom photos!
