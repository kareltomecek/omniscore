# OmniScore (OmS)

OmniScore je webová aplikace pro řízení a projekci sportovních zápasů a časomíry (režie, tabule, ovládací pulty). Aplikace funguje jako ucelený single-file systém postavený na HTML5, CSS a moderním JavaScriptu s podporou synchronizace přes Firebase Realtime Database.

---

## 🏛️ Architektura a okna aplikace

Aplikace pracuje se třemi klíčovými koncepty / okny:

1. **OO (Ovládací okno)**
   - Hlavní režijní rozhraní pro obsluhu časomíry a celého zápasu.
   - Umožňuje nastavení sportu, pravidel, časů, týmů, soupisek, trestů a sponzorských prvků.
   - Řídí otevírání a synchronizaci projekčních oken.

2. **PO (Projekční okno / Projekce)**
   - Zobrazení určené pro diváky a projekční plochy (velkoplošné LED obrazovky, TV, monitory v hale).
   - Obsahuje režimy pro zobrazení aktuálního skóre, periody, běžícího času, odpočtů trestů, timeoutů, grafiky gólů i prezentačních smyček (sponzoři, soupisky, QR kódy).

3. **OPG (Ovládací panel gólů)**
   - Rychlé rozhraní určené pro snadné a pohotové zaznamenávání gólů, střelců, asistencí a stavu zápasu.
   - Optimalizováno pro rychlé ovládání během dynamické hry.

---

## 🛠️ Použité technologie a knihovny

- **Frontend core:** Čistý HTML5, CSS3 (CSS Grid / Flexbox / CSS Variables), JavaScript (Vanilla ES6+).
- **Architektura:** Single-file (`index.html`) s přísným členěním oblastí.
- **Firebase Realtime Database:** Reálná synchronizace stavu mezi OO a PO okny napříč zařízeními i offline fallback.
- **Firebase Auth:** Autentizace a správa uživatelských profilů / licencí.
- **SheetJS (xlsx):** Import a export týmů a soupisek z/do formátů Excel/CSV.
- **QRCode.js:** Generování QR kódů pro projekci (např. v PO2).
- **Lemon Squeezy:** Platební brána a správa licencí.

---

## 📁 Struktura kódu v `index.html`

Kód v souboru `index.html` je organizován do logických oblastí pro zachování přísné disciplíny:

1. **HTML Head & Knihovny (řádky 1–18):** Načítání externích SDK a skriptů.
2. **CSS Styly (řádky 19–2577):**
   - CSS proměnné a globální layout.
   - Styly pro OO (ovládací prvky, dialogy, tabulky).
   - Styly pro PO (responzivní velkoplošné zobrazení, animace gólů, tresty).
3. **HTML Šablony a DOM struktura (řádky 2578–2629):**
   - Kostra ovládacích panelů, oken a dialogů.
4. **JavaScript Jádro (řádky 2630+):**
   - **Konfigurace a stav aplikace:** Globální stav zápasu, týmy, časomíra.
   - **Firebase inicializace & Sync:** Synchronizace změn mezi OO a PO.
   - **Modul časomíry:** Start, stop, odpočty, intervaly, periody.
   - **Tresty a události:** Evidence 2min/5min trestů, timeouty, góly.
   - **Správa oken (PO/OO komunikace):** Otevírání oken přes `window.open` a `BroadcastChannel` / `localStorage` / `Firebase`.
   - **Import/Export:** Práce se soubory XLSX a nastavením zápasů.

---

## 🔄 Datové struktury (Základní stav zápasu)

Základní synchronizovaný datový objekt reprezentuje aktuální stav utkání:
- `time`: Aktuální herní čas (vteřiny, milisekundy, směr běhu).
- `period`: Aktuální perioda (1, 2, 3, prodloužení, nájezdy).
- `teams`: Názvy týmů, barvy, loga, aktuální skóre (`home`, `away`).
- `penalties`: Aktivní tresty pro domácí i hosty (číslo hráče, délka trestu, zbývající čas).
- `matchState`: Stav utkání (`stopped`, `running`, `timeout`, `intermission`, `finished`).
- `overlay`: Aktivní celoobrazovkové překryvy na PO (např. animace gólu, timeout, reklama).
- `lastUpdate`: Unix timestamp poslední změny stavu turnaje.
- `activeMaster`: Informace o zařízení, které aktivně řídí turnaj (`clientTabId`, `lastHeartbeat`).

