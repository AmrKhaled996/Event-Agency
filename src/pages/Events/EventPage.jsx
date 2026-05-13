import { Calendar, Clock, Heart, Share2 } from "lucide-react";
import NavigationBar from "../../components/Layout/NavigationBar";
import Footer from "../../components/Layout/Footer";
import OtherEventsSlider from "../../components/Layout/OtherEventsSlider";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addToInterested,
  getEventAvailability,
  getEvents,
  removeFromInterested,
  reserveEventSeats,
} from "../../APIs/eventApis";
import DisplayLocatinMap from "./../../components/UI/DisplayLocatinMap";
import Loading from "./../../components/Layout/LoadingLayout";
import { extractDateTime } from "../../utils/dateFormater";

import ErrorDialog from "./../../components/Dialogs/ErrorDialog";
import { useUser } from "../../Context/AuthProvider";
import { Link, useLocation } from "react-router";
import { BuyerSeatMap } from "./../../components/UI/BuyerSeatMap";
import { ReservationTimer } from "./../../components/UI/ReservationTimer";
import { Button } from "./../../components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../components/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "./../../components/shadcn/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./../../components/shadcn/dialog";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import useAppNavigate from "../../Router/useAppNavigate";
import { RulesList } from "../../components/UI/RulesList";
import { TagsList } from "../../components/UI/Tagslist";
import { useTranslation } from "react-i18next";
import { getAccessToken } from "../../services/cookieTokenService";
import { Title } from "react-head";
import { handleError } from "../../utils/errorHandler";

const RESERVATION_DURATION = 10 * 60 * 1000;
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";
const RESERVATION_STORAGE_PREFIX = "event-seat-reservation";

