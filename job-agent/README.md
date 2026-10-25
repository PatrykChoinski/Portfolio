# Radar kariery — lokalny asystent aplikacji

Uruchom `npm run jobs`, następnie otwórz http://127.0.0.1:4318. Panel działa osobno od publicznego portfolio. Katalog `job-agent` nie jest kopiowany do publikowanego portfolio. Pobieranie aktualnego polskiego CV z portfolio jest dostępne w panelu.

Proces musi pozostać uruchomiony, aby sprawdzać wybrane źródła co godzinę. Pierwsze sprawdzenie uruchom przyciskiem. Nie zainstalowano zadania systemowego. Przycisk obejmuje tylko źródła zaznaczone i zapisane w ustawieniach.

## Prywatne dane

Dane są zapisywane atomowo w `%USERPROFILE%/.portfolio-job-agent/state.json`, poza repozytorium. Można zmienić katalog przez `JOB_AGENT_HOME` i port przez `JOB_AGENT_PORT`. Nie uruchamiaj dwóch procesów z tym samym katalogiem danych. Eksport historii zawiera prywatne informacje o poszukiwaniu pracy. Narzędzie nie przechowuje haseł ani cookies przeglądarki.

## Kryteria

Minimum 15 000 PLN **brutto miesięcznie na umowie o pracę**, dolna granica widełek. B2B, netto, waluty obce i nieznane widełki wymagają weryfikacji. Maksymalnie 100 km w linii prostej od centrum Warszawy (52.2297, 21.0122), nie odległość drogowa. Nieznane współrzędne również wymagają weryfikacji. Kryteria można zaostrzać w panelu.

Ocena kompetencji to dopasowanie słów kluczowych do udokumentowanych obszarów PLC/HMI/SCADA/motion, z dodatkowym sprawdzeniem kontekstu automatyki przemysłowej. Samo słowo „motion” albo automatyzacja procesów finansowych nie wystarczają. Jawna lista wymaganych umiejętności (obecnie dostępna w adapterze No Fluff Jobs) jest porównywana z kompetencjami z CV. Brak potwierdzenia choćby jednej pozycji kieruje ofertę do weryfikacji. Rozpoznawane są dokładne nazwy i wybrane równoważne zapisy, np. NodeJS/Node.js; Java nie jest uznawana za JavaScript. To nadal filtr wstępny, nie pełna ocena wymagań opisanych wyłącznie swobodnym tekstem. Oferty wygasłe są blokowane.

W szczegółach oferty można uzupełnić potwierdzone widełki brutto UoP i współrzędne. Wymagane jest wskazanie podstawy potwierdzenia. Nowa treść pobrana ze źródła lub potwierdzenie starsze niż 7 dni wymusza ponowną weryfikację. Narzędzie nie zgaduje współrzędnych na podstawie nazwy miasta i nie uznaje FULL_TIME w danych strukturalnych za dowód UoP ani wynagrodzenia brutto.

## Portale użytkownika

| Portal | Odczyt ofert przez lokalny serwer | Aplikowanie i konto |
| --- | --- | --- |
| Pracuj.pl | Wyszukiwanie „automatyk, Warszawa”; w sprawdzeniu na żywo HTTP 403 | Wymaga przeglądarki i konta; brak automatycznego adaptera wysyłki |
| RocketJobs | Kategoria automatyka, widoczne strony „Następna”, do 10 stron i 500 szczegółów | Lokalna wysyłka rozpoznanym formularzem bez konta; dodatkowe wymagania zatrzymują wysyłkę |
| No Fluff Jobs | Kategoria automatyka, pierwsza strona; jawne widełki brutto UoP, współrzędne i wymagania bieżącej oferty | Wymaga formularza portalu; brak automatycznego adaptera wysyłki |
| Aplikuj.pl | Wyszukiwanie automatyk w Warszawie, widoczne strony „Następna”, do 10 stron i 500 szczegółów; zawiera też reklamy innych zawodów; jawne widełki brutto miesięcznie na UoP | Wymaga formularza portalu; brak automatycznego adaptera wysyłki |
| LinkedIn | Obsługa przez zalogowaną przeglądarkę, bez adaptera serwerowego | Wymaga aktywnej sesji; istniejącego profilu nie należy dublować |
| Jooble | Brak adaptera; API agregatora wymaga osobnego klucza | Konto kandydata nie jest kluczem API; oferty mogą przekierowywać do innych portali |

