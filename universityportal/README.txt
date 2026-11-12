======================================================================
GREENFIELD STATE UNIVERSITY — VARSITY UNIVERSITY PORTAL PACKAGE
======================================================================

OUTPUT MODE: SINGLE FILE (embedded inside index.html — up to 800 students)

FILES IN THIS PACKAGE
---------------------
1. index.html          -> Complete university website + encrypted student portal.
2. (Single-file mode embeds all encrypted blobs in index.html.)
3. robots.txt          -> Tells search engines not to index the /data/ folder.
4. access-slips.html   -> Printable A4 access slips (8 per sheet). DO NOT UPLOAD.
5. codes.csv           -> Master list of matric numbers & access codes. KEEP OFFLINE.
6. students.csv        -> Sample/source student list CSV.
7. results.csv         -> Sample/source course results CSV.
8. README.txt          -> This setup, operations, and data protection guide.

STEP 1: UPLOADING TO A WEB HOST (HTTPS REQUIRED)
------------------------------------------------
Upload ONLY index.html, robots.txt to your web host:
- cPanel / Shared Hosting: Upload to public_html/ (or a subfolder like public_html/portal/).
- Netlify Drop / Cloudflare Pages / GitHub Pages: Deploy the public folder over HTTPS.

IMPORTANT HOSTING NOTES:
- Do NOT upload codes.csv or access-slips.html to any web server! Keep them
  offline on a password-protected Registry / ICT workstation.
- Single-file mode works even when hosted as one file, and requires HTTPS for Web Crypto decryption.
- Browsers require HTTPS (or localhost) for Web Crypto decryption (crypto.subtle).

STEP 2: DISTRIBUTING ACCESS SLIPS
---------------------------------
1. Open access-slips.html in Chrome or Edge on the Registry computer.
2. Click "Print A4 Slips" (8 slips print per A4 sheet).
3. Cut along the dashed lines and issue each slip confidentially ONLY to the
   verified student (check Student ID card before handing over a slip).

STEP 3: PUBLISHING NEXT SEMESTER'S RESULTS
------------------------------------------
1. Append the new semester's rows to results.csv (e.g. 2025/2026 Second Semester).
2. Open the Frontdoor Varsity Builder (customizer.html?template=universityportal).
3. Upload your updated students.csv and results.csv.
4. Choose whether to keep existing student codes or click "Reissue codes".
5. Click "Generate portal", download the new ZIP, and replace index.html on your host.

STEP 4: LOST ACCESS CODES
-------------------------
Students tap "Lost your code?" to send a pre-filled WhatsApp (0800 000 0000)
or email (ict@example.com) request to the ICT Helpdesk with their name, matric
number, and department. After verifying the student's identity offline against
codes.csv, the Registry/ICT officer shares their code or issues fresh slips in
the next build.

HONEST SYSTEM LIMITS (STATIC PORTAL ARCHITECTURE)
-------------------------------------------------
Because this portal runs 100% as static encrypted files without a backend server:
- Zero server crashes on result-release day when thousands check at once.
- Results are published as encrypted static files; updating scores requires
  rebuilding in the customizer and re-uploading to your host.
- There is no lecturer online score-entry portal.
- There is no online course registration module.
- There is no automated self-service password reset email/SMS link (true
  self-service reset requires a live server and database; ask the developer
  if your institution needs a full backend version).

DATA PROTECTION & PRIVACY NOTICE (NDPA 2023)
--------------------------------------------
Institutions handle students' personal academic data and must comply with
applicable data protection laws such as the Nigeria Data Protection Act (NDPA 2023).
- Each student's record is individually encrypted with PBKDF2-SHA-256 (120,000
  iterations) + AES-GCM-256; published files contain zero plaintext student names,
  matric numbers, phone numbers, or grades.
- Keep access-slips.html and codes.csv strictly private and publish portals only
  with official institutional authorization.
======================================================================
