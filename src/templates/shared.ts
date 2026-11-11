/**
 * Frontdoor HTML Templates - Shared Helpers
 * =========================================
 * Reusable utility functions for HTML escaping, URL sanitization,
 * phone normalization, layered resilient images, and progressive enhancement.
 */

/**
 * Escapes characters that are unsafe inside HTML attributes and body text.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates external URLs: only allow http, https, mailto, and tel.
 * Returns an empty string if invalid or dangerous (e.g. javascript:, data:).
 */
export function validateUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  // Safe protocols allowed in anchor tags
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return '';
}

/**
 * Normalizes a Nigerian phone number for tel: links (e.g. "0800 000 0000" -> "tel:08000000000").
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^\d+]/g, '');
  return digits;
}

/**
 * Normalizes a phone number into an international WhatsApp format (without + or leading zeros).
 * For Nigeria, converts "0800 000 0000" or "07060725593" -> "234..."
 */
export function normalizeWhatsApp(phone: string): string {
  if (!phone) return '2348000000000';
  let clean = phone.replace(/[^\d]/g, '');
  if (clean.startsWith('234')) {
    return clean;
  }
  if (clean.startsWith('0')) {
    clean = '234' + clean.slice(1);
  }
  return clean || '2348000000000';
}

/**
 * Generates initials or monogram from a person or business name (e.g., "Chinedu Okafor" -> "CO").
 */
export function getInitials(name: string): string {
  if (!name) return 'CO';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Renders a resilient layered image container:
 * 1. An SVG/CSS art background displaying a monogram and themed gradient.
 * 2. An overlay <img> using data-photo for progressive loading.
 */
export function renderLayeredImage(options: {
  aspectRatio?: string; // e.g. "4/5" or "16/10"
  imageUrl?: string;
  initials?: string;
  label?: string;
  alt: string;
  className?: string;
  bgGradient?: string;
}): string {
  const {
    aspectRatio = '4/5',
    imageUrl = '',
    initials = 'CO',
    label = 'Chinedu Okafor',
    alt,
    className = 'layered-image-box',
    bgGradient = 'linear-gradient(135deg, #101828 0%, #0F766E 100%)',
  } = options;

  const safeAlt = escapeHtml(alt);
  const safeInitials = escapeHtml(initials);
  const safeLabel = escapeHtml(label);
  const validImgUrl = validateUrl(imageUrl);

  return `
    <div class="${escapeHtml(className)}" style="aspect-ratio: ${aspectRatio}; background: ${bgGradient};">
      <!-- Layer 1: Art & Monogram fallback (always visible if photo fails or before it loads) -->
      <div class="layered-art-layer" aria-hidden="true">
        <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="art-svg">
          <defs>
            <radialGradient id="art-glow-${safeInitials}" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#0F766E" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#101828" stop-opacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="85" fill="url(#art-glow-${safeInitials})" />
          <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="52" fill="#E6F4F1" letter-spacing="2">
            ${safeInitials}
          </text>
        </svg>
        <span class="art-label">${safeLabel}</span>
      </div>

      <!-- Layer 2: Real photo with progressive loading -->
      ${
        validImgUrl
          ? `<img src="${escapeHtml(validImgUrl)}" data-photo="${escapeHtml(validImgUrl)}" alt="${safeAlt}" loading="lazy" class="layered-photo" onload="this.classList.add('loaded')" onerror="this.style.display='none'" />`
          : ''
      }
    </div>
  `.trim();
}

/**
 * Returns the vanilla client-side script for menu toggle, active section spy,
 * scroll-reveal with .js-ready fallback (1500ms), and progressive image loading.
 */
export function getSharedScript(): string {
  return `
    (function() {
      // 1. Progressive Enhancement: Mark document as js-ready
      // Content remains visible by default so no user is ever locked out if JS fails
      document.documentElement.classList.add('js-ready');

      // 1500ms safety timeout: ensure all reveal elements are fully visible even if intersection observer stalls
      setTimeout(function() {
        document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(function(el) {
          el.classList.add('revealed');
        });
      }, 1500);

      // 2. Scroll Reveal with IntersectionObserver
      if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal-on-scroll').forEach(function(el) {
          observer.observe(el);
        });
      } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('.reveal-on-scroll').forEach(function(el) {
          el.classList.add('revealed');
        });
      }

      // 3. Mobile Menu Toggle and Smooth Close on Link Click
      var menuToggle = document.getElementById('nav-toggle');
      var navLinks = document.querySelectorAll('.nav-menu a');
      if (menuToggle) {
        navLinks.forEach(function(link) {
          link.addEventListener('click', function() {
            menuToggle.checked = false;
          });
        });
      }

      // 4. Scrollspy for Active Navigation Link
      var sections = document.querySelectorAll('section[id]');
      function updateActiveNav() {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var offset = 120;
        sections.forEach(function(section) {
          var top = section.offsetTop - offset;
          var height = section.offsetHeight;
          var id = section.getAttribute('id');
          if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(function(link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      }
      window.addEventListener('scroll', updateActiveNav, { passive: true });
      updateActiveNav();

      // 5. Contact WhatsApp Form Builder
      var waForm = document.getElementById('quick-wa-form');
      if (waForm) {
        waForm.addEventListener('submit', function(e) {
          e.preventDefault();
          var nameInput = document.getElementById('wa-sender-name');
          var msgInput = document.getElementById('wa-sender-msg');
          var name = nameInput ? nameInput.value.trim() : '';
          var msg = msgInput ? msgInput.value.trim() : '';
          var baseWa = waForm.getAttribute('data-wa-num') || '2347060725593';
          var fullMsg = 'Hello Chinedu, my name is ' + (name || 'a visitor') + '. ' + msg;
          var targetUrl = 'https://wa.me/' + baseWa + '?text=' + encodeURIComponent(fullMsg);
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        });
      }

      // 6. Layered Image Loader: handles data-photo images
      document.querySelectorAll('img[data-photo]').forEach(function(img) {
        if (img.complete && img.naturalHeight > 0) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', function() {
            img.classList.add('loaded');
          });
          img.addEventListener('error', function() {
            img.style.display = 'none';
          });
        }
      });
    })();
  `.trim();
}
