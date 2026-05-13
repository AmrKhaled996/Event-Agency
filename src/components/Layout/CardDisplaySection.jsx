import { useEffect, useState } from "react";
import Card from "../UI/Card";
// import { useUser } from "../../Context/AuthProvider";

import Loading from "./LoadingLayout";
import CardSkeleton from "../UI/CardSkeleton";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";


function CardDisplaySection({ title, endpoint }) {
  const [cards, setcards] = useState([]);

  
  const navigate = useAppNavigate();
  const { t } = useTranslation();

  const handleEndpoint = async () => {
    try {
      
      const response = await endpoint();
      const newcards = response.data.data;
      if (newcards.events.length === 0) {
        setcards(t("common.feedback.noResults"));
        return;
      }
     
      setcards(newcards.events);
      
    } catch (error) {
      console.error("error", error.response);
    }
  };

  const handleDiscoverMore = () => {
    navigate(`/events-pagenation?page=1&title=${title.trim()}`, {
      state: { title: title },
    });
  };

  useEffect(() => {
    handleEndpoint();
  }, []);

  return (
    <div className="  md:ml-10 md:mr-10 md:px-10 px-2 mt-20">
      <h1 className=" text-3xl  font-bold mb-5 ml-10 ">{title}</h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 items-center sm:grid-cols-2 lg:grid-cols-3  xl:gap-x-8 ">
        {cards && cards?.length > 0 ? (
           typeof cards=== "string" ? (
            <div className="col-span-full text-center text-gray-500 pt-10 pb-2">
              {cards}
            </div>
          ) : (
              cards?.map((card, index) => {
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
                  isInterested={card?.isInterested}
                  crossOrigin="anonymous"
                  interestedCount={card?.interestedCount}
                />
              );
            })
          )
        ) : (
          [1, 2, 3, 4, 5, 6].map((temp, index) => <CardSkeleton key={index} />)
        )}
      </div>
      <div className="w-full flex justify-center ">
        <button
          onClick={handleDiscoverMore}
          className="border border-primary bg-white md:px-30 px-20 py-3 font-semibold text-lg text-primary my-15 rounded-md cursor-pointer hover:shadow-primary/40 hover:shadow-lg  transition-all duration-300"
        >
          {t(`homePage.sections.discover`)}
        </button>
      </div>
      {/* {loading && <Loading />} */}
    </div>
  );
}

export default CardDisplaySection;