---

## 🔒 Správa relací a synchronizace (Multi-device ochrana)

Aplikace řeší souběh více zařízení pod jedním uživatelským účtem:
1. **Záchranná brzda při startu (Cloud vs. LocalStorage):**
   - Při startu OO se data z `localStorage` automaticky nevysílají do cloudu.
   - Proběhne kontrola `lastUpdate` v cloudu vs. lokálně.
   - Pokud jsou v cloudu novější data (např. z turnaje v hale), aplikace nabídne načtení novějších dat z cloudu.
2. **Řízení Master vs. Divák:**
   - Každá relace eviduje aktivní řídicí zařízení (`activeMaster`).
   - Při otevření turnaje na dalším počítači je uživatel dotázán na převzetí řízení (Master) nebo otevření pouze pro čtení (Divák).
   - Zařízení v režimu Divák má zablokovaný zápis do cloudu, aby nedošlo k přepsání běžícího turnaje.
3. **Přímé ukládání do cloudu:**
   - V akordeonu *Nastavení Turnaje* je k dispozici přímé tlačítko *„☁️ Uložit turnaj do cloudu“* s indikací času posledního uložení a kódu relace.

---

## 🚀 Vývojový a publikační cyklus (Produkce vs. Beta)

Aplikace používá bezpečný dvoustupňový provoz:

