# Portfolio — Patryk Choiński

Responsywna strona po polsku: filtrowane realizacje, szczegóły projektów, kompetencje, historia zawodowa i automatycznie generowane CV PDF. JavaScript ES modules, Node.js 22+, Node Test Runner i Playwright.

## Uruchomienie lokalne

```powershell
npm ci
npx playwright install chromium
npm run cv
npm run build
npm run dev
```

Podgląd: http://127.0.0.1:4173. Serwer developerski obsługuje pliki lokalne. Wersja do hostowania: `dist/`.

## Testy

```powershell
npm test
npm run cv
npm run build
npm run test:e2e
```

Testy obejmują filtrowanie, spójność CV z treścią strony, anonimizację, szczegóły, nawigację mobilną i PDF. Testy przeglądarkowe uruchamiają własny serwer wersji produkcyjnej.

## Treść

`src/data.mjs` zawiera profil, kompetencje, projekty, doświadczenie i wykształcenie. `scripts/cv-template.mjs` definiuje układ CV. Przed budowaniem `npm run cv` odtwarza HTML i PDF.

Nie publikować oryginalnego CV ani dokumentacji klientów. Oryginalne PDF-y i `.local/` są ignorowane przez Git. Opisy bazują na dokumentacji i CV; nie przypisują autorstwa na podstawie samej obecności repozytorium. Dokładny zakres indywidualnej odpowiedzialności wymaga potwierdzenia właściciela.

Aktualność stanowiska Field Application Engineer i publikację e-maila oraz telefonu właściciel potwierdził 23.10.2026. Wykształcenie i daty szkoleń pochodzą ze starego CV; ważności uprawnień nie zakłada się automatycznie. Przegląd objął projekty lokalne, publiczne repozytoria osobiste oraz 37 dostępnych repozytoriów powiązanego konta GitHub. Projektów z innym wskazanym autorem nie przypisano właścicielowi portfolio.

## Automatyczne wdrożenie

Workflow `.github/workflows/ci.yml`: testy po `push` do `main`, `pull_request` do `main` oraz ręcznie. Generuje CV, buduje stronę i sprawdza ją w Chromium. Deployment GitHub Pages następuje wyłącznie po sukcesie dla `main`; pull requesty nie publikują.

Po autoryzowanym pierwszym pushu ustaw **Settings → Pages → Source: GitHub Actions** i `main` jako domyślną gałąź. Puste repo zdalne wskazywało `master`; lokalna gałąź `main` odpowiada wymaganiu użytkownika. Docelowy adres: `https://patrykchoinski.github.io/Portfolio/`.

Lokalny `git pull` nie jest zdarzeniem GitHub Actions. CI uruchamia pull request, push lub ręczne wywołanie w zakładce Actions.

**Nie wykonano pushu ani publikacji.** Commity pozostają lokalne.
