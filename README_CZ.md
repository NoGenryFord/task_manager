# Správce Úkolů - Webová Aplikace

Komplexní webový systém pro správu úkolů postavený na frameworku Flask a moderních webových technologiích. Tato aplikace poskytuje robustní řešení pro organizaci, sledování a správu úkolů s intuitivním uživatelským rozhraním a RESTful API architekturou.

## Exekutivní Souhrn

Správce Úkolů je full-stack webová aplikace navržená pro efektivní správu úkolů. Využívá Model-View-Controller (MVC) architekturu s Flask backendem, integrací SQLite databáze a responzivním frontendem. Aplikace klade důraz na bezpečnost, uživatelskou zkušenost a kvalitu kódu při zachování profesionálních vývojových standardů.

## Klíčové Funkce

### Základní Funkcionalita

- **Kompletní CRUD Operace**: Vytváření, čtení, aktualizace a mazání úkolů
- **Pokročilé Filtrování**: Filtrování úkolů podle stavu (Aktivní, Dokončené, Všechny)
- **Inteligentní Řazení**: Řazení podle termínu, data vytvoření nebo priority
- **Správa Stavu**: Sledování dokončení úkolů a úkolů po termínu
- **Inteligence Dat**: Automatické rozpoznání "Dnes", "Zítra" a úkolů po termínu

### Technická Excelence

- **RESTful API**: Komplexní REST endpointy pro všechny operace
- **Validace Vstupů**: Server-side a client-side validace s sanitizací
- **Bezpečnostní Opatření**: Ochrana proti XSS a SQL injection
- **Responzivní Design**: Mobilně přívětivé rozhraní s adaptivními layouty
- **Zpracování Chyb**: Komplexní správa chyb a uživatelská zpětná vazba

### Uživatelská Zkušenost

- **Moderní Rozhraní**: Čisté, profesionální design s gradient prvky
- **Interaktivní Prvky**: Hover efekty, animace a vizuální zpětná vazba
- **Přístupnost**: Navigace klávesnicí a kompatibilita se screen readery
- **Výkon**: Optimalizované načítání a plynulé interakce

## Technologický Stack

### Backend Technologie

- **Flask Framework**: Lehký WSGI web aplikační framework
- **SQLAlchemy ORM**: Databázová abstrakční vrstva a object-relational mapping
- **SQLite Databáze**: Lehký, bezserverový databázový engine
- **Python 3.x**: Primární programovací jazyk

### Frontend Technologie

- **HTML5**: Sémantické značkování s moderními standardy
- **CSS3**: Pokročilé stylování s Flexbox, Grid a animacemi
- **Vanilla JavaScript**: Čistý JavaScript bez externích závislostí
- **Responzivní Design**: Mobile-first přístup s media queries

### Vývojové Nástroje

- **MVC Architektura**: Model-View-Controller design pattern
- **RESTful API**: Representational State Transfer architektonický styl
- **JSON**: Formát pro výměnu dat v API komunikaci

## Architektura Projektu

### Struktura Adresářů

```
task_manager/
├── app.py                    # Flask aplikační entry point a definice cest
├── requirements.txt          # Závislosti Python balíčků
├── README.md                # Projektová dokumentace (anglicky)
├── README_CZ.md             # Projektová dokumentace (česky)
├── .gitignore               # Git ignore pravidla pro Python projekty
├── database/                # Databázové správcovské utility
│   ├── create_db.py         # Skript pro inicializaci databáze
│   ├── delete_db.py         # Utility pro odstranění databáze
│   ├── reset_db.py          # Reset databáze s ukázkovými daty
│   └── recreate_db.py       # Legacy skript pro znovuvytvoření databáze
├── tasks.db                 # SQLite databázový soubor (auto-generovaný)
├── templates/               # Jinja2 HTML šablony
│   ├── index.html           # Hlavní dashboard úkolů
│   ├── add_task.html        # Formulář pro vytvoření úkolu
│   └── edit_task.html       # Formulář pro úpravu úkolu
└── static/                  # Statické webové assety
    ├── styles/
    │   └── style.css        # Stylesheet aplikace
    ├── js/
    │   ├── index.js         # Funkcionalita dashboardu
    │   ├── add_task.js      # Logika vytváření úkolů
    │   └── edit_task.js     # Logika úprav úkolů
    └── favicon.ico          # Ikona aplikace
```

### Databázové Schéma

```sql
Tabulka Tasks:
- id (INTEGER PRIMARY KEY): Unikátní identifikátor úkolu
- title (VARCHAR(200)): Název/titulek úkolu
- description (TEXT): Detailní popis úkolu
- due_date (DATE): Termín splnění úkolu
- is_done (BOOLEAN): Stav dokončení
- created_at (DATETIME): Časové razítko vytvoření
```

