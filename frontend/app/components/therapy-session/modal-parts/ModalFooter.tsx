interface ModalFooterProps {
  mode: "edit" | "create";
  onSave: () => void;
}

export default function ModalFooter({ mode, onSave }: ModalFooterProps) {
  return (
    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
      <button
        onClick={onSave}
        className="w-full flex justify-center items-center py-5 px-4 border border-transparent rounded-2xl text-sm text-white bg-black transition gap-1 cursor-pointer"
      >
        {mode === "create" ? "Create Session" : "Save Changes"}
      </button>
    </div>
  );
}
