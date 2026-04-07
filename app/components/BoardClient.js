"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../page.module.css";

const columns = [
  { key: "backlog", title: "1. Tuotteen kehitysjono" },
  { key: "in_progress", title: "2. Työn alla" },
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
  const [showBlast, setShowBlast] = useState(false);
  const [blastId, setBlastId] = useState(0);
  const [showProgressFx, setShowProgressFx] = useState(false);
  const [progressFxId, setProgressFxId] = useState(0);
  const [showDoneFx, setShowDoneFx] = useState(false);
  const [doneFxId, setDoneFxId] = useState(0);
  const [showDeleteFx, setShowDeleteFx] = useState(false);
  const [deleteFxId, setDeleteFxId] = useState(0);
  const blastTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const doneTimerRef = useRef(null);
  const deleteTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (blastTimerRef.current) {
        clearTimeout(blastTimerRef.current);
      }
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
      if (doneTimerRef.current) {
        clearTimeout(doneTimerRef.current);
      }
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, []);

  function triggerConfetti() {
    setBlastId((value) => value + 1);
    setShowBlast(true);

    if (blastTimerRef.current) {
      clearTimeout(blastTimerRef.current);
    }

    blastTimerRef.current = setTimeout(() => {
      setShowBlast(false);
    }, 1300);
  }

  function triggerProgressFx() {
    setProgressFxId((value) => value + 1);
    setShowProgressFx(true);

    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }

    progressTimerRef.current = setTimeout(() => {
      setShowProgressFx(false);
    }, 900);
  }

  function triggerDoneFx() {
    setDoneFxId((value) => value + 1);
    setShowDoneFx(true);

    if (doneTimerRef.current) {
      clearTimeout(doneTimerRef.current);
    }

    doneTimerRef.current = setTimeout(() => {
      setShowDoneFx(false);
    }, 1700);
  }

  function triggerDeleteFx() {
    setDeleteFxId((value) => value + 1);
    setShowDeleteFx(true);

    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
    }

    deleteTimerRef.current = setTimeout(() => {
      setShowDeleteFx(false);
    }, 980);
  }

  async function loadItems() {
    const response = await fetch("/api/use-cases", { cache: "no-store" });
    const data = await response.json();
    setItems(data);
  }

  async function addUseCase(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const response = await fetch("/api/use-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    if (!response.ok) return;

    setNewTitle("");
    triggerConfetti();
    await loadItems();
  }

  async function moveItem(id, status) {
    const response = await fetch("/api/use-cases", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (!response.ok) return;

    if (status === "in_progress") {
      triggerProgressFx();
    }

    if (status === "done") {
      triggerDoneFx();
    }

    await loadItems();
  }

  async function deleteItem(id) {
    const response = await fetch("/api/use-cases", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) return;

    triggerDeleteFx();
    await loadItems();
  }

  return (
    <>
      {showProgressFx ? (
        <div key={progressFxId} className={styles.progressRush} aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <span className={styles.rushLine} key={index} />
          ))}
        </div>
      ) : null}

      {showDoneFx ? (
        <div key={doneFxId} className={styles.doneVictory} aria-hidden="true">
          <span className={styles.vMark}>V</span>
        </div>
      ) : null}

      {showDeleteFx ? (
        <div key={deleteFxId} className={styles.deleteLaser} aria-hidden="true">
          <span className={styles.deleteFlash} />
          {Array.from({ length: 10 }, (_, index) => (
            <span className={styles.laserBeam} key={index} />
          ))}
        </div>
      ) : null}

      <div className={styles.formShell}>
        {showBlast ? (
          <div key={blastId} className={styles.confettiBurst} aria-hidden="true">
            {Array.from({ length: 24 }, (_, index) => (
              <span className={styles.confettiPiece} key={index} />
            ))}
          </div>
        ) : null}

        <form className={styles.form} onSubmit={addUseCase}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Lisää uusi käyttötapaus backlogiin..."
          />
          <button type="submit">Lisää</button>
        </form>
      </div>

      <section className={styles.board}>
        {columns.map((column) => {
          const columnItems = items.filter((item) => item.status === column.key);

          return (
            <article className={`${styles.column} ${styles[column.key]}`} key={column.key}>
              <h2>{column.title}</h2>
              {columnItems.length === 0 ? <p className={styles.empty}>Ei rivejä.</p> : null}

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
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => deleteItem(item.id)}
                    >
                      Poista
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
