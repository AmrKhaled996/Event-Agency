import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";


function App() {
   const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir =
      i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);
  return (
    <>
      
    </>
  );
}

export default App;
