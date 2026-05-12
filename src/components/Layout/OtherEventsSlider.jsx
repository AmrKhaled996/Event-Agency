import { useEffect, useRef, useState } from "react";
import Card from "../UI/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  latestEvents,
  nearbyEvents,
  personalizedEvents,
} from "../../APIs/homeApis";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";


function OtherEventsSlider() {
  const [cards, setcards] = useState([]);
  const scrollRef = useRef(null);
  const slug = useParams();
  const id = new URLSearchParams(useLocation().search).get("id");
  const {t}= useTranslation();

  const slideRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const slideleft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };
  const handleEndpoint = async () => {
    try {
      const response = await personalizedEvents();
      setcards(response.data.data.events);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleEndpoint();
  }, [slug, id]);

  return (
    <section className="w-full py-20 bg-white no-scrollbar h-fit">
      <div className="max-w-350 mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("homePage.sections.otherEvents")}
          </h2>
          <div>
            <button
              onClick={slideleft}
              className="p-3 mr-5 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={slideRight}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-10 no-scrollbar scroll-smooth h-fit"
        >
          {cards?.map((card, index) => (
            <div key={index} className="shrink-0 w-80">
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
                isInterested={card?.isInterested}
                crossOrigin="anonymous"
                interestedCount={card?.interestedCount}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OtherEventsSlider;
