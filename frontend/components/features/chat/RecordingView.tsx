"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "next/dist/server/api-utils";
import { getAIAnswer } from "@/lib/api/ai";
import { saveUserInput } from "@/lib/api/chat";
import { FaMicrophone } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useParams } from "next/navigation";
import { useAudioPlayer } from "@/lib/hooks/useAudioPlayer";
import Message from "@/types/message";

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface RecordingViewProps {
  isActive: boolean;
  isTherapistResponseLoading: boolean;
  onError: (error: ApiError) => void;
  setIsAILoading: React.Dispatch<React.SetStateAction<boolean>>;
  onNewMessage: (message: Message) => void;
  selectedTone: string;
}

const SILENCE_MS = 2500;
const WAVEFORM_BAR_COUNT = 5;
const WAVEFORM_MIN_SCALE = 0.18;
/** Middle bars read slightly louder — matches how speech energy clusters. */
const WAVEFORM_CENTER_WEIGHTS = [0.78, 0.92, 1, 0.92, 0.78];

export default function RecordingView({
  isActive,
  isTherapistResponseLoading,
  onError,
  setIsAILoading,
  onNewMessage,
  selectedTone,
}: RecordingViewProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statusLabel, setStatusLabel] = useState("Listening...");
  const transcriptStartIndexRef = useRef(0);
  const recognitionResultsLengthRef = useRef(0);
  const transcriptRef = useRef("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef(false);
  const isSendingRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestGenerationRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef(false);
  const isTherapistLoadingRef = useRef(false);

  const params = useParams();
  const therapySessionId = Number(params?.therapySessionId);
  const { playBase64Audio, stopAudio, isPlaying } = useAudioPlayer();
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const waveformRafRef = useRef<number | null>(null);
  const waveformBarRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isTherapistLoadingRef.current = isTherapistResponseLoading;
  }, [isTherapistResponseLoading]);

  const stopAudioMonitor = useCallback(() => {
    if (waveformRafRef.current !== null) {
      cancelAnimationFrame(waveformRafRef.current);
      waveformRafRef.current = null;
    }
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    waveformBarRefs.current.forEach((bar) => {
      if (bar) {
        bar.style.transform = `scaleY(${WAVEFORM_MIN_SCALE})`;
      }
    });
  }, []);

  const startAudioMonitor = useCallback(async () => {
    if (mediaStreamRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.55;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      const timeDomainData = new Uint8Array(analyser.fftSize);
      const binCount = analyser.frequencyBinCount;
      // Human speech sits in lower-mid bins; the top bins stay near zero.
      const speechBinStart = 2;
      const speechBinEnd = Math.min(
        binCount - 1,
        Math.floor(binCount * 0.45)
      );
      const speechBinSpan = Math.max(1, speechBinEnd - speechBinStart);

      const updateLevels = () => {
        if (!analyserRef.current) return;

        const analyserNode = analyserRef.current;
        analyserNode.getByteTimeDomainData(timeDomainData);
        analyserNode.getByteFrequencyData(frequencyData);

        let sumSquares = 0;
        for (let i = 0; i < timeDomainData.length; i++) {
          const sample = (timeDomainData[i] - 128) / 128;
          sumSquares += sample * sample;
        }
        const rms = Math.sqrt(sumSquares / timeDomainData.length);
        const volumeLevel = Math.min(1, Math.pow(rms * 5.5, 0.85));

        for (let barIndex = 0; barIndex < WAVEFORM_BAR_COUNT; barIndex++) {
          const start =
            speechBinStart +
            Math.floor((barIndex / WAVEFORM_BAR_COUNT) * speechBinSpan);
          const end =
            speechBinStart +
            Math.floor(((barIndex + 1) / WAVEFORM_BAR_COUNT) * speechBinSpan);

          let peak = 0;
          for (let i = start; i < end; i++) {
            peak = Math.max(peak, frequencyData[i]);
          }

          const bandLevel = Math.min(1, Math.pow(peak / 165, 0.75));
          const combined =
            volumeLevel * 0.5 + bandLevel * 0.5 * WAVEFORM_CENTER_WEIGHTS[barIndex];
          const scale =
            WAVEFORM_MIN_SCALE +
            combined * (1 - WAVEFORM_MIN_SCALE);

          const bar = waveformBarRefs.current[barIndex];
          if (bar) {
            bar.style.transform = `scaleY(${scale.toFixed(3)})`;
          }
        }

        waveformRafRef.current = requestAnimationFrame(updateLevels);
      };

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      waveformRafRef.current = requestAnimationFrame(updateLevels);
    } catch {
      // Waveform falls back to idle bars if mic analysis is unavailable.
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
  }, [clearSilenceTimer]);

  const interruptAssistant = useCallback(() => {
    requestGenerationRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    stopAudio();
    setIsAILoading(false);
    isSendingRef.current = false;
    clearSilenceTimer();
    setStatusLabel("Listening...");
  }, [clearSilenceTimer, setIsAILoading, stopAudio]);

  const sendTranscript = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSendingRef.current) return;

      const requestId = ++requestGenerationRef.current;
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      isSendingRef.current = true;
      clearSilenceTimer();

      const userMessage: Message = {
        id: Date.now(),
        content: trimmed,
        role: "user",
      };

      // Match text chat: show the user's message before backend requests run.
      onNewMessage(userMessage);
      setTranscript("");
      transcriptRef.current = "";
      transcriptStartIndexRef.current = recognitionResultsLengthRef.current;
      setStatusLabel("Thinking...");

      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        onError({
          name: "Auth Error",
          statusCode: 401,
          message: "You are not authenticated. Please sign in again.",
        });
        isSendingRef.current = false;
        setIsAILoading(false);
        setStatusLabel("Listening...");
        return;
      }

      setIsAILoading(true);

      await saveUserInput(token, therapySessionId, onError, trimmed);

      if (requestId !== requestGenerationRef.current) {
        isSendingRef.current = false;
        return;
      }

      const response = await getAIAnswer(
        trimmed,
        therapySessionId,
        onError,
        token,
        selectedTone,
        abortController.signal
      );

      if (requestId !== requestGenerationRef.current) {
        isSendingRef.current = false;
        return;
      }

      if (!response?.answer) {
        setIsAILoading(false);
        isSendingRef.current = false;
        setStatusLabel("Listening...");
        return;
      }

      setIsAILoading(false);

      const aiMessage: Message = {
        id: Date.now() + 1,
        content: response.answer.content,
        role: "assistant",
        shouldAnimate: true,
      };
      onNewMessage(aiMessage);

      if (response?.audio) {
        if (requestId !== requestGenerationRef.current) {
          isSendingRef.current = false;
          return;
        }
        setStatusLabel("Speaking...");
        playBase64Audio(response.audio);
      }

      isSendingRef.current = false;
      setStatusLabel("Listening...");
    },
    [
      clearSilenceTimer,
      onError,
      onNewMessage,
      playBase64Audio,
      selectedTone,
      setIsAILoading,
      therapySessionId,
    ]
  );

  const scheduleSilenceSend = useCallback(() => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      if (!isListeningRef.current || isSendingRef.current) {
        return;
      }
      const pending = transcriptRef.current.trim();
      if (pending) {
        void sendTranscript(pending);
      }
    }, SILENCE_MS);
  }, [clearSilenceTimer, sendTranscript]);

  const startRecognition = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !window.webkitSpeechRecognition ||
      isListeningRef.current
    ) {
      return;
    }

    transcriptStartIndexRef.current = 0;
    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newTranscript = "";
      for (
        let i = transcriptStartIndexRef.current;
        i < event.results.length;
        i++
      ) {
        newTranscript += event.results[i][0].transcript;
      }

      const trimmed = newTranscript.trim();
      const isAssistantBusy =
        isPlayingRef.current ||
        isTherapistLoadingRef.current ||
        isSendingRef.current;

      if (trimmed && isAssistantBusy) {
        interruptAssistant();
      }

      recognitionResultsLengthRef.current = event.results.length;
      transcriptRef.current = trimmed;
      setTranscript(trimmed);

      if (trimmed) {
        scheduleSilenceSend();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") return;

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        onError({
          name: "Permission Error",
          statusCode: 403,
          message:
            "Microphone access denied. Please enable microphone permissions.",
        });
        stopRecognition();
      } else if (event.error === "network") {
        onError({
          name: "Network Error",
          statusCode: 500,
          message: "Network error occurred. Please check your connection.",
        });
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // Browser may reject rapid restarts; will retry on next activation.
        }
      }
    };

    try {
      recognition.start();
      isListeningRef.current = true;
      setIsListening(true);
      setStatusLabel("Listening...");
    } catch {
      onError({
        name: "Error",
        statusCode: 500,
        message: "Failed to start speech recognition. Please try again.",
      });
    }
  }, [interruptAssistant, onError, scheduleSilenceSend, stopRecognition]);

  const clearTranscript = useCallback(() => {
    clearSilenceTimer();
    setTranscript("");
    transcriptRef.current = "";
    transcriptStartIndexRef.current = 0;

    if (isListeningRef.current && recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current.onend = null;
      recognitionRef.current = null;
      isListeningRef.current = false;
      setTimeout(() => {
        if (isActive) {
          startRecognition();
        }
      }, 100);
    }
  }, [clearSilenceTimer, isActive, startRecognition]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  useEffect(() => {
    if (!isActive) {
      interruptAssistant();
      stopRecognition();
      stopAudioMonitor();
      setTranscript("");
      transcriptRef.current = "";
      return;
    }

    void startAudioMonitor();
    startRecognition();

    return () => {
      stopRecognition();
      stopAudioMonitor();
    };
  }, [
    interruptAssistant,
    isActive,
    startAudioMonitor,
    startRecognition,
    stopAudioMonitor,
    stopRecognition,
  ]);

  const showTranscript = transcript.length > 0;

  return (
    <div className="chat-voice-panel">
      {showTranscript && (
        <div
          ref={transcriptContainerRef}
          className="chat-transcript scrollbar-hide"
        >
          <p>{transcript}</p>
        </div>
      )}

      <div className="chat-voice-panel__controls">
        <div className="chat-voice-panel__controls-side">
          {showTranscript && (
            <button
              onClick={clearTranscript}
              className="chat-mic-secondary"
              title="Discard current phrase"
              type="button"
            >
              <RxCross2 className="h-5 w-5" />
            </button>
          )}
        </div>

        <div
          className={`chat-mic-btn chat-mic-btn--indicator ${
            isListening ? "chat-mic-btn--recording" : ""
          }`}
          aria-hidden="true"
        >
          <FaMicrophone className="chat-mic-btn__icon" />
        </div>

        <div className="chat-voice-panel__controls-side" aria-hidden="true" />
      </div>

      {isListening && (
        <div className="chat-voice-waveform" aria-hidden="true">
          {Array.from({ length: WAVEFORM_BAR_COUNT }, (_, index) => (
            <span
              key={index}
              ref={(element) => {
                waveformBarRefs.current[index] = element;
              }}
              className="chat-voice-waveform__bar"
              style={{ transform: `scaleY(${WAVEFORM_MIN_SCALE})` }}
            />
          ))}
        </div>
      )}

      <p className="chat-voice-panel__label">{statusLabel}</p>
    </div>
  );
}
