# NextGrant — Site oficial

Site single-page HTML/CSS/JS pentru **NextGrant SRL**, gata de deploy pe TopHost cPanel (fără build step, fără npm).

## Structură fișiere

```
.
├── index.html        # Markup + SEO + JSON-LD + Tailwind config + atribute data-i18n
├── style.css         # Stiluri brand, animații, componente
├── script.js         # Interactivitate (calculator, carousel, formular, particule, i18n engine)
├── translations.js   # Dicționar complet RO / RU / EN (~150 chei × 3 limbi)
├── favicon.svg       # Favicon principal — același logo ca în header (SVG vector)
├── favicon-mask.svg  # Versiune monocrom pentru Safari pinned tabs
└── README.md         # Acest fișier
```

## Deploy

1. Urcă cele 6 fișiere (`index.html`, `style.css`, `script.js`, `translations.js`, `favicon.svg`, `favicon-mask.svg`) în folderul `public_html` din cPanel.
2. Asigură-te că ai și `sitemap.xml` și `robots.txt` (de păstrat din site-ul vechi).
3. Asta e tot. Nu e nimic de compilat.

### Favicon: fallback-uri opționale PNG

Browser-ele moderne (Chrome, Firefox, Safari, Edge) folosesc direct `favicon.svg`. Pentru compatibilitate maximă pe **iOS home screen** și **browsere legacy**, generează manual din `favicon.svg` două PNG-uri:

- **`apple-touch-icon.png`** — 180×180 px (pentru iOS când userul adaugă site-ul pe home screen)
- **`favicon-32.png`** — 32×32 px (fallback pentru browsere care nu acceptă SVG favicon)

Tool-uri online care fac asta în 30s din `favicon.svg`:
- realfavicongenerator.net
- favicon.io/favicon-converter

Urci PNG-urile în root, alături de `favicon.svg`. HTML-ul deja le referențiază — doar fișierele lipsesc (browser-ul cade silent pe SVG dacă nu le găsește, deci nu se rupe nimic).

---

## Multi-lingvism (RO / RU / EN)

Site-ul are traducere reală pentru **3 limbi**: română (default), rusă, engleză. Comutarea se face din butoanele `RO · RU · EN` din header (desktop și mobile).

### Cum funcționează

1. Toate textele traductibile au atributul `data-i18n="cheie"` în HTML
2. Fișierul `translations.js` conține dicționarul complet cu toate cheile pentru fiecare limbă
3. Funcția `applyTranslations(lang)` din `script.js` traversează DOM-ul și înlocuiește textul
4. Limba aleasă e salvată în `localStorage` și se păstrează între vizite

### Tipuri de atribute folosite

| Atribut | Folosit pentru | Exemplu |
|---|---|---|
| `data-i18n="key"` | Text simplu (textContent) | `<a data-i18n="nav.home">Acasă</a>` |
| `data-i18n-html="key"` | Conținut cu HTML (innerHTML) | `<p data-i18n-html="programs.1.desc.html">Până la <strong>3M lei</strong>...</p>` |
| `data-i18n-placeholder="key"` | Placeholder pentru input/textarea | `<input data-i18n-placeholder="lead.field.email.ph" />` |
| `data-i18n-title="key"` | Atributul title | `<button data-i18n-title="lang.tooltip.ru">RU</button>` |
| `data-i18n-aria-label="key"` | Atributul aria-label | `<input data-i18n-aria-label="calc.slider.aria" />` |

### Cum modific o traducere existentă

Deschide `translations.js`, găsește cheia (ex: `hero.subheadline`) și modifică valoarea în limba dorită:

```js
ru: {
  'hero.subheadline': 'Tinerea ta nouă în rusă aici',
  ...
}
```

Salvezi, reîncarci browserul. Gata.

### Cum adaug o limbă nouă (ex: ucraineană)

1. În `translations.js`, adaugă o nouă secțiune `uk: { ... }` cu toate cheile traduse
2. În `index.html`, adaugă butonul în switcher (atât în header desktop cât și în meniul mobil):
   ```html
   <span class="text-text-muted/40">·</span>
   <button class="lang-btn" data-lang="uk" aria-pressed="false">UK</button>
   ```
