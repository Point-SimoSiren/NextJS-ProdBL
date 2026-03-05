"use client";

import { useState } from "react";
import styles from "../page.module.css";

const columns = [
  { key: "backlog", title: "1. Tuotteen kehitysjono" },
  { key: "in_progress", title: "2. Tyon alla" },
  { key: "done", title: "3. Valmiit" },
];

const nextStatus = {
  backlog: "in_progress",
  in_progress: "done",
  done: null,
};

const prevStatus = {
  backlog: null,
  in_progress: "backlog",
  done: "in_progress",
};

export default function BoardClient({ initialItems }) {
  // "use client" mahdollistaa React-hookit aivan kuten tavallisessa React-sovelluksessa.
  // Server Component (app/page.js) syottaa ensidatan propsina.
  const [items, setItems] = useState(initialItems);
  const [newTitle, setNewTitle] = useState("");

  async function loadItems() {
    const response = await fetch("/api/use-cases", { cache: "no-store" });
    const data = await response.json();
    setItems(data);
  }

  async function addUseCase(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await fetch("/api/use-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    setNewTitle("");
    loadItems();
  }

  async function moveItem(id, status) {
    await fetch("/api/use-cases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadItems();
  }

  return (
    <>
      <form className={styles.form} onSubmit={addUseCase}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Lisaa uusi kayttotapaus backlogiin..."
        />
        <button type="submit">Lisaa</button>
      </form>

      <section className={styles.board}>
        {columns.map((column) => {
          const columnItems = items.filter((item) => item.status === column.key);

          return (
            <article className={styles.column} key={column.key}>
              <h2>{column.title}</h2>
              {columnItems.length === 0 ? <p className={styles.empty}>Ei riveja.</p> : null}

              {columnItems.map((item) => (
                <div className={styles.card} key={item.id}>
                  <strong>{item.title}</strong>
                  <small>id: {item.id}</small>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, prevStatus[item.status])}
                      disabled={!prevStatus[item.status]}
                    >
                      Vasemmalle
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(item.id, nextStatus[item.status])}
                      disabled={!nextStatus[item.status]}
                    >
                      Oikealle
                    </button>
                  </div>
                </div>
              ))}
            </article>
          );
        })}
      </section>
    </>
  );
}
