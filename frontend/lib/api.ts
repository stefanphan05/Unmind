import Message from "@/types/message";
import { ApiError } from "next/dist/server/api-utils";

const API_URL = "http://127.0.0.1:5000/v1/unmind/ask";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWZhbiJ9.FnM01Z6ZTTtZ7ChnkOyBlokL0GA4LFsT8qF66f8bZn0";

export const getAIanswer = async (
  textMessage: string,
  onNewMessage: (message: Message) => void,
  onError: (error: ApiError) => void
): Promise<void> => {
  if (textMessage) {
    if (!textMessage.trim()) {
      onError({
        name: "Error",
        statusCode: 400,
        message: "Please provide a message",
      });
      return;
    }

    onNewMessage({
      id: Date.now().toString() + "-user",
      content: textMessage,
      role: "user",
      timestamp: new Date(),
    });

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
      const errorData = await response.json();
      const errorMessage = errorData.error || "Unknown error occurred";

      onError({
        name: "Error",
        statusCode: response.status,
        message: errorMessage,
      });
    }

    const data = await response.json();

    onNewMessage({
      id: Date.now().toString() + "-assistant",
      content: data.answer,
      role: "assistant",
      timestamp: new Date(),
    });
  }
};

// Send the recorded audio to backend
// export const sendAudioToBackend = async (
//   audioBlob: Blob | null,
//   onNewMessage: (message: Message) => void,
//   onError: (error: ApiError) => void
// ): Promise<void> => {
//   if (audioBlob) {
//     const formData = new FormData();
//     formData.append("type", "speech");

//     // Dynamically get extension from blob type
//     const audioFileName = `recording.${
//       audioBlob.type.split("/")[1].split(";")[0]
//     }`;
//     formData.append("audio_file", audioBlob, audioFileName);

//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         Authorization: AUTH_TOKEN,
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       const errorMessage = errorData.error || "Unknown error occurred";

//       onError({
//         name: "Error",
//         statusCode: response.status,
//         message: errorMessage,
//       });

//       return;
//     }

//     const data = await response.json();

//     // Call onNewMessage to add the user question
//     onNewMessage({
//       id: Date.now().toString() + "-user",
//       content: data.question,
//       role: "user",
//       timestamp: new Date(),
//     });

//     // Call onNewMessage to add the assistant's response
//     onNewMessage({
//       id: Date.now().toString() + "-assistant",
//       content: data.answer,
//       role: "assistant",
//       timestamp: new Date(),
//     });
//   }
// };
