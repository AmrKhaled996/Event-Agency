import { DeleteIcon, Info, Pencil, RefreshCcw, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import InfoDialog from "../../../components/Dialogs/InfoDialog";
import UpdateDialog from "../../../components/Dialogs/UpdateDialog";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog";
import { cancelEvent, deleteEvent, getAllEvents } from "../../../APIs/organizerApis";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import Loading from "../../../components/Layout/LoadingLayout";
import useAppNavigate from "../../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";
import CancelDialog from "../../../components/Dialogs/CancelDialog";


export default function OrganizerEventsPage() {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setcancelDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [events, setEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [loading, setloading] = useState(false);

  const navigate = useAppNavigate();

  const handleDelete = async () => {
    try {
      // Call API to delete event
      const eventId = selectedEvent.id;

       await deleteEvent(eventId);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId),
      );
      setDeleteDialogOpen(false);
    } catch (error) {
       const message = error.response?.data?.data[0]?.message || t("common.feedback.error");
      setDialogMessage(message);
      setopenDialog(true);
    }
  };
  const handleCancel = async () => {
    try {
      // Call API to cancel event
      const eventId = selectedEvent.id;

       await cancelEvent(eventId);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId),
      );
      setcancelDialogOpen(false);
    } catch (error) {
       const message = error.response?.data?.data[0]?.message || t("common.feedback.error");
      setDialogMessage(message);
      setopenDialog(true);
    }
  };

  const handleUpdate = () => {
    // Implement update logic here
    try {
      const eventId = selectedEvent.id;
      // Call API to update event details

      navigate(`/organizer/update-event?id=${eventId}`, {
        state: { event: selectedEvent, id: eventId },
      });
    } catch (error) {
       const message = error.response?.data?.data[0]?.message || t("common.feedback.error");
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setUpdateDialogOpen(false);
    }
  };
  const getEvents = async () => {
    try {
      setloading(true);
      const response = await getAllEvents();
      setEvents(response.data.data.result);
    } catch (error) {
      const message = error.response?.data?.data[0]?.message || t("common.feedback.error");
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    getEvents();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{t("organizer.dashboard.myEvents")}</h2>

      <div className="bg-white rounded-t-xl shadow-md overflow-hidden min-h-145 p-2">
        <div className="grid grid-cols-1 md:grid-cols-3 text-center p-1 gap-4 text-lg font-semibold bg-blue-50">
          <p className="p-4">{t("organizer.dashboard.eventImage")}</p>
          <p className="p-4">{t("organizer.dashboard.eventName")}</p>
          {/* <p className="p-4 px-7">ID</p>
          <p className="p-4">Status</p> */}
          <p className="p-4 text-center">{t("organizer.dashboard.options")}</p>
        </div>

        <div className="max-h-120 h-full overflow-y-auto overflow-x-auto py-2 flex flex-col gap-6 rounded-2xl">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-8  text-center items-center shadow-[0_1px_15px_-10px]  mb-1  min-h-32 rounded-xl"
              >
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  crossOrigin="anonymous"
                  className="h-full w-full overflow-hidden rounded-l-xl"
                />
                <p className="p-4 text-xl font-medium">{event.title}</p>
                {/* <p className="p-4">{event.id}</p>
                <p
                  className={`p-2 w-24 text-center rounded-2xl 
                   ${
                     event.status === "Active"
                       ? "text-green-600 font-bold bg-green-100 "
                       : event.status === "Canceled"
                       ? "text-red-600 font-bold bg-red-100"
                       : event.status === "Pending"
                       ? "text-yellow-600 font-bold bg-yellow-100"
                       : event.status === "Ended"
                       ? "text-gray-800 font-bold bg-gray-100"
                       : "text-gray-600"
                   }

                  `}
                >
                  {event.status}
                </p> */}
                <p className="p-4 flex gap-2 h-20 justify-center items-center">
                  <Trash
                    size={60}
                    fill="red"
                    color="red"
                    onClick={() => {
                      setDeleteDialogOpen(true);
                      setSelectedEvent(event);
                    }}
                    className=" rounded-full hover:bg-gray-200 p-2 h-12 flex-1 hover:cursor-pointer"
                  />{" "}
                  <Pencil
                    color="green"
                    onClick={() => {
                      setUpdateDialogOpen(true);
                      setSelectedEvent(event);
                    }}
                    className=" rounded-full hover:bg-gray-200 p-2  h-12 flex-1 hover:cursor-pointer "
                  />{" "}
                  <Info
                    color="gray"
                    onClick={() => {
                      setInfoDialogOpen(true);
                      setSelectedEvent(event);
                    }}
                    className=" rounded-full hover:bg-gray-200 p-2  h-12 flex-1 hover:cursor-pointer "
                  />{" "}
                  <DeleteIcon
                    size={60}
                    fill="red"
                    color="red"
                    onClick={() => {
                      setcancelDialogOpen(true);
                      setSelectedEvent(event);
                    }}
                    className=" rounded-full hover:bg-gray-200 p-2 h-12 flex-1 hover:cursor-pointer"
                  />{" "}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              {t("organizer.dashboard.noEventsFound")}
            </div>
          )}
        </div>
      </div>

      {deleteDialogOpen && (
        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      )}
      {cancelDialogOpen && (
        <CancelDialog
          open={cancelDialogOpen}
          onClose={() => setcancelDialogOpen(false)}
          onConfirm={handleCancel}
        />
      )}
      {updateDialogOpen && (
        <UpdateDialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          onConfirm={handleUpdate}
          event={selectedEvent}
        />
      )}

      {infoDialogOpen && (
        <InfoDialog
          open={infoDialogOpen}
          onClose={() => setInfoDialogOpen(false)}
          data={selectedEvent}
        />
      )}
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
      {loading && <Loading />}
    </div>
  );
}
