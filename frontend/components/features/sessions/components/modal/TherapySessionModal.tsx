import { useEffect, useState } from "react";

import { TherapySession } from "@/types/therapySession";

import InputField from "./fields/InputField";
import StatusSelector from "./fields/StatusSelector";
import ResultSelector from "./fields/ResultSelector";
import ModalHeader from "./parts/ModalHeader";
import ModalFooter from "./parts/ModalFooter";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  session?: TherapySession | null;
  mode: "edit" | "create";
  onCreate: (payload: Omit<TherapySession, "id">) => Promise<void> | void;
  onUpdate: (payload: TherapySession) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export default function TherapySessionModal({
  isOpen,
  onClose,
  session,
  mode,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [id, setId] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<TherapySession["status"]>("upcoming");
  const [result, setResult] = useState<TherapySession["result"]>("pending");

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && session) {
      setId(session.id);
      setName(session.name);
      setStatus(session.status);
      setResult(session.result);
    } else {
      setId(undefined);
      setName("");
      setStatus("upcoming");
      setResult("neutral");
    }
  }, [isOpen, mode, session]);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      if (mode === "create") {
        await onCreate({ name, status, result });
      } else if (id) {
        await onUpdate({ id, name, status, result });
      }
      onClose();
    } catch {
      console.log("Error");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await onDelete(id);
      onClose();
    } catch {
      console.log("Error deleting session");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-300 w-full max-w-2xl mx-4 overflow-hidden"
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
          <StatusSelector value={status} onChange={setStatus} />

          {mode !== "create" && (
            <ResultSelector value={result} onChange={setResult} />
          )}
        </div>
        <ModalFooter mode={mode} onSave={handleSave} onDelete={handleDelete} />
      </div>
    </div>
  );
}
