export const profile = {
  name: 'Patryk Choiński',
  title: 'Field Application Engineer · Automatyka przemysłowa',
  summary: 'Specjalizuję się w aplikacjach automatyki przemysłowej: PLC, HMI, SCADA, sterowaniu ruchem i napędach. Łączę logikę sterownika z pracą maszyny, układami wykonawczymi i interfejsem operatora. Narzędzia IT wykorzystuję do integracji danych, wizualizacji i automatyzacji testów.',
  github: 'https://github.com/PatrykChoinski',
  email: 'patryk@choinski.net.pl',
  phone: '+48 696 568 545',
};
export const experience = [
  {period:'03.2020 – obecnie',role:'Field Application Engineer',company:'Firma z branży automatyki przemysłowej',description:'Tworzenie aplikacji PLC, HMI i motion dla maszyn do obróbki kamienia, opakowań, drewna i innych procesów przemysłowych. Integracja serwonapędów, falowników i pneumatyki.'},
  {period:'10.2018 – 03.2020',role:'Technical Support Engineer',company:'Firma z branży automatyki przemysłowej',description:'Wsparcie techniczne w zakresie sterowników PLC, HMI, SCADA, napędów, kontrolerów ruchu i robotów Delta.'},
  {period:'07.2017 – 08.2017',role:'Staż inżynierski',company:'Firma z branży motoryzacyjnej',description:'Programowanie PLC Mitsubishi i robotów Fanuc oraz prace przy układach elektrycznych.'},
];
export const education = [
  {period:'2014 – 2018',title:'Automatyka i robotyka · studia inżynierskie',school:'Politechnika Warszawska'},
  {period:'2019 – 2020',title:'Informatyka · okres nauki według CV',school:'Politechnika Warszawska'},
];
export const skills = [
 {"group":"Programowanie PLC","type":"Logika sterowania maszyną","items":["PLC","Structured Text"],"description":"Programy sterowników, sekwencje pracy i aplikacje maszynowe. Sterowanie procesem oraz powiązanie logiki PLC z HMI i układami wykonawczymi."},
 {"group":"Motion Control","type":"Sterowanie ruchem wieloosiowym","items":["Pozycjonowanie","Bazowanie osi","Interpolacja","Profile ruchu"],"description":"Ruchy ręczne i automatyczne, osie maszyny oraz geometria operacji obróbczych. Praca z programami cięcia, frezowania i wiercenia."},
 {"group":"Serwonapędy i falowniki","type":"Napędy i układy wykonawcze","items":["Serwonapędy","Falowniki","Enkodery"],"description":"Napędy osi i silników, parametryzacja narzędziami producenta oraz integracja napędów z aplikacją sterownika i sygnałami sprzężenia zwrotnego."},
 {"group":"Panele operatorskie HMI","type":"Obsługa i parametryzacja maszyny","items":["HMI","Tryb ręczny / automat","Parametry maszyny"],"description":"Ekrany operatorskie, nastawy i sterowanie pracą maszyny. Powiązanie panelu z programem PLC oraz prezentacją aktualnego stanu aplikacji."},
 {"group":"Regulatory temperatury","type":"Regulacja procesów cieplnych","items":["PID","Sterowanie z histerezą"],"description":"Sterowanie temperaturą z wykorzystaniem regulacji PID lub regulacji dwustanowej z histerezą."},
 {"group":"SCADA i dane procesowe","type":"Nadzór, historia i raportowanie","items":["SCADA","Receptury","Trendy i raporty"],"description":"Wizualizacja instalacji, receptury, dane historyczne, przebiegi procesowe i raportowanie."},
 {"group":"Robotyka i elektrotechnika","type":"Integracja urządzeń przemysłowych","items":["Roboty","Pneumatyka","Układy elektryczne"],"description":"Doświadczenie w programowaniu robotów, układach elektrycznych i integracji pneumatyki. Narzędzia dokumentacji elektrycznej uzupełniają pracę nad sterowaniem."},
 {"group":"Komunikacja przemysłowa","type":"Łączenie sterownika z systemami nadzorczymi","items":["EtherCAT","CANopen","EtherNet/IP","Modbus TCP","Modbus RTU","OPC UA"],"description":"Integracja danych ze sterownika, urządzeń pomiarowych i aplikacji. Przepływy danych, wizualizacja pomiarów oraz obsługa alarmów."},
 {"group":"Wizualizacja i narzędzia webowe","area":"support","type":"IT wspierające automatykę","items":["JavaScript","Node.js","WebGL","HTML","CSS","SSE"],"description":"Dodatkowa warstwa aplikacji: wizualizacja 3D maszyny, symulacja offline i prezentacja danych z PLC w przeglądarce."},
 {"group":"Bazy danych i integracje","area":"support","type":"Dane produkcyjne i raportowanie","items":["SQL Server","PostgreSQL","SQL","SQLite"],"description":"Dużo pracuję z SQL Server i PostgreSQL. Bazy danych wspierają gromadzenie danych produkcyjnych, integracje i raportowanie."},
 {"group":"AI w pracy inżynierskiej","area":"support","type":"Wsparcie tworzenia aplikacji","items":["Claude","Codex","AI"],"description":"Korzystam z Claude i Codex jako narzędzi wspomagających pracę z kodem i dokumentacją. Rozwiązania weryfikuję w kontekście aplikacji przemysłowej."},
 {"group":"Skrypty i automatyczne testy","area":"support","type":"Narzędzia rozwoju aplikacji przemysłowych","items":["Python","PowerShell","Git","GitHub Actions","CI/CD","JUnit"],"description":"Automatyzacja kompilacji i testowania aplikacji PLC, raporty ze stanu runtime oraz skrypty pomagające rozwijać i utrzymywać projekty."}
];
export const applicationAreas = ['Maszyny do obróbki kamienia', 'Maszyny do produkcji opakowań kartonowych', 'Maszyny do obróbki drewna', 'Maszyny do produkcji rolet', 'Maszyny dla branży tytoniowej', 'Mycie form wtryskowych', 'Zgrzewanie i rolowanie worków', 'Systemy SCADA dla produkcji'];
export const projects = [
 {"id":"mould-care","title":"Czyszczenie i diagnostyka kanałów form","subtitle":"Aplikacja urządzenia do obsługi form wtryskowych","category":"Automatyka","sector":"Firma z branży serwisu form wtryskowych","tags":["PLC","HMI","Diagnostyka"],"description":"Zaprogramowałem PLC i HMI urządzenia do czyszczenia i diagnostyki kanałów chłodzenia form wtryskowych.","challenge":"Czytelna obsługa procesu czyszczenia, diagnostyki i kontroli parametrów urządzenia.","solution":"Zaprogramowałem sekwencje procesu, diagnostykę i obsługę operatorską urządzenia do czyszczenia kanałów form.","evidence":"Autorstwo aplikacji potwierdziłem jako właściciel portfolio. Zakres projektu ma podstawę w materiałach projektowych lub CV.","kind":"Zaprogramowane przeze mnie","accent":"blue","machine":"mould-care"},
 {"id":"blinds-4000","title":"Automatyzacja produkcji żaluzji","subtitle":"PLC + HMI dla maszyny produkcyjnej","category":"Automatyka","sector":"Firma z branży maszyn do rolet i żaluzji","tags":["PLC","HMI"],"description":"Zaprogramowałem sterowanie automatem do produkcji żaluzji.","challenge":"Połączenie obsługi operatora z sekwencjami pracy automatu produkcyjnego.","solution":"Zaprogramowałem aplikację PLC i HMI łączącą sekwencje pracy automatu z obsługą operatora.","evidence":"Autorstwo aplikacji potwierdziłem jako właściciel portfolio. Zakres projektu ma podstawę w materiałach projektowych lub CV.","kind":"Zaprogramowane przeze mnie","accent":"amber","machine":"blinds-4000"},
 {"id":"blow-moulding-4000","title":"Formowanie opakowań z tworzyw","subtitle":"Sterowanie maszyną do formowania opakowań","category":"Automatyka","sector":"Firma z branży maszyn do przetwórstwa tworzyw","tags":["PLC","HMI","Napędy"],"description":"Zaprogramowałem PLC i HMI maszyny do produkcji opakowań z tworzyw sztucznych.","challenge":"Integracja programu sterownika, interfejsu operatora i pracy maszyny w cyklu produkcyjnym.","solution":"Zaprogramowałem sterownik i panel operatorski butelczarki oraz zintegrowałem sterowanie cyklem maszyny z napędami.","evidence":"Autorstwo aplikacji potwierdziłem jako właściciel portfolio. Zakres projektu ma podstawę w materiałach projektowych lub CV.","kind":"Zaprogramowane przeze mnie","accent":"mint","machine":"blow-moulding-4000"},
 {"id":"stone-control","title":"Sterowanie maszyną do obróbki kamienia","subtitle":"PLC + HMI + napędy osi","category":"Automatyka","sector":"Firma z branży maszyn do obróbki kamienia","tags":["PLC","HMI","Serwonapędy","Falowniki"],"description":"Zaprogramowałem PLC i HMI maszyny do obróbki kamienia oraz sterowanie serwonapędami i falownikami.","challenge":"Połączenie ruchu osi, operacji obróbki i obsługi operatorskiej w jednej aplikacji maszyny.","solution":"Zaprogramowałem logikę PLC, ekrany HMI i sterowanie napędami osi. Aplikacja obejmuje proces obróbki i nastawy maszyny.","evidence":"Autorstwo aplikacji potwierdziłem jako właściciel portfolio. Zakres projektu ma podstawę w materiałach projektowych lub CV.","kind":"Zaprogramowane przeze mnie","accent":"mint","machine":"stone"},
 {"id":"packaging-control","title":"Automatyka maszyn opakowaniowych","subtitle":"Sterowanie procesem i obsługa maszyny","category":"Automatyka","sector":"Firma z branży maszyn opakowaniowych","tags":["PLC","HMI","Napędy","Pneumatyka"],"description":"Zaprogramowałem sterowanie maszynami do produkcji opakowań kartonowych.","challenge":"Powiązanie programu maszyny z panelem operatora, ruchem napędów i układami wykonawczymi.","solution":"Zaprogramowałem aplikacje PLC i HMI, sterowanie ruchem oraz integrację falowników i pneumatyki.","evidence":"Autorstwo aplikacji potwierdziłem jako właściciel portfolio. Zakres projektu ma podstawę w materiałach projektowych lub CV.","kind":"Zaprogramowane przeze mnie","accent":"amber","machine":"packaging"},
 {"id":"plc-ci","title":"PLC z automatyczną weryfikacją","subtitle":"Od kompilacji do sprawdzenia RUN","category":"Automatyka","sector":"Firma z branży automatyki przemysłowej","tags":["PLC","Automatyczne testy"],"description":"Zaprogramowałem automatyczne budowanie, uruchamianie i testowanie aplikacji PLC.","challenge":"Powtarzalne sprawdzanie projektu sterownika bez ręcznego przechodzenia przez IDE.","solution":"Zaprogramowałem skrypty kompilujące projekt sterownika, wdrażające aplikację i sprawdzające stan RUN oraz generowanie raportów z testów.","evidence":"Autorstwo aplikacji potwierdziłem jako właściciel portfolio. Zakres projektu ma podstawę w materiałach projektowych lub CV.","url":"https://github.com/PatrykChoinski/Codesys-CI-CD","kind":"Zaprogramowane przeze mnie","accent":"blue"},
 {"id":"process","title":"Proces, receptury i raporty","subtitle":"SCADA dla instalacji mieszania","category":"Dane i SCADA","sector":"Firma z branży instalacji mieszania przemysłowego","tags":["SCADA","Dane procesowe","Raporty"],"description":"Zaprogramowałem wizualizację SCADA procesu mieszania, historię danych i raportowanie.","challenge":"Uporządkowanie danych procesu i udostępnienie ich operatorowi.","solution":"Zaprogramowałem wizualizację instalacji, wykresy przebiegów procesowych oraz eksport i raportowanie danych.","evidence":"Autorstwo aplikacji potwierdziłem jako właściciel portfolio. Zakres projektu ma podstawę w materiałach projektowych lub CV.","kind":"Zaprogramowane przeze mnie","accent":"violet","machine":"operator"}
];
export function filterProjects(category = 'Wszystkie', query = '') {
  const needle = query.trim().toLocaleLowerCase('pl');
  return projects.filter(p => (category === 'Wszystkie' || p.category === category) && [p.title,p.description,...p.tags].join(' ').toLocaleLowerCase('pl').includes(needle));
}

