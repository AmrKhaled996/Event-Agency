import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Loading from "../../components/Layout/LoadingLayout";
import Card from "../../components/UI/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  nearbyEvents,
  newEventsThisWeek,
  pastEvents,
  personalizedEvents,
} from "../../APIs/eventsPagenation";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";

function EventsPagination() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsPage, setEventsPage] = useState(1);

  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const location = useLocation();
  const navigate = useAppNavigate();
  const {t}= useTranslation();

  //   const endpoint = state?.endpoint;

  const urlParams = new URLSearchParams(location.search);

  const title = urlParams.get("title") || "Events";

  const handleEndpoint = async () => {
    // if (typeof endpoint !== "function") return;

    try {
      const page = Number(urlParams.get("page")) || 1;

      setEventsPage(page);

      setLoading(true);
      let response;
      switch (title) {
        case t(`homePage.sections.past`):
          response = await pastEvents(page);
          break;
        case t(`homePage.sections.nearby`):
          response = await nearbyEvents(page);
          break;
        case t(`homePage.sections.new`):
          response = await newEventsThisWeek(page);
          break;
        case t(`homePage.sections.curated`):
          response = await personalizedEvents(page);
          break;
        default:
          setDialogMessage("Error confirming order");
          break;
      }
      console.log("first",response?.data?.data?.events)
      setCards(response?.data?.data?.events || []);
    } catch (error) {
      console.error(error);
      setDialogMessage(
        error.response?.data?.message || "Error confirming order",
      );
      setopenDialog(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleEndpoint();
  }, [location.search]);

  return (
    <>
    <Title>{title}</Title>
      <div className="md:ml-10 md:mr-10 md:px-10 px-2 mt-20">
        <h1 className="text-3xl font-bold mb-5 ml-10">{title}</h1>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {cards?.map((card, index) => {
            return (
              <Card
                key={index}
                bannerUrl={`${card.bannerUrl}`}
                title={card.title}
                description={card.description}
                date={card.date}
                price={card.ticketTypes || []}
                views={card.viwes}
                id={card.id}
                slug={card.slug}
                sessions={card.eventSessions || []}
                crossOrigin="anonymous"
                interestedCount={card?.interestedCount}
              />
            );
          })}
        </div>
        <div className="w-full flex justify-center my-10 gap-20">
          <button
            onClick={() => {
              if (eventsPage <= 1) return;
              const nextPage = eventsPage - 1;
              const newUrlParams = new URLSearchParams(location.search);
              newUrlParams.set("page", nextPage);
              const newUrl = `${location.pathname}?${newUrlParams.toString()}`;
              navigate(`${location.pathname}?${newUrlParams.toString()}`);
              setEventsPage(nextPage);
              scrollTo(0, 0);
            }}
            disabled={eventsPage <= 1}
            className={`${
              eventsPage <= 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary cursor-pointer"
            } md:px-30 px-20 py-3 font-semibold text-lg text-white my-15 rounded-md  flex gap-3 items-center`}
          >
            <ArrowLeft /> {t("common.actions.previous")}
          </button>
          <button
            onClick={() => {
              if (cards.length < 12) return;
              const nextPage = eventsPage + 1;
              const newUrlParams = new URLSearchParams(location.search);
              newUrlParams.set("page", nextPage);
              const newUrl = `${
                window.location.pathname
              }?${newUrlParams.toString()}`;
              navigate(`${location.pathname}?${newUrlParams.toString()}`);
              setEventsPage(nextPage);
              scrollTo(0, 0);
            }}
            className={`${
              cards.length < 12
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary cursor-pointer"
            } md:px-30 px-20 py-3 font-semibold text-lg text-white my-15 rounded-md  flex gap-3 items-center`}
          >
            {t("common.actions.next")} <ArrowRight />
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
    </>
  );
}

export default EventsPagination;
