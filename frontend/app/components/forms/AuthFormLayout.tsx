import AuthFormTitle from "../auth/AuthFormTitle";
import ErrorModal from "../modals/ErrorModal";
import SuccessModal, { SuccessModalProps } from "../modals/SuccessModal";

export function AuthFormLayout({
  title,
  onSubmit,
  children,
  error,
  onCloseError,
  successModal,
}: {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  error?: { message: string; statusCode?: number } | null;
  onCloseError?: () => void;
  successModal?: SuccessModalProps;
}) {
  return (
    <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg space-y-8">
      <AuthFormTitle title={title} />
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
      </form>

      {/* Modals */}
      <div className="h-0">
        {/* Error Modal */}
        {error && onCloseError && (
          <ErrorModal error={error} onClose={onCloseError} />
        )}

        {/* Success Modal */}
        {successModal && (
          <SuccessModal
            isOpen={successModal.isOpen}
            onClose={successModal.onClose}
            title={successModal.title}
            message={successModal.message}
          />
        )}
      </div>
    </div>
  );
}
