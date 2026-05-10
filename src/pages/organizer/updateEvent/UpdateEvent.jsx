import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { getEvents } from "../../../APIs/eventApis";
import { Title } from "react-head";
import { useEventForm } from "../../../Context/EventPovider";
import { useCategories } from "../../../Context/CategoriesProvider";
import CreateEventProgressBar from "../../../components/UI/CreateEventProgressBar";
import SessionForm from "../../../components/Layout/CreateEventSessionForm";
import LocationPicker from "../../../components/Layout/LocationPicker";
import { updateEvent } from "../../../APIs/organizerApis";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import useAppNavigate from "../../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

export default function UpdateEvent() {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const [event, setEvent] = useState({});
  const [loading, setloading] = useState(false);
  const [position, setPosition] = useState();
  const [details, setDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const { categories, findCategoryById, loading: catLoading } = useCategories();

  const { state } = useLocation();
  const eventData = state?.event || {};

  const onFile = (e) => {
    const file = e.target.files[0];
    // console.log(file)
    if (!file) return;
    const preview = URL.createObjectURL(file);

    setEvent((prev) => ({ ...prev, bannerUrl: file, preview }));
  };

  const validate = () => {
    const newErrors = {};

    if (!event?.title?.trim()) newErrors.title = t("organizer.createEvent.validation.titleRequired");
    // if (!event.category) newErrors.category = "Please select a category.";
    if (!event?.description?.trim())
      newErrors.description = t("organizer.createEvent.validation.descriptionRequired");

    // Location
    if (!position) newErrors.location = t("organizer.createEvent.validation.locationRequired");

    if (!details) {
      setErrors((s) => ({ ...s, location: t("organizer.createEvent.validation.locationDetailsMissing") }));
      return;
    }
    // // Sessions validation
    // event.sessions.forEach((session, i) => {
    //   if (!session.date) newErrors[`session_date_${i}`] = "Date is required.";
    //   if (!session.startTime)
    //     newErrors[`session_start_${i}`] = "Start time is required.";
    //   if (!session.endTime)
    //     newErrors[`session_end_${i}`] = "End time is required.";

    //   if (
    //     session.startTime &&
    //     session.endTime &&
    //     session.endTime <= session.startTime
    //   ) {
    //     newErrors[`session_time_${i}`] = "End time must be after start time.";
    //   }
    // });
    // console.log(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const possibleNames = [
    "name",
    "tourism",
    "historic",
    "leisure",
    "suburb",
    "village",
    "town",
    "city",
    "hamlet",
  ];
  const handleUpdate = async () => {
    try {
      if (!validate()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const locationKey = possibleNames.find((key) => details?.[key]);

      const locationName = locationKey ? details[locationKey] : "name";

      // console.log("details111", details);
      // console.log("event111", event);
      const newLocation = {
        name: locationName || "name",
        address: details.address || "address",
        latitude: position[0],
        longitude: position[1],
        city: details.city || details.town || details.village || "",
        state: details.state || "",
        country: details.country || "",
      };

      const newevent = { ...event, venue: newLocation };

      // console.log("newevent", newevent);

      setEvent(newevent);

      const fd = new FormData();

      // === BASIC INFO ===
      fd.append("title", event?.title);
      fd.append("description", event?.description);
      fd.append("type", event?.type);
      fd.append("mode", event?.mode);
      fd.append("categoryName", event.category);

      for (let i = 0; i < event?.eventSessions?.length; i++) {
        fd.append(
          `sessions[${i}][startDate]`,
          event?.eventSessions[i]?.startDate,
        );
        fd.append(`sessions[${i}][endDate]`, event.eventSessions[i].endDate);
      }

      // === BANNER FILE ===
      if (event?.bannerUrl) {
        // console.log(event?.bannerUrl);
        fd.append("banner", event?.bannerUrl);
      }

      // === LOCATION ===
      fd.append("location[name]", event?.venue?.name || "name");
      fd.append("location[address]", event?.venue?.address);
      fd.append("location[city]", event?.venue?.city || "city");
      fd.append("location[state]", event?.venue?.state);
      fd.append("location[country]", event?.venue?.country);
      fd.append("location[latitude]", parseFloat(event?.venue?.latitude));
      fd.append("location[longitude]", parseFloat(event?.venue?.longitude));

      // === TICKETS ARRAY ===
      for (let i = 0; i < event?.ticketTypes?.length; i++) {
        fd.append(`tickets[${i}][name]`, event?.ticketTypes[i].name);
        fd.append(`tickets[${i}][price]`, event?.ticketTypes[i].price);
        fd.append(`tickets[${i}][quantity]`, event?.ticketTypes[i].quantity);
      }

      // Debug: Show form data
      for (let pair of fd.entries()) {
        // console.log(pair[0], pair[1]);
      }
      console.log(fd);
      const response = await updateEvent(fd, eventData.id);
      // console.log("update response", response);

      navigate("/organizer/dashboard/overview");
    } catch (error) {
      const message = error.response?.data?.message || t("organizer.createEvent.errors.loadEvents");
      setDialogMessage(message);
      setopenDialog(true);
      console.error(error);
    } finally {
      setloading(false);
    }
  };
  async function urlToFile(url, filename) {
    const res = await fetch(url);
    const blob = await res.blob();

    return new File([blob], filename, { type: blob.type });
  }

  const handleLoadEvents = async () => {
    try {
      setloading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      const response = await getEvents({ id: id });
      // console.log("cat ID:",response.data.data.event.categoryId );

      const cat = findCategoryById(response.data.data.event.categoryId);
      const oldFile = await urlToFile(
        response.data.data.event.bannerUrl,
        "no-updatedImage.png",
      );
      const preview = URL.createObjectURL(oldFile);
      // console.log(oldFile)
      // console.log("category", cat);
      const eventPos = [
        response.data.data.event.venue?.latitude || 0,
        response.data.data.event.venue?.longitude || 0,
      ];
      setPosition(eventPos);
      setDetails(response.data.data.event.venue);
      // console.log(response.data.data);
      setEvent(response.data.data.event);
      setEvent((s) => ({
        ...s,
        category: cat?.name || "",
        bannerUrl: oldFile,
        preview: preview,
      }));
      // console.log(event)
      setloading(false);
    } catch (error) {
      const message = error.response?.data?.message || t("organizer.createEvent.errors.loadEvents");
      setDialogMessage(message);
      setopenDialog(true);
      // console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (!catLoading) {
      handleLoadEvents();
    }
  }, [catLoading]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title>{t("organizer.createEvent.updateTitle")}</Title>
      {/* Header & Progress Bar */}
      <div className="flex  items-center-safe gap-6 mb-16">
        <button
          onClick={() => navigate("/organizer/dashboard/overview")}
          className="text-5xl bg-gray-50 border relative top-1 border-primary rounded-full  p-2 w-fit h-fit hover:bg-gray-100"
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-5xl font-semibold ">{t("organizer.createEvent.updateHeader")}</h1>
      </div>

      {/* Event Title & Category */}
      <label className="mb-3 flex gap-3 items-center">
        <div className="text-md font-medium w-30 ">
          {t("organizer.createEvent.eventTitle")} <strong className="text-red-600 text-lg">*</strong>
        </div>
        <input
          value={event.title}
          onChange={(e) => setEvent((s) => ({ ...s, title: e.target.value }))}
          className="w-full border rounded p-3 mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder={t("organizer.createEvent.titlePlaceholder")}
        />
      </label>
      {errors.title && (
        <div className="text-red-600 text-sm">{errors.title}</div>
      )}
      <label className="my-3 flex gap-3 items-center">
        <div className="text-md font-medium w-30">
          {t("organizer.createEvent.category")} <strong className="text-red-600 text-lg">*</strong>
        </div>
        <select
          value={event.category}
          onChange={(e) =>
            setEvent((s) => ({ ...s, category: e.target.value }))
          }
          className="w-full border rounded p-3 mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">{t("organizer.createEvent.selectOne")}</option>
          {categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      {errors.category && (
        <div className="text-red-600 text-sm">{errors.category}</div>
      )}

      {/* Location */}
      <h2 className="text-3xl font-semibold mb-4 mt-6">{t("organizer.createEvent.location")}</h2>
      <LocationPicker
        event={event}
        setEvent={setEvent}
        position={position}
        setPosition={setPosition}
        details={details}
        setDetails={setDetails}
      />
      {errors.location && (
        <div className="text-red-600 text-sm">{errors.location}</div>
      )}
      {/* Description */}
      <h2 className="text-3xl font-semibold mb-4 mt-6">
        {t("organizer.createEvent.additionalInfo")}
      </h2>
      <label className="block mb-6">
        <div className="text-md font-medium w-30">
          {t("organizer.createEvent.description")} <strong className="text-red-600 text-lg">*</strong>
        </div>
        <textarea
          value={event.description}
          onChange={(e) =>
            setEvent((s) => ({ ...s, description: e.target.value }))
          }
          className="w-full border rounded p-3 mt-1 border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none h-40"
          placeholder={t("organizer.createEvent.descriptionPlaceholder")}
        />
      </label>
      {errors.description && (
        <div className="text-red-600 text-sm">{errors.description}</div>
      )}

      {/* Edit banner */}
      <h2 className="text-xl font-semibold mb-4">{t("organizer.createEvent.bannerTitle")}</h2>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="bg-primary/10 w-1/2 h-20 text-center text-3xl font-bold border border-gray-300 rounded-lg p-5 "
        />
        <p className="text-xs text-gray-500 mt-2">
          {t("organizer.createEvent.bannerHint")}
        </p>
      </div>

      {event.bannerUrl && (
        <div className="mb-4">
          <div className="border rounded overflow-hidden">
            <img
              src={event?.preview || event?.bannerUrl}
              alt="bannerUrl"
              crossOrigin="anonymous"
              className="w-full h-60 object-cover"
            />
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-center mt-8 text-2xl ">
        <button
          // disabled={Object.keys(errors).length > 0}
          onClick={handleUpdate}
          className="bg-green-700 w-70 text-white px-10 py-4 rounded-xl"
        >
          {t("organizer.createEvent.updateEvent")}
        </button>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          onClose={() => setopenDialog(false)}
          message={dialogMessage}
        />
      )}
    </div>
  );
}
