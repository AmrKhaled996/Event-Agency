import { useState } from "react";
import NavbarMenuIcon from "../Icons/NavbarMenu";
import { ChevronDown, DoorOpen, Heart, TicketXIcon } from "lucide-react";
import TicketIcon from "../Icons/TicketIcon";
import ProfileIcon from "../Icons/ProfileIcon";
// import { useAuth } from "../../Hooks/useAuth";
import { useUser } from "../../Context/AuthProvider";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAccessToken,
  // refreshAccessToken,
  removeTokens,
} from "../../services/cookieTokenService";
import { logout, refreshToken } from "../../APIs/authAPIs";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { becomeOrganizer, getWalletBalance } from "../../APIs/userAPIs";
import { useTranslation } from "react-i18next";
import useAppNavigate from "../../Router/useAppNavigate";
function NavigationBar({ backGround = "primary" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [UserBalance, setUserBalance] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useAppNavigate();
  const navigateTo = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const {lang} =useParams();

  const { user, updateUser } = useUser();

  const handlelogout = async () => {
    try {
      const response = await logout();
      // console.log("Success:", response.data);
      updateUser({});
      // console.log(user)
      removeTokens();

      navigate("/");
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    try {

      // console.log(user);
      // console.log(user)
      const accessToken = getAccessToken();
      if (!accessToken) return;

      const decoded = jwtDecode(accessToken);
      updateUser(decoded);
    } catch (error) {
      // console.log("invalid token:", error);
      updateUser({});
    }
  }, []);

  // const handleBecomeOrganizer = async () => {
  //   try {
  //     const response = await becomeOrganizer();
  //     const newUser = { ...user, role: "organizer" };
  //     updateUser(newUser);
  //     // console.log(user);
  //     // const newtoken = await refreshToken();
  //     // refreshAccessToken(newtoken.data);
  //     // window.location.reload();
  //     // console.log("response", response);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };
  const handleChangeLanguage = (language) => {
    console.log(language)
    console.log("now",i18n.language)
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
   const newPath = location.pathname.replace(`/${lang}`, "");

    navigateTo({
      pathname: `/${language}${newPath}`,
      search: location.search,
      hash: location.hash
    });
    window.location.reload();
    console.log("after",i18n.language)

  };
  const getUserWalletBalance = async() => {

  try {
   const response = await getWalletBalance().then((res) => res.data.data);
   console.log("userBalance:",response?.balance);
   setUserBalance(response?.balance);

  } catch (error) {
    console.log(error.response)
  }
};
  useEffect(() => {
    getUserWalletBalance();
  }, []);
  return (
    <>
      <nav
        className={` ${
          backGround ? `bg-${backGround}` : "bg-primary"
        }  border-gray-200 p-2`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* === 1/4: Logo / Brand === */}
            <div className="w-3/4 flex items-center md:w-1/6">
              <Link to="/" className="h-full w-full flex items-center">
                <img
                  src={"/public/Fa3liatLogo.png"}
                  alt="Fa3liat Logo"
                  className="md:h-20 h-16 w-fit pb-2"
                />
              </Link>
            </div>

            {/* === 1/4: Menu Items === */}
            <div className="hidden lg:flex w-2/4 justify-center font-semibold text-lg">
              <ul className="flex justify-between w-full text-white">
                <li className={`text-center hover:text-gray-300 cursor-pointer ${lang==='ar'? '':'border-r border-gray-400'} flex-1`}>
                  <a href="#">Events</a>
                </li>
                <li className={`text-center hover:text-gray-300 cursor-pointer border-r border-gray-400 flex-1`}>
                  <a href="#">Categories</a>
                </li>
                <li className={`text-center hover:text-gray-300 cursor-pointer ${lang==='en'? '':'border-r border-gray-400'} flex-1`}>
                  <a href="#">Calendar</a>
                </li>
              </ul>
            </div>

            {/* === 1/4: Language Buttons === */}
            <div className="hidden lg:flex w-1/8 justify-center items-center space-x-4">
              <button
                disabled={lang === "ar"}
                onClick={() => handleChangeLanguage("ar")}
                className={`text-white  ${lang === 'ar' ? 'font-extrabold underline text-xl hover:cursor-not-allowed': 'font-bold text-xl hover:cursor-pointer hover:text-gray-300'} `}
              >
                AR
              </button>
              <span className="text-white text-2xl">|</span>
              <button
              disabled={lang === "en"}
                onClick={() => handleChangeLanguage("en")}
                className={`text-white ${lang === 'en' ? 'font-extrabold underline text-xl hover:cursor-not-allowed': 'font-bold text-xl hover:cursor-pointer hover:text-gray-300'}  mr-2`}
              >
                EN
              </button>
            </div>

            {/* === 1/4: Auth Buttons === */}

            {user.role === "user" || user.role === "organizer" ? (
              <div className="text-white flex items-center gap-6">
                <button
                  onClick={() => navigate(`/tickets`)}
                  className="hidden md:flex flex-col items-center text-sm cursor-pointer"
                >
                  <TicketIcon />

                  <span>Tickets</span>
                </button>

                <button
                  onClick={() => navigate(`/interested`)}
                  className="hidden md:flex flex-col items-center text-sm cursor-pointer"
                >
                  <Heart size={30} />
                  <span>Interested</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="flex  items-center gap-1 cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-sm">
                      <ProfileIcon />

                      <span>Profile</span>
                    </div>
                    <ChevronDown size={20} />
                  </button>

                  {openProfile && (
                    <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg w-48  z-20 ">
                      <button
                        className="w-full flex justify-between text-left px-4 py-3 border-b border-gray-200 rounded-t-lg "
                      >
                        <span>Wallet</span> <span>{UserBalance || 0} EGP</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/profile/${user.id}`);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-200 transition duration-300  cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={handlelogout}
                        className="w-full text-left px-4 py-3  transition duration-300 flex gap-2 items-center text-red-700 hover:text-white hover:bg-red-600 cursor-pointer"
                      >
                        <DoorOpen size={20} />
                        logout
                      </button>

                      {user.role === "user" ? (
                        <button
                          onClick={() => navigate("/organizer/upgrade")}
                          className="w-full text-left px-4 py-3 hover:bg-secandry/80 transition duration-300 bg-secandry text-white rounded-b-lg cursor-pointer"
                        >
                          Upgrade to organizer
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate("/organizer/dashboard/overview")
                          }
                          className="w-full text-left px-4 py-3 hover:bg-secandry/80 transition duration-300 bg-secandry text-white rounded-b-lg cursor-pointer"
                        >
                          Go to Dashboard
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex w-1/5 justify-end space-x-4">
                <button
                  onClick={() => {
                    // console.log(user);
                    navigate("/login");
                  }}
                  className="px-6 py-2 bg-secandry text-white rounded-md hover:bg-[#FF8370] transition w-3/5"
                >
                  Join Us
                </button>
              </div>
            )}

            {/* === Mobile Menu Button === */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* === Mobile Dropdown === */}
          {isOpen && (
            <div className="lg:hidden px-4 pb-4 space-y-2">
             
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300 mb-2 border-b py-3 border-white/30"
              >
                Events
              </a>
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300 mb-2 border-b py-3 border-white/30"
              >
                Categories
              </a>
              <a
                href="#"
                className="block text-white font-semibold hover:text-gray-300 mb-5"
              >
                Calendar
              </a>
              {user.role === "user" || user.role === "organizer" ? (
                <div className="flex space-x-2 items-center justify-center text-white  gap-10">
                  <div className=" flex flex-col items-center text-lg cursor-pointer ">
                    <TicketIcon />

                    <span>Tickets</span>
                  </div>

                  <div className=" flex flex-col items-center text-lg cursor-pointer  ">
                    <Heart size={30} />
                    <span>Interested</span>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2 items-center justify-center">
                  <button
                    onClick={() => {
                      navigate("/login");
                    }}
                    className="px-6 py-2 bg-secandry text-white rounded-md hover:bg-[#FF8370] transition w-3/5"
                  >
                    Join Us
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavigationBar;
