interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading your applications..." }: LoadingProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
