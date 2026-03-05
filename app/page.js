import BoardClient from "./components/BoardClient";
import styles from "./page.module.css";
import { listUseCases } from "@/lib/db";

// App Routerissa page.js on oletuksena Server Component.
// Eli tama renderoidaan ensin palvelimella ilman "use client" -direktiivia.
// Pakotetaan dynaamiseksi, jotta SQLite luetaan jokaisella pyynnolla
// eika vain build-vaiheessa generoituun static HTML:aan.
export const dynamic = "force-dynamic";

export default function HomePage() {
  const initialItems = listUseCases();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Kehitysjono-taulu (Next.js + SQLite)</h1>
        <p>
          Tama demo nayttaa yhden tavan rakentaa pieni taysstack-sivu App Routerilla:
          React UI + Route Handlers + SQLite samassa projektissa.
        </p>
      </header>

      <BoardClient initialItems={initialItems} />
    </main>
  );
}
