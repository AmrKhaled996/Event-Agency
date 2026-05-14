import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import { useNotifications } from "../../Context/NotificationContext";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

export default function NotificationBell() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Automatically mark all as read when opening the dropdown
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-secandry rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute ${lang === "ar" ? "left-0" : "right-0"} mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100`}>
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <h3 className="font-bold text-lg">{t("notifications.title", "Notifications")}</h3>
            <div className="flex gap-2">
              <button
                onClick={clearNotifications}
                title={t("notifications.clearAll", "Clear all")}
                className="hover:bg-white/20 p-1 rounded-md transition-colors cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={40} className="mx-auto mb-2 opacity-20" />
                <p>{t("notifications.empty", "No notifications yet")}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-50 relative cursor-default"
                >
                  <h4 className="font-semibold text-sm text-gray-900 pr-4">{notification.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                {t("notifications.close", "Close")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
