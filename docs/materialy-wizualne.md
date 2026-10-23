# Materiały wizualne

Zdjęcia maszyn służą jako materiały poglądowe do pokazania fizycznego kontekstu pracy. Nie są dowodem autorstwa sterowania konkretnego sfotografowanego egzemplarza. Nazwy klientów pozostają zanonimizowane w opisach. Odnośniki do materiałów źródłowych znajdują się przy zdjęciach.

- `public/images/patryk-choinski.jpg`: publiczne zdjęcie profilowe właściciela z GitHuba, profil https://github.com/PatrykChoinski, pobrane 23.10.2026.
- `public/images/stone-saw.webp`: fotografia piły mostowej z katalogu producenta. Pełny adres strony źródłowej zapisany w `machines` w `src/data.mjs`.
- `public/images/box-machine.png`: fotografia maszyny opakowaniowej z katalogu producenta; źródło w `machines`.
- `public/images/operator-panel.jpg`: fotografia panelu HMI z tego samego katalogu; źródło w `machines`.
- `public/logos/codesys.png` i `diadesigner-ax.png`: oryginalne ikony aplikacji wyodrębnione z lokalnie zainstalowanych programów. Bez modyfikacji wzoru znaku.
- `public/logos/nodejs.svg`, `nodered.svg`: oficjalne zasoby projektów, odnośniki w `technologyLogos`.
- Pozostałe SVG: zasoby projektu Devicon, dostępne wraz z licencją MIT w https://github.com/devicons/devicon/blob/master/LICENSE. Znaki towarowe należą do właścicieli poszczególnych technologii.

Materiały producentów i logotypy zachowują prawa ich właścicieli; pobranie nie stanowi przeniesienia licencji. Użycie znaków identyfikuje narzędzia, nie partnerstwo ani rekomendację. Wszystkie pliki są przechowywane lokalnie, więc strona nie wymaga zewnętrznych żądań po obrazy.

## Dodatkowe realizacje i demonstracje

- `public/images/mould-care.png`: fotografia urządzenia do obsługi kanałów chłodzenia form, katalog dystrybutora https://www.dme.net/coolingcare/.
- `public/images/blinds-4000.jpg`: fotografia automatu do żaluzji serii 4000 z katalogu producenta; dokładny odnośnik w danych portfolio.
- `public/images/blow-moulding-4000.jpg`: fotografia butelczarki serii 4000 z katalogu producenta; dokładny odnośnik w danych portfolio.
- `public/video/machine-simulation.webm`: 12-sekundowe nagranie samej sceny WebGL publicznej aplikacji Visu3D. Tryb offline, konto demonstracyjne, program przykładowy. Nie pokazuje rzeczywistego sterownika ani danych zakładu. Obok nagrania można osadzić pełny publiczny symulator — ten element wymaga połączenia z internetem.
- `src/scada-demo.mjs`: nowy demonstrator funkcji wykresów, opracowany na podstawie kategorii sygnałów i funkcji porównywania cykli w lokalnym projekcie SCADA. Kod oryginalnej aplikacji i bazy produkcyjne nie zostały skopiowane. Wszystkie przebiegi są jawnie opisane jako syntetyczne.
- SQL Server i PostgreSQL: kompetencje potwierdzone bezpośrednio przez właściciela 23.10.2026; oryginalne logotypy z Devicon.

Opisy udziału dotyczą aplikacji sterowania i wskazanych projektów. Nie utożsamiają udziału właściciela portfolio z autorstwem całej maszyny lub całej aplikacji zespołowej.

## Sprzęt automatyki

Sześć zdjęć w `public/equipment/` pochodzi z katalogu dystrybutora. Dokładne adresy stron produktów zapisano w `equipment` w `src/data.mjs`. Kontrolery AX opisano jako oparte na CODESYS; napędy, HMI i SCADA jako urządzenia oraz oprogramowanie współpracujące. Funkcje zależne od wariantu i licencji są tak oznaczone. Galerię maszyn połączono z opisami projektów; usunięto widoczne oznaczenia modeli zgodnie z poleceniem właściciela.

## Uproszczenie prezentacji i Actions

Sprzęt pokazano jako pięć przykładowych fotografii kategorii PLC, serwonapęd, falownik, HMI i SCADA, bez nazw modeli i katalogowego przeglądu. Sekcja komunikacji korzysta z lokalnych plików logotypów; źródła zapisano przy każdym wpisie `protocols` w `src/data.mjs`. Modbus TCP i RTU wykorzystują ten sam logotyp z osobnym oznaczeniem wariantu.

