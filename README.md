# Helena Wholesale Distributions Inc: website

The static marketing site for **Helena Wholesale Distributions Inc**, a general-merchandise wholesaler and merchandise broker at 1001 South Main Street, Suite 49, Kalispell, Montana 59901 (406-439-9079).

Live at **https://helenawholesale.com**, served by GitHub Pages from `main`.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The single-page site: hero, services, Suppliers/Buyers tabs, process, the Manifest, Find us |
| `privacy.html`, `404.html` | Supporting pages |
| `css/site.css`, `js/site.js` | All styles and behaviour; no build step, no dependencies |
| `assets/` | Generated contour map, ridge silhouette, logo mark, OG image, touch icon |
| `CNAME` | Custom domain for GitHub Pages |
| `CONTEXT.md` | Domain glossary (Supplier, Buyer, Inquiry, Manifest) |

## The Manifest (inquiry form)

The site's signature element is an inquiry form styled as a bill of lading. Submissions are relayed by [FormSubmit](https://formsubmit.co), which needs no account, to helenawholesalers@gmail.com. The endpoint is set in `data-endpoint` on `<form id="manifest-form">` in `index.html`.

**Activation (one time):** the first Manifest triggers an "Activate Form" email to helenawholesalers@gmail.com. Click it once and submissions start arriving. The activation email also gives a random alias string. Put it in place of the email address in `data-endpoint` (`https://formsubmit.co/ajax/<alias>`) so the address no longer appears in the page source.

Email: info@helenawholesale.com forwards to helenawholesalers@gmail.com through Forward Email (MX and TXT records in GoDaddy DNS).

## Local preview

```sh
python3 -m http.server 8000
```
