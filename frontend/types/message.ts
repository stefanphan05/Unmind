export default interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}