export const portrait = {src:'./public/images/patryk-choinski.jpg',alt:'Patryk Choiński',source:'https://github.com/PatrykChoinski'};
export const machines = [
 {"id":"mould-care","preview":{"youtubeId":"hWU-LDsQ984","start":110,"source":"https://www.youtube.com/watch?v=hWU-LDsQ984"},"title":"Diagnostyka i czyszczenie kanałów form","type":"SERWIS FORM / PLC + HMI","src":"./public/images/mould-care.png","alt":"Urządzenie do automatycznego czyszczenia i diagnostyki kanałów chłodzenia form","description":"Przykład urządzenia z obszaru obsługi form wtryskowych: diagnostyka, proces czyszczenia i panel operatora.","source":"https://www.dme.net/coolingcare/"},
 {"id":"blinds-4000","preview":{"youtubeId":"fPZLL5Wu0Hg","start":52,"source":"https://www.youtube.com/watch?v=fPZLL5Wu0Hg"},"title":"Produkcja żaluzji","type":"PRODUKCJA ŻALUZJI / PLC + HMI","src":"./public/images/blinds-4000.jpg","alt":"Maszyna do produkcji żaluzji z zespołem podawania i składania","description":"Profilowanie, dziurkowanie, cięcie i składanie elementów żaluzji — kontekst aplikacji maszyny produkcyjnej.","source":"https://magnum-metal.pl/maszyny-do-zaluzji-aluminiowych-3/maszyna-magnum-4000/"},
 {"id":"blow-moulding-4000","preview":{"youtubeId":"n0G_CizMkUM","start":25,"source":"https://www.youtube.com/watch?v=n0G_CizMkUM"},"title":"Formowanie opakowań","type":"PRZETWÓRSTWO TWORZYW / PLC + HMI","src":"./public/images/blow-moulding-4000.jpg","alt":"Maszyna do produkcji opakowań metodą wytłaczania z rozdmuchem","description":"Maszyna do produkcji opakowań z tworzyw sztucznych. Sterowanie cyklem, napędami i obsługa operatorska.","source":"https://era-tech.pl/1739-2/"},
 {"id":"stone","preview":{"youtubeId":"ZxMkAq89g_w","start":80,"source":"https://www.youtube.com/watch?v=ZxMkAq89g_w"},"title":"Obróbka kamienia w wielu osiach","type":"PIŁA MOSTOWA / MOTION","src":"./public/images/stone-saw.webp","alt":"Piła mostowa do obróbki kamienia z ruchomą głowicą i stołem roboczym","description":"Osie, geometria narzędzia i sekwencje obróbki — fizyczny kontekst aplikacji PLC oraz wizualizacji 3D.","source":"https://zpupromasz.pl/strona-glowna/produkty/jednosuportowa-pila-wzdluzna-5-osiowa-pw1tk-14-0-600-plc/"},
 {"id":"packaging","preview":{"youtubeId":"fYSw30Xg8fY","start":7,"source":"https://www.youtube.com/watch?v=fYSw30Xg8fY"},"title":"Od arkusza do opakowania","type":"MASZYNA DO OPAKOWAŃ / PLC","src":"./public/images/boxmat-modular.png","alt":"Przemysłowa maszyna do produkcji opakowań kartonowych z podajnikiem arkuszy","description":"Podawanie materiału, cięcie i pozycjonowanie. Przykład maszyny z obszaru aplikacji opakowaniowych opisanego w moim CV.","source":"https://boxmat.tech/boxmakers/boxmat-modular/"},
 {"id":"operator","preview":{"youtubeId":"zT3msdxHrQw","start":43,"source":"https://www.youtube.com/watch?v=zT3msdxHrQw"},"title":"Maszyna z perspektywy operatora","type":"PANEL OPERATORSKI / HMI","src":"./public/images/operator-panel.jpg","alt":"Dotykowy panel operatorski HMI przy przemysłowej maszynie do opakowań","description":"Parametry, receptury i czytelny interfejs — miejsce, w którym logika sterownika spotyka się z codzienną pracą operatora.","source":"https://www.zemat.com/boxmakers/boxmat-pro/"}
];
export const interactiveDemos={
 visu:{title:'Ruch maszyny w 3D',description:'15-sekundowy fragment nagrania wizualizacji 3D: ruch narzędzia i symulacja obróbki.',youtubeId:'PTCmEk8_ix4',start:40,duration:15,source:'https://youtu.be/PTCmEk8_ix4',url:'https://patrykchoinski.github.io/Promasz-Visu3D/'},
 scada:{title:'SCADA mieszalnika — trendy i raporty',description:'Interaktywny podgląd funkcji wykresów z projektu: porównanie przebiegów, wybór sygnałów i śledzenie etapów cyklu. Dane demonstracyjne, bez połączenia z instalacją.',signals:[
 {key:'mixer',name:'Temperatura mieszalnika',unit:'°C',max:120,color:'#ad8be3',axis:'temp'},
 {key:'flap',name:'Temperatura klapy',unit:'°C',max:120,color:'#ff6b9d',axis:'temp'},
 {key:'gear',name:'Temperatura przekładni',unit:'°C',max:120,color:'#e3c1ec',axis:'temp'},
 {key:'motor',name:'Temperatura silnika',unit:'°C',max:120,color:'#b5d12a',axis:'temp'},
 {key:'bearing-l',name:'Temperatura łożyska L',unit:'°C',max:120,color:'#b45e40',axis:'temp'},
 {key:'bearing-r',name:'Temperatura łożyska P',unit:'°C',max:120,color:'#7a5282',axis:'temp'},
 {key:'oil',name:'Temperatura oleju',unit:'°C',max:120,color:'#d3b72a',axis:'temp'},
 {key:'speed',name:'Obroty',unit:'RPM',max:150,color:'#bd8a29',axis:'vel'},
 {key:'current',name:'Prąd',unit:'A',max:80,color:'#00b8d9',axis:'cur'},
 {key:'stamp',name:'Stempel',unit:'%',max:100,color:'#76923c',axis:'stamp'},
 {key:'drain',name:'Klapa spustowa',unit:'%',max:100,color:'#00a6a6',axis:'stamp'},
 {key:'inlet',name:'Klapa wejściowa',unit:'%',max:100,color:'#ff8c00',axis:'stamp'}
 ]}
};
export const technologyLogos = [
 {"name":"SQL Server","area":"support","src":"./public/logos/sqlserver.svg","source":"https://github.com/devicons/devicon/tree/master/icons/microsoftsqlserver"},
 {"name":"PostgreSQL","area":"support","src":"./public/logos/postgresql.svg","source":"https://github.com/devicons/devicon/tree/master/icons/postgresql"},
 {"name":"Node.js","src":"./public/logos/nodejs.svg","source":"https://nodejs.org/en/about/branding"},
 {"name":"JavaScript","src":"./public/logos/javascript.svg","source":"https://github.com/devicons/devicon/tree/master/icons/javascript"},
 {"name":"Python","src":"./public/logos/python.svg","source":"https://github.com/devicons/devicon/tree/master/icons/python"},
 {"name":"Git","src":"./public/logos/git.svg","source":"https://github.com/devicons/devicon/tree/master/icons/git"},
 {"name":"SQLite","src":"./public/logos/sqlite.svg","source":"https://github.com/devicons/devicon/tree/master/icons/sqlite"},
 {"name":"GitHub Actions","src":"./public/logos/githubactions.svg","source":"https://github.com/devicons/devicon/tree/master/icons/githubactions"}
];

