"use client";

import React, { useState, useRef } from "react";
import { Send, Mic } from "lucide-react";
import Message from "@/types/message";

interface PromptBoxProps {
  onNewMessage: (message: Message) => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({ onNewMessage }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Start recording
  const startRecording = (): void => {
    audioChunks.current = [];

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mimeType = "audio/webm";
        const options = { mimeType };

        mediaRecorderRef.current = new MediaRecorder(stream, options);

        mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(audioChunks.current, { type: mimeType });
          setAudioBlob(blob);
          setAudioURL(URL.createObjectURL(blob));
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  // Stop recording
  const stopRecording = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Send the recorded audio to backend
  const sendAudioToBackend = async (): Promise<void> => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("type", "speech");

      // Dynamically get extension from blob type
      const audioFileName = `recording.${
        audioBlob.type.split("/")[1].split(";")[0]
      }`;
      formData.append("audio_file", audioBlob, audioFileName);

      // Add the Authorization token
      // TODO: Change the token into real token or remove entire things
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWZhbnBoYW4iLCJleHAiOjE3NTI3NzM2ODB9.sR5fF27YrRGm3doRB9QZgmX7GOMOX5EoLY2rlgj9_jo";

      try {
        const response = await fetch("http://127.0.0.1:5000/v1/unmind/ask", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
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
        console.log(data);
      } catch (error) {
        console.error("Error sending audio:", error);
      }
    }
  };

  return (
    <div className="bg-white backdrop-blur-lg shadow-lg rounded-lg text-[#5e5e5e] px-4 py-3 ">
      <form className="flex flex-row gap-8">
        <input
          className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-[#262626]"
          placeholder="Share what's on your mind..."
          required
        />

        <div className="flex text-sm">
          <div className="flex gap-2">
            <p
              className={`flex items-center justify-center gap-2 text-sx border border-gray-300/40 px-2 rounded-full cursor-pointer transition ${
                isRecording
                  ? "bg-red-500 text-white shadow-lg ring-4 ring-red-300 animate-expand"
                  : "bg-transparent hover:bg-[#2b2b2b] hover:text-white"
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic className="h-5" />
            </p>

            <p
              className="flex items-center gap-2 text-sx border border-gray-300/40 px-2 py-2 rounded-lg cursor-pointer hover:bg-[#2b2b2b] hover:text-white transition"
              onClick={sendAudioToBackend}
            >
              <Send className="h-5" />
            </p>
          </div>
        </div>
      </form>

      {audioURL && (
        <div className="mt-4 flex flex-col gap-2">
          <audio controls>
            <source src={audioURL} type={audioBlob?.type || "audio/webm"} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default PromptBox;
