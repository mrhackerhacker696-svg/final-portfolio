import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

export default function ApiHealthCheck() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const [lastCheck, setLastCheck] = useState<string>("");

  const checkHealth = async () => {
    setStatus("checking");
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        setStatus("online");
        setLastCheck(new Date().toLocaleTimeString());
      } else {
        setStatus("offline");
      }
    } catch (error) {
      setStatus("offline");
    }
  };

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm">Checking API status...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {status === "online" ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">API Online</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-800">API Offline</span>
        </>
      )}
      {lastCheck && (
        <span className="text-xs text-gray-500">Last check: {lastCheck}</span>
      )}
      <button
        onClick={checkHealth}
        className="text-blue-600 hover:text-blue-700 text-sm underline"
      >
        Refresh
      </button>
    </div>
  );
}
