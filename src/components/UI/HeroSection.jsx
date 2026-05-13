import { Search, MapPin, ChevronDown } from "lucide-react";
import {locationOptions, locationOptionsAr} from "../../utils/LocationOptions";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ErrorDialog from "../Dialogs/ErrorDialog";

import useAppNavigate from "../../Router/useAppNavigate";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const [searchPramas, setSearchPramas] = useSearchParams();
  const search = searchPramas.get("q") || "";
  const [searchVal, setsearchVal] = useState(search);
  const locationParam = searchPramas.get("location") || "";
  const [location, setlocation] = useState(locationParam);
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const { lang } = useParams();
  const {t}=useTranslation();
  const navigate = useAppNavigate();


  const handleSearch = () => {
    // setSearchValue(searchVal); // to sent in api reques
    const params = new URLSearchParams(searchPramas);

    const trimmed = searchVal.trim();

    if (trimmed) {
      params.set("q", trimmed);
      // params.set("location", location);
    } else {
      params.delete("q");
    }
    if (location) params.set("location", location);

    if (!trimmed) {
      setopenDialog(true);
      setDialogMessage(t("ui.hero.searchError"));
      return;
    } else {
      setSearchPramas(params);
      navigate(
        `/search-events${params.toString() ? `?${params.toString()}` : ""}`,
      );
    }
  };

  return (
    <section className="w-full relative p-2">
      {/* Background Placeholder — replace with your own */}

      <div className="relative max-w-300 mx-auto md:px-6 pt-28 pb-24 text-center text-white">
        {/* ===== Title ===== */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          {t("homePage.hero.title1")} <span className="text-orange-300">{t("homePage.hero.titleVar")} </span>
          {t("homePage.hero.title2")}
        </h1>

        {/* ===== Search Bar ===== */}
        <div className="mt-10 w-full flex justify-center">
          <div className="bg-white text-gray-600 w-full md:w-[700px] flex items-center rounded-xl shadow-lg overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 w-full border-r">
              <button
                onClick={() => handleSearch()}
                className="flex items-center gap-2 p-1  hover:bg-linear-to-r from-primary/10 to-secandry/10 transition-colors duration-300 rounded-full"
              >
                <Search className="w-5 h-5 text-gray-400 hover:cursor-pointer hover:text-gray-500" />
              </button>
              <input
                type="text"
                value={searchVal}
                placeholder={t("homePage.hero.searchPlaceholder")}
                onKeyDown={(e) => {
                  e.key === "Enter" && handleSearch(e);
                }}
                onChange={(e) => setsearchVal(e.target.value)}
                className="w-full outline-none text-[15px]"
              />
            </div>

            {/* Location Dropdown */}
            <div className="px-2 py-3 flex w-1/4 md:w-1/5 items-center">
              <select
                onChange={(e) => setlocation(e.target.value)}
                value={location}
                className="
                  text-gray-700 text-15 outline-none cursor-pointer bg-white
                  appearance-auto   
                "
              >
                <option value="" disabled defaultValue={""}>
                  {t("homePage.hero.locationPlaceholder")}
                </option>
                {(lang === "ar" ? locationOptionsAr : locationOptions).map((city, index) => (
                  <option key={index} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setopenDialog(false)}
        />
      )}
    </section>
  );
}
