import { ArrowBigUp, CalendarPlus } from "lucide-react";
import { useUser } from "../../Context/AuthProvider";
import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

function CreateEventHomePageSection() {
  const navigate = useAppNavigate();
  const { user } = useUser();
    const {t}= useTranslation();

  return (
    <div className="w-full flex justify-center ">
      <div
        className="w-full  border py-10 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/images/homePageSections.png')" }}
      >
        {/* Left Gradient Bulb */}

        <h2 className="text-3xl font-bold mb-3">
          {t("homePage.sections.createEvent")}
        </h2>

        <p className="text-lg mb-6 text-white/90">
          {t("homePage.sections.createEventDescription")}

        </p>
        {user && user?.role === "organizer" ? (
          <button
            onClick={() => navigate("/organizer/create-event/basics")}
            className="
            bg-white text-purple-600 font-semibold 
            text-xl
            px-8 py-3 rounded-md shadow 
            hover:bg-white/90 transition flex items-center gap-2 mx-auto
          "
          >
            <CalendarPlus size={20} />
            Create Event
          </button>
        ) : (
          <button
            onClick={() => navigate("/organizer/upgrade")}
            className="
            bg-white text-purple-600 font-semibold 
            text-xl
            px-8 py-3 rounded-md shadow 
            hover:bg-white/90 transition flex items-center gap-2 mx-auto
          "
          >
            <ArrowBigUp size={24} fill="#9810fa" />
            Upgrade Account
          </button>
        )}
      </div>
    </div>
  );
}

export default CreateEventHomePageSection;