3. Asta e. Nu e nevoie de alte modificări — lang switcher-ul detectează automat butonul.

### Cum adaug un text nou care trebuie tradus

1. În `index.html`, dă elementului un atribut `data-i18n="cheie.unica"`:
   ```html
   <p data-i18n="my.new.text">Textul în română aici</p>
   ```
2. În `translations.js`, adaugă cheia în toate cele 3 secțiuni (`ro`, `ru`, `en`):
   ```js
   ro: { ..., 'my.new.text': 'Textul în română aici' },
   ru: { ..., 'my.new.text': 'Текст по-русски здесь' },
   en: { ..., 'my.new.text': 'The text in English here' }
   ```
3. Reîncarci. Site-ul îl traduce automat.

> **Notă:** Cheile lipsă din RU/EN cad automat înapoi pe RO ca fallback (nu se rupe site-ul).

---

## Cum modific culorile

Toate culorile brand sunt definite **în două locuri** și trebuie să rămână sincronizate:

### 1. În `style.css` — variabile CSS

```css
:root{
  --navy:        #0F172A;   /* navy primar (text, header, dark sections) */
  --navy-2:      #1E293B;   /* navy secundar (gradient) */
  --gold:        #C9A84C;   /* gold accent (CTA, highlight) */
  --gold-2:      #B8923D;   /* gold închis */
  --gold-3:      #E8C76A;   /* gold deschis */
  --cream:       #FAFAF7;   /* fundal cremos */
  --gray-soft:   #F3F4F6;   /* secțiuni alternante */
  --text-muted:  #6B7280;   /* subtext, captions */
}
```

### 2. În `index.html` — config Tailwind (în `<script>` sub Tailwind CDN)

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0F172A', 2: '#1E293B', 3: '#334155' },
        gold: { DEFAULT: '#C9A84C', 2: '#B8923D', 3: '#E8C76A' },
        cream: '#FAFAF7',
        ...
      }
    }
  }
}
```

> **Important:** dacă schimbi paleta, modifică ambele locuri identic.

---

## Cum schimb conținutul testimonialelor

Testimonialele sunt în `index.html`, secțiunea cu `<!-- 9. TESTIMONIALE -->`.

Fiecare testimonial are forma:

```html
<article class="testimonial-card">
  <i data-lucide="quote" class="w-8 h-8 text-gold opacity-30"></i>
  <blockquote class="mt-5 text-lg lg:text-xl italic text-navy/80 leading-relaxed">
    Textul citatului aici.
  </blockquote>
  <div class="testimonial-divider"></div>
  <div class="testimonial-author">
    <div class="testimonial-monogram">XY</div>   <!-- 2 inițiale -->
    <div>
      <div class="font-semibold">Nume Prenume</div>
      <div class="text-sm text-text-muted">Funcție · Companie</div>
    </div>
  </div>
</article>
```

**Pentru a adăuga / scoate testimoniale:**
1. Copiază un întreg `<article class="testimonial-card">...</article>` și modifică textul.
2. În `<!-- Controale carousel -->`, în lista `<div class="testimonial-dots">`, adaugă/scoate corespunzător:
   ```html
   <button class="testimonial-dot" data-slide="N" aria-label="Testimonial N+1"></button>
   ```
3. Carousel-ul funcționează automat cu numărul de slide-uri existente.

---

## Cum schimb endpoint-ul Formspree

Deschide `script.js`, prima secțiune:

```js
const FORM_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_FORM_ID';
```

Înlocuiește `REPLACE_WITH_FORM_ID` cu ID-ul formularului tău Formspree (ex: `xqkrlblb`).

> Cât timp endpoint-ul nu este configurat, formularul afișează mesajul de succes dar **NU trimite datele** (ele sunt logate doar în consola browserului, ca să poți testa local).

### Formular alternativ (fără Formspree)

Dacă vrei să trimiți pe propriul tău server (ex: PHP pe TopHost), modifică `initLeadForm()` din `script.js` și schimbă URL-ul de fetch + metoda. Formul de date e standard `FormData`, deci compatibil cu orice backend.

---

## Cum adaug un program nou de grant

În `index.html`, secțiunea cu `<!-- 6. PROGRAME DE GRANTURI -->`, copiază un întreg card și modifică:

```html
<article class="program-card scroll-reveal" style="--delay:480ms">
  <span class="program-badge program-badge-active">ACTIV</span>     <!-- sau program-badge-tineri / -diaspora / -eu -->
  <h3 class="font-display font-bold text-lg mt-4">Numele programului</h3>
  <p class="text-text-muted mt-2 text-[15px] leading-relaxed">
    Descriere scurtă cu suma și domeniile.
  </p>
  <ul class="program-tags">
    <li>Tag 1</li><li>Tag 2</li><li>Tag 3</li>
  </ul>
