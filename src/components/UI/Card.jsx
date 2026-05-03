import { Children, lazy, useState } from "react";
import ActiveInterestedHart from "../Icons/ActiveInterestedHart.jsx";

import UnactiveInterestedHart from "../Icons/UnactiveInterestedHart.jsx";
import { Heart, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEventSessionDate } from "../../utils/dateFormater.js";
import { addToInterested, removeFromInterested } from "../../APIs/eventApis.js";
import LocalLink from "../../Router/LocalLink.jsx";
import { useTranslation } from "react-i18next";

function Card({
  bannerUrl,
  title,
  date,
  price,
  views,
  description,
  slug,
  id,
  sessions,
  isInterested,
}) {
  const [interested, setInterested] = useState(isInterested);
  const sessionssInfo = formatEventSessionDate(sessions);
  const { t } = useTranslation();
  const priceRange = () => {
    if (price.length == 0) return "0";

    if (Number(price[0].price) === 0 && price.length === 1) {
      return "Free";
    }
    if (price[0].price != 0 && price?.length === 1) {
      return `${price[0].price} ${t("common.actions.currncy")}`;
    }
    const minprice = Math.min(...price.map((ticket) => ticket.price));
    const maxprice = Math.max(...price.map((ticket) => ticket.price));
    return `${minprice} - ${maxprice} EGY`;
  };
  const handleInterested = async (e) => {
    e.preventDefault();
    try {
      setInterested((prv) => !prv);
      if (interested) {
        const response = await removeFromInterested(id);
        console.log("action:", response);
      } else {
        const response = await addToInterested(id);
        console.log("action:", response);
      }
    } catch (error) {
      console.log(error?.response || error);
      setInterested((prv) => !prv);
    }
    e.stopPropagation();
  };

  return (
    <>
      <LocalLink
        to={`/events/${slug}?id=${id}`}
        className="max-w-full max-h-150  w-full mt-6 shadow-sm p-1 pb-6 rounded-xl hover:scale-102 transition-all duration-300 hover:shadow-lg"
      >
        <div
          className={`  rounded-lg border-0  bg-cover bg-center h-64 w-full object-cover group-hover:opacity-75 xl:aspect-7/8 relative`}
        >
          <img
            src={encodeURI(bannerUrl)}
            loading="lazy"
            crossOrigin="anonymous"
            className={`  rounded-lg border-0  bg-cover bg-center h-64 w-full object-cover group-hover:opacity-98  xl:aspect-7/8 relative group-hover:scale-102  transition-all `}
            style={{ backgroundImage: `url(${encodeURI(bannerUrl)})` }}
          />
          <button
            onClick={handleInterested}
            className="bg-white rounded-full w-10 h-10  right-3 top-2 flex items-center hover:cursor-pointer  absolute hover:bg-white/85 duration-300 transition-colors"
          >
            {interested ? <ActiveInterestedHart /> : <UnactiveInterestedHart />}
          </button>
        </div>

        <div className="flex px-4">
          <div className="w-fit text-xl font-bold text-primary mt-4 ml-2">
            {sessionssInfo?.dateText || "Dec 8"}
          </div>
          <div className="ml-3">
            <h3 className="mt-4 text-xl font-bold text-gray-900 line-clamp-1 wrap-break-words">
              {title}
            </h3>
            <p className="mt-1 font-normal text-[#5A5A5A] w-full max-h-18 break-all line-clamp-2 wrap-break-word ">
              {description}
            </p>
            <p className="mt-1 font-medium text-[#5A5A5A]">
              {sessionssInfo?.startTime} -{" "}
              {sessionssInfo?.endTime || "6:30 PM - 9:30 PM"}
            </p>
            <p className="mt-1 font-normal text-secandry flex items-center">
              <Heart size={20} className="mr-1 mb-1 " /> 0{" "}
              {t("events.Interested.Interested")}
            </p>
            <p className="mt-1 font-semibold text-green-700 flex items-start">
              <Ticket size={24} className="mr-1 pt-1 " /> {priceRange() || "0"}
            </p>
          </div>
        </div>
      </LocalLink>
    </>
  );
}

export default Card;
