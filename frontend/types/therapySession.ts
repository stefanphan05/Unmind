export interface TherapySession {
  id?: string;
  name: string;
  result: "positive" | "negative" | "neutral" | "pending";
  status: "completed" | "upcoming" | "ongoing";
}
