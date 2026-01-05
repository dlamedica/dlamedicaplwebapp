## Kontekst techniczny
- Stack: React 18 + Vite (`src/main.tsx`), SPA z własnym routerem pushState w `src/App.tsx`.
- Meta startowe tylko w `index.html` (statyczne). Dynamiczne meta użyte wyłącznie w `src/components/pages/ShopPage.tsx`, `EbookDetailPage.tsx`, `JobOfferDetailPage.tsx` (przez `src/utils/seo.ts`).
- Sitemap: `public/sitemap.xml` zawiera tylko `/` i `/kalkulatory`. Robots: `public/robots.txt` pozwala na wszystko, bez wyłączeń dla sekcji gry/symulator.
- Structured data: tylko Product (Ebook detail) via `generateProductStructuredData`; brak Article/FAQ/JobPosting/EducationalOrganization/BreadcrumbList.

## Główne luki SEO (techniczne)
- Brak kanonicznych linków i dynamicznych meta title/description dla większości tras (home, edukacja, artykuły, rankingi, oferty pracy – lista, wydarzenia, Mój pacjent, kalkulatory).
- Brak automatycznego zarządzania meta na zmianę trasy (SPA). `usePageTitle` nie jest używany.
- Ubożuchy sitemap/robots – brak większości URL, brak `noindex` dla elementów gry/symulatora.
- Brak BreadcrumbList i schema per typ strony (Article, JobPosting, EducationalOrganization, FAQPage, Offer/Review).
- Manualny router → brak SSR; konieczny prerender/SPA SEO hardening (meta injection + renderowanie treści dostępnych bez JS).

## Priorytety (High/Med/Low)
- High: centralny menedżer SEO wywoływany przy każdej zmianie trasy w `App.tsx`; dodanie `<link rel="canonical">`; rozszerzenie sitemap/robots; domyślne meta + JSON-LD dla typów stron; noindex dla ścieżek gry/symulatora.
- Med: BreadcrumbList + FAQPage tam, gdzie mamy FAQ; meta dla list (sklep, oferty pracy, wydarzenia, rankingi uczelni, edukacja).
- Low: A/B testy title/description na stronach z niskim CTR, rozbudowa alt tekstów, optymalizacja OG/Twitter.

## Wzorce meta (propozycje)
- Home: `title: "DlaMedica.pl – edukacja, sklep, praca, kalkulatory"`, `description: "Edukacja medyczna, sklep z ebookami i algorytmami, oferty pracy, kalkulatory i narzędzia dla medyków."`, `canonical: https://dlamedica.pl/`.
- Sklep lista (`/sklep`): `title: "Sklep medyczny – ebooki, algorytmy | DlaMedica"`, `description: "Ebooki, algorytmy i materiały dla lekarzy i studentów. Filtry po specjalizacji, promocje, bestsellery."`, `canonical: https://dlamedica.pl/sklep`.
- Produkt (`/sklep/ebook/{id}`): z danych ebooka; jeśli brak shortDescription, tnij `description` do ~155 znaków.
- Artykuł (docelowo `/artykuly/{slug}`): `title: "{Tytuł} | Artykuły medyczne DlaMedica"`, `description` z leadu, `canonical` na slug.
- Edukacja (`/edukacja` + `/edukacja/{przedmiot}`): title = "{Przedmiot} – notatki, pytania egzaminacyjne | DlaMedica", description = 150–160 znaków z tematów modułu.
- Rankingi uczelni (`/uczelnie/{slug}`): title = "{Nazwa uczelni} – ranking, kierunki | DlaMedica", description z kluczowych metryk.
- Oferty pracy lista (`/praca`): title = "Oferty pracy dla medyków | DlaMedica", description = "Aktualne oferty lekarz, pielęgniarka, fizjo, farmaceuta. Filtruj po lokalizacji i specjalizacji."
- Oferta pracy detail (`/praca/{slug}`): z danych oferty; CTA w opisie.
- Wydarzenia (`/wydarzenia/{slug}`): meta na bazie tytułu/terminu/lokalizacji.
- Mój pacjent (informacyjne): index; tryby gry/symulator: `noindex`.

## Wzorce nagłówków (H1–H3)
- Sklep lista: H1 "Sklep medyczny DlaMedica"; H2 sekcje: "Promocje", "Bestsellery", "Nowości", "Kategorie", "FAQ zakupowe".
- Produkt: H1 = tytuł; H2: "Opis", "Parametry", "Autor", "Opinie", "Powiązane produkty".
- Artykuł: H1 = tytuł; H2: 3–5 sekcji merytorycznych; H3: podpunkty i FAQ.
- Edukacja: H1 = przedmiot; H2: "Zakres", "Materiały", "Pytania egzaminacyjne", "Powiązane kalkulatory".
- Ranking uczelni: H1 = nazwa uczelni; H2: "Miejsca w rankingach", "Kierunki", "Wyniki LEK/LDEK", "Kontakt".
- Oferta pracy: H1 = stanowisko + lokalizacja; H2: "Opis roli", "Wymagania", "Oferujemy", "Lokalizacja", "Aplikuj".

