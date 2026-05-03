import { Title } from "react-head";
import { getInterestedEvents } from "../../APIs/userAPIs";
import CardDisplaySection from "../../components/Layout/CardDisplaySection";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import { use, useEffect, useState } from "react";
import Card from "../../components/UI/Card";
import CardSkeleton from "../../components/UI/CardSkeleton";
import { useTranslation } from "react-i18next";

function InterestedEventsPage() {
  const [cards, setcards] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const {t} = useTranslation();
  const handleGetInterested = async () => {
    try {
      // setloading(true);
      const response = await getInterestedEvents();
      const newcards = response.data.data;
      console.log(newcards)
      if (newcards.events.length === 0) {
        setcards("No events found");
        return;
      }

      setcards(newcards.events);
      // setloading(false);
    } catch (error) {
      setopenDialog(true);
      console.log("error", error?.response);
      setDialogMessage(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    handleGetInterested();
  }, []);

  return (
    <>
      <Title>{t("events.interested.title")}</Title>

      <div className="px-4 sm:px-6 lg:px-16 xl:px-24 my-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl font-serif text-shadow-md text-shadow-gray-400">
            {t("events.interested.title")}
          </h1>
        </div>

        <hr className="my-4 text-gray-300" />

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 items-center sm:grid-cols-2 lg:grid-cols-3  xl:gap-x-8 ">
          {cards.length > 0 ? (
            cards === "No events found" ? (
              <div className="col-span-full text-center text-gray-500 pt-10 pb-2">
                {cards}
              </div>
            ) : (
              cards.map((card, index) => {
                return (
                  <Card
                    key={index}
                    bannerUrl={`${card?.bannerUrl}`}
                    title={card?.title}
                    description={card?.description}
                    date={card?.date}
                    price={card?.ticketTypes || []}
                    views={card?.viwes}
                    id={card?.id}
                    slug={card?.slug}
                    sessions={card?.eventSessions || []}
                    crossOrigin="anonymous"
                    isInterested={card?.isInterested}
                  />
                );
              })
            )
          ) : (
            [1, 2, 3, 4, 5, 6].map((temp, index) => (
              <CardSkeleton key={index} />
            ))
          )}
        </div>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
    </>
  );
}

export default InterestedEventsPage;
