# 📋 Správce Úkolů

Webová aplikace pro správu úkolů s dynamickým frontendem a REST API backendem.

## ✨ Funkce

- 🎨 **Moderní UI/UX** - Gradient design s animacemi
- 🗄️ **SQLite Databáze** - Lokální ukládání dat
- 🔄 **REST API** - Plná CRUD funkcionalita
- 📅 **Chytré Datumy** - "Dnes", "Zítra", "Po termínu"
- 🎯 **Validace Formulářů** - Chybové zprávy

## 🛠️ Technologie

- **Backend**: Flask + SQLAlchemy
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Databáze**: SQLite
- **API**: RESTful JSON API

## 📁 Struktura Projektu

```

task_manager/
├── app.py                 # Hlavní Flask aplikace
├── requirements.txt       # Python závislosti
├── README.md             # Dokumentace (anglicky)
├── README_CZ.md          # Dokumentace (česky)
├── database/             # Skripty pro správu databáze
│   ├── create_db.py      # Skript pro vytvoření databáze
│   ├── delete_db.py      # Skript pro smazání databáze
│   ├── reset_db.py       # Skript pro reset databáze
│   └── recreate_db.py    # Starší skript pro znovuvytvoření
├── tasks.db              # SQLite databáze (automaticky vytvořená)
├── templates/            # HTML šablony
│   ├── index.html        # Hlavní stránka
│   └── add_task.html     # Stránka pro přidání úkolu
└── static/               # Statické soubory
    ├── styles/
    │   └── style.css     # Styly
    └── js/
        ├── index.js      # Logika hlavní stránky
        └── add_task.js   # Logika přidání úkolu
```

## 🚀 Rychlý Start

### 1. Klonování Repozitáře

```bash
git clone https://github.com/NoGenryFord/task_manager.git
cd task_manager
```

### 2. Vytvoření Virtuálního Prostředí (Doporučeno)

```bash
# Windows
python -m venv .venv
.venv/Scripts/activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Instalace Závislostí

```bash
pip install -r requirements.txt
```

### 4. Inicializace Databáze

```bash
python database/reset_db.py
```

### 5. Spuštění Serveru

```bash
python app.py
```

### 6. Otevření v Prohlížeči

Přejděte na: `http://127.0.0.1:5000`

## 🗄️ Správa Databáze

### Vytvoření Databáze

```bash
python database/create_db.py
```

### Reset Databáze s Ukázkovými Daty

```bash
python database/reset_db.py
```

### Smazání Databáze

```bash
python database/delete_db.py
```

## 📚 Dokumentace API

### Endpointy pro Úkoly

#### Získání Všech Úkolů

- **GET** `/tasks`
- **Odpověď**: JSON pole úkolů

#### Získání Jednoho Úkolu

- **GET** `/tasks/{id}`
- **Odpověď**: JSON objekt úkolu

#### Vytvoření Úkolu

- **POST** `/tasks`
- **Tělo Požadavku**:

```json
{
  "title": "Název úkolu",
  "description": "Popis úkolu",
  "dueDate": "2025-07-10"
}
```

#### Aktualizace Úkolu

- **PUT** `/tasks/{id}`
- **Tělo Požadavku**:

```json
{
  "title": "Nový název",
  "description": "Nový popis",
  "due_date": "2025-07-15",
  "is_done": true
}
```

#### Smazání Úkolu

- **DELETE** `/tasks/{id}`

### Stránky

#### Domovská Stránka

- **GET** `/`
- Zobrazuje seznam úkolů

#### Stránka Přidání Úkolu

- **GET** `/add_task`
- Formulář pro vytvoření nového úkolu

## 🎯 Funkcionalita

### ✅ Dokončeno

- [x] CRUD operace pro úkoly
- [x] Moderní UI s gradienty a animacemi
- [x] Responzivní design
- [x] Validace formulářů
- [x] Chytré formátování datumů
- [x] REST API
- [x] Popup menu akcí
- [x] Zprávy o úspěchu/chybách

## 🐛 Známé Problémy

V současné době nejsou žádné kritické problémy.

## 🔧 Nastavení pro Vývoj

### Vývojový Režim

Flask server běží ve vývojovém režimu ve výchozím nastavení:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Schéma Databáze

```sql
CREATE TABLE task (
    id INTEGER PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(200) NOT NULL,
    due_date VARCHAR(10),
    is_done BOOLEAN DEFAULT 0
);
```

---

## 🆘 Potřebujete Pomoc?

Pokud narazíte na problémy:

1. Ujistěte se, že je nainstalován Python (verze 3.7+)
2. Zkontrolujte, zda jsou všechny závislosti nainstalovány: `pip install -r requirements.txt`
3. Ujistěte se, že port 5000 není obsazen jinou aplikací
4. Zkuste restartovat server
5. Zkontrolujte logy v terminálu pro podrobné informace o chybách

### Diagnostické Příkazy:

```bash
# Kontrola verze Pythonu
python --version

# Kontrola nainstalovaných balíčků
pip list

# Kontrola dostupných portů
netstat -an | findstr 5000
```

## 🌍 Jazykové Verze

- 🇬🇧 **Angličtina**: `README.md`
- 🇨🇿 **Čeština**: `README_CZ.md`

---
