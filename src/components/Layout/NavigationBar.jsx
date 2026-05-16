import { useState, useEffect } from "react";
import NavbarMenuIcon from "../Icons/NavbarMenu";
import { ChevronDown, DoorOpen, Heart, TicketXIcon, Bell, Sun, Moon } from "lucide-react";
import TicketIcon from "../Icons/TicketIcon";
import ProfileIcon from "../Icons/ProfileIcon";
import NotificationBell from "../UI/NotificationBell";
import { useUser } from "../../Context/AuthProvider";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAccessToken,
  // refreshAccessToken,
  removeTokens,
} from "../../services/cookieTokenService";
import { logout  } from "../../APIs/authAPIs";
import { jwtDecode } from "jwt-decode";
import {  getWalletBalance } from "../../APIs/userAPIs";
import { useTranslation } from "react-i18next";
import useAppNavigate from "../../Router/useAppNavigate";
import LocalLink from "../../Router/LocalLink";
import { handleError } from "../../utils/errorHandler";
function NavigationBar({ backGround = "primary" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [UserBalance, setUserBalance] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useAppNavigate();
  const navigateTo = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const {lang} =useParams();

  const { user, updateUser } = useUser();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // If user is admin, don't show the public navigation bar
  if (user?.role === "admin") return null;

  const handlelogout = async () => {
    try {
      await logout({ _silentError: true });
      updateUser({});
      removeTokens();
      navigate("/");
    } catch (error) {
      handleError(error);
    }
  };
  useEffect(() => {
    try {
      const accessToken = getAccessToken();
      if (!accessToken) return;

      const decoded = jwtDecode(accessToken);
      updateUser(decoded);
    } catch (error) {
      console.warn("Invalid token:", error.message);
      updateUser({});
    }
  }, []);

  // const handleBecomeOrganizer = async () => {
  //   try {
  //     const response = await becomeOrganizer();
  //     const newUser = { ...user, role: "organizer" };
  //     updateUser(newUser);
  //     // const newtoken = await refreshToken();
  //     // refreshAccessToken(newtoken.data);
  //     // window.location.reload();
  //   } catch (error) {
  //   }
  // };
  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("lang", language);
   const newPath = location.pathname.replace(`/${lang}`, "");

    navigateTo({
      pathname: `/${language}${newPath}`,
      search: location.search,
      hash: location.hash
    },{replace: true});
    // window.location.reload();

  };
  const getUserWalletBalance = async() => {
    if (!user?.id) return;
    try {
      const response = await getWalletBalance().then((res) => res.data.data);
      setUserBalance(response?.balance);
    } catch (error) {
      console.debug("Wallet balance fetch failed", error.message);
    }
  };
  useEffect(() => {
    getUserWalletBalance();
  }, []);
  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          backGround ? `bg-${backGround}` : "bg-primary"
        } soft-shadow backdrop-blur-sm bg-opacity-95 p-2`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* === 1/4: Logo / Brand === */}
            <div className="w-3/4 flex items-center md:w-1/6 transition-transform hover:scale-105">
              <LocalLink to="/" className="h-full w-full flex items-center">
                <img
                  src={"/Fa3liatLogo.png"}
                  alt={t("common.logo.alt")}
                  className="md:h-20 h-16 w-fit pb-2"
                />              </LocalLink>
            </div>

            {/* === 1/4: Menu Items === */}
            <div className="hidden lg:flex w-2/4 justify-center font-medium text-base">
              <ul className="flex justify-center gap-8 w-full text-white/90">
                <li className="hover:text-white transition-colors duration-200">
                  <LocalLink to={`/events-pagenation?page=1&type=nearby&title=${t("homePage.sections.nearby")}`}>
                    {t("layout.nav.events")}
                  </LocalLink>
                </li>

                <li className="hover:text-white transition-colors duration-200">
                  <LocalLink to="/categories">
                    {t("layout.nav.categories")}
                  </LocalLink>
                </li>

                <li className="hover:text-white transition-colors duration-200 cursor-pointer" onClick={() => navigate("/search-events")}>
                  {t("layout.nav.calendar")}
                </li>
              </ul>
            </div>

            {/* === 1/4: Language & Theme === */}
            <div className="hidden lg:flex w-1/8 justify-center items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-black/10 text-white hover:bg-black/20 transition-all cursor-pointer"
                title={isDarkMode ? t("layout.nav.lightMode") : t("layout.nav.darkMode")}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <div className="flex bg-black/10 rounded-full p-1 backdrop-blur-md">
                <button
                  disabled={lang === "ar"}
                  onClick={() => handleChangeLanguage("ar")}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    lang === "ar"
                      ? "bg-white text-primary font-bold shadow-sm"
                      : "text-white hover:text-white/80 cursor-pointer"
                  }`}
                >
                  {t("common.languages.ar")}
                </button>
                <button
                  disabled={lang === "en"}
                  onClick={() => handleChangeLanguage("en")}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    lang === "en"
                      ? "bg-white text-primary font-bold shadow-sm"
                      : "text-white hover:text-white/80 cursor-pointer"
                  }`}
                >
                  {t("common.languages.en")}
                </button>
              </div>
            </div>

            {/* === 1/4: Auth Buttons === */}

            {user?.role === "user" || user?.role === "organizer" ? (
              <div className="text-white flex items-center gap-6">
                <div className="transition-transform hover:scale-110">
                  <NotificationBell />
                </div>
                
                <button
                  onClick={() => navigate(`/tickets`)}
                  className="hidden md:flex flex-col items-center text-xs opacity-90 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                  <div className="transition-transform group-hover:-translate-y-0.5">
                    <TicketIcon />
                  </div>
                  <span className="mt-1">{t("layout.nav.tickets")}</span>
                </button>

                <button
                  onClick={() => navigate(`/interested`)}
                  className="hidden md:flex flex-col items-center text-xs opacity-90 hover:opacity-100 transition-opacity cursor-pointer group"
                >
                  <div className="transition-transform group-hover:-translate-y-0.5">
                    <Heart size={26} />
                  </div>
                  <span className="mt-1">{t("layout.nav.interest")}</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setOpenProfile(!openProfile)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 p-2 px-3 rounded-full transition-all cursor-pointer border border-white/10"
                  >
                    <ProfileIcon />
                    <ChevronDown size={16} className={`transition-transform duration-300 ${openProfile ? "rotate-180" : ""}`} />
                  </button>

                  {openProfile && (
                    <div
                      className={`absolute ${
                        lang === "ar" ? "left-0 " : "right-0"
                      } mt-3 bg-white text-gray-800 shadow-2xl rounded-2xl w-56 z-50 border border-gray-100 py-2 animate-in fade-in zoom-in duration-200`}
                    >
                      <div className="px-4 py-3 border-b border-gray-50 flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{t("layout.nav.wallet")}</span>
                        <span className="text-lg font-bold text-primary">{UserBalance || 0} <small className="text-xs text-gray-500 font-normal">{t("common.currency.egp")}</small></span>
                      </div>

                      <button
                        onClick={() => {
                          navigate(`/profile/${user.id}`);
                          setOpenProfile(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition duration-200 cursor-pointer flex items-center gap-2 text-sm font-medium"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <ProfileIcon />
                        </div>
                        {t("layout.nav.profile")}
                      </button>

                      <button
                        onClick={handlelogout}
                        className={`w-full text-left px-4 py-2.5 hover:bg-rose-50 transition duration-200 flex items-center gap-2 text-rose-600 cursor-pointer text-sm font-medium`}
                      >
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                          <DoorOpen size={16} />
                        </div>
                        {t("layout.nav.logout")}
                      </button>

                      <div className="px-2 mt-1">
                        {user?.role === "user" ? (
                          <button
                            onClick={() => {
                              navigate("/organizer/upgrade");
                              setOpenProfile(false);
                            }}
                            className="w-full text-center px-4 py-2.5 hover:brightness-110 transition duration-300 bg-secandry text-white rounded-xl cursor-pointer text-sm font-bold shadow-md shadow-secandry/20"
                          >
                            {t("layout.nav.upgrade")}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              navigate("/organizer/dashboard/overview");
                              setOpenProfile(false);
                            }}
                            className="w-full text-center px-4 py-2.5 hover:brightness-110 transition duration-300 bg-secandry text-white rounded-xl cursor-pointer text-sm font-bold shadow-md shadow-secandry/20"
                          >
                            {t("layout.nav.dashboard")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex w-1/5 justify-end">
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="px-8 py-2.5 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all active:scale-95 shadow-lg shadow-black/10"
                >
                  {t("layout.nav.join")}
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
              <LocalLink
                to={`/events-pagenation?page=1&type=nearby&title=${t("homePage.sections.nearby")}`}
                className="block text-white font-semibold hover:text-gray-300 mb-2 border-b py-3 border-white/30"
              >
                {t("layout.nav.events")}
              </LocalLink>
              <LocalLink
                to="/categories"
                className="block text-white font-semibold hover:text-gray-300 mb-2 border-b py-3 border-white/30"
              >
                {t("layout.nav.categories")}
              </LocalLink>
              <LocalLink
                to="/calendar"
                className="block text-white font-semibold hover:text-gray-300 mb-5"
              >
                {t("layout.nav.calendar")}
              </LocalLink>
              {user?.role === "user" || user?.role === "organizer" ? (
                <div className="flex space-x-2 items-center justify-center text-white  gap-10">
                  <NotificationBell />
                  <div
                    onClick={() => navigate(`/tickets`)}
                    className=" flex flex-col items-center text-lg cursor-pointer "
                  >
                    <TicketIcon />

                    <span>{t("layout.nav.tickets")}</span>
                  </div>

                  <div
                    onClick={() => navigate(`/interested`)}
                    className=" flex flex-col items-center text-lg cursor-pointer  "
                  >
                    <Heart size={30} />
                    <span>{t("layout.nav.interest")}</span>
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
                    {t("layout.nav.join")}
                  </button>
                </div>
              )}
              <div className="flex lg:flex justify-center w-full items-center space-x-4 mt-4  ">
                <button
                  disabled={lang === "ar"}
                  onClick={() => handleChangeLanguage("ar")}
                  className={`text-white  ${lang === "ar" ? "font-extrabold underline text-xl hover:cursor-not-allowed" : "font-bold text-xl hover:cursor-pointer hover:text-gray-300"} `}
                >
                  {t("common.languages.ar")}
                </button>
                <span className="text-white text-2xl">|</span>
                <button
                  disabled={lang === "en"}
                  onClick={() => handleChangeLanguage("en")}
                  className={`text-white ${lang === "en" ? "font-extrabold underline text-xl hover:cursor-not-allowed" : "font-bold text-xl hover:cursor-pointer hover:text-gray-300"}  mr-2`}
                >
                  {t("common.languages.en")}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavigationBar;
