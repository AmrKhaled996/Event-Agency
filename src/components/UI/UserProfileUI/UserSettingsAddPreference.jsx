import PreferenceBadge from "../PreferenceBadge";
import AddPreferencePopover from "../AddPreferenceBadgeButton";
import ErrorDialog from "../../Dialogs/ErrorDialog";
import Loading from "../../Layout/LoadingLayout";
import { useEffect, useState } from "react";
import { updatePreferences } from "../../../APIs/profileAPI";
import { refreshToken } from "../../../APIs/authAPIs";
import { refreshAccessToken } from "../../../services/cookieTokenService";
// @ts-ignore
import { useBeforeUnload } from "react-router-dom";

/**
 * A component that displays a user's preferences and allows them to add or remove preferences.
 *
 * @param {Object} props - The props object.
 * @param {String[]} props.preferences - The user's current preferences.
 * @param {String[]} props.availablePreferences - The available preferences that the user can add.
 * @param {Function} props.getAvailablePreferences - A function that gets the available preferences.
 * @param {Function} props.setPreferences - A function that sets the user's preferences.
 * @param {Function} props.setAvailablePreferences - A function that sets the available preferences.
 

 
 * Example usage:
 * <UserSettingsAddPreference
 *   preferences={userPreferences}
 *   availablePreferences={availablePreferences}
 *   getAvailablePreferences={getAvailablePreferences}
 *   setPreferences={setPreferences}
 *   setAvailablePreferences={setAvailablePreferences}
 * />
 */

function UserSettingsAddPreference({
  preferences,
  availablePreferences,
  setPreferences,
  setAvailablePreferences,
}) {
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [preferencesBeforeChanged, setPreferencesBeforeChanged] =
    useState(null);

  // @ts-ignore
  const handlePreferenceChange = (preference) => {
    if (preferences.includes(preference)) {
      // @ts-ignore
      const newprefrences = preferences.filter((p) => p.id !== preference.id);
      const newpreferncesIdName = newprefrences.map((pref) => [
        pref.id,
        pref.name,
      ]);
      // console.log("new", newpreferncesIdName);
      setPreferences(newprefrences);
      setAvailablePreferences([...availablePreferences, preference]);
    } else {
      const newpreference = [...preferences, preference];
      const newpreferncesIdName = newpreference.map((pref) => {
        return { id: pref.id, name: pref.name };
      });
      const newavailableprfrences = availablePreferences.filter(
        // @ts-ignore
        (p) => p.id !== preference.id,
      );
      // console.log("new available preferences", newavailableprfrences);
      // console.log("new preference", newpreferncesIdName);
      setPreferences(newpreferncesIdName);
      setAvailablePreferences(newavailableprfrences);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setLoading(true);
      // @ts-ignore
      const preferenceIds = preferences.map((pref) => pref.id);
      // console.log(preferenceIds)
      const response = await updatePreferences({ categoryIds: preferenceIds });
      // console.log("Success:", response.data);

      const newtoken = await refreshToken();
      refreshAccessToken(newtoken.data);
      window.location.reload();
    } catch (error) {
      // @ts-ignore
      const message = error.response?.data?.message || "Something went wrong";
      setDialogMessage(message);
      setopenDialog(true);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // console.log("preferences",preferences)
    if (preferences.length > 0 && !preferencesBeforeChanged) {
      let before = [...preferences];
      setPreferencesBeforeChanged(before);
      // console.log("current:" , preferences,"before:",before)
    }
  }, [preferences]);

  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Preferences</h2>
        <p className="text-sm text-slate-500">
          Configure how you interact with the platform.
        </p>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 pl-4">
          {preferences &&
            preferences?.map((interest) => (
              <PreferenceBadge
                // @ts-ignore
                key={interest.id}
                // @ts-ignore
                interest={interest.name}
                onRemove={() => {
                  handlePreferenceChange(interest);
                }}
              ></PreferenceBadge>
            ))}

          <AddPreferencePopover
            availablePreferences={availablePreferences}
            handlePreferenceChange={handlePreferenceChange}
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleUpdatePreferences}
            className={`px-6 py-2 text-sm font-bold rounded-lg ${preferencesBeforeChanged !== preferences ? ` bg-primary text-white  hover:bg-primary/90 shadow-md shadow-primary/20` : `bg-slate-200 text-slate-400 `}  transition-all`}
          >
            {t("common.action.save")}
          </button>
        </div>
      </div>
      {loading && <Loading />}
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

export default UserSettingsAddPreference;