## JSON-LD – szablony
- Product+Offer+AggregateRating dla `/sklep/ebook/{id}` (już jest, rozszerzyć o `sku`, `availability`, `priceValidUntil`).
- Article / BlogPosting + BreadcrumbList dla artykułów.
- JobPosting + BreadcrumbList dla `/praca/{slug}`.
- EducationalOrganization + BreadcrumbList dla `/uczelnie/{slug}` (ranking).
- FAQPage dla sekcji FAQ (sklep, artykuł, edukacja).

## Sitemap / Robots
- Zastąpić `public/sitemap.xml` generacją dynamiczną (script lub build step) z głównymi trasami SPA: `/`, `/sklep`, `/sklep/ebook/{id}`, `/praca`, `/praca/{slug}`, `/kalkulatory`, `/edukacja`, `/uczelnie`, `/uczelnie/{slug}`, `/wydarzenia`, `/wydarzenia/{slug}`, `/moj-pacjent` (informacyjne), `/faq`, `/kontakt`, `/polityka-prywatnosci`, `/regulamin`.
- `robots.txt`: dodać `Disallow` dla trybów gry/symulatora (np. `/moj-pacjent/symulator`, `/gry`, tryby flashcards w budowie), wskazać sitemap po aktualizacji.

## Propozycja implementacji (techniczne kroki)
1) Stworzyć centralny `seoConfig` + `applySeoForRoute(path, payload?)` w `src/utils/seo-manager.ts`:
   - mapowanie ścieżek → meta title/description/keywords/canonical,
   - opcjonalne generowanie JSON-LD per typ (Product, JobPosting, Article, EducationalOrganization, BreadcrumbList),
   - wywołanie w `App.tsx` w `handlePopState` (po ustawieniu `currentPage`/`jobOfferSlug`) oraz po `pushState` override.
2) Dodać helper `setCanonical(url)` w `src/utils/seo.ts` (użyty przez menedżer).
3) Uzupełnić `ShopPage` o BreadcrumbList + FAQPage JSON-LD (na bazie dostępnych sekcji) i rozszerzyć Product LD.
4) Dla `EbookDetailPage` dodać breadcrumbs (Sklep → Kategoria → Produkt) i uzupełnić Product LD o `sku`, `availability`, `priceValidUntil`, `offers.url`.
5) Dla `JobOfferDetailPage` dodać import `updateMetaTags` (bug) i wstrzyknąć JobPosting LD (title, description, datePosted, validThrough?, employmentType, hiringOrganization, jobLocation, baseSalary jeśli dostępne).
6) Dla `UniversitiesPage/UniversityDetailPage` dodać EducationalOrganization LD (name, address/geo jeżeli mamy dane w plikach) + canonicale.
7) Jeśli pojawią się artykuły z pełnym widokiem, dodać Article + FAQPage LD i sekcję PAA FAQ.
8) Build step: prosty generator sitemap (node script) używający mock danych (ebooki, jobOffers slugs, universities slugs, events slugs jeśli są) i zapis do `public/sitemap.xml`.

## Linkowanie wewnętrzne (kierunki)
- Sklep ↔ artykuły (tematyka produktu), ↔ edukacja (przedmioty pokrewne), ↔ kalkulatory (powiązane algorytmy).
- Artykuły ↔ produkty (ebook/algorytm), ↔ kursy/edukacja, ↔ rankingi uczelni (jeśli temat studiów), ↔ oferty pracy (specjalizacja).
- Oferty pracy ↔ artykuły poradnikowe (jak przygotować się), ↔ uczelnie/kursy (ścieżki rozwoju), ↔ kalkulatory (narzędzia w pracy).
- Rankingi uczelni ↔ kursy/edukacja ↔ artykuły rekrutacyjne ↔ oferty pracy dla absolwentów.
- Mój pacjent (informacyjne) ↔ artykuły/podstawy edukacyjne; tryby gry: bez link juice (noindex/nofollow).

## Core Web Vitals / UX (skrót)
- LCP: preloading hero assets, obrazki WebP, `loading="lazy"` dla list, krytyczny CSS dla above-the-fold w Home/Sklep.
- CLS: rezerwacja wymiarów kart/obrazów, stałe wysokości skeletonów, unikanie dynamicznego shiftu banerów.
- JS diet: code-splitting już jest (lazyPages) – dołożyć leniwe ładowanie ciężkich modułów (mapy uczelni, kalendarze szczepień).
- Cache: `Cache-Control` dla statycznych assets, preconnect do CDN obrazów.

## Lista zadań (skrót)
- High: dodać `seo-manager` i wywołanie w `App.tsx`; canonical tag helper; poprawić import w `JobOfferDetailPage`; zaktualizować sitemap/robots (noindex dla gier/symulatora).
- Med: dodać BreadcrumbList + FAQPage LD w sklep/FAQ; rozszerzyć Product LD; dodać JobPosting/EducationalOrganization LD.
- Low: content A/B testy meta; long-tail FAQ dla artykułów; alt dla obrazów w listach (produkty, oferty).