Adaptery odczytują odnośniki i dane strukturalne JobPosting dostępne w HTML. Nie wykonują kodu strony i nie obchodzą zabezpieczeń. Raportują rzeczywisty zakres odczytu oraz błędy szczegółów. Paginacja podąża wyłącznie za odnośnikami z odwiedzonych stron, z wykrywaniem pętli. Nie zgaduje adresów kolejnych stron. Domyślne limity to 10 stron i 500 szczegółów na źródło; limit, błąd kolejnej strony lub przycisk dynamicznego doładowania oznaczają niepełny odczyt. No Fluff Jobs doładowuje kolejne oferty w przeglądarce, więc jego publiczny odczyt pozostaje ograniczony. Nie jest to pełne przeszukiwanie wszystkich ofert każdego portalu. Zmiana układu strony może wymagać aktualizacji adaptera. Nieukończony odczyt szczegółów nie jest liczony jako odnaleziona oferta. Limity można ustawić w definicji źródła jako maxPages (1–100) i maxDetails (1–5000); panel zachowuje ustawienia domyślne. Kod HTTP 403 i wyzwania bezpieczeństwa wymagają obsługi w przeglądarce.

Sekcja kont przechowuje ręcznie potwierdzony stan i czas sprawdzenia. Zmiana statusu w panelu **nie zakłada konta i nie loguje** na portalu. Nowe hasło, akceptację regulaminu oraz potwierdzenie adresu wykonuje użytkownik w przygotowanej karcie portalu. Haseł nie należy przesyłać przez czat.

Dodatkowo działa adapter publicznej tablicy Greenhouse konkretnego pracodawcy. Greenhouse jest systemem rekrutacyjnym firm, nie portalem wymagającym osobnego konta kandydata. Identyfikatory tablic można opcjonalnie wpisać w ustawieniach.

## Import

Import JSON: tablica ofert lub obiekt `{ "jobs": [...] }`. Poniżej wyłącznie przykład schematu, nie rzeczywista oferta:

```json
[{"title":"Programista PLC","company":"Firma z branży automatyki","url":"https://example.com/jobs/123","description":"PLC, HMI, SCADA","location":"Warszawa","latitude":52.2297,"longitude":21.0122,"salary":{"min":15000,"max":18000,"currency":"PLN","basis":"gross","period":"month","contract":"employment"}}]
```

## Wysyłka i historia

Przycisk „Przygotuj / aplikuj” generuje treść opartą na CV. Bez dostępnej integracji zapisuje **przygotowanie**, nie wysłanie. Otwórz ofertę, wypełnij formularz i potwierdź ręczne wysłanie w panelu. Rozmowy i odrzucenia rejestruje użytkownik; panel nie odczytuje odpowiedzi rekruterów.

Automatyczna wysyłka przez API jest zaimplementowana dla Greenhouse z uprawnionym kluczem API pracodawcy w zmiennej środowiskowej `GREENHOUSE_KEY_IDENTYFIKATOR_TABLICY` (myślniki zastąp podkreśleniami, wielkie litery). Typowe konto kandydata nie posiada tego klucza. Kluczy nie umieszczaj w repozytorium. Dokumentacja: https://docs.greenhouse.io/job-board. Wysyłany jest tekst CV z profilu, doświadczenia i kompetencji oraz treść aplikacji; nie jest wysyłany eksperymentalny rankingowy prompt z publicznego CV. Nie jest dołączany PDF. Formularze wymagające PDF, dodatkowych odpowiedzi lub zgód wymagają ręcznego uzupełnienia.

Automatyzacja domyślnie wyłączona. Po włączeniu obejmuje nowe kwalifikujące się oferty podczas skanowania. Po utracie potwierdzenia lub przerwaniu procesu status „Sprawdź potwierdzenie” blokuje automatyczne ponowienie. Potwierdzone wysłanie wymaga odpowiedzi API `success: true`. Nie wykonano rzeczywistych wysyłek w testach.

