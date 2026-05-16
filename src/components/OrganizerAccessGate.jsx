import { useEffect, useState } from "react";
import { getOrganizerStatus } from "../APIs/userAPIs";
import Loading from "./Layout/LoadingLayout";
import useAppNavigate from "../Router/useAppNavigate";
import { handleError } from "../utils/errorHandler";

export default function OrganizerAccessGate({ children }) {
  const navigate = useAppNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkOrganizerAccess = async () => {
      try {
        const response = await getOrganizerStatus({ _silentError: true });
        const organizer = response?.data?.data?.organizer;

        const hasAccess =
          organizer?.isContactEmailVerified &&
          organizer?.verificationStatus === "APPROVED" &&
          organizer?.status === "ACTIVE";

        if (!isMounted) {
          return;
        }

        if (hasAccess) {
          setIsAllowed(true);
          return;
        }

        navigate("/organizer/status", {
          replace: true,
          state: { organizer },
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        handleError(error, { silent: true });
        navigate("/organizer/status", { replace: true });
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkOrganizerAccess();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isChecking) {
    return <Loading />;
  }

  if (!isAllowed) {
    return null;
  }

  return children;
}