export default function EventPage({ organizer, eventinfo, review = false }) {
  const [event, setEvent] = useState(eventinfo || {});
  const [loading, setloading] = useState(false);
  const [dateFormat, setDateFormat] = useState([]);
  const [timeFormat, setTimeFormat] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isInterested, setisInterested] = useState(
    event?.isInterested || false,
  );

  const navigate = useAppNavigate();
  const { t } = useTranslation();
  const { user } = useUser();
  const location = useLocation();
  const handleLoadEvents = async () => {
    try {
      if (review) return;
      setloading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const response = await getEvents({ id: id });

      setEvent(response.data.data.event);
      const eventSessions =
        response.data.data.event?.eventSessions || eventinfo?.sessions;

      const dateArray = [];
      const timeArray = [];

      for (const session of eventSessions) {
        const startDateTime = session.startDate;
        const endDateTime = session.endDate;

        const { date: startDate, time: startTime } =
          extractDateTime(startDateTime);
        const { date: endDate, time: endTime } = extractDateTime(endDateTime);

        dateArray.push({
          startDate,
          startTime,
          endDate,
          endTime,
        });

        timeArray.push(`${startTime} - ${endTime}`);
      }

      setDateFormat(dateArray);
      setTimeFormat(timeArray);
      if (response.data.data.event.hasSeatMap) {
        const storedRows = parseInt(
          response.data.data.event.eventSeatTier[0].numberOfRows,
        );
        const storedSeatsPerRow = parseInt(
          response.data.data.event.eventSeatTier[0].numberOfColumns,
        );

        const storedSeats = response.data.data.event.eventSeat.map((seat) => ({
          row: seat.rowIndex,
          number: seat.seatIndex,
          tierId: seat.tierNumber ? `${seat.tierNumber}` : null,
          status: seat.isSold ? "sold" : "available",
        }));

        const storedTiers = response.data.data.event.eventSeatTier.map(
          (tier) => ({
            id: `${tier.tierNumber}`,
            name: tier.name,
            price: parseFloat(tier.price),
            color: tier.color,
          }),
        );
        setPriceTiers(storedTiers);
        setRows(parseInt(storedRows));
        setSeatsPerRow(parseInt(storedSeatsPerRow));
        setSeats(storedSeats);
        await loadAvailability(response.data.data.event.id, storedSeats);

      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Something went wrong while fetching event data.";
      setDialogMessage(message);
      setopenDialog(true);
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    handleLoadEvents();
    window.scrollTo(0, 0);
  }, [location.search]);

  const handleInterested = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error(t("apiErrors.UNAUTHORIZED"));
      return;
    }

    try {
      const targetState = !isInterested;
      setisInterested(targetState);
      
      if (isInterested) {
        await removeFromInterested(event.id, { _silentError: true });
      } else {
        await addToInterested(event.id, { _silentError: true });
      }
    } catch (error) {
      setisInterested((prv) => !prv);
      handleError(error);
    }
  };

  const [seats, setSeats] = useState([]);
  const [priceTiers, setPriceTiers] = useState([]);
  const [rows, setRows] = useState(8);
  const [seatsPerRow, setSeatsPerRow] = useState(12);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [viewMode, setViewMode] = useState("pricing");
  const [reservationExpiry, setReservationExpiry] = useState(null);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const seatsRef = useRef([]);
  const selectedSeatsRef = useRef([]);
  const isReservingRef = useRef(false);

  const getReservationStorageKey = useCallback((eventId) => {
    return `${RESERVATION_STORAGE_PREFIX}:${eventId}`;
  }, []);

  const clearStoredReservation = useCallback(
    (eventId) => {
      if (typeof window === "undefined" || !eventId) return;
      localStorage.removeItem(getReservationStorageKey(eventId));
    },
    [getReservationStorageKey],
  );

  const saveStoredReservation = useCallback(
    (eventId, expiresAt, seatsToStore) => {
      if (typeof window === "undefined" || !eventId) return;
      if (!expiresAt || seatsToStore.length === 0) return;

      const payload = {
        expiresAt,
        seats: seatsToStore.map((seat) => ({
          row: seat.row,
          number: seat.number,
          tierId: seat.tierId || null,
        })),
      };

      localStorage.setItem(
        getReservationStorageKey(eventId),
        JSON.stringify(payload),
      );
    },
    [getReservationStorageKey],
  );

  const mapAvailabilityToSeats = useCallback(
    (availabilitySeats = [], fallbackSeats = []) => {
      const fallbackMap = new Map(
        fallbackSeats.map((seat) => [`${seat.row}-${seat.number}`, seat]),
      );

      return availabilitySeats.map((seat) => {
        const key = `${seat.row}-${seat.number}`;
        const fallbackSeat = fallbackMap.get(key);

        return {
          row: seat.row,
          number: seat.number,
          tierId: seat.tierId ? `${seat.tierId}` : fallbackSeat?.tierId || null,
          status: seat.status,
        };
      });
    },
    [],
  );

  const loadAvailability = useCallback(
    async (eventId, fallbackSeats = []) => {
      if (!eventId) return;

      try {
        const availabilityResponse = await getEventAvailability(eventId, { _silentError: true });
        const availability = availabilityResponse.data?.data?.availability;
        if (!availability?.seats) return;

        const mappedSeats = mapAvailabilityToSeats(
          availability.seats,
          fallbackSeats,
        );
        setSeats(mappedSeats);
      } catch (error) {
        console.error("Failed to load seat availability", error);
      }
    },
    [mapAvailabilityToSeats],
  );

  useEffect(() => {
    seatsRef.current = seats;
  }, [seats]);

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!event?.id || !event?.hasSeatMap) return;

    const key = getReservationStorageKey(event.id);
    const rawReservation = localStorage.getItem(key);
    if (!rawReservation) return;

    try {
      const parsedReservation = JSON.parse(rawReservation);
      const expiresAt = Number(parsedReservation?.expiresAt);
      const savedSeats = Array.isArray(parsedReservation?.seats)
        ? parsedReservation.seats
        : [];

      if (!expiresAt || expiresAt <= Date.now() || savedSeats.length === 0) {
        clearStoredReservation(event.id);
        return;
      }

      setReservationExpiry(expiresAt);
      setSelectedSeats(
        savedSeats.map((seat) => ({
          row: seat.row,
          number: seat.number,
          tierId: seat.tierId ? `${seat.tierId}` : null,
          status: "reserved",
        })),
      );
    } catch {
      clearStoredReservation(event.id);
    }
  }, [
    event?.id,
    event?.hasSeatMap,
    getReservationStorageKey,
    clearStoredReservation,
  ]);

  useEffect(() => {
    if (!event?.id || !event?.hasSeatMap) return;

    if (!reservationExpiry || selectedSeats.length === 0) {
      clearStoredReservation(event.id);
      return;
    }

    if (reservationExpiry <= Date.now()) {
      clearStoredReservation(event.id);
      return;
    }

    saveStoredReservation(event.id, reservationExpiry, selectedSeats);
  }, [
    event?.id,
    event?.hasSeatMap,
    reservationExpiry,
    selectedSeats,
    saveStoredReservation,
    clearStoredReservation,
  ]);

  useEffect(() => {
    if (!event?.id || !event?.hasSeatMap) return;

    const currentToken = getAccessToken();
    const socket = io(SOCKET_SERVER_URL, {
      auth: {
        token: currentToken
      }
    });
    socket.on("connect", () => {
      socket.emit("join-event", event.id);
      loadAvailability(event.id, seatsRef.current);
    });

    socket.on("seat:update", ({ row, number, status }) => {
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.row === row && seat.number === number
            ? { ...seat, status }
            : seat,
        ),
      );
    });

    return () => {
      socket.off("seat:update");
      socket.disconnect();
    };
  }, [event?.id, event?.hasSeatMap, loadAvailability]);

  useEffect(() => {
    if (isReservingRef.current || isReserving) return;
    if (reservationExpiry || selectedSeats.length === 0) return;

    const unavailableKeys = new Set(
      seats
        .filter((seat) => seat.status !== "available")
        .map((seat) => `${seat.row}-${seat.number}`),
    );

    const filteredSelection = selectedSeats.filter(
      (seat) => !unavailableKeys.has(`${seat.row}-${seat.number}`),
    );

    if (filteredSelection.length !== selectedSeats.length) {
      setSelectedSeats(filteredSelection);
      toast.error("Some selected seats are no longer available.");
    }
  }, [seats, reservationExpiry, selectedSeats, isReserving]);

  const handleSeatClick = (row, number) => {
    if (reservationExpiry) {
      toast.error(
        "You already have reserved seats. Complete purchase or wait for expiry.",
      );
      return;
    }

    const seat = seats.find((s) => s.row === row && s.number === number);
    if (!seat || seat.status !== "available") return;

    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some(
        (s) => s.row === row && s.number === number,
      );
      if (isAlreadySelected) {
        return prev.filter((s) => !(s.row === row && s.number === number));
      }
      return [...prev, seat];
    });
  };

  const handleReserve = async () => {
    if (reservationExpiry) {
      toast.error("You already have an active reservation.");
      return;
    }

    const selectedSnapshot = selectedSeatsRef.current;
    if (selectedSnapshot.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    if (!event?.id) return;

    const uniqueSelectedSeats = Array.from(
      new Map(
        selectedSnapshot.map((seat) => [`${seat.row}-${seat.number}`, seat]),
      ).values(),
    );

    const tickets = uniqueSelectedSeats.map((seat) => {
      const tier = priceTiers.find((t) => t.id === seat.tierId);
      return {
        seatInfo: {
          row: seat.row,
          number: seat.number,
          tierId: seat.tierId,
          tierName: tier?.name,
        },
      };
    });

    try {
      isReservingRef.current = true;
      setIsReserving(true);
      
      await reserveEventSeats(event.id, tickets, { _silentError: true });
      
      const localExpiry = Date.now() + RESERVATION_DURATION;
      setReservationExpiry(localExpiry);
      setSelectedSeats(
        uniqueSelectedSeats.map((seat) => ({ ...seat, status: "reserved" })),
      );
      setShowReservationDialog(true);
      saveStoredReservation(event.id, localExpiry, uniqueSelectedSeats);
    } catch (error) {
      handleError(error, {
        silent: true,
        onMapped: (message) => {
          setDialogMessage(message);
          setopenDialog(true);
        }
      });
      await loadAvailability(event.id, seatsRef.current);
    } finally {
      isReservingRef.current = false;
      setIsReserving(false);
    }
  };

  const handleReservationExpire = async () => {
    setSelectedSeats([]);
    setReservationExpiry(null);
    setShowReservationDialog(false);
    clearStoredReservation(event?.id);
    if (event?.id) {
      await loadAvailability(event.id, seatsRef.current);
    }
    toast.error("Reservation expired. Seats have been released.");
  };

  const handleBuyNow = () => {
    const selectedSnapshot = selectedSeatsRef.current;
    if (!reservationExpiry || selectedSnapshot.length === 0) {
      toast.error("Reserve seats first before purchasing.");
      return;
    }

    setSeats((prev) =>
      prev.map((seat) => {
        const isSelected = selectedSnapshot.some(
          (s) => s.row === seat.row && s.number === seat.number,
        );
        if (isSelected) {
          return { ...seat, status: "sold" };
        }
        return seat;
      }),
    );

    const total = selectedSnapshot.reduce((sum, seat) => {
      const tier = priceTiers.find((t) => t.id === seat.tierId);
      return sum + (tier?.price || 0);
    }, 0);

    const tickets = selectedSnapshot.map((seat) => {
      const tier = priceTiers.find((t) => t.id === seat.tierId);
      return {
        name: tier?.name,
        price: parseFloat(tier?.price) || 0,
        count: 1,
        seatInfo: {
          row: seat.row,
          number: seat.number,
          tierId: seat.tierId,
          tierName: tier?.name,
        },
      };
    });

    navigate("/payment/confirmation", {
      state: { tickets, id: event.id },
    });
    toast.success(`Purchase successful! Total: $${total.toFixed(2)}`);
    setSelectedSeats([]);
    setReservationExpiry(null);
    setShowReservationDialog(false);
    clearStoredReservation(event?.id);
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => {
      const tier = priceTiers.find((t) => t.id === seat.tierId);
      return sum + (tier?.price || 0);
    }, 0);
  };

  const totalToPurchase = calculateTotal();

  const getAvailabilityStats = () => {
    const available = seats.filter(
      (s) => s.status === "available" && s.tierId,
    ).length;
    const sold = seats.filter((s) => s.status === "sold").length;
    const reserved = seats.filter((s) => s.status === "reserved").length;
    const total = seats.filter((s) => s.tierId).length;

    return { available, sold, reserved, total };
  };

  const stats = getAvailabilityStats();


  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Fa3liat",
        text: "Check out this event!",
        url: window.location.href,
      });

    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <>
      {event?.title && <Title>{event?.title}</Title>}

      <div className="w-full bg-white text-black p-4 max-w-350 mx-auto select-text">
        {/* Header Image */}
        <img
          src={event.bannerUrl || eventinfo?.preview || "/images/login.jpg"}
          alt="Event Banner"
          crossOrigin="anonymous"
          className="w-full h-120 rounded-xl mb-6"
        />

        {/* Title + Icons */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold select-text">
            {event.title || eventinfo?.title || "Sound Of Hart 2026"}
          </h1>
          <div className="flex flex-col md:flex-row gap-8 text-2xl">
            <button 
            onClick={handleShare}
            className="cursor-pointer">
              <Share2 size={30} />
            </button>
            <button
              onClick={(e) => {
                handleInterested(e);
              }}
              className="cursor-pointer"
            >
              {isInterested ? (
                <Heart size={30} className={`text-secandry`} fill="#FF49B5" />
              ) : (
                <Heart size={30} />
              )}
            </button>
          </div>
        </div>

        {/* Date & Time */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("events.details.date")}
          </h2>

          {dateFormat.length > 0 ? (
            dateFormat.map((dateItem, index) => (
              <div key={`event-session-date-${index}`} className="mb-4 space-y-2">
                {/* Date */}
                <p className="flex gap-4 items-center">
                  <Calendar />
                  <span>{dateItem.startDate}</span>
                </p>

                {/* Time */}
                <p className="flex gap-4 items-center pl-8 text-gray-500">
                  <Clock />
                  <span>{timeFormat[index] || "6:30 PM - 9:30 PM"}</span>
                </p>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              <p className="flex gap-4 items-center">
                <Calendar />
                Saturday, 2 December 2023
              </p>

              <p className="flex gap-4 items-center pl-8 text-gray-500">
                <Clock />
                6:30 PM - 9:30 PM
              </p>
            </div>
          )}
        </div>

        {/* Ticket Info */}
        {event?.hasSeatMap ? (
          /* ======================= SEAT MAP UI ======================= */

          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {t("events.details.seatMap.ticketInfo")}
                  </h1>
                  <p className="text-gray-600">
                    {t("events.details.seatMap.ticketDescription")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  {/* View Mode Toggle */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("events.details.seatMap.viewMode")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs
                        value={viewMode}
                        onValueChange={(v) => setViewMode(v)}
                      >
                        <TabsList
                          className="
      grid w-full grid-cols-2
      bg-gray-200
      rounded-xl
      p-1
    "
                        >
                          <TabsTrigger
                            value="pricing"
                            className="
        rounded-lg
        text-gray-700
        data-[state=active]:bg-white
        data-[state=active]:text-black
        data-[state=active]:shadow-sm
        transition-all
      "
                          >
                            {t("events.details.seatMap.pricing")}
                          </TabsTrigger>

                          <TabsTrigger
                            value="availability"
                            className="
        rounded-lg
        text-gray-700
        data-[state=active]:bg-white
        data-[state=active]:text-black
        data-[state=active]:shadow-sm
        transition-all
      "
                          >
                            {t("events.details.seatMap.availability")}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Legend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("events.details.seatMap.legend")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {viewMode === "pricing" ? (
                        <>
                          {priceTiers.map((tier) => (
                            <div
                              key={`tier-legend-${tier.id || tier.name}`}
                              className="flex items-center gap-3"
                            >
                              <div
                                className="w-6 h-6 rounded border-2 border-gray-400"
                                style={{ backgroundColor: tier.color }}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{tier.name}</div>
                                <div className="text-sm text-gray-600">
                                  ${tier.price}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-gray-400 bg-[#22c55e]" />
                            <span>{t("events.details.seatMap.available")}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-gray-400 bg-[#ef4444]" />
                            <span>{t("events.details.seatMap.sold")}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-gray-400 bg-[#f59e0b]" />
                            <span>{t("events.details.seatMap.reserved")}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded border-2 border-blue-700 bg-[#3b82f6]" />
                            <span>
                              {t("events.details.seatMap.yourSelection")}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("events.details.seatMap.seatAvailability")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            {t("events.details.seatMap.available")}
                          </span>
                          <span className="font-bold text-green-600">
                            {stats.available}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">{t("events.details.seatMap.sold")}</span>
                          <span className="font-bold text-red-600">
                            {stats.sold}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {t("events.details.seatMap.reserved")}
                          </span>
                          <span className="font-bold text-amber-600">
                            {stats.reserved}
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="text-sm text-gray-600">
                          {t("events.details.seatMap.totalSeats")}
                        </div>
                        <div className="text-2xl font-bold">{stats.total}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Seats */}
                  {selectedSeats.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {t("events.details.seatMap.yourSelection")} (
                          {selectedSeats.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {selectedSeats.map((seat) => {
                            const tier = priceTiers.find(
                              (t) => t.id === seat.tierId,
                            );
                            return (
                              <div
                                key={`${seat.row}-${seat.number}`}
                                className="flex justify-between items-center text-sm"
                              >
                                <span>
                                  {t("events.details.seatMap.row")}{" "}
                                  {String.fromCharCode(65 + seat.row)},{" "}
                                  {t("events.details.seatMap.seat")}{" "}
                                  {seat.number + 1}
                                </span>
                                <span className="font-medium">
                                  ${tier?.price || 0}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center">
                          <span className="font-semibold">
                            {t("events.details.seatMap.total")}
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            ${totalToPurchase.toFixed(2)}
                          </span>
                        </div>
                        {user?.id ? (
                          !reservationExpiry && (
                            <Button
                              onClick={handleReserve}
                              disabled={isReserving}
                              className="w-full"
                              size="lg"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              {isReserving
                                ? "Reserving..."
                                : "Reserve for 10 Minutes"}
                            </Button>
                          )
                        ) : (
                          <p className="text-lg pl-3 mb-2 text-red-600">
                            {t("events.details.seatMap.cannotReserve")}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Reservation Timer */}
                  {reservationExpiry && (
                    <ReservationTimer
                      expiresAt={reservationExpiry}
                      onExpire={handleReservationExpire}
                    />
                  )}

                  {/* Buy Button */}
                  {user?.id ? (
                    reservationExpiry && (
                      <Button
                        onClick={handleBuyNow}
                        disabled={selectedSeats.length === 0}
                        className="w-full"
                        size="lg"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t("events.details.seatMap.completePurchase")} $
                        {totalToPurchase.toFixed(2)}
                      </Button>
                    )
                  ) : (
                    <p className="text-lg pl-3 mb-2 text-red-600">
                      {t("events.details.seatMap.cannotbuy")}
                    </p>
                  )}
                </div>

                {/* Main Content - Seat Map */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {t("events.details.seatMap.venueMap")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto pb-4 flex flex-row-reverse">
                        <BuyerSeatMap
                          seats={seats}
                          rows={rows}
                          seatsPerRow={seatsPerRow}
                          priceTiers={priceTiers}
                          onSeatClick={handleSeatClick}
                          selectedSeats={selectedSeats}
                          viewMode={viewMode}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Reservation Confirmation Dialog */}
            <Dialog
              open={showReservationDialog}
              onOpenChange={setShowReservationDialog}
            >
              <DialogContent className="bg-white!">
                <DialogHeader>
                  <DialogTitle>
                    {t("events.details.seatMap.seatReserved")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("events.details.seatMap.DialogDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-900">
                          {t("events.details.seatMap.timerStarted")}
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          {t("events.details.seatMap.pleaseCompletePurchase")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setShowReservationDialog(false)}>
                    {t("events.details.seatMap.continue")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          /* ======================= NORMAL TICKET UI ======================= */
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                {t("events.details.ticketing.ticketInfo")}
              </h2>

              {event?.ticketTypes?.length > 0 ? (
                event.ticketTypes.map((ticket) => (
                  <p className="text-lg pl-3 mb-2" key={ticket.id}>
                    {`${ticket.name}: ${ticket.price} EGP`}
                  </p>
                ))
              ) : eventinfo?.tickets?.length > 0 ? (
                eventinfo.tickets.map((ticket, index) => (
                  <p className="text-lg pl-3 mb-2" key={index}>
                    {`${ticket.name}: ${ticket.price} EGP`}
                  </p>
                ))
              ) : (
                <p>{t("events.details.ticketing.noAvailableTickets")}</p>
              )}
            </div>

            {/* Ticket Button */}
            {user?.id ? (
              <button
                onClick={() =>
                  navigate(`/payment/tickets?id=${event.id}`, {
                    state: { tickets: event.ticketTypes || [], id: event.id },
                  })
                }
                className="bg-pink-500 text-white px-6 py-3 rounded-lg shadow mb-6 cursor-pointer transition-all hover:bg-[#FF8370]"
              >
                {t("events.details.ticketing.buyTickets")}
              </button>
            ) : (
              <p className="text-lg pl-3 mb-2 text-red-600">
                {t("events.details.ticketing.cannotbuy")}
              </p>
            )}
          </>
        )}

        {/* Location */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 ">
            {t("events.details.location")}
          </h2>
          <p className="mb-3 select-all">
            {event.venue?.address ||
              eventinfo?.location?.address ||
              `Bal Gandharva Rang Mandir, Near Junction Of 24th & 32nd Road &
            Patwardhan Park, Off Linking Road, Bandra West, Mumbai, India`}
          </p>
          <div className="w-full">
            <DisplayLocatinMap
              lat={event.venue?.latitude || eventinfo?.location?.latitude}
              lon={event.venue?.longitude || eventinfo?.location?.longitude}
              name={event.venue?.address || eventinfo?.location?.address}
            />
          </div>
        </div>

        {/* Hosted By */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("events.details.hostedBy")}
          </h2>
          <div className="flex items-center gap-3">
            <img src="/images/Charity.jpg" className="w-12 h-12 rounded-full" />
            <div>
              <p className="font-semibold">
                {event.organizer?.name || organizer?.name || (typeof organizer === 'string' ? organizer : "") || "Fa3liat Organizer"}
              </p>
              <div className="flex gap-2 mt-1">
                <button className="border px-2 py-1 rounded cursor-pointer">
                  {t("events.details.contact")}
                </button>
                <button className="border px-2 py-1 rounded bg-gray-900 text-white cursor-pointer">
                  + {t("events.details.follow")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <RulesList rules={event?.rules} />
        <TagsList tags={event?.tags} />
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">
            {t("events.details.description")}
          </h2>
          <p className="whitespace-pre-wrap">
            {event.description || eventinfo?.description}
          </p>
        </div>

        <hr className="text-gray-400 mt-10 " />
      </div>

      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </>
  );
}