## Instalace a Nastavení

### Systémové Požadavky

- Python 3.7 nebo vyšší
- Moderní webový prohlížeč (Chrome, Firefox, Safari, Edge)
- Minimálně 50MB volného místa na disku

### Kroky Instalace

#### 1. Nastavení Repozitáře

```bash
git clone https://github.com/NoGenryFord/task_manager.git
cd task_manager
```

#### 2. Python Virtuální Prostředí (Doporučeno)

```bash
# Windows Command Prompt
python -m venv .venv
.venv/Scripts/activate

# Windows PowerShell
python -m venv .venv
.venv/Scripts/Activate.ps1

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### 3. Instalace Závislostí

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 4. Inicializace Databáze

```bash
# Vytvoření databáze s ukázkovými daty
python database/reset_db.py

# Nebo vytvoření prázdné databáze
python database/create_db.py
```

#### 5. Spuštění Aplikace

```bash
python app.py
```

#### 6. Přístup k Aplikaci

Otevřete webový prohlížeč a přejděte na: `http://127.0.0.1:5000`

## Správa Databáze

Aplikace obsahuje komplexní databázové správcovské utility pro vývoj a údržbu.

### Dostupné Příkazy

#### Vytvoření Databáze

```bash
python database/create_db.py
```

Vytvoří prázdnou databázi s požadovaným schématem.

```bash
python database/reset_db.py
```

Znovu vytvoří databázi a naplní ji ukázkovými úkoly pro testování a demonstrační účely.

#### Odstranění Databáze

```bash
python database/delete_db.py
```

Kompletně odstraní databázový soubor. **Varování**: Tato akce je nevratná.

### Ukázková Data

Reset skript obsahuje rozmanité ukázkové úkoly demonstrující:

- Různé stavy úkolů (Aktivní, Dokončené)
- Různé termíny splnění (Minulé, Současné, Budoucí)
- Realistické popisy úkolů a priority

## Dokumentace API

Správce Úkolů poskytuje komplexní RESTful API pro programový přístup ke všem funkcionalitám.

### Základní URL

```
http://127.0.0.1:5000/api
```

### Autentifikace

V současnosti API pracuje bez autentifikace pro vývojové účely. V produkčních prostředích implementujte odpovídající autentifikační mechanismy.

### Přehled Endpointů

#### Správa Úkolů

##### Získání Všech Úkolů

- **Metoda**: `GET`
- **Endpoint**: `/tasks`
- **Popis**: Vrací všechny úkoly v databázi
- **Formát Odpovědi**: JSON pole objektů úkolů
- **Kód Úspěchu**: 200 OK

##### Získání Jednoho Úkolu

- **Metoda**: `GET`
- **Endpoint**: `/tasks/{id}`
- **Popis**: Vrací konkrétní úkol podle ID
- **Parametry**:
  - `id` (integer): Identifikátor úkolu
- **Formát Odpovědi**: JSON objekt úkolu
- **Kód Úspěchu**: 200 OK
- **Chybové Kódy**: 404 Not Found

##### Vytvoření Nového Úkolu

- **Metoda**: `POST`
- **Endpoint**: `/tasks`
- **Popis**: Vytvoří nový úkol
- **Request Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Název úkolu (povinné)",
    "description": "Detailní popis (volitelné)",
    "due_date": "YYYY-MM-DD (volitelné)"
  }
  ```
- **Kód Úspěchu**: 201 Created
- **Chybové Kódy**: 400 Bad Request, 422 Unprocessable Entity

##### Aktualizace Existujícího Úkolu

- **Metoda**: `PUT`
- **Endpoint**: `/tasks/{id}`
- **Popis**: Aktualizuje existující úkol
- **Parametry**:
  - `id` (integer): Identifikátor úkolu
- **Request Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Aktualizovaný název (volitelné)",
    "description": "Aktualizovaný popis (volitelné)",
    "due_date": "YYYY-MM-DD (volitelné)",
    "is_done": true/false (volitelné)
  }
  ```
- **Kód Úspěchu**: 200 OK
- **Chybové Kódy**: 400 Bad Request, 404 Not Found, 422 Unprocessable Entity

##### Smazání Úkolu

- **Metoda**: `DELETE`
- **Endpoint**: `/tasks/{id}`
- **Popis**: Trvale odstraní úkol
- **Parametry**:
  - `id` (integer): Identifikátor úkolu
- **Kód Úspěchu**: 204 No Content
- **Chybové Kódy**: 404 Not Found

### Datové Modely

#### Struktura Objektu Úkolu

