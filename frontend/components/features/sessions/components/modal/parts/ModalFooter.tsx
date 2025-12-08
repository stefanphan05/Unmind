import { FiTrash2 } from "react-icons/fi";

interface ModalFooterProps {
  mode: "edit" | "create";
  onSave: () => void;
  onDelete: () => void;
}

export default function ModalFooter({
  mode,
  onSave,
  onDelete,
}: ModalFooterProps) {
  return (
    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-1">
      <button
        onClick={onSave}
        className="w-full flex justify-center items-center py-5 px-4 border border-transparent rounded-2xl text-sm text-white bg-black transition gap-1 cursor-pointer"
      >
        {mode === "create" ? "Create Session" : "Save Changes"}
      </button>

      {mode !== "create" && (
        <button
          onClick={onDelete}
          className=" justify-center items-center py-5 px-5 border border-transparent rounded-2xl text-sm text-white bg-red-500 transition gap-1 cursor-pointer"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
