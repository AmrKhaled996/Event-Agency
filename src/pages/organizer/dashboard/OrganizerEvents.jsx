import { DeleteIcon, Info, Pencil, RefreshCcw, Trash, BookHeart } from "lucide-react";
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
import { handleError } from "../../../utils/errorHandler";
import EmptyState from "../../../components/UI/EmptyState";

export default function OrganizerEventsPage() {
  const { t } = useTranslation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelDialogOpen, setcancelDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [loading, setloading] = useState(false);

  const navigate = useAppNavigate();

  const handleDelete = async () => {
    try {
      const eventId = selectedEvent.id;
      await deleteEvent(eventId, { _silentError: true });

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId),
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      handleError(error, {
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setopenDialog(true);
        }
      });
    }
  };
  const handleCancel = async () => {
    try {
      const eventId = selectedEvent.id;
      await cancelEvent(eventId, { _silentError: true });

      setEvents((prevEvents) =>
        prevEvents.map((event) => 
          event.id === eventId ? { ...event, status: "Canceled" } : event
        ),
      );
      setcancelDialogOpen(false);
    } catch (error) {
      handleError(error, {
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setopenDialog(true);
        }
      });
    }
  };

  const handleUpdate = () => {
    try {
      const eventId = selectedEvent.id;
      navigate(`/organizer/update-event?id=${eventId}`, {
        state: { event: selectedEvent, id: eventId },
      });
    } catch (error) {
      handleError(error);
    } finally {
      setUpdateDialogOpen(false);
    }
  };
  const getEvents = async () => {
    try {
      setloading(true);
      const response = await getAllEvents({ _silentError: true });
      const data = response.data?.data;
      const fetchedEvents = data?.events || data?.result || data?.data || [];
      setEvents(fetchedEvents);
    } catch (error) {
      handleError(error, {
        silent: true,
        onMapped: (msg) => {
          setDialogMessage(msg);
          setopenDialog(true);
        }
      });
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

      <div className="bg-white rounded-xl soft-shadow overflow-hidden min-h-145 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 text-center p-2 gap-4 text-sm font-semibold bg-gray-50 text-gray-600 uppercase tracking-wider border-b border-gray-100">
          <p className="py-3 px-4">{t("organizer.dashboard.eventImage")}</p>
          <p className="py-3 px-4">{t("organizer.dashboard.eventName")}</p>
          <p className="py-3 px-4 text-center">{t("organizer.dashboard.options")}</p>
        </div>

        <div className="max-h-120 h-full overflow-y-auto py-4 px-4 flex flex-col gap-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center items-center bg-white border border-gray-100 p-3 rounded-xl transition-all duration-200 hover:border-primary/20 hover:bg-gray-50/50 group"
              >
                <div className="h-28 w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    crossOrigin="anonymous"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-4 text-left md:text-center">
                  <p className="text-lg font-bold text-gray-800 leading-tight mb-1">{event.title}</p>
                  <p className="text-xs text-gray-400 font-normal">ID: {event.id.toString().slice(0, 8)}...</p>
                </div>
                <div className="flex gap-3 justify-center items-center px-4">
                  <button
                    onClick={() => {
                      const displayEvent = { ...event };
                      if (displayEvent.venue && typeof displayEvent.venue === 'object') {
                        displayEvent.venue = displayEvent.venue.name;
                      }
                      setSelectedEvent(displayEvent);
                      setInfoDialogOpen(true);
                    }}
                    title={t("common.view")}
                    className="p-2.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <Info size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setUpdateDialogOpen(true);
                    }}
                    title={t("common.edit")}
                    className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setcancelDialogOpen(true);
                    }}
                    title={t("common.cancel")}
                    className="p-2.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    <DeleteIcon size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setDeleteDialogOpen(true);
                    }}
                    title={t("common.delete")}
                    className="p-2.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState 
              title={t("organizer.dashboard.noEventsFound")}
              description={t("organizer.dashboard.noEventsFoundDesc", "You haven't created any events yet. Start by creating your first event!")}
              icon={BookHeart}
            />
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