</article>
```

**Tipuri de badge disponibile** (CSS în `style.css`):
- `program-badge-active` — verde (programe ODA active)
- `program-badge-tineri` — mov (start tineri)
- `program-badge-diaspora` — albastru (PARE 1+1)
- `program-badge-eu` — gold (UE / GIZ)

**Recomandare delay reveal:** la fiecare card nou adaugă `--delay:Xms` în atributul `style`, incrementând cu 80ms (ex: 0, 80ms, 160ms, 240ms, 320ms, 400ms, 480ms ...).

> Adaugă programul nou și în footer la coloana **Programe**, și în `<!-- Coloana programe -->`.

---

## SEO — ce e deja configurat

Site-ul are deja optimizări SEO solide implementate:

### Tehnic on-page
- ✅ Title + meta description optimizate (152 caractere — pentru Google snippet)
- ✅ Canonical URL
- ✅ Geo-targeting Moldova (`geo.region`, `geo.placename`, `ICBM`)
- ✅ Open Graph + Twitter Card pentru share-uri pe social media
- ✅ `<main>` tag pentru conținutul principal (accessibility + SEO)
- ✅ Single `<h1>`, hierarchy `h2`/`h3` corect
- ✅ `lang="ro"` pe `<html>` (se schimbă dinamic la RU/EN)
- ✅ `hreflang` annotations pentru cele 3 limbi (RO/RU/EN + x-default)
- ✅ Google Search Console verification (preluat din site-ul vechi: `7s14EETKjkw...`)
- ✅ `robots.txt` în root cu sitemap declarat
- ✅ `sitemap.xml` în root cu hreflang per URL
- ✅ Favicon SVG vector (scalează perfect)
- ✅ Preconnect Google Fonts + DNS prefetch CDN-uri

### Structured data (JSON-LD)
6 schemas complete în `<head>`:
1. **Organization** — entitate principală cu logo, social URLs, contact point multi-lang
2. **ProfessionalService** — local SEO cu adresă, geo-coordonate, hasOfferCatalog (verificare gratuită + dosar complet)
3. **WebSite** — pentru sitelinks searchbox în Google
4. **BreadcrumbList** — navigation hierarchy
5. **HowTo** — cei 4 pași pentru obținerea grantului (poate apărea ca rich result)
6. **FAQPage** — cele 5 întrebări (eligibile pentru rich snippets în SERP)

Toate testabile la **search.google.com/test/rich-results** după deploy.

---

## SEO — checklist post-launch

După ce site-ul e live pe nextgrant.md:

### Săptămâna 1
- [ ] **Verifică în Search Console** (search.google.com/search-console) că proprietatea e activă cu codul `7s14EETKjkw...`. Site-ul vechi era deja indexat — Google va detecta versiunea nouă automat.
- [ ] **Submit sitemap.xml** manual în GSC: Site Map → Add a new sitemap → `https://nextgrant.md/sitemap.xml`
- [ ] **Test Rich Results** la [search.google.com/test/rich-results](https://search.google.com/test/rich-results) cu URL-ul `nextgrant.md` — ar trebui să vezi: Organization, FAQ, HowTo, BreadcrumbList. Dacă apar erori, raportează-le.
- [ ] **Test Mobile-Friendly** la [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly) — ar trebui să fie pass.
- [ ] **Test PageSpeed** la [pagespeed.web.dev](https://pagespeed.web.dev/) — țintă: 90+ pe Performance + Accessibility + SEO.
- [ ] **Generează `apple-touch-icon.png`** (180×180) și `og-image.jpg` (1200×630) — vezi secțiunea Favicon mai jos.
- [ ] **Înregistrează la Bing Webmaster Tools** (bing.com/webmasters) — submit sitemap aici și.

### Săptămâna 2-4
- [ ] **Setează Google Business Profile** (google.com/business) — pin pe Calea Moșilor 28, Chișinău. Telefon, ore, foto exterior. **Crucial pentru "consultanță granturi Chișinău"**.
- [ ] **Adaugă-te în directoare locale Moldova**: 999.md, kompass.md, allmoldova.md, moldova.md, business-moldova.md. NAP consistent (Name-Address-Phone identic).
- [ ] **Optimizează profilurile Facebook + Instagram**: link la nextgrant.md în bio, descriere completă, locație, ore.
- [ ] **Cere primii 3-5 clienți** să lase Google reviews pe Google Business. Fiecare review e ranking signal local.

### Lunile 2-6 (long term)
- [ ] **Conținut blog** — pe partea opusă a single-page-ului poți adăuga articole tip "Cum aplici la grantul ODA pas cu pas", "Greșeli frecvente în dosar Programul 373" etc. Lunile 3-6 e momentul când long-tail-ul aduce trafic real.
- [ ] **Backlinks din presă locală**: bizlaw.md, bani.md, mold-street.com — pitch-uri presă cu unghiuri (cazuri de succes, statistici granturi).
- [ ] **Schema Review/AggregateRating** după ce ai testimoniale verificabile (cere clienților Google reviews pentru a putea pune și schema cu rating).

---

## Configurări critice rămase (de făcut tu, manual)

### 1. Open Graph image (`og-image.jpg`)

Pentru share-uri pe Facebook/LinkedIn/WhatsApp ai nevoie de o imagine 1200×630 px.
**Tool gratuit**: [canva.com](https://canva.com) — folder "Social Media" → "Facebook Cover" → 1200×630.

Conținut sugerat:
- Logo NextGrant pe stânga
- Text mare: "Granturi nerambursabile pentru IMM-uri Moldova"
- Cifre cheie: "Până la 3M lei • Răspuns în 24h"
- Background navy + accent gold

Salvezi ca `og-image.jpg`, urci în root.

### 2. Favicon PNG-uri (opționale dar recomandate)

`favicon.svg` deja merge pentru 99% din browsere. Pentru iOS home screen + browsere legacy:
- **`apple-touch-icon.png`** — 180×180 px
- **`favicon-32.png`** — 32×32 px

Tool care le face automat din SVG: [realfavicongenerator.net](https://realfavicongenerator.net) sau [favicon.io](https://favicon.io/favicon-converter).

### 3. SSL/HTTPS pe TopHost

Asigură-te că ai certificat SSL activ (Let's Encrypt e gratuit pe TopHost cPanel) și că **forțezi HTTPS** prin .htaccess:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirecționare www → non-www (pentru consistență cu canonical)
RewriteCond %{HTTP_HOST} ^www\.nextgrant\.md$ [NC]
RewriteRule ^ https://nextgrant.md%{REQUEST_URI} [L,R=301]
```

Pune în `.htaccess` din public_html.

---

## Animații și accesibilitate

- Toate animațiile respectă **`prefers-reduced-motion`** — utilizatorii cu setarea activată văd toate elementele instantaneu.
- Particulele canvas se opresc automat când tab-ul nu e activ.
- Cursor custom apare doar pe desktop (mouse), niciodată pe touch.
- Toate butoanele și link-urile au `:focus-visible` cu outline gold pentru navigare cu tastatura.

## Compatibilitate browsere

- Chrome / Edge — toate versiunile recente
- Firefox — toate versiunile recente
- Safari (macOS / iOS 15+) — toate funcționalitățile
- Samsung Internet — testat OK

## Performanță

- **First Contentful Paint** ținta < 1.5s pe mobile 4G
- **Lighthouse Performance** ținta > 90
- Tailwind via CDN (acceptabil pentru un single-page; pentru optimizare maximă pe long-term, poți compila Tailwind local și exporta CSS minim)

---

## Contact tehnic

Pentru orice modificare majoră, păstrează această structură simplă: **un singur HTML + un singur CSS + un singur JS**. Asta e ce face site-ul rapid și ușor de întreținut pe TopHost.

---

© 2026 NextGrant SRL · Chișinău, Republica Moldova 🇲🇩