1. **Testovací / vývojová verze (`beta/`):**
   - **Kód:** [beta/index.html](file:///c:/____001%20Programming/001%20Antigravity/AG%20001%20OmS/beta/index.html)
   - **Živý web:** `https://kareltomecek.github.io/omniscore/beta/`
   - **Účel:** Zde se provádí veškeré nové úpravy, optimalizace a funkce. Tato verze se bere na turnaje k živému otestování.
2. **Ostrá stabilní produkce (kořen):**
   - **Kód:** [index.html](file:///c:/____001%20Programming/001%20Antigravity/AG%20001%20OmS/index.html)
   - **Živý web:** `https://kareltomecek.github.io/omniscore/`
   - **Účel:** Prověřená a stabilní verze. Slouží jako spolehlivá záloha během turnaje (v případě problémů v betě stačí v prohlížeči umazat `/beta`).
   - **Překlopení:** Z `beta/` do kořene se kód překlápí až po úspěšném otestování v reálném turnajovém provozu.

Automatický deployment na web probíhá přes GitHub Actions ([.github/workflows/static.yml](file:///c:/____001%20Programming/001%20Antigravity/AG%20001%20OmS/.github/workflows/static.yml)) po každém odeslání (push) do větve `main`.

---

## 📝 Changelog

### Verze `v0.7.23-beta` (Testovací větev)
- **Robustní obnova turnaje ze zálohy Excel/CSV, verze aplikace v exportech a detekce kolizí relací:**
  - **Dynamická detekce zálohy turnaje:** Skenování hlavičky tabulky rozpisu zápasů rozšířeno na prvních 40 řádků a doplněno o dynamické rozpoznání klíčových polí (`Kategorie:`, `Pořadatel:`, `Exportováno:`, `Relace:`, `Pravidla:`, `Verze:`). Starší i novější zálohy s libovolným počtem řádků metadat jsou spolehlivě identifikovány jako kompletní zálohy.
  - **Plné zachování a obnova odehraných výsledků:** Sloupec *Skóre* je správně parsován a dosazen do zápasů (`homeScore`, `guestScore`) při obnově zálohy i při importu samotného harmonogramu (již nedochází k nechtěnému vynulování skóre na `null`).
  - **Přenášení a ochrana Session ID ze zálohy:** Při obnově zálohy se přebírá původní `Session ID` a název turnaje. Pokud se kód relace shoduje se stávajícím turnajem v cloudu Firebase, systém porovná datum poslední změny a počet odehraných utkání a nabídne volbu: přepsat cloud ze zálohy, nebo zálohu nahrát jako novou kopii s novým ID.
  - **Verze aplikace v hlavičce exportu:** Do generovaných XLSX i tiskových exportů přidán řádek `["Verze aplikace:", APP_VERSION]` pro přesnou identifikaci verze, zpětnou kompatibilitu a snadnou budoucí migraci.
  - **Dynamické mapování sloupců a bezpečné ukončení sekcí:** Čtení rozpisu se dynamicky řídí názvy sloupců v hlavičce a spolehlivě se zastaví před sekcemi `TABULKA TURNAJE`, `SBOR ROZHODČÍCH`, `SOUPISKY DRUŽSTEV` a `RŮZNÉ`.

### Verze `v0.7.22-beta` (Testovací větev)
- **Automatická registrace aktivního turnaje v cloudu:**
  - **Okamžitá přítomnost aktivního turnaje v seznamu:** Otevřený aktivní turnaj je nyní v dialogu cloudových turnajů automaticky zaevidován a zobrazen s označením `✓ AKTIVNÍ`. Již nedochází k situaci, kdy by dialog hlásil absenci uložených turnajů, pokud je v aplikaci aktivní turnaj rozpracován.
  - **Garantované načtení při otevření správce:** Metoda `openCloudSessionsModal()` a `refreshCloudSessionsList()` automaticky synchronizují metadata aktivní relace a zařadí ji do tabulky.
  - **Okamžitá registrace při vytvoření nového turnaje:** Funkce `createNewCloudSession()` ihned po vytvoření nového ID inicializuje záznam v cloudu i metadatech.

### Verze `v0.7.21-beta` (Testovací větev)
- **Zabezpečení kořenového uzlu cloudu, samooprava seznamu a zjednodušení dialogu:**
  - **Odstranění tlačítka „💾 Uložit aktuální turnaj“ z modálního okna:** Dialog správy cloudových turnajů nyní slouží jako přehledný manažer a rozcestník turnajů (seznam, Otevřít, Kopie, Smazat a + Nový turnaj). Pro explicitní ruční uložení slouží přímé tlačítko v akordeonu *Nastavení turnaje*.
  - **Striktní ochrana kořene metadat (`isRoot`):** Zablokován jakýkoli zápis do kořenového uzlu `users/{uid}/sessions`, pokud chybí nebo je prázdné ID relace. Tím je trvale vyloučeno nechtěné přepsání či smazání seznamu uživatelských turnajů.
  - **Automatická detekce a samooprava poškozených záznamů (`undefined`):** Funkce načítání seznamu turnajů filtruje pouze platné objekty s neprázdným `sessionId`. Jakékoli fragmenty či poškozené klíče v kořenu automaticky z cloudu odstraní, takže v tabulce se již nikdy nezobrazí poškozené položky `undefined`.

### Verze `v0.7.20-beta` (Testovací větev)
- **Odstranění nechtěného zápisu do cloudu při smazání aktivní relace:**
  - **Eliminace předčasného vytvoření nového turnaje v cloudu:** Při smazání aktivního turnaje se dočasné prázdné ID již neodesílá do Firebase a nezapisuje se do seznamu relací uživatele.
  - **Čistý a přesný výběr:** V seznamu existujících turnajů uživatel vidí výhradně své skutečně uložené turnaje (žádný prázdný nově vytvořený turnaj se již v seznamu neobjevuje).
  - **Založení nového turnaje pouze na výzvu:** Nová cloudová relace se založí teprve tehdy, když uživatel výslovně klikne na volbu *„➕ Založit nový čistý turnaj“*.
  - **Hladké načtení bez potvrzovacího dotazu:** Pokud je paměť po smazání prázdná, otevření existujícího turnaje proběhne přímo bez zbytečného dotazu na přepsání lokálních dat.

### Verze `v0.7.19-beta` (Testovací větev)
- **Korektní správa a volba po smazání aktivní cloudové relace:**
  - **Odstranění nechtěného znovuvytvoření smazaných dat:** Při smazání aktivního turnaje se již data turnaje nekopírují pod nové náhodné ID. Paměť aplikace (`state`), lokální úložiště i rozhraní se kompletně a bezpečně vyčistí (`resetTournamentStateInMemory`).
  - **Interaktivní dialog volby dalšího kroku:** Pokud uživatel smaže právě otevřený turnaj a v cloudu má ještě další turnaje, zobrazí se přehledné modální okno (`#modal-post-delete-choice`) nabízející dvě volby:
    1. **📂 Vybrat a otevřít jiný existující turnaj z cloudu:** Ponechá otevřený seznam se zbývajícími turnaji, kde lze jedním kliknutím otevřít kterýkoli jiný turnaj.
    2. **➕ Založit nový čistý turnaj:** Spustí proces vytvoření nového prázdného turnaje s možností zadání vlastního kódu relace.
  - **Automatické přepnutí při prázdném účtu:** Pokud byl smazán poslední turnaj v účtu, aplikace uživatele informuje a automaticky inicializuje novou čistou relaci bez pozůstatků předchozího turnaje.

### Verze `v0.7.18-beta` (Testovací větev)
- **Přechod na fyzické favicon soubory v `beta/`:**
  - Z důvodu bezpečnostních omezení a chování prohlížeče Chrome (který data URI v záložce často ignoruje nebo přebíjí chybou 404) byl Base64 řetězec nahrazen přímými soubory `beta/favicon.png` a `beta/favicon.ico`.
  - V hlavičce `beta/index.html` zavedeny standardní vazby `<link rel="icon">`, `<link rel="shortcut icon">` a `<link rel="apple-touch-icon">`.
  - Ikona 0:0 je nyní 100% kompatibilní se všemi moderními prohlížeči, GitHub Pages i lokálním serverem.

### Verze `v0.7.17-beta` (Testovací větev)
- **Nová favicon aplikace (Base64 data URI):**
  - Nahrazena původní dočasná emoji ikona novou grafickou faviconou se sportovním motivem digitálního skóre `0:0`.
  - Ikona je optimalizována, převedena do formátu PNG a vložena přímo do hlavičky `<head>` v souboru `beta/index.html` jako kompaktní Base64 řetězec.
  - Plně zachována single-file architektura aplikace bez nutnosti externích souborů.


### Verze `v0.7.16-beta` (Testovací větev)
- **Oprava překreslení po načtení dat z cloudu (Hotfix):**
  - Opravena chyba `admin.renderSettings is not a function` v `applyCloudData`, kde se volaly neexistující metody namísto standardního interního cyklu `admin.loadFromStorage()`.
  - Data z cloudu se po stisknutí tlačítka stáhnou, aplikují do úložiště a rozhraní se hladce překreslí bez jakékoli chybové hlášky.

### Verze `v0.7.15-beta` (Testovací větev)
- **Oprava a rozšíření detekce konfliktu dat z cloudu Firebase:**
  - **Oprava přebíjení časového razítka při startu:** Odstraněna chyba, kdy počáteční volání `game.syncProjection()` přepsalo `state.lastUpdate` aktuálním časem ještě před dotazem na Firebase, což způsobilo, že cloudová data se vždy jevila jako starší a varovný dialog se nezobrazil.
  - **Komplexní detekce odlišností:** Porovnání se již nespoléhá pouze na časové razítko, ale detekuje i vyšší počet odehraných zápasů v cloudu, prázdný lokální stav vůči cloudu a odlišnosti v odehraných výsledcích.
  - **Přehledné porovnání (Cloud vs. Tento počítač):** Modální dialog zobrazuje vedle sebe počet odehraných zápasů, celkový počet utkání, počet týmů a čas změn s doporučením načíst čerstvá data z cloudu.
  - **Informační lišta (Cloud Sync Banner):** Pokud uživatel zvolí ponechání lokálních dat, v záhlaví zůstává dostupná modrá lišta umožňující kdykoli jedním kliknutím stáhnout čerstvá data z cloudu.
  - **Kompletní překreslení po načtení:** Při aplikaci cloudových dat se spolehlivě překreslí nastavení, rozpis, výsledky, týmy, hráči, rozhodčí, tabulky i časy.

### Verze `v0.7.14-beta` (Testovací větev)
- **Zpřesnění textu v informační liště a hlášení:**
  - Text v horní žluté liště `#spectator-banner` upraven na: *„REŽIM DIVÁK: Turnaj aktivně řídí jiné zařízení. Ovládací prvky jsou uzamčeny (můžete pouze číst).“*

### Verze `v0.7.13-beta` (Testovací větev)
- **Dokonalá vizuální symetrie přepínače rolí v patičce:**
  - Tlačítko `👁️ DIVÁK` v patičce bylo upraveno tak, aby mělo identický kompaktní formát jako tlačítko `👑 MASTER`.
  - Odstraněn dlouhý text v závorce, který způsoboval zalamování řádků – tlačítko nese čistý název `👁️ DIVÁK`, má stejný tvar, zaoblení i velikost, a liší se pouze textem a oranžovým motivem (`rgba(255, 152, 0, 0.25)` s ohraničením a textem `#ff9800`).
  - Podrobná nápověda pro převzetí řízení zůstává k dispozici jako tooltip při najetí myší a horní žlutá lišta zůstává beze změn.

### Verze `v0.7.12-beta` (Testovací větev)
- **Vyladění rozhraní a vizuální sjednocení režimu Divák:**
  - **Skrytí nastavení projekce ve Veřejných zobrazeních:** Spodní blok *Nastavení zobrazení* (volba tématu, velikost času v projekci, zpoždění kroku, střídání QR kódů, interval a prolínání) je v režimu Divák zcela skryt (`display: none`). V sekci tak zůstávají pouze čisté odkazy a tlačítka pro QR kódy a veřejné pohledy.
  - **Barevné sjednocení stavového tlačítka:** Spodní tlačítko `👁️ DIVÁK (Klikněte pro převzetí)` v patičce bylo přebarveno na stejný teplý žlutý odstín (`#ff9800`) s kontrastním černým textem jako horní informační lišta.

### Verze `v0.7.11-beta` (Testovací větev)
- **Kompletní a neprodyšné uzamčení režimu Divák (Spectator Lockdown Fix):**
  - **Oprava CSS selektorů:** Opraveny selektory akordeonů (`#acc-settings`, `#acc-logos`, `#acc-players`, `#acc-music`, `#acc-app-settings`), které se dříve chybně dotazovaly na neexistujícího potomka `.accordion-content`. Nyní jsou všechny interaktivní prvky uvnitř těchto sekcí (tlačítka `+ Přidat družstvo`, `🎲 Vylosovat pořadí`, `🔒 Pořadí zamčeno`, klikací loga týmů, audio checkboxy atd.) 100% zablokované proti kliknutí (`pointer-events: none`) a zašedlé.
  - **Proklikávání menu zachováno:** Hlavičky akordeonů zůstávají plně interaktivní – uživatel může volně rozklikávat a prohlížet všechny sekce.
  - **Dostupnost čtení a QR kódů:** Tabulky, Exporty (Excel, tisk) a Veřejná zobrazení / QR kódy zůstávají v režimu Divák plně funkční a použitelné.
  - **Rozpis zápasů:** Seznam zápasů je čitelný a scrollovatelný, ale položky nelze editovat, proklikávat ani přetahovat.
  - **Vícevrstvá obrana v JS (Defense-in-Depth):** Pojistka `if (!state.isMaster) return;` doplněna do všech mutačních metod (`addTeamSlot`, `shuffleTeams`, `toggleTeamsLock`, `saveSettings`, `resetTournament`, `generateScheduleFromTemplate`, `addMatch`, `saveEditedMatch`, `deleteMatch`, `deleteSelected`, `resetSelectedScores`, `moveSelected`, `handleScheduleImport`, `updatePlayersFromCloud`, `uploadPlayersFromFile`, `game.step`, `game.adjustScore`, `game.toggleTimer`, `game.resetTimer`, `game.adjustTime`, `game.manualTimeEntry`, `admin.saveToStorage`).

### Verze `v0.7.10-beta` (Testovací větev)
- **Kompletní neprodyšné uzamčení režimu Divák (Spectator Lockdown):**
  - Uzamčeny všechny zbývající interaktivní prvky: klikací obrázky log družstev v `#acc-logos`, popisky (`<label>`) a checkboxy automatického režimu a posuvníky v `#acc-music`.
  - Přidány bezpečnostní pojistky přímo do JavaScriptových funkcí nahrávání log (`handleLogoUpload`, `handleDefaultLogo`), znělek (`handleAnthemUpload`) a nastavení hudby (`pickDirectory`, `setAutoEnabled`, `setMode`, `setFadeDuration`, `setAutoChangeStrategy`), které v režimu Divák akci striktně zablokují.

### Verze `v0.7.9-beta` (Testovací větev)
- **Rozšíření předvoleb názvů zápasů o umístění:**
  - Do výběrového pole *Název / Skupina* v rozpisu zápasů přidány předvolby: *O 3. místo*, *O 5. místo*, *O 7. místo*, *O 9. místo*, *O 11. místo*, *O 13. místo* a *O 15. místo*.

### Verze `v0.7.8-beta` (Testovací větev)
- **Vizuální a funkční uzamčení OO v režimu Divák (Spectator Lock):**
  - V režimu Divák jsou všechny akční a editační prvky (góly, časomíra, změny rozpisu, nastavení časů a týmů) zašedlé a uzamčené proti nechtěnému klikání.
  - Plně zachována možnost proklikávání menu, akordeonů, generování/kopírování QR kódů a odkazů na veřejná zobrazení/projekci.
  - Přidána horní žlutá informační lišta (`#spectator-banner`) s tlačítkem **„👑 Převzít řízení (Master)“**.
  - Při převzetí řízení jiným počítačem se na dosavadní řídicí stanici zobrazí upozornění a stanice se automaticky přepne do uzamčeného režimu Divák s horním žlutým pruhem.

### Verze `v0.7.7-beta` (Testovací větev)
- **Inteligentní správa relací a ochrana dat při práci z více počítačů:**
  - Implementována záchranná brzda při startu OO: porovnání časových razítek (`lastUpdate`) v cloudu Firebase a lokálním úložišti `localStorage`.
  - Pokud jsou v cloudu novější data (např. odehraný turnaj z haly), aplikace zobrazí modální dialog s možností okamžitého načtení dat z cloudu a zamezí automatickému přepsání staršími lokálními daty.
  - Implementován mechanismus řízení **Master vs. Divák**:
    - Detekce aktivně řízeného turnaje jiným zařízením s dotazem na převzetí řízení.
    - Režim Divák (pouze pro čtení) má zablokovaný zápis do cloudu pro maximální bezpečnost.
    - Vizuální stavový štítek role v patičce OO (`👑 MASTER` / `👁️ DIVÁK`) s možností přepnutí jedním klikem.
  - Přidáno přímé tlačítko **„☁️ Uložit turnaj do cloudu“** přímo do akordeonu *Nastavení Turnaje* (sekce *Rychlý start / Import / Obnova*) včetně zobrazení času posledního uložení.
  - Opravena obnova časového razítka `lastUpdate` při načítání z `localStorage`.

### Verze `v0.7.6` (Výchozí baseline)
- **Založení Gitu & stabilní výchozí bod:**
  - Sjednocení a zakotvení funkční single-file verze `index.html`.
  - Vytvoření testovacího prostředí `beta/` (s verzí `v0.7.6-beta`) i produkčního kořene (`v0.7.6`).
  - Vizuální zobrazení verze přímo v aplikaci (titulek okna, patička OO, JS konstanta `APP_VERSION`).
  - Vytvoření živé projektové dokumentace `README.md`.
  - Konfigurace `.gitignore` pro ignorování interních a archivních složek (`002 Verze/`, `001 Pomocné soubory/`, `003 Bugs/`).
  - Integrace automatického publikování GitHub Pages přes GitHub Actions.
