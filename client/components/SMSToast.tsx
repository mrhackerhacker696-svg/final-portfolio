import React, { useState, useEffect } from "react";
import { CheckCircle, MessageCircle, X, AlertCircle } from "lucide-react";

interface ToastMessage {
  id: number;
  type: "success" | "error" | "info";
  message: string;
  timestamp: number;
}

export default function SMSToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Listen for SMS alert events
    const handleSMSAlert = (event: CustomEvent) => {
      const newToast: ToastMessage = {
        id: Date.now(),
        type: "success",
        message: `📱 SMS Alert Sent! ${event.detail.message}`,
        timestamp: Date.now(),
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    // Listen for contact form submissions (only triggered by actual form submission)
    const handleContactSubmission = (event: CustomEvent) => {
      // Only show toast if this is a real form submission event
      if (!event.detail || event.detail.isRefresh) return;

      const notificationSettings = event.detail?.notificationSettings || {};

      if (
        notificationSettings.smsNotifications &&
        notificationSettings.mobileNumber
      ) {
        const toast: ToastMessage = {
          id: Date.now(),
          type: "success",
          message: `📲 SMS sent to ${notificationSettings.mobileNumber}`,
          timestamp: Date.now(),
        };

        setToasts((prev) => [...prev, toast]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, 5000);
      }
    };

    window.addEventListener(
      "newSMSNotification",
      handleSMSAlert as EventListener,
    );
    window.addEventListener(
      "contactFormSubmitted",
      handleContactSubmission as EventListener,
    );

    return () => {
      window.removeEventListener(
        "newSMSNotification",
        handleSMSAlert as EventListener,
      );
      window.removeEventListener(
        "contactFormSubmitted",
        handleContactSubmission as EventListener,
      );
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-sm
            animate-in slide-in-from-right duration-300
            ${toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }
          `}
        >
          <div className="flex-shrink-0">
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : toast.type === "error" ? (
              <AlertCircle className="h-5 w-5 text-red-600" />
            ) : (
              <MessageCircle className="h-5 w-5 text-blue-600" />
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(toast.timestamp).toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
