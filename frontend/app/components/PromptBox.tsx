"use client";

import React, { useState, useRef } from "react";
import { Send, Mic, Trash2 } from "lucide-react";
import Message from "@/types/message";

interface PromptBoxProps {
  onNewMessage: (message: Message) => void;
}

const PromptBox: React.FC<PromptBoxProps> = ({ onNewMessage }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [textMessage, setTextMessage] = useState<string>("");

  // Alternative states for temporary holding values
  const [tempTextMessage, setTempTextMessage] = useState<string>("");
  const [tempAudioURL, setTempAudioURL] = useState<string | null>(null);
  const [tempAudioBlob, setTempAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

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
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWZhbnBoYW4ifQ.eJOmRym9VXGNxixrIlXCvsAKUQVIPAt6bsI57QYAk9Q";

      try {
        const response = await fetch("http://127.0.0.1:5000/v1/unmind/ask", {
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
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

        // Clear the audio state after sending
        setAudioURL(null);
        setAudioBlob(null);
      } catch (error) {
        console.error("Error sending audio:", error);
      }
    }
  };

  const sendTextToBackend = async (): Promise<void> => {
    if (textMessage) {
      const payload = {
        type: "text",
        message: textMessage,
      };

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0ZWZhbnBoYW4ifQ.eJOmRym9VXGNxixrIlXCvsAKUQVIPAt6bsI57QYAk9Q";

      const response = await fetch("http://127.0.0.1:5000/v1/unmind/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

      setTextMessage("");

      try {
      } catch (error) {
        console.error("Error sending text message:", error);
      }
    }
  };

  // Function to remove the audio
  const removeAudio = () => {
    setAudioURL(null);
    setAudioBlob(null);
  };

  // Handle form submission and prevent reload
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (audioURL) {
      setTempAudioURL(audioURL);
      setTempAudioBlob(audioBlob);
      setAudioURL(null); // clear immediately
      sendAudioToBackend();
    } else if (textMessage) {
      setTempTextMessage(textMessage);
      setTextMessage(""); // clear immediately
      sendTextToBackend();
    }
  };

  return (
    <div className="glass text-[#5e5e5e] px-4 py-3 ">
      <form
        className="flex flex-row gap-4 items-center"
        onSubmit={handleSubmit}
      >
        {!audioURL ? (
          <input
            className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-[#262626] h-10"
            placeholder="Share what's on your mind..."
            type="text"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            required
          />
        ) : (
          <div className="flex gap-4 items-center w-full h-10">
            <audio controls className="flex-1 h-10">
              <source src={audioURL} type={audioBlob?.type || "audio/webm"} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="flex gap-2 items-center">
          {!audioURL ? (
            <p
              className={`glass icon flex items-center justify-center gap-2 text-sx px-2 cursor-pointer transition ${
                isRecording
                  ? "bg-red-500 text-white shadow-lg ring-4 ring-red-300 animate-expand"
                  : "hover:bg-[#2b2b2b] hover:text-white"
              }`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Mic className="h-5" />
            </p>
          ) : (
            <p
              className={`glass icon flex items-center justify-center gap-2 text-sx px-2 cursor-pointer transition ${
                isRecording
                  ? "bg-red-500 text-white shadow-lg ring-4 ring-red-300 animate-expand"
                  : "hover:bg-[#2b2b2b] hover:text-white"
              }`}
              onClick={removeAudio}
            >
              <Trash2 className="h-5" />
            </p>
          )}

          <p
            className="glass flex items-center gap-2 text-sx px-2 py-2 cursor-pointer hover:bg-[#2b2b2b] hover:text-white transition"
            onClick={handleSubmit}
          >
            <Send className="h-5" />
          </p>
        </div>
      </form>
    </div>
  );
};

export default PromptBox;
