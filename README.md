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

The site's signature element is an inquiry form styled as a bill of lading. Submissions go through [Web3Forms](https://web3forms.com) to the business inbox.

**To connect it:** create an access key at web3forms.com for the receiving inbox. Then paste the key into `data-access-key=""` on `<form id="manifest-form">` in `index.html`. Until a key is set, the form asks visitors to call 406-439-9079 and quote their reference number.

## Local preview

```sh
python3 -m http.server 8000
```
