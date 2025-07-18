"use client";
import { Mic, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";

interface AudioRecorderProps {
  audioURL: string | null;
  setAudioURL: React.Dispatch<React.SetStateAction<string | null>>;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  audioURL,
  setAudioURL,
  setAudioBlob,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
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
  return (
    <div>
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
          onClick={() => {
            setAudioURL(null);
            setAudioBlob(null);
          }}
        >
          <Trash2 className="h-5" />
        </p>
      )}
    </div>
  );
};

export default AudioRecorder;
