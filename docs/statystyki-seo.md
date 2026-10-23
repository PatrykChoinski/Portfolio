# Statystyki i SEO

## Co jest podłączone

`src/data.mjs` → `site` zawiera publiczny identyfikator strumienia Google Analytics 4 i metatag weryfikacji Search Console, odczytane z konta właściciela 23.10.2026. Nie są to hasła ani klucze API. Surowe raporty, dane odwiedzających i dane logowania nie trafiają do repozytorium.

Pomiar działa wyłącznie na produkcyjnym adresie portfolio i dopiero po zgodzie. Podgląd lokalny nie jest zliczany. Odmowa nie blokuje strony. Zgodę można cofnąć przez przycisk w stopce; strona wyłącza pomiar i usuwa cookie Analytics. Dane historyczne sprzed instalacji nie są dostępne.

Panel właściciela: `/statystyki.html`. To zestaw skrótów do prywatnych raportów w Google, bez publikowania liczb ani tworzenia fikcyjnego licznika. `/prywatnosc.html` opisuje pomiar i wybór odwiedzającego. Obie strony mają `noindex`.

## Zakres raportów

- GA4: użytkownicy, nowi/powracający, sesje, wyświetlenia, czas zaangażowania, źródła ruchu i kampanie UTM, kraje/regiony, typy urządzeń, przeglądarki i systemy operacyjne.
- Zdarzenia: `page_view`, `section_view`, `scroll_depth`, `project_open`, `project_filter`, `project_search`, `cv_download`, `cv_preview`, `contact_click`, `demo_start`, `video_start`, `scada_interaction`, `outbound_click`, `web_vital`.
- Prywatność zdarzeń: bez wpisanego hasła wyszukiwania, e-maila, telefonu i pełnych zewnętrznych URL-i; `page_location` to kanoniczny URL, referrer ograniczony do domeny. UTM przyjmuje tylko ograniczone identyfikatory kampanii. Google Signals i personalizacja reklam są wyłączone w konfiguracji tagu.
- Web Vitals: LCP, INP, CLS, FCP, TTFB z biblioteki Google `web-vitals`. Każdy typ raportowany jest, gdy przeglądarka ma wystarczające dane (np. INP wymaga interakcji). Nie każda wizyta musi dostarczyć wszystkich metryk.
- Search Console: kliknięcia i wyświetlenia w Google, frazy wyszukiwania, CTR, średnia pozycja, indeksowanie i mapy witryny. Wymaga weryfikacji po opublikowaniu metatagu.

Nie są zbierane reklamy, demografia oparta na Google Signals ani nagrania sesji. Liczba zmierzonych użytkowników uwzględnia tylko osoby wyrażające zgodę i nieblokujące Analytics. Statystyki SEO nie są liczbą odwiedzin całego internetu i nie gwarantują pozycji w Google.

## Ustawienia w Google

1. Po publikacji potwierdź strumień `G-9LDN9QT3BG` w Analytics i wyświetlenia w raporcie czasu rzeczywistego po zgodzie na stronie.
2. W Analytics → Administracja → Zdarzenia oznacz `cv_download` i `contact_click` jako kluczowe zdarzenia. Będą widoczne po pierwszym wystąpieniu; można też utworzyć je po nazwie.
3. Administracja → Definicje niestandardowe: wymiary o zakresie Zdarzenie dla parametrów `section_id`, `project_id`, `category`, `contact_method`, `demo_name`, `percent_scrolled`, `metric_name`, `metric_rating`. Wskaźnik niestandardowy `metric_value` (liczba) pokazuje wartość Web Vitals; filtruj go po `metric_name`, ponieważ CLS jest bez jednostki, pozostałe metryki w ms. Nie rejestruj `metric_id` jako wymiaru (duża liczba unikalnych wartości).
4. Strumień → Pomiar zaawansowany: wyłącz automatyczne wyświetlenia po zmianach historii, jeśli zostaną włączone. Ten portfolio mierzy jedno otwarcie dokumentu, a sekcje osobno jako `section_view`. Automatyczne zdarzenia Google np. `file_download` są osobne od własnego `cv_download`; nie należy sumować ich jako jednego wyniku.
5. Search Console → prefiks `https://patrykchoinski.github.io/Portfolio/` → weryfikacja tagiem HTML. Dopiero po deploymentcie kod jest widoczny dla Google. Następnie zgłoś `https://patrykchoinski.github.io/Portfolio/sitemap.xml`.
6. Po potwierdzeniu obu usług można powiązać Search Console z GA4 w ustawieniach integracji.

