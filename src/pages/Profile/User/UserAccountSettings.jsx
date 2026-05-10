import { useEffect, useState } from "react";
import UserSettings from "../../../components/Layout/UserSettingsLayout";
import UserSettingsSecurity from "../../../components/UI/UserProfileUI/UserSettingsSecurit";
import PersonalInfoSection from "../../../components/UI/UserProfileUI/UserPersonalInfo";
import PreferencesSection from "../../../components/UI/UserProfileUI/UserSettingsAddPreference";
import DeleteAccountSection from "../../../components/UI/UserProfileUI/UserDeleteAccount";
import { useCategories } from "../../../Context/CategoriesProvider";
import { getPreferences } from "../../../APIs/profileAPI";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";

function UserAccountSettings() {
  const { t } = useTranslation();
  const { categories, loading } = useCategories();
  const [preferences, setPreferences] = useState([]);
  const location = useLocation();
  const [authProvider, setAuthProvider] = useState("");
  const { accountData } = location.state || {};
  // console.log(accountData)

  const [availablePreferences, setAvailablePreferences] = useState([]);

  const getAvailablePreferences = () => {
    setAvailablePreferences(
      categories.filter((pref) => !preferences.includes(pref)),
    );
  };

  const handleGetUserPreferences = async () => {
    try {
      const userpreferences = (await getPreferences()).data.data.preferences;
      setPreferences(userpreferences);
      console.log(userpreferences);
      const notuserpreferences = categories.filter(
        (cat) => !userpreferences.some((pref) => pref.id === cat.id),
      );
      console.log("not ", notuserpreferences);
      setAvailablePreferences(notuserpreferences);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAuthProvider(accountData?.authProvider);
    // console.log(authProvider)
    try {
      if (categories.length === 0) return;
      handleGetUserPreferences();
    } catch (error) {
      console.log(error);
    }
  }, [categories, accountData]);
  return (
    <UserSettings
      title={t("profile.settings.manage")}
      description={t("profile.settings.manageDesc")}
    >
      {accountData?.authProvider === "LOCAL" && (
        <UserSettingsSecurity provider={accountData?.authProvider} />
      )}
      <Title>{t("profile.settings.manage")}</Title>

      <PersonalInfoSection
        userLocation={accountData?.location}
        accountData={accountData}
      />

      <PreferencesSection
        preferences={preferences}
        availablePreferences={availablePreferences}
        setPreferences={setPreferences}
        setAvailablePreferences={setAvailablePreferences}
        getAvailablePreferences={getAvailablePreferences}
      />

      <DeleteAccountSection />
    </UserSettings>
  );
}

export default UserAccountSettings;

