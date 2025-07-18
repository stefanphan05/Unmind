import Message from "@/types/message";

const API_URL = "http://127.0.0.1:5000/v1/unmind/ask";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWZhbnBoYW4ifQ.eJOmRym9VXGNxixrIlXCvsAKUQVIPAt6bsI57QYAk9Q";

export const sendTextToBackend = async (
  textMessage: string,
  onNewMessage: (message: Message) => void
): Promise<void> => {
  if (textMessage) {
    const payload = {
      type: "text",
      message: textMessage,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AUTH_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log(errorMessage);
      throw new Error(
        `Request failed with status: ${response.status}. ${errorMessage}`
      );
    }

    const data = await response.json();

    // Handle the response
    onNewMessage({
      id: Date.now().toString() + "-user",
      content: data.question,
      role: "user",
      timestamp: new Date(),
    });

    onNewMessage({
      id: Date.now().toString() + "-assistant",
      content: data.answer,
      role: "assistant",
      timestamp: new Date(),
    });
  }
};

// Send the recorded audio to backend
export const sendAudioToBackend = async (
  audioBlob: Blob | null,
  onNewMessage: (message: Message) => void
): Promise<void> => {
  if (audioBlob) {
    const formData = new FormData();
    formData.append("type", "speech");

    // Dynamically get extension from blob type
    const audioFileName = `recording.${
      audioBlob.type.split("/")[1].split(";")[0]
    }`;
    formData.append("audio_file", audioBlob, audioFileName);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: AUTH_TOKEN,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log(errorMessage);
      throw new Error(
        `Request failed with status: ${response.status}. ${errorMessage}`
      );
    }

    const data = await response.json();

    // Call onNewMessage to add the user question
    onNewMessage({
      id: Date.now().toString() + "-user",
      content: data.question,
      role: "user",
      timestamp: new Date(),
    });

    // Call onNewMessage to add the assistant's response
    onNewMessage({
      id: Date.now().toString() + "-assistant",
      content: data.answer,
      role: "assistant",
      timestamp: new Date(),
    });
  }
};
