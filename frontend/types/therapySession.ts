export interface TherapySession {
  id: string;
  name: string;
  date: string;
  result: "positive" | "negative" | "neutral";
  status: "completed" | "upcoming" | "ongoing";
}