```json
{
  "id": 1,
  "title": "Příklad úkolu",
  "description": "Popis úkolu",
  "due_date": "2025-07-15",
  "is_done": false,
  "created_at": "2025-07-07T10:30:00"
}
```

### Zpracování Chyb

Všechny API endpointy vrací konzistentní chybové odpovědi:

```json
{
  "error": "Popis chyby",
  "message": "Detailní chybová zpráva",
  "status_code": 400
}
```

## Funkce Uživatelského Rozhraní

### Funkcionalita Dashboardu

- **Přehled Úkolů**: Komplexní zobrazení všech úkolů s indikátory stavu
- **Pokročilé Filtrování**: Filtrování podle stavu dokončení (Všechny, Aktivní, Dokončené)
- **Inteligentní Řazení**: Řazení podle termínu, data vytvoření nebo abecedně
- **Vizuální Indikátory Stavu**: Barevně odlišené stavy úkolů a oznámení o překročení termínu
- **Interaktivní Prvky**: Hover efekty a plynulé animace

### Správa Formulářů

- **Validace v Reálném Čase**: Okamžitá zpětná vazba na vstupy formuláře
- **Inteligence Dat**: Rozpoznání dat v přirozeném jazyce
- **Prevence Chyb**: Client-side a server-side validace
- **Uživatelská Zpětná Vazba**: Systém úspěšných a chybových zpráv
- **Přístupnost**: Navigace klávesnicí a podpora screen readerů

## Bezpečnostní Aspekty

### Implementovaná Bezpečnostní Opatření

- **Validace Vstupů**: Komplexní server-side validace všech uživatelských vstupů
- **Ochrana proti XSS**: HTML escaping a sanitizace obsahu
- **Prevence SQL Injection**: SQLAlchemy ORM parametrizované dotazy
- **Zpracování Chyb**: Sanitizované chybové zprávy pro prevenci úniku informací

### Doporučení pro Produkci

- Implementovat uživatelskou autentifikaci a autorizaci
- Povolit HTTPS/TLS šifrování
- Přidat rate limiting pro API endpointy
- Implementovat správu session s bezpečnými cookies
- Nakonfigurovat Content Security Policy (CSP) hlavičky

## Výkon a Optimalizace

### Současné Optimalizace

- **Databázové Indexy**: Optimalizované dotazy s vhodnými indexy
- **Caching Statických Assetů**: Efektivní načítání CSS a JavaScript
- **Minimální Závislosti**: Výběr lehkých frameworků
- **Responzivní Design**: Optimalizováno pro různé velikosti obrazovek

## Vývojové Směrnice

### Standardy Kvality Kódu

- **Dokumentace**: Komplexní inline komentáře a docstringy
- **Zpracování Chyb**: Robustní správa výjimek v celé aplikaci
- **Struktura Kódu**: Čistá, udržovatelná MVC architektura
- **Testování**: Vestavěná validace a kontrola chyb

### Implementované Nejlepší Praktiky

- RESTful API design principy
- Sémantické HTML značkování
- Moderní CSS metodologie (BEM-like konvence pojmenování)
- Progressive enhancement přístup
- Dodržování přístupnosti (WCAG směrnice)

## Kompatibilita s Prohlížeči

### Podporované Prohlížeče

- **Chrome**: Verze 80+
- **Firefox**: Verze 75+
- **Safari**: Verze 13+
- **Edge**: Verze 80+

### Požadavky na Funkce

- Podpora JavaScript ES6+
- Podpora CSS Flexbox a Grid
- Kompatibilita s Fetch API
- Podpora Local Storage

## Řešení Problémů

### Běžné Problémy a Řešení

#### Chyby Připojení k Databázi

```bash
# Řešení: Reset databáze
python database/reset_db.py
```

#### Port Již Používán

```bash
# Zkontrolovat, který proces používá port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Ukončit proces nebo změnit port v app.py
```

#### Chyby Oprávnění

```bash
# Zajistit správná oprávnění souborů
chmod 755 database/
chmod 644 database/*.py
```

#### Chyby Module Not Found

```bash
# Ověřit aktivaci virtuálního prostředí
pip list
pip install -r requirements.txt
```

### Diagnostické Příkazy

```bash
# Systémová diagnostika
python --version
pip list
netstat -an | findstr 5000  # Windows
lsof -i :5000               # macOS/Linux
```

### Standardy Kódu

- Dodržujte PEP 8 pro Python kód
- Používejte významné názvy proměnných a funkcí
- Zahrnujte komplexní komentáře
- Udržujte konzistentní odsazení (4 mezery)
- Pište srozumitelný kód

## Jazykové Verze

- 🇬🇧 **Angličtina**: `README.md`
- 🇨🇿 **Čeština**: `README_CZ.md`

---