export const equipment = [
 {"name":"Regulator temperatury","type":"REGULACJA TEMPERATURY","description":"Regulator temperatury do sterowania procesem cieplnym.","src":"./public/equipment/temperature-controller.jpg","source":"https://induprogress.pl/produkt/dtme04/"},
 {"name":"Sterownik PLC","type":"STEROWNIK PLC","description":"Sterownik PLC do logiki maszyny i sterowania ruchem osi. Integracja z napędami przez sieć przemysłową.","src":"./public/equipment/ax3.jpg","source":"https://induprogress.pl/kategoria-produktu/sterowanie-i-wizualizacja-procesow/sterowniki-plc/sterowniki-ruchu-ax/"},
 {"name":"Serwonapęd","type":"SERWONAPĘD / ETHERCAT","description":"Serwonapęd w wariancie EtherCAT do współpracy ze sterownikiem ruchu. Parametryzacja i diagnostyka napędu w aplikacji osi.","src":"./public/equipment/servo.jpg","source":"https://induprogress.pl/kategoria-produktu/technika-napedowa/serwonapedy/serwonapedy-serii-asd-a3/"},
 {"name":"Falownik","type":"FALOWNIK / SILNIKI","description":"Przemiennik częstotliwości do sterowania silnikiem. Integracja sieciowa zależy od wybranego wariantu i opcjonalnych kart komunikacyjnych.","src":"./public/equipment/inverter.jpg","source":"https://induprogress.pl/kategoria-produktu/technika-napedowa/przemienniki-czestotliwosci/falowniki-serii-vfd-c2000/"},
 {"name":"Panel HMI","type":"HMI","description":"Panele operatorskie: nastawy, receptury i obsługa maszyny. Dobór modelu i interfejsów do aplikacji PLC.","src":"./public/equipment/hmi.jpg","source":"https://induprogress.pl/produkt/dop-115wx/"},
 {"name":"SCADA","type":"SCADA / NADZÓR PROCESU","description":"Wizualizacja instalacji, alarmy, trendy oraz historia procesu. Warstwa nadzorcza współpracująca ze sterownikiem.","src":"./public/equipment/scada.jpg","source":"https://induprogress.pl/produkt/diav-011k50000a/"}
];
export const protocols = [
 {name:'EtherCAT',src:'./public/protocols/ethercat.png',source:'https://www.hilscher.com/products/pc-cards-for-industrial-ethernet-fieldbus/pci-express/cifx-50e-re',use:'Sterowanie ruchem i wymiana danych z serwonapędami.'},
 {name:'CANopen',src:'./public/protocols/canopen.png',source:'https://seeklogo.com/vector-logo/396975/canopen',use:'Komunikacja z urządzeniami i napędami na magistrali CAN.'},
 {name:'EtherNet/IP',src:'./public/protocols/ethernetip.jpg',source:'https://www.odva.org/technology-standards/key-technologies/ethernet-ip/',use:'Integracja urządzeń przemysłowych w sieci Ethernet.'},
 {name:'Modbus TCP',src:'./public/protocols/modbus.png',source:'https://www.modbus.org/',variant:'TCP',use:'Wymiana rejestrów z urządzeniami po Ethernet.'},
 {name:'Modbus RTU',src:'./public/protocols/modbus.png',source:'https://www.modbus.org/',variant:'RTU',use:'Komunikacja szeregowa z urządzeniami przemysłowymi.'},
 {name:'OPC UA',src:'./public/protocols/opcua.png',source:'https://litmus.io/integrations/opc-ua-client',use:'Udostępnianie danych PLC do SCADA i aplikacji IT.'}
];

