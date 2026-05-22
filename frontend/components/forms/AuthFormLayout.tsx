import AuthFormTitle from "../features/auth/AuthFormTitle";
import ErrorModal from "../features/modals/ErrorModal";
import SuccessModal, {
  SuccessModalProps,
} from "../features/modals/SuccessModal";

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
    <div className="auth-card auth-stagger auth-stagger--card">
      <div className="auth-stagger auth-stagger--1">
        <AuthFormTitle title={title} />
      </div>
      <form onSubmit={onSubmit} className="auth-form mt-8">
        <div className="auth-form__fields space-y-6">{children}</div>
      </form>

      <div className="h-0">
        {error && onCloseError && (
          <ErrorModal error={error} onClose={onCloseError} />
        )}

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
