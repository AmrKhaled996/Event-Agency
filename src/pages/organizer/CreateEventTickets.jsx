import { useState, useEffect } from "react";
import CreateEventProgressBar from "../../components/UI/CreateEventProgressBar";
import { useEventForm } from "../../Context/EventPovider";
import { Title } from "react-head";
import { SeatMap } from "./../../components/UI/SeatMap";
import { PriceTierEditor } from "./../../components/UI/PriceTierEditor";
import { VenueSettings } from "./../../components/UI/VenueSettings";
import { Button } from "./../../components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../components/shadcn/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../../components/shadcn/tabs";
import { Eye, Edit3 } from "lucide-react";
import { toast } from "sonner";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

function CreateEventTickets() {
  const { t } = useTranslation();
  const { formData, updateForm } = useEventForm();
  const navigate = useAppNavigate();
  const [type, setType] = useState(formData.tickets.type || "ticketed");
  const [tickets, setTickets] = useState(formData.tickets.tickets || []);
  const [ticketName, setTicketName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(0);
  const [eventType, setEventType] = useState("general");
  const addTicket = () => {
    if (!ticketName) return;
    const newticket = {
      name: ticketName,
      price: ticketPrice || 0,
      quantity: ticketQuantity || 0,
    };
    const next = [...tickets, newticket];
    setTickets(next);
    updateForm("tickets", { type, tickets: next });
    setTicketName("");
    setTicketPrice("");
  };

  const removeTicket = (i) => {
    const next = tickets.filter((_, remove) => remove !== i);
    setTickets(next);
    updateForm("tickets", { type, tickets: next });
  };

  const handleNext = () => {
    if (eventType === "seatmap") {
      updateForm("tickets", {
        eventType: "seatmap",
        type: "ticketed",
        tickets,
        seats,
        rows,
        seatsPerRow,
        priceTiers,
      });
    } else {
      updateForm("tickets", {
        eventType: "general",
        type: "ticketed",
        tickets,
      });
    }

    navigate("/organizer/create-event/review");
  };

  const [rows, setRows] = useState(8);
  const [seatsPerRow, setSeatsPerRow] = useState(12);
  const [tempRows, setTempRows] = useState(rows);
  const [tempSeatsPerRow, setTempSeatsPerRow] = useState(seatsPerRow);
  const [seats, setSeats] = useState([]);
  const [priceTiers, setPriceTiers] = useState([
    {
      id: "1",
      name: "VIP",
      price: 150,
      color: "#ec4899",
    },
    {
      id: "2",
      name: "Premium",
      price: 100,
      color: "#8b5cf6",
    },
    {
      id: "3",
      name: "Standard",
      price: 50,
      color: "#3b82f6",
    },
  ]);
  const [selectedTier, setSelectedTier] = useState(priceTiers[0].id);
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    const newSeats = [];
    for (let row = 0; row < rows; row++) {
      for (let seat = 0; seat < seatsPerRow; seat++) {
        newSeats.push({
          row,
          number: seat,
          tierId: null,
        });
      }
    }
    setSeats(newSeats);
    setTickets([]);
  }, [rows, seatsPerRow]);

  const handleSeatClick = (row, number) => {
    if (!selectedTier) {
      toast.error(t("organizer.createEvent.validation.selectTier"));
      return;
    }

    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((seat) => {
        if (seat.row === row && seat.number === number) {
          // If clicking same tier → unassign
          if (seat.tierId === selectedTier) {
            return { ...seat, tierId: null };
          }
          // Otherwise assign new tier
          return { ...seat, tierId: selectedTier };
        }
        return seat;
      });

      const updatedTickets = priceTiers
        .map((tier) => {
          const quantity = updatedSeats.filter(
            (s) => s.tierId === tier.id,
          ).length;

          return quantity > 0
            ? { name: tier.name, price: tier.price, quantity }
            : null;
        })
        .filter(Boolean);

      setTickets(updatedTickets);

      return updatedSeats;
    });
  };

  const handleTierAdd = (tier) => {
    // omit id
    const newTier = {
      ...tier,
      id: Date.now().toString(),
    };
    setPriceTiers((prev) => [...prev, newTier]);
    setSelectedTier(newTier.id);
    toast.success(t("organizer.createEvent.validation.tierAdded", { name: tier.name }));
  };

  const handleTierUpdate = (id, updates) => {
    setPriceTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, ...updates } : tier)),
    );
  };

  const handleTierDelete = (id) => {
    // Remove tier from seats
    setSeats((prev) =>
      prev.map((seat) =>
        seat.tierId === id ? { ...seat, tierId: null } : seat,
      ),
    );
    // Remove tier from list
    setPriceTiers((prev) => prev.filter((tier) => tier.id !== id));
    // Deselect if this tier was selected
    if (selectedTier === id) {
      setSelectedTier(priceTiers[0]?.id || null);
    }
    toast.success(t("organizer.createEvent.validation.tierDeleted"));
  };

  const handleApplyLayout = () => {
    setRows(tempRows);
    setSeatsPerRow(tempSeatsPerRow);
    toast.success(t("organizer.createEvent.validation.layoutUpdated"));
  };

  const getStatistics = () => {
    const stats = priceTiers.map((tier) => ({
      ...tier,
      count: seats.filter((seat) => seat.tierId === tier.id).length,
      revenue:
        seats.filter((seat) => seat.tierId === tier.id).length * tier.price,
    }));

    const totalSeats = seats.length;
    const assignedSeats = seats.filter((seat) => seat.tierId !== null).length;
    const totalRevenue = stats.reduce((sum, stat) => sum + stat.revenue, 0);

    return { stats, totalSeats, assignedSeats, totalRevenue };
  };

  const { stats, totalSeats, assignedSeats, totalRevenue } = getStatistics();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title>{t("organizer.createEvent.ticketing")}</Title>
      <CreateEventProgressBar step={3} />
      <h2 className="text-xl font-semibold mb-4">{t("organizer.createEvent.ticketingTitle")}</h2>
      <div className="flex items-center gap-4 mb-8">
        <span
          className={`text-sm font-medium ${
            eventType === "seatmap" ? "text-black" : "text-gray-400"
          }`}
        >
          {t("organizer.createEvent.seatMap")}
        </span>

        <button
          onClick={() =>
            setEventType(eventType === "seatmap" ? "general" : "seatmap")
          }
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            eventType === "general" ? "bg-gray-300" : "bg-purple-600"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              eventType === "general" ? "translate-x-7" : ""
            }`}
          />
        </button>

        <span
          className={`text-sm font-medium ${
            eventType === "general" ? "text-black" : "text-gray-400"
          }`}
        >
          {t("organizer.createEvent.generalAdmission")}
        </span>
      </div>

      {/* Conditional Rendering */}
      {eventType === "seatmap" ? (
        <div>
          {/* Seat Map Configuration UI */}
          <p className="text-gray-600">{t("organizer.createEvent.configureLayout")}</p>
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{t("organizer.createEvent.seatMapTitle")}</h1>
                  <p className="text-gray-600">
                    {t("organizer.createEvent.seatMapDesc")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Left Sidebar */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("organizer.createEvent.controls")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Button
                            variant={editMode ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setEditMode(true)}
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {t("organizer.createEvent.edit")}
                          </Button>
                          <Button
                            variant={!editMode ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setEditMode(false)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t("organizer.createEvent.preview")}
                          </Button>
                        </div>

                        {editMode && selectedTier && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>{t("organizer.createEvent.edit")}</strong> {t("organizer.createEvent.dragInstruction")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <Tabs defaultValue="tiers">
                        <TabsList
                          className="
      grid w-full grid-cols-2
      bg-gray-200
      rounded-xl
      p-1
    "
                        >
                          <TabsTrigger
                            value="tiers"
                            className="
        rounded-lg
        text-gray-700
        data-[state=active]:bg-white
        data-[state=active]:text-black
        data-[state=active]:shadow-sm
        transition-all
      "
                          >
                            {t("organizer.createEvent.priceTiers")}
                          </TabsTrigger>

                          <TabsTrigger
                            value="layout"
                            className="
        rounded-lg
        text-gray-700
        data-[state=active]:bg-white
        data-[state=active]:text-black
        data-[state=active]:shadow-sm
        transition-all
      "
                          >
                            {t("organizer.createEvent.layout")}
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tiers" className="mt-4">
                          <PriceTierEditor
                            priceTiers={priceTiers}
                            selectedTier={selectedTier}
                            onTierSelect={setSelectedTier}
                            onTierAdd={handleTierAdd}
                            onTierUpdate={handleTierUpdate}
                            onTierDelete={handleTierDelete}
                          />
                        </TabsContent>
                        <TabsContent value="layout" className="mt-4">
                          <VenueSettings
                            rows={tempRows}
                            seatsPerRow={tempSeatsPerRow}
                            onRowsChange={setTempRows}
                            onSeatsPerRowChange={setTempSeatsPerRow}
                            onApply={handleApplyLayout}
                          />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("organizer.createEvent.statistics")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-600">{t("organizer.createEvent.totalSeats")}</div>
                        <div className="text-2xl font-bold">{totalSeats}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          {t("organizer.createEvent.assignedSeats")}
                        </div>
                        <div className="text-2xl font-bold">
                          {assignedSeats}
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="text-sm text-gray-600">
                          {t("organizer.createEvent.potentialRevenue")}
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          ${totalRevenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-2 border-t pt-4">
                        {stats.map((stat) => (
                          <div
                            key={stat.id}
                            className="flex justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: stat.color }}
                              />
                              <span>{stat.name}</span>
                            </div>
                            <span className="font-medium">
                              {stat.count} x ${stat.price} = ${stat.revenue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content - Seat Map */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("organizer.createEvent.venueMap")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto pb-4">
                        <SeatMap
                          seats={seats}
                          rows={rows}
                          seatsPerRow={seatsPerRow}
                          selectedTier={selectedTier}
                          priceTiers={priceTiers}
                          onSeatClick={handleSeatClick}
                          editMode={editMode}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* General Admission UI */}
          <p className="text-gray-600">
            {t("organizer.createEvent.generalAdmissionDesc")}
          </p>
          <div className="mb-10">
            <div className="flex gap-3 ">
              <button
                onClick={() => {

                  setTickets([]);
                  setType("ticketed");
                }}
                className={`p-4 border rounded flex flex-col justify-center items-center flex-1 ${
                  type === "ticketed"
                    ? "border-purple-700 bg-purple-50"
                    : "bg-white"
                }`}
              >
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 90 90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_359_2572" fill="white">
                    <path d="M86.164 31.8864L78.4068 24.1291C77.781 23.5117 76.9465 23.1512 76.0679 23.1187C75.1894 23.0861 74.3305 23.3839 73.6607 23.9534C72.6266 24.8336 71.2996 25.2931 69.9426 25.2411C68.5856 25.189 67.2977 24.629 66.3342 23.6721C65.3778 22.7086 64.8181 21.4211 64.766 20.0645C64.7139 18.7079 65.1732 17.3813 66.0529 16.3473C66.6224 15.6775 66.9202 14.8186 66.8876 13.9401C66.8551 13.0615 66.4946 12.2271 65.8771 11.6012L58.1129 3.8352C57.4567 3.18031 56.5676 2.8125 55.6405 2.8125C54.7135 2.8125 53.8243 3.18031 53.1682 3.8352L40.802 16.1996C40.0385 16.9659 39.4627 17.8984 39.1197 18.9243C39.053 19.1215 38.9416 19.3007 38.7944 19.4479C38.6471 19.5952 38.4679 19.7065 38.2707 19.7733C37.2445 20.1162 36.3118 20.6927 35.5461 21.4573L3.8352 53.1682C3.18031 53.8243 2.8125 54.7135 2.8125 55.6406C2.8125 56.5676 3.18031 57.4568 3.8352 58.1129L11.6012 65.8701C12.2271 66.4876 13.0615 66.8481 13.9401 66.8806C14.8186 66.9132 15.6775 66.6154 16.3473 66.0459C17.3789 65.1586 18.7078 64.6939 20.0676 64.745C21.4273 64.796 22.7176 65.3591 23.6798 66.3213C24.642 67.2834 25.205 68.5737 25.2561 69.9335C25.3071 71.2933 24.8424 72.6221 23.9551 73.6537C23.3857 74.3235 23.0879 75.1824 23.1204 76.061C23.1529 76.9395 23.5135 77.774 24.1309 78.3998L31.8881 86.1571C32.5443 86.8119 33.4334 87.1797 34.3605 87.1797C35.2875 87.1797 36.1767 86.8119 36.8328 86.1571L68.5437 54.4461C69.3079 53.6808 69.8843 52.7488 70.2277 51.7233C70.2942 51.5254 70.4056 51.3456 70.5532 51.198C70.7008 51.0504 70.8806 50.939 71.0785 50.8725C72.1038 50.5294 73.0358 49.9537 73.8014 49.1903L86.1658 36.8241C86.8183 36.168 87.1844 35.2802 87.1841 34.3548C87.1838 33.4295 86.817 32.542 86.164 31.8864ZM46.0209 26.6744C45.7597 26.9357 45.4497 27.1429 45.1084 27.2843C44.7671 27.4257 44.4013 27.4984 44.0319 27.4984C43.6625 27.4984 43.2968 27.4257 42.9555 27.2843C42.6142 27.1429 42.3042 26.9357 42.043 26.6744L40.0197 24.6512C39.5051 24.1211 39.2198 23.4098 39.2253 22.671C39.2309 21.9322 39.5269 21.2253 40.0495 20.703C40.572 20.1804 41.2789 19.8845 42.0177 19.8789C42.7566 19.8734 43.4678 20.1587 43.998 20.6733L46.0213 22.6965C46.5413 23.2185 46.8317 23.9242 46.8291 24.659C46.8264 25.3937 46.531 26.0963 46.0076 26.6133L46.0209 26.6744Z" fill="black"/>
                  </mask>
                  <path
                    d="M86.164 31.8864L78.4068 24.1291C77.781 23.5117 76.9465 23.1512 76.0679 23.1187C75.1894 23.0861 74.3305 23.3839 73.6607 23.9534C72.6266 24.8336 71.2996 25.2931 69.9426 25.2411C68.5856 25.189 67.2977 24.629 66.3342 23.6721C65.3778 22.7086 64.8181 21.4211 64.766 20.0645C64.7139 18.7079 65.1732 17.3813 66.0529 16.3473C66.6224 15.6775 66.9202 14.8186 66.8876 13.9401C66.8551 13.0615 66.4946 12.2271 65.8771 11.6012L58.1129 3.8352C57.4567 3.18031 56.5676 2.8125 55.6405 2.8125C54.7135 2.8125 53.8243 3.18031 53.1682 3.8352L40.802 16.1996C40.0385 16.9659 39.4627 17.8984 39.1197 18.9243C39.053 19.1215 38.9416 19.3007 38.7944 19.4479C38.6471 19.5952 38.4679 19.7065 38.2707 19.7733C37.2445 20.1162 36.3118 20.6927 35.5461 21.4573L3.8352 53.1682C3.18031 53.8243 2.8125 54.7135 2.8125 55.6406C2.8125 56.5676 3.18031 57.4568 3.8352 58.1129L11.6012 65.8701C12.2271 66.4876 13.0615 66.8481 13.9401 66.8806C14.8186 66.9132 15.6775 66.6154 16.3473 66.0459C17.3789 65.1586 18.7078 64.6939 20.0676 64.745C21.4273 64.796 22.7176 65.3591 23.6798 66.3213C24.642 67.2834 25.205 68.5737 25.2561 69.9335C25.3071 71.2933 24.8424 72.6221 23.9551 73.6537C23.3857 74.3235 23.0879 75.1824 23.1204 76.061C23.1529 76.9395 23.5135 77.774 24.1309 78.3998L31.8881 86.1571C32.5443 86.8119 33.4334 87.1797 34.3605 87.1797C35.2875 87.1797 36.1767 86.8119 36.8328 86.1571L68.5437 54.4461C69.3079 53.6808 69.8843 52.7488 70.2277 51.7233C70.2942 51.5254 70.4056 51.3456 70.5532 51.198C70.7008 51.0504 70.8806 50.939 71.0785 50.8725C72.1038 50.5294 73.0358 49.9537 73.8014 49.1903L86.1658 36.8241C86.8183 36.168 87.1844 35.2802 87.1841 34.3548C87.1838 33.4295 86.817 32.542 86.164 31.8864ZM46.0209 26.6744C45.7597 26.9357 45.4497 27.1429 45.1084 27.2843C44.7671 27.4257 44.4013 27.4984 44.0319 27.4984C43.6625 27.4984 43.2968 27.4257 42.9555 27.2843C42.6142 27.1429 42.3042 26.9357 42.043 26.6744L40.0197 24.6512C39.5051 24.1211 39.2198 23.4098 39.2253 22.671C39.2309 21.9322 39.5269 21.2253 40.0495 20.703C40.572 20.1804 41.2789 19.8845 42.0177 19.8789C42.7566 19.8734 43.4678 20.1587 43.998 20.6733L46.0213 22.6965C46.5413 23.2185 46.8317 23.9242 46.8291 24.659C46.8264 25.3937 46.531 26.0963 46.0076 26.6133L46.0209 26.6744Z"
                    stroke="black"
                    strokeWidth="8"
                    mask="url(#path-1-inside-1_359_2572)"
                  />
                </svg>
                {t("organizer.createEvent.ticketedEvent")}
                <div className="text-sm text-gray-500">
                  {t("organizer.createEvent.ticketedEventDesc")}
                </div>
              </button>
              <button
                onClick={() => {
                  setTickets([
                    { name: "Free Event", price: 0, quantity: 10000 },
                  ]);
                  setType("free");
                }}
                className={`p-4 border rounded flex flex-col justify-center items-center flex-1 ${
                  type === "free"
                    ? "border-purple-700 bg-purple-50"
                    : "bg-white"
                }`}
              >
                <img
                  src={"/images/Free_icon.png"}
                  alt="Free icon"
                  className="w-12.5 h-fit"
                />
                {t("organizer.createEvent.freeEvent")}
                <div className="text-sm text-gray-500">
                  {t("organizer.createEvent.freeEventDesc")}
                </div>
              </button>
            </div>
          </div>

          {type === "ticketed" ? (
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <input
                  value={ticketName}
                  type="text"
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder={t("organizer.createEvent.ticketNamePlaceholder")}
                  className="border rounded p-2 col-span-2 "
                />
                <input
                  value={ticketPrice}
                  type="number"
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder={t("organizer.createEvent.pricePlaceholder")}
                  className="border rounded p-2"
                />
                <input
                  value={ticketQuantity}
                  type="number"
                  onChange={(e) => setTicketQuantity(e.target.value)}
                  placeholder={t("organizer.createEvent.quantityPlaceholder")}
                  className="border rounded p-2 "
                />
              </div>
              <div className="mt-3">
                <button
                  onClick={addTicket}
                  className="px-4 py-2 bg-purple-700 text-white rounded"
                >
                  {t("organizer.createEvent.addTicket")}
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {tickets.map((tic, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border rounded p-3"
                  >
                    <div>
                      <div className="font-medium">{tic.name}</div>
                      <div className="text-sm text-gray-500">
                        {t("organizer.createEvent.priceLabel")} {tic.price}
                      </div>
                    </div>
                    <button
                      onClick={() => removeTicket(i)}
                      className="text-red-500"
                    >
                      {t("common.actions.remove")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className=" flex justify-center gap-3 items-center">
              {t("organizer.createEvent.quantityLabel")}
              <input
                value={ticketQuantity}
                type="number"
                onChange={(e) => {
                  setTicketQuantity(e.target.value);
                  setTickets([
                    { name: "Free Event", price: 0, quantity: e.target.value },
                  ]);
                }}
                placeholder={t("organizer.createEvent.quantityPlaceholder")}
                className="border rounded p-2 "
              />
            </div>
          )}
        </div>
      )}
      <div className="flex justify-between">
        <button
          onClick={() => navigate("/organizer/create-event/banner")}
          className="text-gray-600"
        >
          {t("organizer.createEvent.back")}
        </button>
        <button
          disabled={type === "ticketed" && tickets.length === 0}
          onClick={handleNext}
          className="bg-purple-700 text-white px-6 py-2 rounded"
        >
          {t("organizer.createEvent.next")}
        </button>
      </div>
    </div>
  );
}

export default CreateEventTickets;
