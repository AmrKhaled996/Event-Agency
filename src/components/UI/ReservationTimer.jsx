import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "./../shadcn/card";
import { cn } from "./../shadcn/utils";
import { useTranslation } from "react-i18next";

export function ReservationTimer({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const {t}=useTranslation();

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);
      setTimeLeft(remaining);

      if (remaining === 0) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const isWarning = timeLeft < 120000; // Less than 2 minutes
  const isCritical = timeLeft < 60000; // Less than 1 minute

  return (
    <Card
      className={cn(
        "border-2",
        isCritical && "border-red-500 bg-red-50",
        isWarning && !isCritical && "border-amber-500 bg-amber-50",
        !isWarning && "border-blue-500 bg-blue-50",
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-3 rounded-full",
              isCritical && "bg-red-100",
              isWarning && !isCritical && "bg-amber-100",
              !isWarning && "bg-blue-100",
            )}
          >
            {isCritical ? (
              <AlertCircle
                className={cn("w-6 h-6", isCritical && "text-red-600")}
              />
            ) : (
              <Clock
                className={cn(
                  "w-6 h-6",
                  isWarning && !isCritical && "text-amber-600",
                  !isWarning && "text-blue-600",
                )}
              />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600">
              {t("events.details.booking.reservationTimer")}
            </div>
            <div
              className={cn(
                "text-3xl font-bold",
                isCritical && "text-red-600",
                isWarning && !isCritical && "text-amber-600",
                !isWarning && "text-blue-600",
              )}
            >
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
          </div>
        </div>
        <div
          className={cn(
            "mt-4 text-sm",
            isCritical && "text-red-700",
            isWarning && !isCritical && "text-amber-700",
            !isWarning && "text-blue-700",
          )}
        >
          {isCritical && (
            <p className="font-medium">
              {t("events.booking.completeNow")}
            </p>
          )}
          {isWarning && !isCritical && (
            <p>{t("events.booking.completeSoon")}</p>
          )}
          {!isWarning && (
            <p>{t("events.booking.yourSeats")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
