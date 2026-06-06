export interface LogEntry {
  id: string;
  date: string;
  timestamp: string;
  type: "study" | "project" | "health" | "freelance";
  note: string;
}

export interface Goal {
  id: string;
  name: string;
  category: "internship" | "course" | "project" | "exam" | "freelance";
  targetDate: string;
  progress: number;
  status: "active" | "paused" | "done";
  createdAt: string;
}

export function getLogs(): LogEntry[];
export function addLog(entry: Omit<LogEntry, "id"> & { id?: string }): LogEntry;
export function getLogsForDate(dateString: string): LogEntry[];
export function getGoals(): Goal[];
export function addGoal(goal: Omit<Goal, "id" | "createdAt"> & { id?: string; createdAt?: string }): Goal;
export function updateGoalProgress(id: string, newProgress: number): void;
export function updateGoalStatus(id: string, newStatus: Goal["status"]): void;
