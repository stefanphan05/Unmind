import { useEffect, useState } from "react";

import { TherapySession } from "@/types/therapySession";

import StatusSelector from "./components/StatusSelector";
import SessionDatePicker from "./components/DatePicker";
import ResultSelector from "./components/ResultSelector";
import ModalHeader from "./components/ModalHeader";
import ModalFooter from "./components/ModalFooter";
import InputField from "./components/InputField";

interface TherapySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session?: TherapySession | null;
  onCreate: (session: TherapySession) => void;
  onUpdate: (session: TherapySession) => void;
  mode: "edit" | "create";
}

export default function TherapySessionModal({
  isOpen,
  onClose,
  session,
  onCreate,
  onUpdate,
  mode,
}: TherapySessionModalProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "completed">(
    "upcoming"
  );
  const [result, setResult] = useState<
    "positive" | "neutral" | "negative" | "pending"
  >("pending");
  const [id, setId] = useState<string | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      if (mode === "edit" && session) {
        setId(session.id);
        setName(session.name);
        setDate(session.date);
        setStatus(session.status);
        setResult(session.result);
      } else {
        setId(undefined);
        setName("");
        setDate(new Date().toISOString().split("T")[0]);
        setStatus("upcoming");
        setResult("neutral");
      }
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, session, mode]);

  const handleSave = () => {
    if (!name.trim()) return;

    const sessionData: TherapySession = {
      ...(id ? { id } : {}),
      name,
      date,
      status,
      result,
    };

    if (mode === "create") {
      onCreate({ name, date, status, result });
    } else {
      onUpdate({ id, name, date, status, result });
    }
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-300 w-full max-w-2xl mx-4 overflow-hidden transition-all duration-300 ease-out transform ${
          isAnimating
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 translate-y-4 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader mode={mode} onClose={onClose} />

        <div className="px-6 py-6 space-y-5">
          <InputField
            id="session_name"
            label="Session Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter session name..."
          />

          <SessionDatePicker value={date} onChange={setDate} />

          <StatusSelector value={status} onChange={setStatus} />

          <ResultSelector value={result} onChange={setResult} />
        </div>

        <ModalFooter mode={mode} onSave={handleSave} />
      </div>
    </div>
  );
}
