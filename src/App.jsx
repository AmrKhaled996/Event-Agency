
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
