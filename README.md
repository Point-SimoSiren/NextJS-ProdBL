# Next.js oppimisdemo: kehitysjono-taulu

Yksinkertainen Next.js-sovellus, jossa on kolme saraketta:

1. Tuotteen kehitysjono
2. Tyon alla
3. Valmiit

Data tallennetaan paikalliseen SQLite-tiedostoon `data/board.db`.

## Kaynnistys

```bash
npm install
npm run dev
```

Avaa selain: `http://localhost:3000`

## Mita katsoa jos osaat jo Express + React

- `app/page.js`
  - Oletuksena **Server Component** (ei `use client`).
- `app/components/BoardClient.js`
  - **Client Component** (`"use client"`), jossa React-hookit.
- `app/api/use-cases/route.js`
  - Next.js **Route Handler** (vastaa Express-routeja).
- `lib/db.js`
  - SQLite-initialisointi ja SQL-funktiot.

## API (paikallinen)

- `GET /api/use-cases`
- `POST /api/use-cases` body: `{ "title": "..." }`
- `PATCH /api/use-cases` body: `{ "id": 1, "status": "in_progress" }`
