# Radar kariery — lokalny asystent aplikacji

Uruchom `npm run jobs`, następnie otwórz http://127.0.0.1:4318. Panel działa osobno od publicznego portfolio; katalog `job-agent` nie jest kopiowany do jego publikowanej wersji. Proces musi pozostać uruchomiony, aby sprawdzać źródła co godzinę. Pierwsze sprawdzenie uruchom przyciskiem. Nie zainstalowano zadania systemowego.

Dane są zapisywane atomowo w `%USERPROFILE%/.portfolio-job-agent/state.json`, poza repozytorium. Można zmienić katalog przez `JOB_AGENT_HOME` i port przez `JOB_AGENT_PORT`. Nie uruchamiaj dwóch procesów z tym samym katalogiem danych. Eksport historii zawiera prywatne informacje o poszukiwaniu pracy.

## Kryteria

Minimum 15 000 PLN **brutto miesięcznie na umowie o pracę**, dolna granica widełek. B2B, netto, waluty obce i nieznane widełki wymagają weryfikacji. Maksymalnie 100 km w linii prostej od centrum Warszawy (52.2297, 21.0122), nie odległość drogowa. Nieznane współrzędne również wymagają weryfikacji. Kryteria można zaostrzać w panelu. Ocena kompetencji jest prostym dopasowaniem słów kluczowych do udokumentowanych obszarów PLC/HMI/SCADA/motion; nie potwierdza spełnienia wszystkich wymagań oferty.

## Źródła i ograniczenia

Aktywny adapter: publiczne tablice Greenhouse konkretnych pracodawców. Wprowadź ich identyfikatory z adresów tablic. API Greenhouse zwykle nie zawiera widełek i współrzędnych — takie oferty pozostają do weryfikacji. Aktualizacja przez import tego samego URL pozwala uzupełnić zweryfikowane dane. Brak integracji z Pracuj.pl, LinkedIn, Indeed, OLX, No Fluff Jobs i Just Join IT; narzędzie nie przeszukuje wszystkich portali. Brak automatycznego logowania, odczytu poczty, obchodzenia CAPTCHA i odczytu odpowiedzi rekruterów.

Import JSON: tablica ofert lub obiekt `{ "jobs": [...] }`. Poniżej wyłącznie przykład schematu, nie rzeczywista oferta:

```json
[{"title":"Programista PLC","company":"Firma z branży automatyki","url":"https://example.com/jobs/123","description":"PLC, HMI, SCADA","location":"Warszawa","latitude":52.2297,"longitude":21.0122,"salary":{"min":15000,"max":18000,"currency":"PLN","basis":"gross","period":"month","contract":"employment"}}]
```

## Wysyłka

Przycisk „Przygotuj / aplikuj” generuje treść opartą na CV; bez dostępnej integracji zapisuje **przygotowanie**, nie wysłanie. Otwórz ofertę i wypełnij formularz, a następnie potwierdź ręczne wysłanie w panelu. Rozmowy i odrzucenia rejestruje użytkownik; panel nie zgaduje odpowiedzi.

Automatyczna wysyłka jest zaimplementowana wyłącznie dla Greenhouse z uprawnionym kluczem API pracodawcy w zmiennej środowiskowej `GREENHOUSE_KEY_IDENTYFIKATOR_TABLICY` (myślniki zastąp podkreśleniami, wielkie litery). Typowe konto kandydata nie posiada tego klucza. Kluczy nie umieszczaj w repozytorium. API opisano w https://docs.greenhouse.io/job-board. Wysyłany jest tekst CV z profilu i doświadczenia oraz treść aplikacji; nie jest wysyłany eksperymentalny rankingowy prompt z CV. Nie jest dołączany PDF. Formularze wymagające PDF, dodatkowych odpowiedzi lub zgód muszą być uzupełnione ręcznie.

Automatyzacja domyślnie wyłączona. Po włączeniu obejmuje nowe, kwalifikujące się oferty podczas skanowania, nie istniejące pozycje oznaczone jako przygotowane. Po utracie potwierdzenia lub przerwaniu procesu status „Sprawdź potwierdzenie” blokuje automatyczne ponowienie. Potwierdzone wysłanie wymaga odpowiedzi API `success: true`. Nie wykonano rzeczywistych wysyłek w testach.

Historia podaje czas w strefie Europe/Warsaw; zapis źródłowy używa UTC. Statystyki pokazują aktualny etap ofert, a historia przechowuje wszystkie zmiany.
