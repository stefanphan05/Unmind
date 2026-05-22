export type SessionTone =
  | "fun"
  | "angry"
  | "about_to_cry"
  | "boring"
  | "aggressive"
  | "compassionate";

export interface TherapySession {
  id?: string;
  name: string;
  tone?: SessionTone;
  summary?: string;
  date?: string;
  result?: "positive" | "negative" | "neutral" | "pending";
  status?: "completed" | "upcoming" | "ongoing";
}
