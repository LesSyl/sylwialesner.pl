# Nazwa projektu

> Nowoczesna strona internetowa (portfolio / wizytówka web designera) z lekką, animowaną grafiką SVG w sekcji hero.

[Podgląd strony](/dist/img/fullpage_snapshot.webp) 



---

## Spis treści

- [O projekcie](#o-projekcie)
- [Funkcje](#funkcje)
- [Technologie](#technologie)
- [Struktura projektu](#struktura-projektu)
- [Animowana grafika w hero](#animowana-grafika-w-hero)
- [Dostępność i wydajność](#dostępność-i-wydajność)
- [Obsługiwane przeglądarki](#obsługiwane-przeglądarki)
- [Licencja](#licencja)
- [Autor](#autor)

---

## O projekcie

Jednostronicowa strona prezentująca usługi projektowania stron internetowych. Zawiera sekcje: hero, wprowadzenie, usługi, realizacje, proces współpracy, kontakt oraz stopkę. Całość jest responsywna (mobile first), a w sekcji hero znajduje się autorska, animowana wstęga linii wykonana w czystym SVG i JavaScript, bez żadnych bibliotek.

## Funkcje

- Responsywny układ (telefon, tablet, desktop), oparty na CSS Grid i Flexbox.
- Animowana wstęga linii SVG w hero: gładki ruch, efekt przekręcenia (3D) i cieniowanie głębi.
- Przewijany pas tekstowy (marquee) w CSS.
- Nawigacja z menu mobilnym i podświetlaniem nagłówka po przewinięciu.
- Link „Skip to content" dla użytkowników klawiatury.
- Fonty Inter hostowane lokalnie (`woff2`, `font-display: swap`).
- Szanuje ustawienie systemowe `prefers-reduced-motion`.

## Technologie

- **HTML5** - semantyczna struktura, **Kit** (`html/index.kit`)
- **Sass / SCSS** - modułowe style (`@use`), zmienne i mixiny
- **JavaScript** - vanilla, bez bibliotek
- **SVG** - animowana wstęga linii w hero
- **Gulp** - (`gulpfile.js`)
- **npm** - (`package.json`)
- **Inter** - font (SIL Open Font License)
- **Git** - kontrola wercji, GitHub

## Struktura projektu

```
.
├── dist/                  # pliki wynikowe (po zbudowaniu)
│   ├── css/
│   ├── fonts/
│   ├── img/
│   └── js/
├── html/
│   └── index.kit          # szablon Kit, z którego powstaje index.
├── src/                   # pliki źródłowe
│   ├── fonts/             # fonty Inter (woff2)
│   ├── img/               # obrazy
│   ├── js/
│   │   └── main.js        # menu, interakcje i animacja wstęgi SVG
│   └── sass/
│       ├── main.scss      # główny plik stylów
│       ├── _animations.scss
│       ├── _colors.scss
│       ├── _mixins.scss
│       └── _svg.scss      # style grafiki SVG w hero
├── .gitignore
├── gulpfile.js            # zadania Gulp (kompilacja, kopiowanie plików)
├── index.html
├── package.json
├── package-lock.json
├── polityka-prywatnosci.html
└── README.md

```

## Animowana grafika w hero

Wstęga linii jest rysowana w JavaScript na elemencie `<svg class="ribbon">`. Kształt wyznacza krzywa osi (`CENTER`), wzdłuż której płynie około 50 cienkich linii. W jednym miejscu wstęga wykonuje pół obrotu (skrzyżowanie linii), a pozostałe parametry sterują szerokością, efektem 3D i ruchem.


## Dostępność i wydajność

- Grafika ma `aria-hidden="true"` (jest tylko dekoracją).
- Przy `prefers-reduced-motion: reduce` rysowany jest jeden statyczny kadr, bez animacji.
- Animacja zatrzymuje się, gdy hero nie jest widoczne (`IntersectionObserver`).
- Brak zewnętrznych bibliotek i zależności w kodzie grafiki.
- Widoczny wskaźnik fokusu (`:focus-visible`) i link „Skip to content".

## Obsługiwane przeglądarki

Aktualne wersje Chrome, Edge, Firefox i Safari. Strona używa m.in. `clip-path`, `overflow-x: clip`, `svh` i `clamp()`.

## Licencja

Font Inter jest udostępniany na licencji [SIL Open Font License 1.1](https://openfontlicense.org/).

## Autor

Sylwia Lesner · [LinkedIn](https://www.linkedin.com/in/sylwia-k-lesner/) / sylwia.k.lesner@gmail.com
