interface ErrorMessageProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = "Something went wrong.",
  description = "Please try again.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state-icon" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8.16 14.14A1.5 1.5 0 0 0 3.43 20h17.14a1.5 1.5 0 0 0 1.3-2l-8.16-14.14a1.5 1.5 0 0 0-2.6 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
