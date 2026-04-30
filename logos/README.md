# Logo-uri clienți (trust strip)

Pune aici logo-urile celor 3 companii care apar în secțiunea **"Au lucrat cu noi"** de pe homepage.

## Fișiere așteptate

| Fișier | Companie | Site |
|---|---|---|
| `alfa-nistru.png` | Alfa Nistru | [alfa-nistru.md](https://www.alfa-nistru.md) |
| `echarge-moldova.png` | eCharge Moldova | [echarge.md](https://www.echarge.md) |
| `inter-dent.png` | Inter Dent | [interdent.md](https://www.interdent.md) |

## Specificații tehnice

- **Format**: PNG cu fond **transparent** (preferabil) sau JPG cu fond alb
  - Dacă ai SVG curat, poți folosi `.svg` în loc — mai bun pentru rezoluție
- **Dimensiuni**: orientare orizontală, ~400×120 px (raportul important e ~3:1 sau ~4:1)
  - Site-ul afișează la max 48px înălțime, deci minimum 96px înălțime sursă pentru retina
- **Greutate**: max 30 KB per fișier (folosește [tinypng.com](https://tinypng.com) pentru compresie)
- **Fundal**: transparent — pe site-ul nostru fondul e cremos (`#FAFAF7`)
- **Culoare**: oricare e logo-ul oficial; site-ul îl afișează implicit grayscale + 60% opacity, full color pe hover

## Cum încarci pe GitHub

1. Mergi la [github.com/Mihaimike/NextGrant-test](https://github.com/Mihaimike/NextGrant-test)
2. Navighezi în folderul `logos/`
3. Add file → Upload files → trage cele 3 PNG-uri
4. Commit changes
5. Așteaptă 1-2 min, hard refresh la site → logo-urile apar automat

## Cum arată dacă fișierele lipsesc

Dacă un fișier nu există (404), site-ul afișează automat un **fallback elegant**:
cerc navy cu inițialele (AN, eC, PD) lângă numele companiei. Nu se rupe nimic.
Asta-i starea actuală până încarci PNG-urile reale.

## SVG vector (alternativă superioară)

Dacă obții logo-uri SVG (din kit de brand al companiei), schimbă referința în
`index.html` — secțiunea trust strip — de la `.png` la `.svg`. SVG-urile scalează
perfect pe orice ecran fără pierdere de calitate și sunt și mai mici ca KB.

Exemplu:
```html
<img src="logos/alfa-nistru.svg" alt="Alfa Nistru — logo" />
```
