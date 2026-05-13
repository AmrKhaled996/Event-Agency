import WarningIcon from "../components/Icons/WarningIcon";
import useAppNavigate from "../Router/useAppNavigate";

function UnauthorizedPage() {
        const navigator = useAppNavigate();
    return ( 
        <div className="w-full flex flex-col items-center justify-center min-h-140 h-[60vh]">
            {/* icon */}
            <WarningIcon />
            <h1 className="text-4xl font-bold mb-6  ">Unauthorized</h1>
            <p className="text-2xl text-center">You are not authorized to access this page.</p>
            <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all" onClick={() => navigator("/")}>
                Go Back Home
            </button>

        </div>
     );
}

export default UnauthorizedPage;