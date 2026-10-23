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
