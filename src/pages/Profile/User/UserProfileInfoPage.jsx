import { IdCard, Stars, FlagTriangleLeft, Settings } from "lucide-react";

import { Badge } from "../../../components/shadcn/badge";
import UserProfileHeader from "../../../components/UI/UserProfileUI/UserProfileHeader";
import UserProfileMainLayout from "../../../components/Layout/UserProfileMainLayout";
import UserProfileInfoItem from "../../../components/UI/UserProfileUI/UserProfileInfoItem";

import { useEffect, useState } from "react";
import { useUser } from "../../../Context/AuthProvider";
import {
  getAttendedEvents,
  getMyProfile,
  getPreferences,
} from "../../../APIs/profileAPI";
import ErrorDialog from "../../../components/Dialogs/ErrorDialog";
import Loading from "../../../components/Layout/LoadingLayout";
import { DateToAge } from "../../../utils/dateFormater";
import useAppNavigate from "../../../Router/useAppNavigate";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Title } from "react-head";

function UserProfilePage() {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const { user } = useUser();
  const [accountData, setAccountData] = useState();
  const [openDialog, setopenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // url : http://localhost:5173/profile/:userId
  const { userId } = useParams();
  const accountId = userId;
 
  const handleLoadProfile = async () => {
    try {
      setLoading(true);

      const profile = (await getMyProfile()).data.data;
      const preferences = (await getPreferences()).data.data.preferences;
      const attendedEvents = (await getAttendedEvents()).data.data.count;

      const fullData = {
        ...profile,
        age: DateToAge(profile?.birthDate),
        preferences: preferences,
        attendedEvents,
      };
   
      setAccountData(fullData);
    } catch (error) {
      const message =
        error.response?.data?.error || t("profile.user.fetchError");
      setDialogMessage(message);
      setopenDialog(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadProfile();
  }, []);

  return (
    <UserProfileMainLayout
      openDialog={openDialog}
      dialogMessage={dialogMessage}
      loading={loading}
      setopenDialog={setopenDialog}
    >
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Title>{t("profile.user.title")}</Title>
        <UserProfileHeader
          name={accountData?.name || t("profile.user.userName")}
          memberSince="2026"
          eventsAttended={accountData?.attendedEvents || 0}
        />

        <div className="p-8 px-10">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <IdCard color="#BB52E0" size={28} />
            {t("profile.user.personalInfo")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <UserProfileInfoItem label={t("profile.user.age")}>
              {accountData?.age}
            </UserProfileInfoItem>

            <UserProfileInfoItem label={t("profile.user.gender")}>
              {accountData?.gender}
            </UserProfileInfoItem>

            <UserProfileInfoItem label={t("profile.user.location")}>
              <div className="flex items-center gap-1.5">
                <FlagTriangleLeft color="#BB52E0" size={24} />
                {accountData?.governorate?.toLowerCase()}
              </div>
            </UserProfileInfoItem>

            <UserProfileInfoItem label={t("profile.user.email")}>
              {accountData?.email}
            </UserProfileInfoItem>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Stars color="#BB52E0" />
              {t("profile.user.preferences")}
            </h3>

            <div className="flex flex-wrap gap-2 pl-4">
              {accountData?.preferences &&
                accountData?.preferences.map((interest) => (
                  <Badge
                    key={interest.id}
                    className={`px-4 py-2 rounded-full bg-slate-100  text-slate-700  text-md font-medium border border-slate-300 `}
                  >
                    {interest.name}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
        {user.id === accountId && (
          <div className="bg-slate-50  p-6 flex justify-start gap-3 border-t border-slate-200 ">
            <button
              onClick={() =>
                navigate(`/profile/${user.id}/setting`, {
                  state: { accountData: accountData },
                })
              }
              className="px-6 py-2.5 rounded-lg text-md font-bold bg-primary text-white shadow-md shadow-primary/25 hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Settings color="white" size={24} /> {t("profile.user.editAccount")}
            </button>
          </div>
        )}
      </div>
    </UserProfileMainLayout>
  );
}

export default UserProfilePage;

