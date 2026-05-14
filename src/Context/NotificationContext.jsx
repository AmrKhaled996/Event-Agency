import { createContext, useContext, useEffect, useState, useCallback } from "react";
import socket, { connectSocket, disconnectSocket } from "../services/socket";
import { useUser } from "./AuthProvider";
import { toast } from "sonner";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Persist notifications to localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notification) => {
    console.log("Adding notification to list and showing toast:", notification);
    setNotifications((prev) => [
      { ...notification, read: false, createdAt: notification.createdAt || new Date().toISOString() },
      ...prev,
    ].slice(0, 50)); // Keep only latest 50

    // Show a toast for the new notification
    toast.success(notification.title, {
      description: notification.message,
      duration: 5000,
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (user && user.id) {
      connectSocket();

      socket.on("notification:new", (data) => {
        console.log("New notification received:", data);
        addNotification(data);
      });

      return () => {
        socket.off("notification:new");
        // We don't disconnect here because other components (like Chatbot) might use the socket
      };
    } else {
      disconnectSocket();
      setNotifications([]);
    }
  }, [user, addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
