import { ArrowRight, Ticket } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { Title } from "react-head";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import TicketDialog from "../../components/Dialogs/TicketDialog";
import { Skeleton } from "../../components/shadcn/skeleton";
import { Card, CardContent, CardHeader } from "../../components/shadcn/card";
import CardSkeleton from "../../components/UI/CardSkeleton";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import { getUserTickets } from "../../APIs/userAPIs";
import { extractDateTime } from "../../utils/dateFormater";
import { useTranslation } from "react-i18next";

function DisplayUserTickets() {
  const { t } = useTranslation();
  const [sortedMethod, setSortedMethod] = useState("Newest");
  const [openDialog, setopenDialog] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openErrorDialog, setopenErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSortingChange = (method) => {
    setSortedMethod(method);
    // console.log(method);

    if (method === "Newest") {
      const newTickets = [...tickets].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setTickets(newTickets);
    } else if (method === "Nearest") {
      const now = new Date();
      const newTickets = [...tickets].sort((a, b) => {
        const aDiff = Math.abs(new Date(a.date) - now);
        const bDiff = Math.abs(new Date(b.date) - now);
        return aDiff - bDiff;
      });
      setTickets(newTickets);
    }
  };

  const handleLoadTickets = async () => {
    try {
      setLoading(true);
      const response = (await getUserTickets()).data.data.tickets;
      // console.log(response);
      const ticketsData = response;

      const groupedTickets = Object.values(
        ticketsData.reduce((acc, ticket) => {
          const orderId = ticket?.orderId;

          if (!acc[orderId]) {
            acc[orderId] = {
              orderId,
              tickets: [],
            };
          }

          acc[orderId]?.tickets?.push(ticket);

          return acc;
        }, {}),
      );
      // console.log("groupedTickets:", groupedTickets);
      setTickets(groupedTickets);
    } catch (error) {
      const message =
        error.response?.data?.error || t("tickets.details.fetchError");
      setDialogMessage(message);
      setopenErrorDialog(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadTickets();
  }, []);
  // testing downloading QR code as PDF

  return (
    <>
      <Title>{t("tickets.title")}</Title>

      <div className="px-4 sm:px-6 lg:px-16 xl:px-24 my-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl font-serif text-shadow-md text-shadow-gray-400">
            {t("tickets.header")}
          </h1>

          {/* Sorting */}
          <div className="flex w-full md:w-auto border border-gray-300 rounded-lg overflow-hidden">
            {[
              { id: "Newest", label: t("tickets.sorting.newest") },
              { id: "Nearest", label: t("tickets.sorting.nearest") },
            ].map((method, i) => (
              <label
                key={method.id}
                className={`flex-1 text-center px-4 py-2 font-mono cursor-pointer transition
                ${
                  sortedMethod === method.id
                    ? "bg-primary text-white cursor-not-allowed"
                    : "bg-white hover:bg-primary/10"
                }
                ${i === 0 ? "border-r border-gray-300" : ""}
              `}
              >
                <input
                  type="radio"
                  name="selected"
                  value={method.id}
                  checked={sortedMethod === method.id}
                  onChange={(e) => handleSortingChange(e.target.value)}
                  className="hidden"
                />
                {method.label}
              </label>
            ))}
          </div>
        </div>

        <hr className="my-4 text-gray-300" />

        {/* Tickets */}
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6

        "
        >
          {tickets?.length >= 1
            ? tickets?.map((order, index) => (
                <div
                  key={order?.tickets[0]?.ticketId}
                  onClick={() => {
                    setopenDialog(true);
                    setSelectedTicket(order?.tickets);
                  }}
                  className="border rounded-xl shadow-lg flex flex-col items-center text-center overflow-hidden hover:shadow-2xl hover:scale-103 transition duration-500 hover:bg-black/5"
                >
                  {/* QR */}
                  <div className="w-32 h-32 sm:w-40 sm:h-48 mt-8">
                    <QRCode
                      value={order?.tickets[0]?.ticketId}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="py-4 px-4">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      {order?.tickets[0]?.title}
                    </h3>

                    <p className="text-gray-500 text-sm sm:text-base">
                      {t("tickets.details.date")}:{" "}
                      {extractDateTime(order?.tickets[0]?.date).date}
                    </p>

                    <p className="text-gray-500 text-sm sm:text-base">
                      {t("tickets.details.quantity")}: {order?.tickets?.length}
                    </p>
                  </div>
                  {/* Button */}
                  <button className="w-full bg-primary text-white py-3 flex items-center justify-center gap-2 hover:bg-primary/80 transition">
                    {t("tickets.details.viewDetails")} <ArrowRight size={18} />
                  </button>
                </div>
              ))
            : loading &&
              [1, 2, 3, 4, 5, 6].map((temp) => <CardSkeleton key={temp} />)}
          {openDialog && (
            <TicketDialog
              open={openDialog}
              onClose={() => setopenDialog(false)}
              tickets={selectedTicket}
            />
          )}
        </div>
        {tickets?.length === 0 && !loading && (
          <p className="text-gray-500 text-center w-full min-h-[50vh] flex items-center justify-center">
            {t("tickets.details.noTickets")}
          </p>
        )}
      </div>
      {openErrorDialog && (
        <ErrorDialog
          open={openErrorDialog}
          message={dialogMessage}
          onClose={() => setopenErrorDialog(false)}
        />
      )}
    </>
  );
}

export default DisplayUserTickets;
