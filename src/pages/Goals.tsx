import { useState, useEffect } from "react";
import {
  getGoals,
  addGoal,
  updateGoalProgress,
  updateGoalStatus,
} from "../store.js";

type GoalStatus = "active" | "paused" | "done";
type GoalCategory = "internship" | "course" | "project" | "exam" | "freelance";

interface Goal {
  id: string;
  name: string;
  category: GoalCategory;
  targetDate: string;
  progress: number;
  status: GoalStatus;
  createdAt: string;
}

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  internship: "#534AB7",
  course: "#1D9E75",
  project: "#BA7517",
  exam: "#185FA5",
  freelance: "#0F6E56",
};

const CATEGORY_BG: Record<GoalCategory, string> = {
  internship: "#EEEDFE",
  course: "#EAF3DE",
  project: "#FAEEDA",
  exam: "#E6F1FB",
  freelance: "#E1F5EE",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GoalCategory>("internship");
  const [targetDate, setTargetDate] = useState("");

  function refresh() {
    setGoals(getGoals() as Goal[]);
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addGoal({ name: name.trim(), category, targetDate, progress: 0, status: "active" });
    setName("");
    setCategory("internship");
    setTargetDate("");
    setShowForm(false);
    refresh();
  }

  function handleProgress(id: string, val: number) {
    updateGoalProgress(id, val);
    refresh();
  }

  function handleStatus(id: string, status: GoalStatus) {
    updateGoalStatus(id, status);
    refresh();
  }

  const visible = goals.filter((g) => g.status !== "done");

  return (
    <div className="page">
      <p className="page-title">Goals</p>
      <p className="page-subtitle">Track what matters most.</p>

      {/* Add goal toggle */}
      <div className="section">
        <button
          className="btn-primary"
          style={{ width: "100%", marginBottom: showForm ? "12px" : "0" }}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "✕ Cancel" : "+ New goal"}
        </button>

        {showForm && (
          <form
            className="log-form"
            onSubmit={handleAdd}
            style={{ animation: "fadeIn 0.15s ease" }}
          >
            <input
              className="form-control"
              type="text"
              placeholder="Goal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value as GoalCategory)}
            >
              <option value="internship">Internship</option>
              <option value="course">Course</option>
              <option value="project">Project</option>
              <option value="exam">Exam</option>
              <option value="freelance">Freelance</option>
            </select>
            <input
              className="form-control"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              Add goal
            </button>
          </form>
        )}
      </div>

      {/* Goals list */}
      <div className="section">
        <h2 className="section-title">Active goals</h2>

        {visible.length === 0 ? (
          <p className="empty-state">No goals yet. Add your first one above. 🎯</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {visible.map((goal) => (
              <div
                key={goal.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${CATEGORY_COLORS[goal.category]}`,
                  borderRadius: "var(--radius-lg)",
                  animation: "fadeIn 0.2s ease",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>
                    {goal.name}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      background: CATEGORY_BG[goal.category],
                      color: CATEGORY_COLORS[goal.category],
                      textTransform: "capitalize",
                      flexShrink: 0,
                    }}
                  >
                    {goal.category}
                  </span>
                </div>

                {/* Target date */}
                {goal.targetDate && (
                  <p style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "12px" }}>
                    Target: {formatDate(goal.targetDate)}
                  </p>
                )}

                {/* Progress bar */}
                <div style={{ marginBottom: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Progress</span>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: CATEGORY_COLORS[goal.category] }}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      background: "var(--bg-secondary)",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${goal.progress}%`,
                        background: CATEGORY_COLORS[goal.category],
                        borderRadius: "4px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={goal.progress}
                  onChange={(e) => handleProgress(goal.id, Number(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: CATEGORY_COLORS[goal.category],
                    marginBottom: "12px",
                    cursor: "pointer",
                  }}
                />

                {/* Status buttons */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {goal.status === "active" ? (
                    <button
                      onClick={() => handleStatus(goal.id, "paused")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        fontWeight: 500,
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatus(goal.id, "active")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        fontWeight: 500,
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={() => handleStatus(goal.id, "done")}
                    style={{
                      flex: 1,
                      padding: "8px",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      fontWeight: 500,
                      background: "#EAF3DE",
                      border: "1px solid #C0DD97",
                      borderRadius: "var(--radius-md)",
                      color: "#3B6D11",
                      cursor: "pointer",
                    }}
                  >
                    Done ✓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
