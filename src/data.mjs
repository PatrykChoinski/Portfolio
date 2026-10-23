export const profile = {
  name: 'Patryk Choiński',
  title: 'Automatyka przemysłowa. Oprogramowanie. Integracje.',
  summary: 'Łączę świat maszyn z oprogramowaniem. Pracuję nad sterowaniem PLC, interfejsami operatora i aplikacjami, które pomagają zrozumieć proces — od danych ze sterownika po wizualizację 3D.',
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
  {group:'Automatyka i motion', type:'Programowanie sterowników i sterowanie ruchem', items:['CODESYS', 'DIADesigner-AX', 'Structured Text', 'SoftMotion', 'PLC', 'HMI'], description:'Logika maszyn, sekwencje, osie, bazowanie i integracja warstwy operatorskiej.'},
  {group:'Web i wizualizacja', type:'Programowanie frontend i backend', items:['JavaScript', 'Node.js', 'Three.js', 'WebGL', 'HTML', 'CSS', 'SSE'], description:'Interaktywne aplikacje przeglądarkowe, symulacja pracy maszyny i serwery integracyjne.'},
  {group:'Dane i komunikacja', type:'Integracje przemysłowe i programowanie przepływowe', items:['OPC UA', 'Node-RED', 'SQL Server', 'SQLite', 'DIAView'], description:'Odczyt danych procesowych, dashboardy, receptury, raportowanie i migracje danych.'},
  {group:'Narzędzia i jakość', type:'Skrypty oraz automatyzacja budowania i testów', items:['Python', 'PowerShell', 'Git', 'GitHub Actions', 'CI/CD', 'JUnit'], description:'Kompilacja projektów PLC, testy stanu runtime oraz powtarzalne procesy wydawania.'},
  {group:'Maszyny i robotyka', type:'Programowanie i integracja układów przemysłowych', items:['Delta', 'Mitsubishi PLC', 'Fanuc', 'Serwonapędy', 'Falowniki', 'Pneumatyka'], description:'Doświadczenie opisane w CV: aplikacje maszynowe, roboty i integracja układów wykonawczych.'},
  {group:'Systemy operatorskie', type:'Wizualizacja procesów i dokumentacja elektryczna', items:['KingSCADA', 'KingView', 'SQL', 'EPLAN', 'SEE Electrical'], description:'SCADA, dane produkcyjne oraz narzędzia elektryczne wymienione w dotychczasowym CV.'},
];
export const projects = [
  {id:'digital-twin', title:'Maszyna w przeglądarce', subtitle:'Wizualizacja 3D i symulacja obróbki', category:'Web i 3D', sector:'Firma z branży maszyn do obróbki kamienia', tags:['Node.js','Three.js','OPC UA','JavaScript'], description:'Przeglądarkowa wizualizacja maszyny wieloosiowej z trybem online i symulacją offline.', challenge:'Pokazanie ruchu narzędzia i geometrii obróbki w sposób czytelny dla operatora.', solution:'Scena WebGL, odczyt pozycji przez OPC UA i aktualizacje SSE. Tryb offline odwzorowuje rampy ruchu, operacje cięcia, frezowania i wiercenia.', evidence:'Dokumentacja aplikacji opisuje architekturę, moduły geometrii oraz testy Node.js i przeglądarkowe.', kind:'Projekt aplikacji', accent:'mint'},
  {id:'plc-ci',title:'PLC z automatyczną weryfikacją',subtitle:'Od kompilacji do sprawdzenia RUN',category:'Automatyka',sector:'Firma z branży automatyki przemysłowej',tags:['CODESYS','Python','PowerShell','GitHub Actions'],description:'Pipeline budowania, uruchamiania i testowania aplikacji PLC na runnerze Windows.',challenge:'Powtarzalne sprawdzanie projektu sterownika bez ręcznego przechodzenia przez IDE.',solution:'Skrypty CODESYS Scripting kompilują projekt, wdrażają go do runtime i niezależnie sprawdzają stan RUN. Wyniki trafiają do raportów JUnit.',evidence:'Publiczne repozytorium zawiera opis etapów build, deploy i test.',url:'https://github.com/PatrykChoinski/Codesys-CI-CD',kind:'Projekt narzędziowy',accent:'blue'},
  {id:'energy',title:'Energia pod kontrolą',subtitle:'Integracja danych i dashboard IoT',category:'Dane i SCADA',sector:'Firma z branży automatyki i pomiarów energii',tags:['Node-RED','OPC UA','DIADesigner-AX'],description:'Projekt łączący sterownik, pomiary energii i przeglądarkowy interfejs danych.',challenge:'Połączenie urządzeń przemysłowych z warstwą prezentacji danych.',solution:'Przepływy Node-RED i integracja OPC UA z dashboardem oraz obsługą alarmów.',evidence:'README repozytorium wskazuje środowiska PLC, narzędzia pomiarowe i zależności Node-RED.',url:'https://github.com/PatrykChoinski/IoT-NodeRed-EnergyMeter',kind:'Projekt integracyjny',accent:'amber'},
  {id:'process',title:'Proces, receptury i raporty',subtitle:'SCADA dla instalacji mieszania',category:'Dane i SCADA',sector:'Firma z branży instalacji mieszania przemysłowego',tags:['DIAView','SQL Server','SQLite','Python'],description:'Projekt wizualizacji procesu z danymi historycznymi i raportowaniem.',challenge:'Uporządkowanie danych procesu i udostępnienie ich operatorowi.',solution:'Środowisko DIAView i SQL Server, wykresy przebiegów oraz skrypty eksportu danych do SQLite.',evidence:'Lokalna dokumentacja i skrypty potwierdzają stos technologiczny. Zakres indywidualnej odpowiedzialności wymaga doprecyzowania.',kind:'Udział w projekcie',accent:'violet'},
];
export function filterProjects(category = 'Wszystkie', query = '') {
  const needle = query.trim().toLocaleLowerCase('pl');
  return projects.filter(p => (category === 'Wszystkie' || p.category === category) && [p.title,p.description,...p.tags].join(' ').toLocaleLowerCase('pl').includes(needle));
}
