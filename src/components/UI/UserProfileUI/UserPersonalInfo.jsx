import { useState } from "react";
import { refreshToken } from "../../../APIs/authAPIs.js";
import { updateMyProfile } from "../../../APIs/profileAPI.js";
import { refreshAccessToken } from "../../../services/cookieTokenService.js";
import {locationOptions} from "../../../utils/LocationOptions.js";
import Loading from "../../Layout/LoadingLayout.jsx";

function PersonalInfoSection({ userLocation, accountData }) {
  const [location, setlocation] = useState(userLocation);
  const [loading, setLoading] = useState(false);

  const handleChangeLoction = (e) => {
    setlocation(e.target.value);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      // console.log(Location);
      const response = await updateMyProfile({
        name: accountData.name,
        phone: accountData.phone,
        gender: accountData.gender,
        location: location,
        languagePreference: accountData.languagePreference,
        birthDate: accountData.birthDate,
      });
      // console.log("Success:", response.data);
      // console.log(user);
      const newtoken = await refreshToken();
      refreshAccessToken(newtoken.data);
      window.location.reload();
      // console.log("response", response);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">
          Personal Information
        </h2>

        <p className="text-sm text-slate-500">
          Update your location and regional settings.
        </p>
      </div>

      <div className="p-6">
        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Location
            </label>
            {/* {console.log(userLocation)} */}
            <select className="form-select w-full bg-slate-100 h-12 rounded-lg text-md p-2 pr-10">
              {locationOptions.map((location) =>
                location.value === userLocation ? (
                  <option key={location.value} value={location.value} selected>
                    {location.label}
                  </option>
                ) : (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleUpdateProfile}
              className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 shadow-md shadow-primary/20 transition-all"
            >
              {t("common.action.save")}
            </button>
          </div>
        </form>
      </div>
      {loading && <Loading />}
    </section>
  );
}

export default PersonalInfoSection;