## SEO techniczne

Build generuje metadane canonical, Open Graph, kartę Twitter i JSON-LD ProfilePage/Person z danych portfolio. Buduje mapę witryny i HTML zawierający projekty oraz kompetencje przed uruchomieniem JavaScript. Skrypt klienta uzupełnia interakcje bez duplikowania sekcji. Nagłówek menu jest przyklejony, a portret zachowuje pełny kwadratowy kadr; podpisy znajdują się pod zdjęciem.

`robots.txt` powstaje w katalogu projektu. Na GitHub Pages plik `/Portfolio/robots.txt` nie zastępuje pliku robots domeny `/robots.txt`; podstawą jest poprawna mapa i jej zgłoszenie w Search Console. Nie dodano losowych dat modyfikacji ani sfabrykowanych ocen, recenzji lub danych o ruchu.

## Weryfikacja

`npm test`, `npm run cv`, `npm run build`, `npm run test:e2e`. Testy sprawdzają zgodę i wycofanie zgody, jeden pageview, brak danych kontaktowych i treści wyszukiwania w zdarzeniach, zdarzenia CV/kontaktu/projektów, wyłączenie localhost, treść bez JS, metadane, mapę, kolejność sekcji, portret bez kadrowania i przyklejone menu na telefonie oraz komputerze. Google tag jest w testach zastępowany, aby nie wysyłać sztucznego ruchu na prawdziwe konto.

## Ustawienia konta wykonane 23.10.2026

Na koncie właściciela w usłudze Portfolio (560519935) zapisano osiem wymiarów zdarzeń: section_id, project_id, contact_method, demo_name, category, percent_scrolled, metric_name, metric_rating. Zapisano wskaźnik metric_value jako Standard, z opisem jednostek. Zdarzenia cv_download i contact_click utworzono z kodem i oznaczono jako kluczowe, bez wartości pieniężnej, z liczeniem raz na zdarzenie. Potwierdzono ich obecność w tabeli kluczowych zdarzeń.

W pomiarze zaawansowanym wyłączono wyświetlenia po zmianie historii oraz automatyczne przewijanie, kliknięcia, wyszukiwania, formularze, filmy i pobrania. Odpowiadające interakcje mierzy kod portfolio, bez przesyłania niepotrzebnych treści i bez zdublowanych zdarzeń. Wbudowane zdarzenia sesji i zaangażowania GA4 nadal zapewnia sam tag. Zmiany potwierdzono w interfejsie Google, bez tworzenia sztucznego ruchu w testach.

Po publikacji należy potwierdzić odbiór ruchu, zweryfikować Search Console metatagiem i zgłosić mapę witryny. Stan kodu źródłowego sam w sobie nie jest potwierdzeniem działania produkcyjnego pomiaru.

CI: test prywatności sprawdza dokładny kształt zdarzeń kontaktowych zamiast wyszukiwania trzech cyfr mogących wystąpić w identyfikatorze pomiaru. Testy uruchamia oficjalny obraz mcr.microsoft.com/playwright:v1.64.1-noble z gotowymi zależnościami. Wersja @playwright/test jest przypięta do 1.64.1 i musi odpowiadać obrazowi przy aktualizacji. Wszystkie dotychczasowe etapy testów, generowania CV i budowania strony pozostają wymagane.

Sekcja GitHub: własny widget zgodny z kolorystyką portfolio, bez zewnętrznego generatora kart. Kalendarz i jego suma pochodzą z publicznego https://github.com/users/PatrykChoinski/contributions, liczba publicznych repozytoriów z GitHub REST API. Ostatnie commity pobierane są z wybranych publicznych repozytoriów autora (tylko SHA, data, przyjazny tytuł projektu i link; bez nazw klientów i treści wiadomości commitów). Dane odświeżają się przy publikacji, data stanu jest widoczna. Przy awarii API wykorzystywana jest zapisana, datowana kopia danych. Aktywności GitHuba nie opisano jako godzin ani łącznej liczby commitów; kalendarz obejmuje także inne typy aktywności, a niewidoczna praca nie jest liczona. Tokeny i prywatne dane nie są wymagane.
