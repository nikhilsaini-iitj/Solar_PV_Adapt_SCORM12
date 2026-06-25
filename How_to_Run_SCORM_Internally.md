# How to Run the SCORM 1.2 Package Internally

## 1. Option A — SCORM Test Harness (quickest, no LMS needed)
The build already includes `scorm_test_harness.html`. It launches the course with a cookie-based fake SCORM API so you can test locally.

### Steps
1. Extract `Solar_PV_Adapt_SCORM12.zip` to a folder.
2. Serve that folder over HTTP (SCORM must run from a server, not `file://`):
   ```bash
   cd /path/to/extracted/Solar_PV_Adapt_SCORM12
   python3 -m http.server 8000
   ```
3. Open: `http://localhost:8000/scorm_test_harness.html`

The harness sets:
```js
window.ADAPT_BUILD_TYPE = 'production';
window.ISCOOKIELMS = true;
```
This lets Adapt save progress to cookies instead of a real LMS.

---

## 2. Option B — Real LMS / SCORM Cloud
Upload the zip directly:
- **SCORM Cloud** (Rustici) — https://cloud.scorm.com
- **Moodle** with SCORM plugin
- **TalentLMS, Docebo, Litmos, Articulate Online**

Use `index_lms.html` as the launch URL (that is what `imsmanifest.xml` points to).

---

## 3. Option C — Serve as a static site (GitHub Pages style)
The package is the same as the live GitHub Pages build:
1. Extract the zip.
2. Serve the folder via any static server (Nginx, Apache, `python3 -m http.server`, Vercel, Netlify).
3. Open `index.html` for public preview or `index_lms.html` for LMS-style launch.

---

## 4. Files you care about
| File | Purpose |
|------|---------|
| `index_lms.html` | LMS launch page (uses real SCORM API lookup) |
| `scorm_test_harness.html` | Local test launch (cookie-based fake LMS) |
| `imsmanifest.xml` | SCORM 1.2 manifest — points to `index_lms.html` |
| `libraries/SCORM_API_wrapper.js` | Pipwerks SCORM 1.2 / 2004 wrapper |

---

## 5. Important notes
- **Do not open the HTML files directly with `file://`**. Browsers block iframes, modules, and SCORM API discovery on `file://`.
- **HTTPS is required for AR/camera features** on mobile browsers. If you serve internally over plain HTTP, AR will not launch on phones.
- For internal QA, run on `localhost` (browsers treat localhost as secure-ish for most APIs) or use a local HTTPS reverse proxy.
