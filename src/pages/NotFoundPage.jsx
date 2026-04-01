import WarningIcon from "../components/Icons/WarningIcon";

function NotFoundPage() {
    return ( 
        
                <div className="w-full flex flex-col items-center justify-center min-h-140 h-full">
            {/* icon */}
            <WarningIcon />
            <h1 className="text-4xl font-bold mb-6  ">Page Not Founded</h1>
            <p className="text-2xl text-center">there is no such page. or maybe you are lost</p>
            <botton className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all" onClick={() => window.location.href = "/"}>
                Go Back Home
            </botton>

        </div>

     );
}

export default NotFoundPage;