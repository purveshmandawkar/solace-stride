import { useState, useEffect, useMemo } from "react";
import { getLogs, getGoals } from "../store.js";

interface LogEntry {
  id: string;
  date: string;
  timestamp: string;
  type: "study" | "project" | "health" | "freelance";
  note: string;
}

interface Goal {
  id: string;
  name: string;
  category: string;
  targetDate: string;
  progress: number;
  status: "active" | "paused" | "done";
  createdAt: string;
}

function todayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateKeyOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return todayKey(d);
}

export default function Me() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setLogs(getLogs() as LogEntry[]);
    setGoals(getGoals() as Goal[]);
  }, []);

  const streak = useMemo(() => {
    const today = todayKey(new Date());
    const logDates = new Set(logs.map((l) => l.date));
    let count = 0;
    let i = 0;
    while (true) {
      const key = dateKeyOffset(i);
      // if today has no logs yet, still allow streak from yesterday
      if (i === 0 && !logDates.has(key)) {
        i++;
        continue;
      }
      if (!logDates.has(key)) break;
      count++;
      i++;
      if (i > 365) break;
    }
    void today;
    return count;
  }, [logs]);

  const weekLogs = useMemo(() => {
    const keys = Array.from({ length: 7 }, (_, i) => dateKeyOffset(i));
    return logs.filter((l) => keys.includes(l.date));
  }, [logs]);

  const activeGoals = useMemo(() => goals.filter((g) => g.status === "active"), [goals]);
  const doneGoals = useMemo(() => goals.filter((g) => g.status === "done"), [goals]);

  const weekByType = useMemo(() => {
    const counts: Record<string, number> = { study: 0, project: 0, health: 0, freelance: 0 };
    weekLogs.forEach((l) => {
      if (counts[l.type] !== undefined) counts[l.type]++;
    });
    return counts;
  }, [weekLogs]);

  const TYPE_COLORS: Record<string, string> = {
    study: "#1D9E75",
    project: "#185FA5",
    health: "#0F6E56",
    freelance: "#BA7517",
  };

  const statBoxStyle: React.CSSProperties = {
    flex: 1,
    background: "var(--bg-secondary)",
    borderRadius: "var(--radius-md)",
    padding: "12px 8px",
    textAlign: "center",
  };

  return (
    <div className="page">
      {/* Profile strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#EEEDFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "14px",
            color: "#534AB7",
            flexShrink: 0,
          }}
        >
          PM
        </div>
        <div>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
            Purvesh Mandawkar
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-tertiary)", marginTop: "2px" }}>
            ENTC · SCOE · Year 2
          </p>
        </div>
      </div>

      {/* Stat boxes */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <div style={statBoxStyle}>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            {streak}
          </p>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>
            day streak
          </p>
        </div>
        <div style={statBoxStyle}>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            {weekLogs.length}
          </p>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>
            logs this week
          </p>
        </div>
        <div style={statBoxStyle}>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            {activeGoals.length}
          </p>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "2px" }}>
            active goals
          </p>
        </div>
      </div>

      {/* Weekly breakdown */}
      <div className="section">
        <h2 className="section-title">This week</h2>
        <div className="card">
          {weekLogs.length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--text-tertiary)", textAlign: "center", padding: "8px 0" }}>
              Start logging on the Home screen 📊
            </p>
          ) : (
            Object.entries(weekByType)
              .filter(([, count]) => count > 0)
              .map(([type, count]) => (
                <div
                  key={type}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "0.5px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: TYPE_COLORS[type],
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        color: "var(--text-primary)",
                        textTransform: "capitalize",
                      }}
                    >
                      {type}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: TYPE_COLORS[type],
                      background: type === "study" ? "#EAF3DE"
                        : type === "project" ? "#E6F1FB"
                        : type === "health" ? "#E1F5EE"
                        : "#FAEEDA",
                      padding: "2px 10px",
                      borderRadius: "10px",
                    }}
                  >
                    {count} {count === 1 ? "log" : "logs"}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Completed goals */}
      <div className="section">
        <h2 className="section-title">Completed</h2>
        <div className="card">
          {doneGoals.length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--text-tertiary)" }}>
              No completed goals yet.
            </p>
          ) : (
            doneGoals.map((goal, i) => (
              <div
                key={goal.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 0",
                  borderBottom: i < doneGoals.length - 1 ? "0.5px solid var(--border)" : "none",
                }}
              >
                <span style={{ color: "#1D9E75", fontWeight: 700, fontSize: "15px" }}>✓</span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--text-tertiary)",
                    textDecoration: "line-through",
                  }}
                >
                  {goal.name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
