#!/usr/bin/env python3
"""
Frontdoor HTML Templates - Template Packager
===========================================
A zero-dependency packaging script using Python 3 standard library
(zipfile, pathlib, argparse, sys) to package landing page templates
into standalone, ready-to-host ZIP files for Nigerian small businesses.

Usage:
    python tools/package_templates.py           # Build all template ZIP archives
    python tools/package_templates.py --check   # Verify template folders and required files
"""

import argparse
import os
from pathlib import Path
import sys
import zipfile

# The eight ready-made landing page templates in the Frontdoor collection
TEMPLATE_IDS = [
    "atelier",
    "glow",
    "spice",
    "covenant",
    "estate",
    "launch",
    "folio",
    "pulse",
]

HOW_TO_USE_TEXT = """============================================================
HOW TO USE THIS TEMPLATE - FRONTDOOR HTML TEMPLATES
============================================================

Thank you for downloading this ready-made landing page template!
This is a 100% pure HTML5 and CSS3 website. There is no JavaScript,
no build step, and no complex setup. It works immediately in any browser.

QUICK START IN 4 SIMPLE STEPS:
------------------------------------------------------------
1. UNZIP THIS FOLDER
   Extract this ZIP file anywhere on your computer.

2. EDIT YOUR BUSINESS DETAILS (index.html)
   Open index.html in any text editor (such as Notepad, VS Code,
   or TextEdit). Look for the <!-- REPLACE --> comments:
   - Replace the business name with your business name.
   - Replace the phone number (e.g., 07060725593) with yours.
   - Replace WhatsApp links:
     Change '2347060725593' to your phone number in international format
     (for Nigeria, start with 234 and drop the first 0, e.g. 2348012345678).
   - Replace the email address and city location.

3. CUSTOMIZE YOUR COLORS AND FONTS (style.css)
   Open style.css. Right at the very top, you will see:
   /* ========================================================
      EDIT YOUR BRAND HERE (Colors & Fonts)
      ======================================================== */
   Change --primary, --accent, --bg, and --surface to match your
   brand colors! You can also change the Google Fonts links in index.html.

4. ADD YOUR OWN PHOTOS (images/ folder)
   You can put your photos (hero.jpg, lookbook1.jpg, etc.) in the
   images/ folder, then update the CSS image variables at the top
   of style.css (e.g., --photo-hero: url("images/hero.jpg");).
   If a photo is missing or offline, a beautiful gradient shows automatically!

5. PUBLISH TO THE INTERNET
   Upload this entire folder to your web host:
   - Free option 1: GitHub Pages (free hosting on your own name.github.io)
   - Free option 2: Netlify (drag and drop this unzipped folder into netlify.com)
   - Traditional option: cPanel / Any shared hosting File Manager
   
That's it! Your landing page is live, mobile-friendly, ultra-fast,
and ready to convert Nigerian customers directly into WhatsApp chats.
============================================================
"""


def verify_templates(root_dir: Path) -> bool:
    """
    Checks that every template folder exists and contains index.html and style.css.
    Returns True if all templates pass, or False if any template has missing files.
    """
    print("Checking template folders and files...")
    all_valid = True

    for tid in TEMPLATE_IDS:
        folder = root_dir / tid
        if not folder.is_dir():
            print(f"  [ERROR] Missing template folder: {folder}")
            all_valid = False
            continue

        index_file = folder / "index.html"
        style_file = folder / "style.css"

        if not index_file.is_file():
            print(f"  [ERROR] Missing index.html in template: {tid}")
            all_valid = False
        if not style_file.is_file():
            print(f"  [ERROR] Missing style.css in template: {tid}")
            all_valid = False

        if index_file.is_file() and style_file.is_file():
            print(f"  [OK] {tid:10} -> index.html, style.css present")

    return all_valid


def package_templates(root_dir: Path, output_dir: Path) -> None:
    """
    Packages each template directory into a standalone ZIP file in output_dir.
    Includes index.html, style.css, images/ directory, and HOW_TO_USE.txt.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    results = []

    print(f"\nPackaging templates to {output_dir.resolve()} ...\n")
    print(f"{'Template':<14} {'Archive Name':<22} {'Size':<10} {'Status'}")
    print("-" * 56)

    for tid in TEMPLATE_IDS:
        folder = root_dir / tid
        if not folder.is_dir():
            print(f"{tid:<14} {'N/A':<22} {'N/A':<10} SKIPPED (Folder missing)")
            continue

        zip_path = output_dir / f"{tid}.zip"

        with zipfile.ZipFile(zip_path, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
            # Add root HOW_TO_USE.txt
            zf.writestr(f"{tid}/HOW_TO_USE.txt", HOW_TO_USE_TEXT)

            # Add index.html
            index_path = folder / "index.html"
            if index_path.exists():
                zf.write(index_path, arcname=f"{tid}/index.html")

            # Add style.css
            style_path = folder / "style.css"
            if style_path.exists():
                zf.write(style_path, arcname=f"{tid}/style.css")

            # Add images folder contents
            images_dir = folder / "images"
            if images_dir.is_dir():
                for img_file in images_dir.rglob("*"):
                    if img_file.is_file():
                        arcname = f"{tid}/images/{img_file.relative_to(images_dir)}"
                        zf.write(img_file, arcname=arcname)
            else:
                # Add default images readme
                zf.writestr(
                    f"{tid}/images/README.txt",
                    "Add your own business photos here and reference them in style.css or index.html.\n",
                )

        size_kb = os.path.getsize(zip_path) / 1024
        print(f"{tid:<14} {zip_path.name:<22} {size_kb:>6.1f} KB   OK")
        results.append((tid, zip_path.name, size_kb))

    print("-" * 56)
    print(f"Successfully created {len(results)} template packages in {output_dir}/")


def main():
    parser = argparse.ArgumentParser(
        description="Frontdoor HTML Templates - ZIP Packager and Integrity Verifier"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify that all template folders contain index.html and style.css, then exit",
    )
    parser.add_argument(
        "--output",
        default="downloads",
        help="Target folder for generated ZIP files (default: downloads)",
    )

    args = parser.parse_args()

    # Determine project root (parent directory of /tools)
    script_dir = Path(__file__).resolve().parent
    root_dir = script_dir.parent
    downloads_dir = root_dir / args.output

    if args.check:
        valid = verify_templates(root_dir)
        if not valid:
            print("\nVerification FAILED. Some template files are missing.")
            sys.exit(1)
        print("\nVerification PASSED. All 8 template folders are complete.")
        sys.exit(0)

    # First verify integrity
    if not verify_templates(root_dir):
        print("\nWarning: Some templates were missing, packaging available templates...")

    package_templates(root_dir, downloads_dir)


if __name__ == "__main__":
    main()
