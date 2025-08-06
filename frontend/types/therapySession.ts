export interface TherapySession {
  id?: string;
  name: string;
  date: string;
  result: "positive" | "negative" | "neutral" | "pending";
  status: "completed" | "upcoming" | "ongoing";
}
