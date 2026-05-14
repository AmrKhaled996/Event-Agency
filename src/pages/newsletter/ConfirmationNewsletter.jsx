import { Title } from "react-head";
import { useTranslation } from "react-i18next";

function ConfirmNewsletter() {
    const {t} =useTranslation();
    return ( 
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
            <Title>{t("newsletter.success.title")}</Title>
            <div className="bg-green-200 p-8 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">{t("newsletter.success.header")}</h2>
                <p className="mb-6 font-medium text-lg">{t("newsletter.success.description")}</p>
                <a href="/" className="text-white bg-green-800 px-4 py-2 rounded hover:bg-green-900">{t("newsletter.backbutton")}</a>
            </div>
        </div>
     );
}

export default ConfirmNewsletter;