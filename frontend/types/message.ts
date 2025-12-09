export default interface Message {
  id: number;
  content: string | undefined;
  role: "user" | "assistant";
}