Panel Actions odtwarza wybrane etapy publicznych przebiegów CODESYS CI: #21 z 22.09.2026 (powodzenie) i #24 z 24.09.2026 (błąd kompilacji). Nazwy etapów, ich wyniki i czasy pochodzą z GitHub API. Wizualizacja skraca czas i nie inicjuje nowego wykonania ani połączenia z PLC. Linki do źródłowych przebiegów są w danych publicznych. Nie kopiowano surowych logów ani danych środowiska runnera.

Usunięto karty energii i wizualizacji przeglądarkowej; animacja 3D pozostaje w sekcji aplikacji w działaniu.

Dodano zdjęcie regulatora temperatury DTM (DTME04) ze strony InduProgress: https://induprogress.pl/produkt/dtme04/. Lokalny plik: public/equipment/temperature-controller.jpg. Podpis pozostaje ogólny, bez nazwy modelu. Kompetencję regulacji PID i histerezy dodano na podstawie deklaracji właściciela portfolio z 23.10.2026.

Filmy poglądowe kart projektów (publiczne odtwarzacze YouTube, bez kopiowania plików):
- Serwis form: https://www.youtube.com/watch?v=hWU-LDsQ984 — film osadzony przez DME na https://www.dme.net/coolingcare/.
- Żaluzje: https://www.youtube.com/watch?v=fPZLL5Wu0Hg — osadzony na stronie źródłowej fotografii Magnum.
- Formowanie opakowań: https://www.youtube.com/watch?v=n0G_CizMkUM — osadzony na https://era-tech.pl/1739-2/.
- Kamień: https://www.youtube.com/watch?v=ZxMkAq89g_w — oficjalny kanał wskazany na stronie źródłowej; tytuł „Jednosuportowa piła PLC ( 5osi )”, potwierdzony w kanale RSS.
- Opakowania: https://www.youtube.com/watch?v=Lh55n9MseT8 — osadzony na stronie źródłowej fotografii.
- Panel operatora: https://www.youtube.com/watch?v=zT3msdxHrQw — film tej samej maszyny opakowaniowej; jest kontekstem obsługi maszyny, nie nagraniem instalacji SCADA właściciela.

Filmy są materiałem poglądowym, nie dowodem autorstwa aplikacji ani udziału w realizacji konkretnego egzemplarza. Zachowano oryginalne odtwarzacze i oznaczenia źródeł. Cykl widocznej karty: 1 s fotografii, następnie 15 s odtwarzania (od zdarzenia PLAYING), powtarzany. Ukryte karty i karta przeglądarki w tle wstrzymują filmy; preferencja ograniczenia ruchu wymaga ręcznego uruchomienia. Błąd odtwarzacza pozostawia zdjęcie i możliwość ponowienia.

Aktualizacja 23.10.2026: karta automatyki opakowań używa fotografii Boxmat Modular z https://boxmat.tech/wp-content/uploads/2026/06/boxmat-modular-1.png oraz filmu https://www.youtube.com/watch?v=fYSw30Xg8fY osadzonego na https://boxmat.tech/boxmakers/boxmat-modular/. Cykl zmieniono na 1 s fotografii + 15 s filmu. Fragmenty wybrano po przeglądzie klatek podglądowych publikowanych przez odtwarzacz: serwis form 110–125 s (układ czyszczenia), żaluzje 52–67 s (mechanizmy podawania i składania), butelczarka 25–40 s (cykl formowania), piła 80–95 s (obróbka), opakowania 7–22 s (mechanizmy, obsługa i podawanie kartonu), panel 43–58 s (obsługa interfejsu).

Właściciel potwierdził autorstwo programowania wszystkich opisanych aplikacji. Opisy i CV mówią teraz „Zaprogramowałem”; nie przypisują autorstwa konstrukcji maszyn. W treściach i oznaczeniach automatyki zastąpiono nazwy środowisk programistycznych kategoriami PLC, HMI, SCADA i napędów. Nazwy technologii IT pozostają w części uzupełniającej.

Sekcja „Ruch maszyny w 3D”: na polecenie właściciela zastąpiono lokalne nagranie publicznym filmem https://youtu.be/PTCmEk8_ix4 („Pila Visu 3D”). Fragment 40–55 s pokazuje ruch w wizualizacji bez wstępnej konfiguracji; wybór potwierdzono w podglądowych klatkach odtwarzacza. Odtwarzacz zapętla wyłącznie ten 15-sekundowy zakres, jest wyciszony i zatrzymuje się poza widokiem oraz po ukryciu karty. Przy ograniczeniu ruchu uruchamiany ręcznie. Pełny interaktywny symulator pozostaje dostępny.
