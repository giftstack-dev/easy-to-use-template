HOW TO ADD PHOTOS TO DAMILOLA VANCE (FOLIO)
===========================================
1. Save your photos in this folder (e.g., avatar.jpg, project1.jpg, project2.jpg, etc.).
2. Open style.css in the parent folder.
3. Locate the "PHOTO SLOTS" section near the top.
4. Replace the Picsum demo URL with your local photo file:
   For example, change:
     --photo-hero: url("https://picsum.photos/seed/folio-hero/900/1100");
   to:
     --photo-hero: url("images/avatar.jpg");
5. Because every photo slot uses a CSS background layer with a branded gradient,
   your portfolio will always look sharp and impactful even before you add custom photos!
