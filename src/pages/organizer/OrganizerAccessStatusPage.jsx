import { useEffect, useMemo, useState } from "react";
import { ShieldAlert, MailCheck, Clock3, Ban } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getOrganizerStatus, resendOtpsOrganizer } from "../../APIs/userAPIs";
import Loading from "../../components/Layout/LoadingLayout";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import useAppNavigate from "../../Router/useAppNavigate";
import { handleError } from "../../utils/errorHandler";
import { useTranslation } from "react-i18next";

export default function OrganizerAccessStatusPage() {
  const navigate = useAppNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [organizer, setOrganizer] = useState(location.state?.organizer || null);
  const [loading, setLoading] = useState(!location.state?.organizer);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      if (organizer) {
        return;
      }

      try {
        const response = await getOrganizerStatus({ _silentError: true });
        if (!isMounted) {
          return;
        }
        setOrganizer(response?.data?.data?.organizer || null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        handleError(error, {
          silent: true,
          onMapped: (msg) => {
            setDialogMessage(msg);
            setOpenDialog(true);
          },
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, [organizer]);

  useEffect(() => {
    if (
      organizer?.isContactEmailVerified &&
      organizer?.verificationStatus === "APPROVED" &&
      organizer?.status === "ACTIVE"
    ) {
      navigate("/organizer/dashboard/overview", { replace: true });
    }
  }, [navigate, organizer]);

  const statusConfig = useMemo(() => {
    if (!organizer) {
      return {
        icon: ShieldAlert,
        title: t("organizer.status.unavailable.title"),
        message: t("organizer.status.unavailable.message"),
        actionLabel: t("common.actions.goBack"),
        action: () => navigate("/"),
      };
    }

    if (!organizer.isContactEmailVerified) {
      return {
        icon: MailCheck,
        title: t("organizer.status.emailVerification.title"),
        message: t("organizer.status.emailVerification.message", {
          email: organizer.contactEmail || "",
        }),
        actionLabel: t("organizer.status.emailVerification.action"),
        action: () => navigate("/organizer/otp-verification"),
        secondaryLabel: t("auth.otp.resend"),
        secondaryAction: async () => {
          try {
            setIsResending(true);
            await resendOtpsOrganizer({ _silentError: true });
            setDialogMessage(t("organizer.status.emailVerification.resent"));
            setOpenDialog(true);
          } catch (error) {
            handleError(error, {
              silent: true,
              onMapped: (msg) => {
                setDialogMessage(msg);
                setOpenDialog(true);
              },
            });
          } finally {
            setIsResending(false);
          }
        },
      };
    }

    if (organizer.verificationStatus === "UNDER_REVIEW") {
      return {
        icon: Clock3,
        title: t("organizer.status.review.title"),
        message: t("organizer.status.review.message"),
        actionLabel: t("common.actions.goBack"),
        action: () => navigate("/"),
      };
    }

    if (organizer.verificationStatus === "REJECTED") {
      return {
        icon: Ban,
        title: t("organizer.status.rejected.title"),
        message:
          organizer.rejectionReason ||
          t("organizer.status.rejected.message"),
        actionLabel: t("common.actions.goBack"),
        action: () => navigate("/"),
      };
    }

    if (organizer.status !== "ACTIVE") {
      return {
        icon: Ban,
        title: t("organizer.status.suspended.title"),
        message:
          organizer.suspendReason ||
          t("organizer.status.suspended.message"),
        actionLabel: t("common.actions.goBack"),
        action: () => navigate("/"),
      };
    }

    return null;
  }, [navigate, organizer, t]);

  if (loading || !statusConfig) {
    return <Loading />;
  }

  const Icon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6">
          <Icon size={30} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          {statusConfig.title}
        </h1>
        <p className="text-slate-600 text-lg leading-8 mb-8">
          {statusConfig.message}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={statusConfig.action}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            {statusConfig.actionLabel}
          </button>
          {statusConfig.secondaryAction && (
            <button
              onClick={statusConfig.secondaryAction}
              disabled={isResending}
              className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-60"
            >
              {isResending
                ? t("common.actions.loading")
                : statusConfig.secondaryLabel}
            </button>
          )}
        </div>
      </div>
      {openDialog && (
        <ErrorDialog
          open={openDialog}
          message={dialogMessage}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </div>
  );
}
