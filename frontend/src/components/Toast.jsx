// frontend/src/components/Toast.jsx
import { useEffect } from "react";

export default function Toast({
  show,
  type = "success",
  message,
  onClose,
  autoHideMs = 3000,
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [show, autoHideMs, onClose]);

  if (!show) return null;

  const base = "fixed right-4 bottom-4 px-4 py-3 rounded shadow-lg text-sm";
  const styles =
    type === "error"
      ? "bg-red-600 text-white"
      : type === "warn"
      ? "bg-yellow-500 text-black"
      : "bg-emerald-600 text-white";

  return (
    <div className={`${base} ${styles}`}>
      {message}
      <button
        onClick={onClose}
        className="ml-3 underline underline-offset-2"
        aria-label="Dismiss"
      >
        Dismiss
      </button>
    </div>
  );
}
