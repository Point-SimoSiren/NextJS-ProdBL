import BoardClient from "./components/BoardClient";
import styles from "./page.module.css";
import { listUseCases } from "@/lib/db";

// App Routerissa page.js on oletuksena Server Component.
// Eli tämä renderöidään ensin palvelimella ilman "use client" -direktiiviä.
// Pakotetaan dynaamiseksi, jotta SQLite luetaan jokaisella pyynnöllä
// eikä vain build-vaiheessa generoituun static HTML:ään.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const initialItems = listUseCases();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Kehitysjono-taulu (Next.js + SQLite)</h1>
        <p>
          Trello-taulu sovellus Next.js App Routerilla:
          React UI + Route Handlers + SQLite samassa projektissa.
        </p>
      </header>

      <BoardClient initialItems={initialItems} />
    </main>
  );
}