export const pipelineRuns = [{"number":21,"date":"2026-09-22T10:19:42Z","url":"https://github.com/PatrykChoinski/Codesys-CI-CD/actions/runs/35715363533","result":"success","steps":[{"name":"Checkout","result":"success","seconds":6},{"name":"Compile project","result":"success","seconds":31},{"name":"Deploy application to runtime (login, download, start)","result":"success","seconds":90},{"name":"Run smoke test","result":"success","seconds":37},{"name":"Write consolidated report","result":"success","seconds":0}]},{"number":24,"date":"2026-09-24T09:04:27Z","url":"https://github.com/PatrykChoinski/Codesys-CI-CD/actions/runs/35979015070","result":"failure","steps":[{"name":"Checkout","result":"success","seconds":6},{"name":"Compile project","result":"failure","seconds":146},{"name":"Deploy application to runtime (login, download, start)","result":"skipped","seconds":0},{"name":"Run smoke test","result":"skipped","seconds":0},{"name":"Write consolidated report","result":"success","seconds":0}]}]
;

export const site = {
 url:'https://patrykchoinski.github.io/Portfolio/',
 title:'Patryk Choiński | Automatyka przemysłowa | PLC · HMI · Motion',
 description:'Patryk Choiński — portfolio automatyki przemysłowej: PLC, HMI, SCADA, sterowanie ruchem, serwonapędy i aplikacje maszynowe.',
 measurementId:'G-9LDN9QT3BG',
 searchConsoleVerification:'pHfgscL4jHIHr1DB6bfPVhhSE_kVvRV8cjs6SMkTb0E',
 analyticsUrl:'https://analytics.google.com/analytics/web/#/a413259687p560519935/reports/intelligenthome',
 searchConsoleUrl:'https://search.google.com/search-console?resource_id=https%3A%2F%2Fpatrykchoinski.github.io%2FPortfolio%2F'
};

export const portfolioScreenshots = [
 {id:'plc-library',title:'Struktura aplikacji PLC',src:'./public/screenshots/plc-library-redacted.png',alt:'Zanonimizowany zrzut edytora PLC z drzewem folderów i kodem Structured Text',caption:'Rzeczywisty widok biblioteki sterowania. Kod jest widoczny. Folder Buffor i jego zawartość są czytelne; nazwy pozostałych folderów zostały zamazane.'},
 {id:'scada-screen',title:'Trendy i raporty procesu',src:'./public/screenshots/scada-trends.png',alt:'Zrzut aplikacji SCADA z trendami i wyborem sygnałów',caption:'Rzeczywisty ekran aplikacji SCADA: trendy procesu i wybór sygnałów.'}
];

export const githubProfile={username:'PatrykChoinski',activityUrl:'https://github.com/PatrykChoinski?tab=overview',repositories:[{name:'Portfolio',title:'Portfolio'},{name:'Promasz-Visu3D',title:'Wizualizacja maszyny 3D'},{name:'Codesys-CI-CD',title:'Automatyczne testy PLC'}]};
