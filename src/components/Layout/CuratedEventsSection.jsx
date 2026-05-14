import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import useAppNavigate from "../../Router/useAppNavigate";
import { ArrowLeft, ArrowRight } from "lucide-react";

function CuratedEventsSection() {
    const {t}= useTranslation();
  const {lang} = useParams();
  const navigate = useAppNavigate();
  return (
    <div
      className={`w-full flex justify-center z-20 px-4 my-10 relative
           before:content-['kljlk']
            before:absolute ${lang ==="ar"? 'before:-right-10':'before:-left-10'} before:bottom-10
            md:before:flex
            before:translate-y-10
            before:w-60 before:h-60
            before:rounded-full
            before:bg-linear-to-br
            before:blur-3xl
            before:from-[#2d5aff7e]
            before:to-[#962dff7e]
            before:to-50%
            before:opacity-90
            before:z-10
            before:hidden
            `}
    >
      <div
        className="

          relative w-full max-w-6xl 
          rounded-3xl p-10
          text-center text-white 
          overflow-hidden
          bg-cover bg-center
          
        "
        style={{ backgroundImage: "url('/images/homePageSections.png')" }}
      >
        {/* Left Gradient Bulb */}
        <div
          className="
            absolute left-0 top-0 h-full w-1/3 
            pointer-events-none
             
           
          "
        ></div>

        <h2 className="text-3xl font-bold mb-3">
          {t("homePage.sections.curatedForYou")}
        </h2>

        <p className="text-lg mb-6 text-white/90">
          {t("homePage.sections.curatedForYouDescription")}
          
        </p>

        <button
        onClick={()=>{navigate(`/events-pagenation?page=1&type=curated&title=${t(`homePage.sections.curated`)}`)}}
          className="
            bg-white text-purple-600 font-semibold 
            px-8 py-3 rounded-xl shadow 
            hover:bg-white/90 transition flex items-center gap-2 mx-auto
          "
        >
          {t("homePage.sections.curatedForYouButton")}
          <span className="text-xl">{lang === "ar" ? <ArrowLeft size={20} className="text-purple-600" /> : <ArrowRight size={20} className="text-purple-600" />}</span>
        </button>
      </div>
    </div>
  );
}
export default CuratedEventsSection;
