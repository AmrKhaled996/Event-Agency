import { useState } from "react";
import { useEventForm } from "../../Context/EventPovider";
import CreateEventProgressBar from "../../components/UI/CreateEventProgressBar";
import { Link } from "react-router-dom";
import { createEvent } from "../../APIs/organizerApis";
import EventPage from "../Events/EventPage";

import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import Loading from "../../components/Layout/LoadingLayout";
import LocalLink from "../../Router/LocalLink";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";

function CreateEventReview() {
  const { t } = useTranslation();
  const { formData } = useEventForm();
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useAppNavigate();

  const submit = async () => {
    try {
      setSubmitting(true);

      const fd = new FormData();

      // === BASIC INFO ===
      fd.append("title", formData.basicInfo.title);
      fd.append("description", formData.basicInfo.description);
      fd.append("type", formData.tickets.type);
      fd.append("mode", formData.basicInfo.mode);
      fd.append("categoryName", formData.basicInfo.category);

      for (let i = 0; i < formData.basicInfo.sessions.length; i++) {
        fd.append(
          `sessions[${i}][startDate]`,
          formData.basicInfo.sessions[i].startDate,
        );
        fd.append(
          `sessions[${i}][endDate]`,
          formData.basicInfo.sessions[i].endDate,
        );
      }

      // === BANNER FILE ===
      if (formData.banner?.file) {
        fd.append("banner", formData.banner.file);
      }

      // === LOCATION ===
      fd.append("location[name]", formData.basicInfo.location.name);
      fd.append("location[address]", formData.basicInfo.location.address);
      fd.append("location[city]", formData.basicInfo.location.city || "city");
      fd.append("location[state]", formData.basicInfo.location.state);
      fd.append("location[country]", formData.basicInfo.location.country);
      fd.append(
        "location[latitude]",
        parseFloat(formData.basicInfo.location.latitude),
      );
      fd.append(
        "location[longitude]",
        parseFloat(formData.basicInfo.location.longitude),
      );

      // === TICKETS ARRAY ===
      for (let i = 0; i < formData.tickets.tickets.length; i++) {
        fd.append(`tickets[${i}][name]`, formData.tickets.tickets[i].name);
        fd.append(`tickets[${i}][price]`, formData.tickets.tickets[i].price);
        fd.append(
          `tickets[${i}][quantity]`,
          formData.tickets.tickets[i].quantity,
        );
      }
      for (let i = 0; i < formData.basicInfo.tags.length; i++) {
        fd.append(`tags[${i}]`, formData.basicInfo.tags[i]);
        console.log("tag", formData.basicInfo.tags[i]);
      }
      const rules = (formData.basicInfo.rules).map((rule) => ({rule}));
      for (let i = 0; i < formData.basicInfo.rules.length; i++) {
        console.log("rules", rules[i]);
        fd.append(`eventRules[${i}][rule]`, rules[i].rule);
      }
      // === EVENT TYPE ===

      fd.append("eventType", formData.tickets.eventType);

      // === SEATS ===
      if (formData.tickets.eventType === "seatmap") {
        fd.append("seatsData", JSON.stringify(formData.tickets.seats));
        console.log(JSON.stringify(formData.tickets.seats));
        fd.append("numberOfRows", String(formData.tickets.rows));
        fd.append("numberOfColumns", String(formData.tickets.seatsPerRow));
        fd.append("priceTiers", JSON.stringify(formData.tickets.priceTiers));
      }

      // Debug: Show form data
      // for (let pair of fd.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      setLoading(true);
      const response = await createEvent(fd, true); // send formData

      alert(t("organizer.createEvent.createSuccess"));
      navigate(`/organizer/dashboard/overview`);
    } catch (error) {
      const message = error.response?.data?.message || t("common.feedback.error");
      console.log(error.response);
      setDialogMessage(message);
      setopenDialog(true);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title>{t("organizer.createEvent.review")}</Title>
      <CreateEventProgressBar step={4} />
      <h2 className="text-xl font-semibold mb-4">{t("organizer.createEvent.reviewTitle")}</h2>

      <div className="border-6 rounded-2xl p-3 relative">
        <EventPage
          eventinfo={{
            ...formData.basicInfo,
            ...formData.tickets,
            ...formData.banner,
          }}
          review={true}
        />
        <div className="h-full w-full inset-0 absolute z-100"></div>
      </div>

      <div className="flex justify-between mt-6">
        <LocalLink to="/organizer/create-event/ticket" className="text-gray-600">
          {t("organizer.createEvent.editTickets")}
        </LocalLink>
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {submitting ? t("organizer.createEvent.creating") : t("organizer.dashboard.createEvent")}
        </button>
      </div>
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

export default CreateEventReview;

