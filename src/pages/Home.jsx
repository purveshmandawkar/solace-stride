import { useEffect, useState } from "react";
import { addLog, getLogs, getLogsForDate } from "../store.js";

const TYPE_COLORS = {
  study: "#1D9E75",
  project: "#185FA5",
  health: "#0F6E56",
  freelance: "#BA7517",
};

const TYPES = ["study", "project", "health", "freelance"];

function formatToday(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function todayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function nowTime(d) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default function Home() {
  const [type, setType] = useState("study");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const today = new Date();
  const dateKey = todayKey(today);

  useEffect(() => {
    setEntries(getLogsForDate(dateKey));
    // ensure getLogs is referenced
    void getLogs;
  }, [dateKey]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!note.trim()) return;
    const now = new Date();
    addLog({
      date: todayKey(now),
      timestamp: nowTime(now),
      type,
      note: note.trim(),
    });
    setEntries(getLogsForDate(dateKey));
    setNote("");
    setType("study");
  }

  return (
    <div className="page">
      <p className="today-date">{formatToday(today)}</p>

      <section className="section">
        <h2 className="section-title">Add to today</h2>
        <form className="log-form" onSubmit={handleSubmit}>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <input
            className="form-control"
            type="text"
            placeholder="what did you do?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            + Log it
          </button>
        </form>
      </section>

      <section className="section">
        <h2 className="section-title">Today's log</h2>
        {entries.length === 0 ? (
          <p className="empty-state">
            Nothing logged yet. Add your first block above.
          </p>
        ) : (
          <ul className="log-list">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="log-card"
                style={{ borderLeftColor: TYPE_COLORS[entry.type] }}
              >
                <div className="log-note">{entry.note}</div>
                <div className="log-time">{entry.timestamp}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
