/* Safarova Tours v1.0
 * All page content comes from data/content.json (the "CMS").
 * Edit that file to change text, images, prices and tours; no code changes needed.
 */
(function () {
  "use strict";

  const CONTENT_URL = "data/content.json";

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const url = (v) => {
    const s = String(v ?? "").trim();
    return /^(javascript|data|vbscript):/i.test(s) ? "#" : esc(s);
  };

  const ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.2.7 3.5 2.8 3.5 5.7"/>',
    shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 8 7.5 9 4.3-1 7.5-4.5 7.5-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    guide: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/><path d="M9 14.5 12 18l3-3.5"/>',
    support: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="13" width="4" height="6" rx="1.5"/><rect x="17.5" y="13" width="4" height="6" rx="1.5"/><path d="M19.5 19c0 1.5-2 2.5-5 2.5"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H16a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h7.5"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="13.5" r="1"/><circle cx="16.5" cy="13.5" r="1"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    money: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    phone: '<path d="M5 3.5h3.5l1.5 5-2.2 1.3a11 11 0 0 0 6.4 6.4l1.3-2.2 5 1.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8"/>',
    whatsapp: '<path d="M4 20l1.2-4A8.5 8.5 0 1 1 8.3 19z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 1a4.6 4.6 0 0 1-2.4-2.4l1-1-1-2z"/>'
  };
  const icon = (name) =>
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.star}</svg>`;

  const LOGO_MARK =
    '<svg viewBox="0 0 48 36" aria-hidden="true"><circle cx="31" cy="9" r="5" fill="#f5b72e" opacity=".9"/><path d="M2 34 18 8l16 26z" fill="#f5b72e"/><path d="M18 8l16 26h-9z" fill="#c98b0f"/><path d="M26 34 36 18l10 16z" fill="#f5b72e" opacity=".75"/></svg>';

  // Tour links use the URL hash (tour.html#id=fayoum) so the tour id survives
  // "clean URL" redirects done by some servers/hosts (e.g. npx serve: tour.html -> /tour).
  const tourUrl = (id, extra = {}) => {
    const q = new URLSearchParams({ id, ...extra });
    return "tour.html#" + q.toString();
  };
  const tourParams = () => {
    const fromHash = new URLSearchParams(location.hash.replace(/^#/, ""));
    const fromQuery = new URLSearchParams(location.search);
    const get = (k) => fromHash.get(k) || fromQuery.get(k);
    return { id: get("id"), date: get("date"), travelers: get("travelers") };
  };

  const money = (n, c) => `${esc(c.site.currency)}${esc(n)}`;
  const isHome = document.body.dataset.page === "home";
  const prefix = isHome ? "" : "index.html";

  /* ---------- Shared: header & footer ---------- */
  function renderHeader(c) {
    const path = location.pathname.split("/").pop() || "index.html";
    const nav = c.nav
      .map((n) => {
        let href = n.href;
        if (href.startsWith("#") && href !== "#contact" && !isHome) href = prefix + href;
        const active = href === path || (isHome && href === "index.html") ? " active" : "";
        return `<li><a class="${active.trim()}" href="${url(href)}">${esc(n.label)}</a></li>`;
      })
      .join("");

    $("#site-header").innerHTML = `
      <div class="container header-inner">
        <a class="logo" href="index.html" aria-label="${esc(c.site.name)} ${esc(c.site.tagline)} home">
          ${LOGO_MARK}
          <span><span class="logo-name">${esc(c.site.name)}</span><span class="logo-tag">${esc(c.site.tagline)}</span></span>
        </a>
        <nav class="main-nav" id="main-nav" aria-label="Main">
          <ul>${nav}</ul>
          <a class="btn btn-gold btn-sm" href="${url(c.bookButton.href)}">${esc(c.bookButton.label)}</a>
        </nav>
        <div class="header-actions">
          <a class="btn btn-gold btn-sm" href="${url(c.bookButton.href)}">${esc(c.bookButton.label)}</a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">${icon("menu")}</button>
        </div>
      </div>`;

    // Hide duplicate in-menu button on desktop
    const inMenuBtn = $("#main-nav .btn");
    const mq = window.matchMedia("(max-width: 860px)");
    const sync = () => (inMenuBtn.style.display = mq.matches ? "" : "none");
    sync();
    mq.addEventListener("change", sync);

    const toggle = $("#menu-toggle");
    const menu = $("#main-nav");
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = icon(open ? "x" : "menu");
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = icon("menu");
      }
    });
  }

  function renderFooter(c) {
    const f = c.footer;
    const el = $("#contact");
    el.style.backgroundImage = `url("${url(f.image)}")`;
    const waHref = f.contact.whatsapp ? `https://wa.me/${encodeURIComponent(f.contact.whatsapp)}` : `mailto:${f.contact.email}`;
    el.innerHTML = `
      <div class="footer-cta">
        <h2>${esc(f.ctaTitle)}</h2>
        <p>${esc(f.ctaText)}</p>
        <a class="btn btn-gold" href="${url(waHref)}" target="_blank" rel="noopener">${esc(f.ctaButton)} ${icon("arrow")}</a>
      </div>
      <div class="container footer-main">
        <div>
          <a class="logo" href="index.html">${LOGO_MARK}<span><span class="logo-name">${esc(c.site.name)}</span><span class="logo-tag">${esc(c.site.tagline)}</span></span></a>
          <p style="margin-top:14px">${esc(f.about)}</p>
          <div class="social">${f.social.map((s) => `<a href="${url(s.href)}" target="_blank" rel="noopener" aria-label="${esc(s.icon)}">${icon(s.icon)}</a>`).join("")}</div>
        </div>
        <div>
          <h4>Tours</h4>
          <ul>${c.tours.map((t) => `<li><a href="${tourUrl(t.id)}">${esc(t.name)}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>${icon("phone")}<a href="tel:${url(f.contact.phone.replace(/\s/g, ""))}">${esc(f.contact.phone)}</a></li>
            <li>${icon("mail")}<a href="mailto:${url(f.contact.email)}">${esc(f.contact.email)}</a></li>
            <li>${icon("pin")}<span>${esc(f.contact.address)}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">${esc(f.copyright)}</div>`;
  }

  function tourCard(t, c) {
    return `
      <article class="tour-card">
        <a class="thumb" href="${tourUrl(t.id)}"><img src="${url(t.image)}" alt="${esc(t.name)}" loading="lazy"></a>
        <div class="body">
          <h3><a href="${tourUrl(t.id)}">${esc(t.name)}</a></h3>
          <p class="tags">${esc(t.tags)}</p>
          <div class="meta">
            <a class="link" href="${tourUrl(t.id)}">${esc(c.toursSection.linkLabel)} ${icon("arrow")}</a>
            <span class="price">${esc(c.tourPage.fromLabel)} <strong>${money(t.price, c)}</strong></span>
          </div>
        </div>
      </article>`;
  }

  /* ---------- Home page ---------- */
  function renderHome(c) {
    const h = c.hero;
    const hero = $("#hero");
    hero.style.backgroundImage = `url("${url(h.image)}")`;
    hero.innerHTML = `
      <div class="container">
        <p class="hero-eyebrow">${esc(h.eyebrow)}</p>
        <h1>${esc(h.title)} <span>${esc(h.titleHighlight)}</span></h1>
        <p class="hero-sub">${esc(h.subtitle)}</p>
        <a class="btn btn-gold" href="${url(h.button.href)}">${esc(h.button.label)} ${icon("arrow")}</a>
      </div>`;

    // Search form
    const s = c.search;
    const destinations = [...new Set(c.tours.map((t) => t.destination))];
    const today = new Date();
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $("#search-form").innerHTML = `
      <div class="field">${icon("pin")}<div>
        <label for="f-dest">${esc(s.destinationLabel)}</label>
        <select id="f-dest" name="destination"><option value="">${esc(s.destinationPlaceholder)}</option>${destinations.map((d) => `<option>${esc(d)}</option>`).join("")}</select>
      </div></div>
      <div class="field">${icon("compass")}<div>
        <label for="f-type">${esc(s.typeLabel)}</label>
        <select id="f-type" name="type"><option value="">${esc(s.typePlaceholder)}</option>${s.tourTypes.map((t) => `<option>${esc(t)}</option>`).join("")}</select>
      </div></div>
      <div class="field">${icon("calendar")}<div>
        <label for="f-date">${esc(s.dateLabel)}</label>
        <input id="f-date" name="date" type="date" min="${todayStr}">
      </div></div>
      <div class="field">${icon("user")}<div>
        <label for="f-trav">${esc(s.travelersLabel)}</label>
        <select id="f-trav" name="travelers">${Array.from({ length: s.maxTravelers }, (_, i) => `<option value="${i + 1}">${i + 1} ${i ? "People" : "Person"}</option>`).join("")}</select>
      </div></div>
      <button class="btn btn-navy" type="submit">${icon("search")} ${esc(s.buttonLabel)}</button>`;

    // Features
    $("#features").innerHTML = c.features
      .map((f) => `<div class="feature"><span class="feature-icon">${icon(f.icon)}</span><div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div></div>`)
      .join("");

    // Tours
    const ts = c.toursSection;
    $("#tours-head").innerHTML = `<p class="eyebrow">${esc(ts.eyebrow)}</p><h2>${esc(ts.title)}</h2><p>${esc(ts.subtitle)}</p>`;
    const grid = $("#tour-grid");
    const info = $("#results-info");
    const showTours = (list, filtered) => {
      grid.innerHTML = list.length ? list.map((t) => tourCard(t, c)).join("") : `<p class="empty">No tours match your search. Try different filters.</p>`;
      info.hidden = !filtered;
      if (filtered) {
        info.innerHTML = `Showing ${list.length} of ${c.tours.length} tours · <button type="button" id="reset-search">Clear filters</button>`;
        $("#reset-search").addEventListener("click", () => {
          $("#search-form").reset();
          showTours(c.tours, false);
        });
      }
    };
    showTours(c.tours, false);

    $("#search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const dest = fd.get("destination");
      const type = fd.get("type");
      const date = fd.get("date");
      const travelers = Number(fd.get("travelers") || 1);
      const weekday = date ? new Date(date + "T00:00:00").getDay() : null;
      const result = c.tours.filter(
        (t) =>
          (!dest || t.destination === dest) &&
          (!type || (t.types || []).includes(type)) &&
          (weekday === null || !t.availableDays || t.availableDays.includes(weekday)) &&
          (!t.maxGroup || travelers <= t.maxGroup)
      );
      // Exactly one matching tour -> open its details page directly (date/travelers carried over)
      if (result.length === 1) {
        const extra = { travelers: String(travelers) };
        if (date) extra.date = date;
        location.href = tourUrl(result[0].id, extra);
        return;
      }
      showTours(result, true);
      $("#tours").scrollIntoView({ behavior: "smooth" });
    });

    // Why choose us
    const w = c.why;
    const why = $("#about");
    why.style.backgroundImage = `url("${url(w.image)}")`;
    why.innerHTML = `
      <div class="container">
        <div>
          <p class="eyebrow">${esc(w.eyebrow)}</p>
          <h2>${esc(w.title)}</h2>
          <p class="lead">${esc(w.text)}</p>
          <a class="btn btn-gold" href="#contact">${esc(c.footer.ctaButton)} ${icon("arrow")}</a>
        </div>
        <div class="why-list">${w.items.map((i) => `<div class="why-item">${icon(i.icon)}<div><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div></div>`).join("")}</div>
      </div>`;
  }

  /* ---------- Tour details page ---------- */
  function renderTour(c) {
    const params = tourParams();
    const id = params.id;
    const t = c.tours.find((x) => x.id === id);
    const p = c.tourPage;
    const banner = $("#page-banner");
    banner.style.backgroundImage = `url("${url(p.bannerImage)}")`;

    if (!t) {
      banner.innerHTML = `<div class="container"><h1>${esc(p.notFound)}</h1><nav class="breadcrumb"><a href="index.html">Home</a></nav></div>`;
      $("#tour-detail").innerHTML = `<div class="tour-grid">${c.tours.map((x) => tourCard(x, c)).join("")}</div>`;
      $("#related").remove();
      return;
    }

    document.title = `${t.name} | ${c.site.name} ${c.site.tagline}`;
    banner.innerHTML = `
      <div class="container">
        <h1>${esc(t.name)} Tour</h1>
        <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>›</span><a href="index.html#tours">Tours</a><span>›</span><span>${esc(t.name)}</span></nav>
      </div>`;

    const gallery = t.gallery && t.gallery.length ? t.gallery : [t.image];
    const today = new Date();
    const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const list = (items, cls, ic) => `<ul class="check-list ${cls}">${(items || []).map((i) => `<li>${icon(ic)}<span>${esc(i)}</span></li>`).join("")}</ul>`;

    $("#tour-detail").innerHTML = `
      <div class="detail-grid">
        <div>
          <div class="gallery-main"><img id="main-img" src="${url(gallery[0])}" alt="${esc(t.name)}"></div>
          <div class="gallery-thumbs">${gallery
            .map((g, i) => `<button type="button" class="${i ? "" : "active"}" data-src="${url(g)}" aria-label="Show photo ${i + 1}"><img src="${url(g)}" alt="" loading="lazy"></button>`)
            .join("")}</div>
        </div>
        <div class="detail-info">
          <div class="facts">
            <div class="fact">${icon("clock")}<div><span>${esc(p.labels.duration)}</span><small>${esc(t.duration)}</small></div></div>
            <div class="fact">${icon("pin")}<div><span>${esc(p.labels.pickup)}</span><small>${esc(t.pickup)}</small></div></div>
            <div class="fact">${icon("users")}<div><span>${esc(p.labels.type)}</span><small>${esc(t.groupType)}</small></div></div>
            <div class="fact">${icon("money")}<div><span>${esc(p.labels.price)}</span><small>${esc(p.fromLabel)} ${money(t.price, c)}</small></div></div>
          </div>
          <h2>${esc(p.highlightsTitle)}</h2>
          ${list(t.highlights, "", "check")}
          <div class="book-box">
            <p class="from">${esc(p.fromLabel)}<strong>${money(t.price, c)}</strong>${esc(t.priceNote)}</p>
            <form class="book-form" id="book-form">
              <input type="date" name="date" min="${todayStr}" aria-label="Date" required>
              <select name="travelers" aria-label="Travelers">${Array.from({ length: t.maxGroup || 10 }, (_, i) => `<option value="${i + 1}">${i + 1} ${i ? "People" : "Person"}</option>`).join("")}</select>
              <button class="btn btn-gold btn-sm" type="submit">${esc(p.bookLabel)}</button>
            </form>
          </div>
        </div>
      </div>

      <div class="tabs">
        <div class="tab-list" role="tablist">
          ${Object.entries(p.tabs)
            .map(([k, label], i) => `<button type="button" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}">${esc(label)}</button>`)
            .join("")}
        </div>
        <div class="tab-panel" role="tabpanel" id="panel-description" aria-labelledby="tab-description"><p>${esc(t.summary)}</p></div>
        <div class="tab-panel" role="tabpanel" id="panel-itinerary" aria-labelledby="tab-itinerary" hidden>
          <ol class="timeline">${(t.itinerary || []).map((s) => `<li><span class="time">${esc(s.time)}</span><div><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div></li>`).join("")}</ol>
        </div>
        <div class="tab-panel" role="tabpanel" id="panel-included" aria-labelledby="tab-included" hidden>${list(t.included, "", "check")}</div>
        <div class="tab-panel" role="tabpanel" id="panel-notIncluded" aria-labelledby="tab-notIncluded" hidden>${list(t.notIncluded, "x-list", "x")}</div>
      </div>`;

    // Gallery
    const main = $("#main-img");
    document.querySelectorAll(".gallery-thumbs button").forEach((b) =>
      b.addEventListener("click", () => {
        main.src = b.dataset.src;
        document.querySelectorAll(".gallery-thumbs button").forEach((x) => x.classList.toggle("active", x === b));
      })
    );

    // Tabs
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs.forEach((tab) =>
      tab.addEventListener("click", () => {
        tabs.forEach((x) => {
          const on = x === tab;
          x.setAttribute("aria-selected", String(on));
          document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
        });
      })
    );

    // Prefill booking from search (if coming from the search bar)
    const bf = $("#book-form");
    if (params.date) bf.elements.date.value = params.date;
    if (params.travelers && bf.elements.travelers.querySelector(`option[value="${CSS.escape(params.travelers)}"]`)) bf.elements.travelers.value = params.travelers;

    // Booking -> WhatsApp (or email fallback)
    $("#book-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const msg = `Hello ${c.site.name} ${c.site.tagline}, I'd like to book the "${t.name}" tour on ${fd.get("date")} for ${fd.get("travelers")} traveler(s).`;
      const ct = c.footer.contact;
      const link = ct.whatsapp
        ? `https://wa.me/${encodeURIComponent(ct.whatsapp)}?text=${encodeURIComponent(msg)}`
        : `mailto:${ct.email}?subject=${encodeURIComponent("Booking: " + t.name)}&body=${encodeURIComponent(msg)}`;
      window.open(link, "_blank", "noopener");
    });

    // Related tours
    const others = c.tours.filter((x) => x.id !== t.id);
    $("#related").innerHTML = `<div class="container"><div class="section-head"><h2>${esc(p.relatedTitle)}</h2></div><div class="tour-grid related-grid">${others.map((x) => tourCard(x, c)).join("")}</div></div>`;
  }

  /* ---------- Boot ---------- */
  fetch(CONTENT_URL, { cache: "no-cache" })
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then((c) => {
      if (isHome) document.title = c.site.title;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.content = c.site.description;
      renderHeader(c);
      renderFooter(c);
      if (isHome) {
        renderHome(c);
        if (location.hash) {
          let target = null;
          try { target = document.querySelector(location.hash); } catch (e) { /* not a selector */ }
          if (target) setTimeout(() => target.scrollIntoView(), 50);
        }
      } else {
        renderTour(c);
        // Clicking another tour on the details page only changes the hash: re-render
        window.addEventListener("hashchange", () => {
          if (!$("#related")) $("#tour-detail").insertAdjacentHTML("afterend", '<section class="section section-alt" id="related"></section>');
          renderTour(c);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    })
    .catch((err) => {
      console.error(err);
      document.querySelector("main").innerHTML = `
        <div class="load-error"><h3>Content could not be loaded</h3>
        <p>The site reads its content from <code>data/content.json</code>. Browsers block this when the page is opened directly from disk (file://).
        Run it through a local server instead, for example <code>npx serve .</code> or VS Code's "Live Server" extension. Also check the JSON for syntax errors.</p></div>`;
    });
})();