Historia działań podaje czas w strefie Europe/Warsaw; zapis źródłowy używa UTC. Statystyki pokazują aktualny etap ofert, a historia przechowuje wszystkie zmiany. Nie jest to jeszcze kompletna automatyzacja aplikowania na sześciu portalach.

Wysyłka wykonana przez asystenta w przeglądarce jest zapisywana osobno jako „Wysłana · przeglądarka”, z tekstem potwierdzenia portalu, adresem oferty, nazwą CV i czasem zarejestrowania potwierdzenia. Sam przycisk „Aplikuj” bez potwierdzenia nie wystarcza. Powtórne zapisanie tego samego potwierdzenia jest blokowane. Publiczne API nie jest używane do zgadywania sukcesu wysyłki z przeglądarki.

Automatyczny odczyt widełek UoP uznaje tylko jednoznaczny zapis zakresu z etykietą „PLN Brutto miesięcznie – UoP”. Odróżnia go od osobnych kwot netto B2B i nie bierze widełek z sekcji podobnych ofert. Sprzeczne zakresy pozostają do weryfikacji. Samo salary w JobPosting nadal nie potwierdza brutto ani UoP.

Dla RocketJobs odczytywane są też współrzędne z publicznych danych strony, wyłącznie gdy identyfikator oferty oraz miasto są zgodne z aktualnym ogłoszeniem i istnieje jedna jednoznaczna para współrzędnych. Współrzędne podobnych ofert są pomijane. Kod dekoduje JSON bez uruchamiania skryptów strony. Brak jednoznacznego wyniku nadal wymaga weryfikacji lokalizacji.

## Lokalna wysyłka RocketJobs

Obsługa formularza bez konta jest zaimplementowana w rocket-apply.mjs i podłączona do przycisku „Przygotuj / aplikuj” oraz opcji automatycznego aplikowania. Własna przeglądarka działa w tle, bez korzystania z cookies, haseł ani profilu przeglądarki użytkownika. Kod wykorzystuje zainstalowaną przeglądarkę Edge lub przeglądarkę Playwright. Nie stosuje trybu ukrywania automatyzacji ani obchodzenia CAPTCHA.

Przed wysyłką ponownie sprawdza stronę oferty: zgodność pracodawcy i stanowiska, aktualne widełki brutto UoP, współrzędne oraz wymagania ustawione w panelu. Wgrywa aktualny PDF z portfolio i wiadomość opartą na profilu z aktualnym minimum płacowym. Nie zaznacza rejestracji konta ani marketingu. Wymagane dodatkowe pytania, regulaminy lub widoczna CAPTCHA dają status do ręcznej obsługi.

Zamiar wysłania jest zapisywany przed kliknięciem, aby przerwanie procesu nie spowodowało ponowienia. Sukces wymaga komunikatu o wysłaniu do tego samego pracodawcy. Brak potwierdzenia daje status niepewny i blokuje automatyczne ponowienie. Rejestrowane są nazwa CV, jego SHA-256 oraz — jeśli zapis jest możliwy — zrzut ekranu w prywatnym katalogu evidence obok state.json.

Mechanizm przetestowano na lokalnych formularzach: poprawna wysyłka, wyłączone opcjonalne zgody, wymagany regulamin, dodatkowe pytania i brak potwierdzenia. Nie wykonano nim nowej rzeczywistej wysyłki; wcześniejsza aplikacja w historii została wysłana przez asystenta w przeglądarce. Nie oznacza to jeszcze zweryfikowanej produkcyjnie automatyzacji wszystkich sześciu portali.

No Fluff Jobs: odczyt lokalizacji i wymagań z publicznego JSON serverApp-state wymaga zgodności identyfikatora bieżącej oferty. Dane polecanych ofert nie są używane do ustalania lokalizacji. Widełki są potwierdzane wyłącznie jawnym oznaczeniem brutto miesięcznie (UoP) w treści strony.
