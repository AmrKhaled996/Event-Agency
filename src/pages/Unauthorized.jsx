import { useTranslation } from "react-i18next";
import WarningIcon from "../components/Icons/WarningIcon";
import useAppNavigate from "../Router/useAppNavigate";

function UnauthorizedPage() {
    const { t } = useTranslation();
    const navigator = useAppNavigate();
    
    return ( 
        <div className="w-full flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 mb-6">
                <WarningIcon />
            </div>
            <h1 className="text-5xl font-extrabold mb-4 text-gray-900 leading-tight">
                {t("common.errors.unauthorized", "Access Denied")}
            </h1>
            <p className="text-xl text-gray-600 max-w-md mb-8">
                {t("common.errors.unauthorizedDesc", "You don't have permission to access this page. Please log in with an authorized account.")}
            </p>
            <button 
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all transform hover:scale-105" 
                onClick={() => navigator("/")}
            >
                {t("common.actions.goHome", "Go Back Home")}
            </button>
        </div>
    );
}

export default UnauthorizedPage;