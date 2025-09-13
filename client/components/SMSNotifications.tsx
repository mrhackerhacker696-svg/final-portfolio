import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  CheckCircle,
  TestTube,
} from "lucide-react";

interface SMSNotification {
  id: number;
  type: "sms" | "call" | "email";
  message: string;
  timestamp: string;
  from: string;
  read: boolean;
}

export default function SMSNotifications() {
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    let lastNotificationId = 0;

    // Check for new contact messages periodically
    const checkForNewMessages = () => {
      const contactMessages: any[] = [];
      const allNotifications: SMSNotification[] = [];

      // Show all contact messages as notifications
      contactMessages.forEach((message: any) => {
        allNotifications.push({
          id: message.id,
          type: message.contactMethod || "email",
          message: `New ${(message.contactMethod || "email").toUpperCase()} from ${message.name}: ${message.subject || "Contact message"}`,
          timestamp: new Date(message.date || Date.now()).toLocaleTimeString(),
          from: message.name,
          read: false,
        });
      });

      // Sort by most recent first
      allNotifications.sort((a, b) => b.id - a.id);

      // Only show popup for truly NEW notifications (not on page refresh)
      if (
        allNotifications.length > 0 &&
        allNotifications[0].id > lastNotificationId &&
        lastNotificationId > 0 // Only show if we've seen notifications before (not first load)
      ) {
        const newNotification = allNotifications[0];

        // Update last seen ID
        lastNotificationId = newNotification.id;
        // no-op in Mongo-only mode

        // Show browser notification
        if (Notification.permission === "granted") {
          new Notification("📱 New Contact Message", {
            body: `${newNotification.from}: ${newNotification.message}`,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
          });
        }

        // Play notification sound
        playNotificationSound();

        // Auto-show dropdown for new notification
        setShowNotifications(true);

        // Auto-hide after 5 seconds
        setTimeout(() => setShowNotifications(false), 5000);
      } else if (allNotifications.length > 0 && lastNotificationId === 0) {
        // On first load, just set the last seen ID without showing popup
        lastNotificationId = allNotifications[0].id;
        // no-op in Mongo-only mode
      }

      setNotifications(allNotifications);
    };

    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check immediately and then every 5 seconds for more responsiveness
    checkForNewMessages();
    const interval = setInterval(checkForNewMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const playNotificationSound = () => {
    try {
      // Create audio context for notification sound
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Audio notification not supported");
    }
  };

  const sendTestNotification = () => {
    // Create a test contact message
    const testMessage = {
      id: Date.now(),
      name: "Test User",
      email: "test@example.com",
      phone: "+91 9876543210",
      subject: "Test SMS Alert",
      message: "This is a test message to check SMS alerts",
      contactMethod: "sms",
      date: new Date().toISOString().split("T")[0],
      status: "new",
    };

    // Directly show the test notification in UI in Mongo-only mode
    setNotifications((prev) => [
      {
        id: testMessage.id,
        type: "sms",
        message: `${testMessage.name}: ${testMessage.subject}`,
        timestamp: new Date().toLocaleTimeString(),
        from: testMessage.name,
        read: false,
      },
      ...prev,
    ]);

    // Show notification
    if (Notification.permission === "granted") {
      new Notification("📱 Test SMS Alert", {
        body: "Test notification sent successfully!",
        icon: "/favicon.ico",
      });
    }

    playNotificationSound();
    alert("🎉 Test SMS Alert sent! Check the notification bell.");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={`relative p-2 text-gray-400 hover:text-blue-600 transition-colors ${unreadCount > 0 ? "animate-pulse" : ""
          }`}
      >
        <MessageCircle
          className={`h-5 w-5 ${unreadCount > 0 ? "text-blue-600" : ""}`}
        />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
            <span className="absolute -top-1 -right-1 bg-red-400 rounded-full h-5 w-5 animate-ping"></span>
          </>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Contact Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No contact notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${notification.type === "sms"
                            ? "bg-purple-100"
                            : notification.type === "call"
                              ? "bg-yellow-100"
                              : "bg-blue-100"
                          }`}
                      >
                        {notification.type === "sms" ? (
                          <MessageCircle className="h-4 w-4 text-purple-600" />
                        ) : notification.type === "call" ? (
                          <Phone className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Mail className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 font-medium">
                          {notification.from}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <button
                onClick={sendTestNotification}
                className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-xs font-medium flex items-center justify-center gap-2"
              >
                <TestTube className="h-3 w-3" />
                Test SMS Alert
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={() => setNotifications([])}
                  className="w-full text-xs text-gray-600 hover:text-gray-800"
                >
                  Clear All Notifications
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
