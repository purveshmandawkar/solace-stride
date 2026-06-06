/**
 * @typedef {Object} LogEntry
 * @property {string} id - uuid
 * @property {string} date - YYYY-MM-DD
 * @property {string} timestamp - HH:MM
 * @property {"study"|"project"|"health"|"freelance"} type
 * @property {string} note
 */

/**
 * @typedef {Object} Goal
 * @property {string} id - uuid
 * @property {string} name
 * @property {"internship"|"course"|"project"|"exam"|"freelance"} category
 * @property {string} targetDate - YYYY-MM-DD
 * @property {number} progress - 0 to 100
 * @property {"active"|"paused"|"done"} status
 * @property {string} createdAt
 */

const LOGS_KEY = "pm_logs";
const GOALS_KEY = "pm_goals";

function safeParse(key) {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(key, value) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/** @returns {LogEntry[]} */
export function getLogs() {
  return safeParse(LOGS_KEY);
}

/**
 * @param {Omit<LogEntry, "id"> & { id?: string }} entry
 * @returns {LogEntry}
 */
export function addLog(entry) {
  const logs = getLogs();
  /** @type {LogEntry} */
  const newEntry = { ...entry, id: entry.id ?? crypto.randomUUID() };
  logs.push(newEntry);
  save(LOGS_KEY, logs);
  return newEntry;
}

/**
 * @param {string} dateString - YYYY-MM-DD
 * @returns {LogEntry[]}
 */
export function getLogsForDate(dateString) {
  return getLogs().filter((l) => l.date === dateString);
}

/** @returns {Goal[]} */
export function getGoals() {
  return safeParse(GOALS_KEY);
}

/**
 * @param {Omit<Goal, "id" | "createdAt"> & { id?: string, createdAt?: string }} goal
 * @returns {Goal}
 */
export function addGoal(goal) {
  const goals = getGoals();
  /** @type {Goal} */
  const newGoal = {
    ...goal,
    id: goal.id ?? crypto.randomUUID(),
    createdAt: goal.createdAt ?? new Date().toISOString(),
  };
  goals.push(newGoal);
  save(GOALS_KEY, goals);
  return newGoal;
}

/**
 * @param {string} id
 * @param {number} newProgress
 */
export function updateGoalProgress(id, newProgress) {
  const goals = getGoals().map((g) =>
    g.id === id ? { ...g, progress: newProgress } : g
  );
  save(GOALS_KEY, goals);
}

/**
 * @param {string} id
 * @param {"active"|"paused"|"done"} newStatus
 */
export function updateGoalStatus(id, newStatus) {
  const goals = getGoals().map((g) =>
    g.id === id ? { ...g, status: newStatus } : g
  );
  save(GOALS_KEY, goals);
}
