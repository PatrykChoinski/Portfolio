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

Automatyka jest głównym obszarem portfolio: siedem grup kompetencji przemysłowych, osiem obszarów aplikacji oraz projekty PLC/HMI/motion na początku listy. Kompetencje IT mają osobną sekcję uzupełniającą. `src/data.mjs` zawiera też źródła zdjęć maszyn, portretu i logotypów. Pochodzenie materiałów opisuje `docs/materialy-wizualne.md`.

Sekcja „Aplikacje w działaniu” zawiera lokalny film WebM z rzeczywistej aplikacji Visu3D oraz przycisk osadzenia pełnego publicznego symulatora (wymaga internetu). Podgląd SCADA pokazuje syntetyczne dane procesowe, wybór 12 sygnałów, porównanie dwóch cykli, kursor czasu i eksport CSV. Nie łączy się z PLC ani bazą produkcyjną. Rozszerzone realizacje obejmują urządzenie do obsługi kanałów chłodzenia form i maszyny serii 4000: automat żaluzjowy oraz butelczarkę. SQL Server i PostgreSQL są wymienione jako używane bazy danych.

Nie publikować oryginalnego CV ani dokumentacji klientów. Oryginalne PDF-y i `.local/` są ignorowane przez Git. Opisy bazują na dokumentacji i CV; nie przypisują autorstwa na podstawie samej obecności repozytorium. Dokładny zakres indywidualnej odpowiedzialności wymaga potwierdzenia właściciela.

Aktualność stanowiska Field Application Engineer i publikację e-maila oraz telefonu właściciel potwierdził 23.10.2026. Wykształcenie i daty szkoleń pochodzą ze starego CV; ważności uprawnień nie zakłada się automatycznie. Przegląd objął projekty lokalne, publiczne repozytoria osobiste oraz 37 dostępnych repozytoriów powiązanego konta GitHub. Projektów z innym wskazanym autorem nie przypisano właścicielowi portfolio.

## Automatyczne wdrożenie

Workflow `.github/workflows/ci.yml`: testy po `push` do `main`, `pull_request` do `main` oraz ręcznie. Generuje CV, buduje stronę i sprawdza ją w Chromium. Deployment GitHub Pages następuje wyłącznie po sukcesie dla `main`; pull requesty nie publikują.

Repozytorium używa `main` jako domyślnej gałęzi, a GitHub Pages jest skonfigurowane z **Source: GitHub Actions**. Adres strony: `https://patrykchoinski.github.io/Portfolio/`.

Lokalny `git pull` nie jest zdarzeniem GitHub Actions. CI uruchamia pull request, push lub ręczne wywołanie w zakładce Actions.

Pierwszy push i uruchomienie publikacji wykonano na polecenie właściciela 23.10.2026. Kolejne pushe wymagają bezpośredniego polecenia użytkownika zgodnie z zasadami repozytorium.

## Statystyki i SEO

Integracja GA4 z wyborem odwiedzającego, zdarzenia CV/kontaktu/projektów, Web Vitals, metadane wyszukiwarki, mapa witryny i HTML czytelny bez JavaScript. Panel właściciela: /statystyki.html. Instrukcja podłączenia i zakres danych: docs/statystyki-seo.md. Lokalny podgląd nie jest zliczany. Przed pierwszym uruchomieniem zbuduj projekt.

## Równoległa publikacja na Hostido

Po udanym buildzie i testach workflow uruchamia niezależnie dwa zadania:
GitHub Pages oraz `deploy-hostido` dla https://patrykchoinski.eu/. Oba używają
tej samej wersji `dist/`; błąd jednego hostingu nie blokuje drugiego.
Pull requesty nie otrzymują danych FTP i niczego nie publikują.

W DirectAdmin przygotuj konto FTP typu „Niestandardowy”, ograniczone do
`/domains/patrykchoinski.eu/public_html/`. Względem tego konta witryna trafia
do `/`. Nie używaj konta mającego dostęp do całego hostingu.
W ustawieniach repozytorium → Secrets and variables → Actions dodaj:

- `HOSTIDO_FTP_USERNAME`: pełny login konta FTP.
- `HOSTIDO_FTP_PASSWORD`: hasło tego konta.

Serwer `host150631.hostido.net.pl`, port 21, jawny TLS/FTPS z weryfikacją certyfikatu.
Hasła nigdy nie są umieszczane w repozytorium ani w logach.
Uploader nadpisuje pliki z `dist/`, stronę główną wysyła na końcu i nie usuwa
pozostałych plików hostingu (np. certyfikatów w `.well-known`).
Brak sekretów powoduje błąd zadania Hostido; po ich uzupełnieniu ponów to zadanie.
Po transferze workflow sprawdza typ MIME JavaScript oraz w Chromium: filtry, szczegóły projektów, schemat sterowania, SCADA, osadzenie symulatora i filmu oraz oba CV. Konfiguracja `hosting/.htaccess` trafia do katalogu głównego strony na Hostido.
Dotychczasowy adres GitHub Pages pozostaje adresem kanonicznym; domena `.eu`
jest drugim miejscem publikacji. Analytics działa na obu adresach po zgodzie.

Hostido nie wysyła pełnego łańcucha CA dla FTPS. Plik
`scripts/certificates/hostido-intermediates.pem` zawiera publiczne certyfikaty
[YR1 i Root YR podpisany przez ISRG Root X1](https://letsencrypt.org/certificates/).
Uploader sprawdza ich podpisy względem wbudowanego magazynu zaufania Node.js
oraz okres ważności, a następnie używa ich do uzupełnienia łańcucha TLS.
Weryfikacja nazwy serwera i certyfikatu pozostaje włączona. Przy zmianie
łańcucha po stronie Hostido odśwież ten plik z oficjalnych źródeł Let's Encrypt.
