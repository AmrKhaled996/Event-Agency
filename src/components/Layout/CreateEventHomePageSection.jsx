import { ArrowBigUp, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/AuthProvider";

function CreateEventHomePageSection() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="w-full flex justify-center ">
      <div
        className="w-full  border py-10 text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/images/homePageSections.png')" }}
      >
        {/* Left Gradient Bulb */}

        <h2 className="text-3xl font-bold mb-3">
          Create an event with Fa3liat!
        </h2>

        <p className="text-lg mb-6 text-white/90">
          Got a show, event, activity or a great experience? Partner with us &
          get listed on Fa3liat
        </p>
        {(user && user?.role === "organizer") ? (
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
        ):(<button
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
          </button>)}
      </div>
    </div>
  );
}

export default CreateEventHomePageSection;
