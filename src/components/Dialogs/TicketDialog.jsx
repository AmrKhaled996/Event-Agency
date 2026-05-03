import { X } from "lucide-react";
import Dialog from "../UI/Dialog";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { axiosInstance } from "../../APIs/axiosInstence";
import { extractDateParts } from "../../utils/dateFormater";
//ticket = [ticket] = [{id: -- ,}]
function TicketDialog({ open, onClose, tickets }) {
  const inputRefs = useRef([]);
  const [ticketsData, setticketsData] = useState([]);
  inputRefs.current = [];

  const setRefs = (el) => {
    if (el && !inputRefs.current.includes(el)) {
      inputRefs.current.push(el);
    }
  };
  console.log("tic:", tickets);

  const handleDownloadPDF = async () => {
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
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      if (i !== 0) pdf.addPage();

      pdf.addImage(imgData, "JPEG", 0, 0, 535, 528);
    }

    pdf.save(tickets[0].ticketType.event.title + " ticket.pdf");
  };

  const handleGetTicketsData = async () => {
    try {
      tickets.forEach((element) => {
        axiosInstance.get(`/api/v1/tickets/${element.id}`).then((res) => {
          setticketsData((prev) => [...prev, res.data]);
        });
      });
    } catch (erorr) {
      console.log(erorr);
    }
  };
  useEffect(() => {
    handleGetTicketsData();
  })
  return (
    <Dialog open={open} onClose={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-300 hover:text-gray-800 transition duration-300 ease-in-out"
      >
        <X size={24} />
      </button>
      <div className="flex flex-col gap-8 h-full max-h-[80vh] w-full overflow-y-scroll">
        {ticketsData &&
          ticketsData?.map((ticket) => (
            <div key={ticket?.id} ref={setRefs}>
              <h3 className="text-3xl text-center text-shadow-2xs  font-semibold mb-4 ">
                {ticket?.ticketType?.event?.title}
              </h3>
              <div
                key={ticket?.id}
                className="border rounded-xl max-w-xl shadow-lg flex flex-col items-center text-center overflow-hidden m-auto "
              >
                {/* QR */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 mt-8 mb-8">
                  <QRCode value={ticket?.id} className="w-full h-full" />
                </div>

                {/* Info */}
                <h3 className="text-lg sm:text-xl font-bold ">
                  {ticket?.ticketType?.event?.title}
                </h3>
                <div className="py-4 px-4 flex flex-col items-start gap-3 ">
                  <p className=" text-sm sm:text-base">
                    Date:{" "}
                    {extractDateParts(
                      ticket?.ticketType?.event?.eventSessions[0]?.startDate,
                    ).day +
                      " " +
                      extractDateParts(
                        ticket?.ticketType?.event?.eventSessions[0]?.startDate,
                      ).month +
                      " " +
                      extractDateParts(
                        ticket?.ticketType?.event?.eventSessions[0]?.startDate,
                      ).year}
                  </p>

                  <p className=" text-sm sm:text-base">
                    {ticket?.eventSeat &&
                      `Seats: ${ticket?.eventSeat?.rowLabel}
                    ${ticket?.eventSeat?.seatLabel}`}
                  </p>

                  <p className=" text-sm sm:text-base">
                    Location: {ticket?.ticketType?.event?.venue?.address}
                  </p>
                  <p className=" text-sm sm:text-base">
                    Ticket Status: {ticket?.status}
                  </p>
                  {/* <p className=" text-sm sm:text-base">
                    organizer: {ticket?.organizer}
                  </p> */}
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
        className="px-6 rounded-xl bg-primary text-white py-3 flex items-center justify-center gap-2 hover:bg-primary/80 transition m-auto mt-6"
      >
        Download as PDF
      </button>
    </Dialog>
  );
}

export default TicketDialog;
