import { X } from "lucide-react";
import Dialog from "../UI/Dialog";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

import {  extractDateTime } from "../../utils/dateFormater";
import { getTicketById } from "../../APIs/ticketsApis";
import { useTranslation } from "react-i18next";

function TicketDialog({ open, onClose, tickets }) {
  const { t } = useTranslation();
  const inputRefs = useRef([]);
  const [ticketsData, setticketsData] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const currentTicket = tickets;

  inputRefs.current = [];

  const addToRefs = (el) => {
    if (el && !inputRefs.current.includes(el)) {
      inputRefs.current.push(el);
    }
  };

  const handleDownloadPDF = async () => {
    if (!ticketsData.length || inputRefs.current.length === 0) return;

    try {
      setIsDownloading(true);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [535, 528],
      });

      for (let i = 0; i < inputRefs.current.length; i++) {
        const element = inputRefs.current[i];

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        if (i !== 0) pdf.addPage([535, 528], "landscape");

        pdf.addImage(imgData, "JPEG", 0, 0, 535, 528);
      }

      const fileName = `${ticketsData[0]?.ticketType?.event?.title || "ticket"}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGetTicketsData = async () => {
    try {
      const data = [];
      for (const element of currentTicket) {
        const response = await getTicketById(element.ticketId);
        data.push(response.data.data);
      }
      setticketsData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    handleGetTicketsData();
  },[currentTicket]);
  return (
    <Dialog open={open} onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-800 transition duration-300 ease-in-out"
      >
        <X size={24} />
      </button>
      <div className="flex flex-col gap-8 h-full max-h-[75vh] w-full overflow-y-scroll">
        {ticketsData &&
          ticketsData?.map((ticket) => (
            <div key={ticket?.ticketId} ref={addToRefs}>
              <h3 className="text-3xl text-center text-shadow-2xs  font-semibold mb-4 ">
                {ticket?.ticketType?.event?.title}
              </h3>
              <div
                key={ticket?.ticketId}
                className="border rounded-xl max-w-xl shadow-lg flex flex-col items-center text-center overflow-hidden m-auto "
              >
                {/* QR */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 mt-8 mb-8">
                  <QRCode value={ticket?.ticketId} className="w-full h-full" />
                </div>

                {/* Info */}
                <h3 className="text-lg sm:text-xl font-bold ">
                  {ticket?.title}
                </h3>
                <div className="py-4 px-4 flex flex-col items-start gap-2 ">
                  <p className=" text-sm sm:text-base">
                    {t("tickets.details.date")}:{" "}
                    {/* {extractDateParts(
                      ticket?.ticketType?.event?.eventSessions[0]?.startDate,
                    ).day +
                      " " +
                      extractDateParts(
                        ticket?.ticketType?.event?.eventSessions[0]?.startDate,
                      ).month +
                      " " +
                      extractDateParts(
                        ticket?.ticketType?.event?.eventSessions[0]?.startDate,
                      ).year} */}
                      {extractDateTime(ticket?.date)?.date + " " + extractDateTime(ticket?.date)?.time}
                  </p>

                 {ticket?.seat && <p className=" text-sm sm:text-base">
                    
                      {t("tickets.details.seats")}: {ticket?.seat?.row}
                    {ticket?.seat?.seat}
                  </p>}

                  <p className=" text-sm sm:text-base">
                    {t("tickets.details.price")}: {ticket?.price}
                  </p>
                  <p className=" text-sm sm:text-base">
                    {t("tickets.details.location")}: {ticket?.location?.name}
                  </p>
                  <p className=" text-sm sm:text-base">
                    {t("tickets.details.status")}: {ticket?.status}
                  </p>
                  <p className=" text-sm sm:text-base">
                    {t("tickets.details.organizer")}: {ticket?.organizer}
                  </p>
                </div>
                <footer
                  className="w-full border-t border-[#ebe6e7] pt-2 pb-3 px-2 text-start text-xs font-light "
                  style={{ color: "#99a1af" }}
                >
                  © 2026 Fa3liat
                </footer>
              </div>
            </div>
          ))}
      </div>
      <button
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="px-6 rounded-xl bg-primary text-white py-3 flex items-center justify-center gap-2 hover:bg-primary/80 transition m-auto mt-6 disabled:bg-gray-400"
      >
        {isDownloading ? t("common.actions.downloading") || "Downloading..." : t("tickets.details.downloadPDF")}
      </button>
    </Dialog>
  );
}

export default TicketDialog;
