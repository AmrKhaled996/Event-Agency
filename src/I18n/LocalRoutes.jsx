import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const supportedLangs = ["en", "ar"];

export default function LocalRoutes() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    // لو اللغة غلط → redirect بعد render
    // if (!supportedLangs.includes(lang)) {
    //   navigate("/ar", { replace: true });
    //   return;
    // }

    // set language
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);

    // set direction
    document.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // دايمًا رجّع Outlet
  return <Outlet />;
}