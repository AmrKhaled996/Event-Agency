import { useEffect, useState } from "react";
import UserSettings from "../../../components/Layout/UserSettingsLayout";
import UserSettingsSecurity from "../../../components/UI/UserProfileUI/UserSettingsSecurit";
import PersonalInfoSection from "../../../components/UI/UserProfileUI/UserPersonalInfo";
import PreferencesSection from "../../../components/UI/UserProfileUI/UserSettingsAddPreference";
import DeleteAccountSection from "../../../components/UI/UserProfileUI/UserDeleteAccount";
import { useCategories } from "../../../Context/CategoriesProvider";
import { getPreferences } from "../../../APIs/profileAPI";

function UserAccountSettings() {
  const { categories, loading } = useCategories();
  const [preferences, setPreferences] = useState([]);

  const [availablePreferences, setAvailablePreferences] = useState([]);

  const getAvailablePreferences = () => {
    setAvailablePreferences(
      categories.filter((pref) => !preferences.includes(pref)),
    );
  };

  const handlePreferenceChange = (preference) => {
    console.log(preference);
    if (preferences.includes(preference)) {
      const newprfrences = preferences.filter((p) => p.id !== preference.id );
      console.log("new" , newprfrences)
      setPreferences(newprfrences);
      setAvailablePreferences([...availablePreferences, preference]);
    } else {
      const newpreference = [...preferences, preference]
      const newavailableprfrences = availablePreferences.filter((p) => p.id !== preference.id );
      console.log("new available preferences",newavailableprfrences)
      console.log("new preference", newpreference);
      setPreferences(newpreference);
      setAvailablePreferences(newavailableprfrences);
    }
  };

  const handleGetUserPreferences = async () => {
    try {
      const userpreferences =(await getPreferences()).data.data.preferences;
      setPreferences(userpreferences);
      console.log(userpreferences)
      setAvailablePreferences(
        categories.filter((cat) => !userpreferences.includes(cat.id)),
      );
    } catch (error) {
      console.log(error);
    }
  };

 useEffect( () => {
  try {
    if (categories.length === 0) return;
    handleGetUserPreferences();

  } catch (error) {
    console.log(error);
  }
}, [categories]);
  return (
    <UserSettings
      title="Manage Account"
      description="Update your security settings and personal preferences."
    >
      <UserSettingsSecurity />

      <PersonalInfoSection />

      <PreferencesSection
        preferences={preferences}
        availablePreferences={availablePreferences}
        handlePreferenceChange={handlePreferenceChange}
        getAvailablePreferences={getAvailablePreferences}
      />

      <DeleteAccountSection />
    </UserSettings>
  );
}

export default UserAccountSettings;
