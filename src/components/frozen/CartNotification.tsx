import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface CartNotificationProps {
  message: string | null;
  onDismiss: () => void;
}

export default function CartNotification({ message, onDismiss }: CartNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 max-w-xs transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 shadow-lg">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
          <Check className="h-3.5 w-3.5 text-secondary-foreground" />
        </div>
        <p className="text-sm text-foreground font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Arrow pointing down to the cart button */}
      <div className="flex justify-end pr-8">
        <div className="w-3 h-3 bg-background border-r border-b border-border rotate-45 -mt-1.5" />
      </div>
    </div>
  );
}
