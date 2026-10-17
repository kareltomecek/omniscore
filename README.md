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
