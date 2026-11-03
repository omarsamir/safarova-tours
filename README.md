# Safarova Tours — v1.0

Static, responsive website (desktop + mobile) for a tourism company.
No build step, no framework, no backend. All content lives in **`data/content.json`**.

## Structure

```
safarova-tours/
├── index.html          Home: header, hero, search + filters, features, 4 tours, why-us, footer
├── tour.html           Tour details page (tour.html#id=<tour id>)
├── css/style.css       All styles (breakpoints at 1024px, 860px, 560px, 380px)
├── js/app.js           Loads content.json and renders every section
├── data/content.json   ← the "CMS": edit this to change the site
└── images/             All images
```

## Editing content (JSON as CMS)

Open `data/content.json` in any text editor (VS Code recommended, it flags JSON errors).

| What you want to change | Where in content.json |
|---|---|
| Logo text, page title, currency | `site` |
| Menu links, "Book Now" button | `nav`, `bookButton` |
| Hero title, subtitle, background, button | `hero` |
| Search labels, tour types, max travelers | `search` |
| The 4 trust badges | `features` |
| "Why choose us" block | `why` |
| Tours (cards + details pages) | `tours` (array) |
| Labels on the details page | `tourPage` |
| Footer CTA, background, contact, social | `footer` |

### Add a new tour
Copy one object inside `tours`, change `id` (unique, no spaces, e.g. `"luxor"`),
then edit name, images, price, highlights, itinerary, etc. It appears automatically
on the home page, in the search filter, in the footer and at `tour.html#id=luxor`.

Clicking any tour card opens its details page. If a search matches exactly one tour, its details page opens directly with the chosen date and travelers filled in.

Tour fields used by the search filter:
- `destination`: shown in the Destination dropdown
- `types`: must match values in `search.tourTypes`
- `availableDays`: weekdays the tour runs (0 = Sunday … 6 = Saturday)
- `maxGroup`: tour is hidden if travelers > this number

### Images
Put new photos in `images/` and reference them as `"images/your-photo.jpg"`.
Recommended sizes: hero/footer 1920×1080, cards 800×530, gallery 1200×800, JPG under ~300 KB.
**The images in v1.0 are placeholders cropped from the design mockup — replace them with real, high-resolution photos you own or have a license for before launch.**

### Booking
"Book Now" on a tour opens WhatsApp with a pre-filled message (tour, date, travelers).
Set your number in `footer.contact.whatsapp` (international format, digits only, e.g. `201012345678`).
If you leave it empty, booking falls back to email.

## Run locally

The page loads JSON with `fetch`, so it must be served over http (double-clicking
`index.html` will show an error). Pick one:

```bash
npx serve .                 # Node.js
python -m http.server 8000  # Python, then open http://localhost:8000
```
or VS Code → install "Live Server" → right-click `index.html` → *Open with Live Server*.

## Deploy (all free options)

**Netlify (easiest, ~1 minute)**
1. Go to https://app.netlify.com/drop
2. Drag the whole `safarova-tours` folder onto the page.
3. You get a live URL. To update content later, edit `content.json` and drag the folder again
   (or connect a GitHub repo for auto-deploys).

**GitHub Pages**
1. Create a GitHub repository and upload the folder contents (index.html at the root).
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / root → Save.
3. Site is live at `https://<username>.github.io/<repo>/`.
4. Editing `data/content.json` directly on GitHub and committing republishes the site.

**Vercel / Cloudflare Pages**
Import the GitHub repo, framework preset "Other", no build command, output directory `/`.

**Custom domain** (e.g. safarova-tours.com): add it in your host's Domains settings and
point your DNS records as instructed there. HTTPS is issued automatically.

**Any shared hosting (cPanel)**: upload the folder contents into `public_html` via File Manager or FTP.

## Roadmap ideas (v1.1+)
About, Gallery and Contact pages · Arabic version (RTL) · Contact form (Netlify Forms / Formspree) ·
Netlify CMS / Decap CMS on top of the same JSON for a visual editor.
