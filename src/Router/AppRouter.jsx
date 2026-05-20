import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import OrganizerAccessGate from "../components/OrganizerAccessGate";

import CreateEventBasics from "../pages/organizer/CreateEventBasics";
import CreateEventBanner from "../pages/organizer/CreateEventBanner";
import CreateEventTickets from "../pages/organizer/CreateEventTickets";
import GoogleCallback from "../pages/Auth/GoogleAuthCallback";
import { EventFormProvider } from "../Context/EventPovider";
import CreateEventReview from "../pages/organizer/CreateEventReview";
import LoginPage from "../pages/Auth/LoginPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import OTPVerificationPage from "../pages/Auth/OTPVerificationPage";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import BackToLogin from "../pages/Auth/BackToLogin";
import CompleteResister from "../pages/onboarding/CompleteRegister";
import ResetPassword from "../pages/Auth/ResetPassword";
import LocationSelection from "../pages/onboarding/LocationSelectionPage";
import PreferenceSelection from "../pages/onboarding/PreferenceSelection";
import PersonlityinfoQ from "../pages/onboarding/Personlityinfo";
import Onboarding from "../components/Layout/Onbording";
import HomePage from "../pages/HomePage";
import EventPage from "../pages/Events/EventPage";
import NavigationBar from "../components/Layout/NavigationBar";
import Footer from "../components/Layout/Footer";
import OtherEventsSlider from "../components/Layout/OtherEventsSlider";
import OrganizerDashboard from "../pages/organizer/dashboard/OrganizerDashboard";
import PayTicketsPage from "../pages/payment/PayTickets";
import PaymanetConfirmationPage from "../pages/payment/PaymentConfiermation";
import PaymentSuccessPage from "../pages/payment/PaymentSuccess";
import PaymentCancelPage from "../pages/payment/PaymentCancel";
import UnauthorizedPage from "../pages/Unauthorized";
import OrganizerOverviewPage from "../pages/organizer/dashboard/OrganizerOverview";
import OrganizerAnalyticsPage from "../pages/organizer/dashboard/OrganizerAnalytics";
import OrganizerEventsPage from "../pages/organizer/dashboard/OrganizerEvents";
import OrganizerSettingsPage from "../pages/organizer/dashboard/OrganizerSettings";
// import OrganizerAttendeeInsightsPage from "../pages/organizer/dashboard/OrganizerAttendeeInsights";
import UpdateEvent from "../pages/organizer/updateEvent/UpdateEvent";
import ConfirmNewsletter from "../pages/newsletter/ConfirmationNewsletter";
import AlreadySubscribedNewsletter from "../pages/newsletter/AlreadySubscribedNewsletter";
import FailureNewsletter from "../pages/newsletter/FailureNewsletter";
import ProtectedRoutes from "./ProtectedRoutes";
import EventsPagination from "../pages/Events/EventsPagination";
import NotFoundPage from "../pages/NotFoundPage";
import DisplayUserTickets from "../pages/Tickets/DisplayUserTickets";
import UserProfileInfoPage from "../pages/Profile/User/UserProfileInfoPage";
import OrganizerProfileInfoPage from "../pages/Profile/Organizer/OrganizerProfileInfoPage";
import UserAccountSettings from "../pages/Profile/User/UserAccountSettings";
import ConfirmEmail from "../pages/Profile/User/ConfirmEmail";
import InterestedEventsPage from "../pages/Events/InterestedEvents";
import SearchEventsPage from "../pages/Events/SearchEventsPage";
import CalendarPage from "../pages/Events/CalendarPage";
import CategoriesPage from "../pages/Categories/CategoriesPage";
import UpgradePage from "../pages/organizer/upgradeToOrganizer/UpgradePage";
import LocalRoutes from "../I18n/LocalRoutes";
import AboutPage from "../pages/Info/AboutPage";
import AboutPageAR from "../pages/Info/AboutPageAR";
import ChatbotHelper from "../pages/chatbot/ChatbotHelper";
import { useTranslation } from "react-i18next";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import LoginPageAdmin from "../pages/Admin/Auth/LoginPage";
import SignUpPageAdmin from "../pages/Admin/Auth/SignUpPage";
import AdminPendingApprovalPage from "../pages/Admin/Auth/AdminPendingApprovalPage";
import OTPVerificationPageOrganizer from "../pages/organizer/upgradeToOrganizer/OTPVerificationPage";
import OrganizerAccessStatusPage from "../pages/organizer/OrganizerAccessStatusPage";

const RedirectWithSearch = ({ to }) => {
  const { search } = useLocation();
  return <Navigate to={to + search} replace />;
};
function AppRouter({ children }) {
  const { t } = useTranslation();
  const savedLang = localStorage.getItem("lang") || "ar";
  return (
    <ErrorBoundary>
      {children}
      <Routes>
        {/* redirect root */}
        <Route path="/" element={<RedirectWithSearch to={`/${savedLang}`} />} />
        <Route path="/confirm-email" element={<RedirectWithSearch to={`/${savedLang}/confirm-email`} />} />
        <Route path="/payment/success" element={<RedirectWithSearch to={`/${savedLang}/payment/success`} />} />


            {/* كل الموقع تحت اللغة */}
            <Route path="/:lang" element={<LocalRoutes />}>
              {/* PUBLIC */}
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="otp-verification" element={<OTPVerificationPage />} />

              <Route
                path="unauthorized"
                element={
                  <>
                    <NavigationBar />
                    <UnauthorizedPage />
                    <Footer />
                  </>
                }
              />

              {/* ONBOARDING */}
              <Route
                path="onboarding/location-selection"
                element={
                  <Onboarding
                    stepNo={2}
                    pageTitle={t("onboarding.locationSelection.title")}
                  >
                    <LocationSelection />
                  </Onboarding>
                }
              />

              <Route
                path="onboarding/preference-selection"
                element={
                  <Onboarding
                    stepNo={3}
                    pageTitle={t("onboarding.preferenceSelection.title")}
                  >
                    <PreferenceSelection />
                  </Onboarding>
                }
              />

              <Route
                path="onboarding/personality-info"
                element={
                  <Onboarding
                    stepNo={1}
                    pageTitle={t("onboarding.personalityinfo.title")}
                  >
                    <PersonlityinfoQ />
                  </Onboarding>
                }
              />

              {/* AUTH */}
              <Route path="completed" element={<CompleteResister />} />
              <Route
                path="forget-password/get-email"
                element={<ForgetPassword />}
              />
              <Route path="forget-password/back" element={<BackToLogin />} />
              <Route path="reset-password" element={<ResetPassword />} />

              {/* EVENTS */}
              <Route
                path="events/:slug"
                element={
                  <>
                    <NavigationBar />
                    <EventPage />
                    <OtherEventsSlider />
                    <Footer />
                  </>
                }
              />

              <Route
                path="events-pagenation"
                element={
                  <>
                    <NavigationBar />
                    <EventsPagination />
                    <Footer />
                  </>
                }
              />

              <Route path="search-events" element={<SearchEventsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="categories" element={<CategoriesPage />} />

              {/* ORGANIZER */}
              <Route
                path="organizer/dashboard/overview"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <OrganizerDashboard page="overview" title={t("organizer.dashboard.overview")}>
                        <OrganizerOverviewPage />
                      </OrganizerDashboard>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route
                path="organizer/dashboard/events"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <OrganizerDashboard page="events" title={t("organizer.dashboard.myEvents")}>
                        <OrganizerEventsPage />
                      </OrganizerDashboard>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route
                path="organizer/dashboard/analytics"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <OrganizerDashboard page="analytics" title={t("organizer.dashboard.analytics")}>
                        <OrganizerAnalyticsPage />
                      </OrganizerDashboard>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route
                path="organizer/dashboard/settings"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <OrganizerDashboard page="settings" title={t("organizer.dashboard.settings") || "Settings"}>
                        <OrganizerSettingsPage />
                      </OrganizerDashboard>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              {/* <Route
                path="organizer/dashboard/attendee-insights"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerDashboard
                      page="attendee-insights"
                      title={t("organizer.dashboard.attendees")}
                    >
                      <OrganizerAttendeeInsightsPage />
                    </OrganizerDashboard>
                  </ProtectedRoutes>
                }
              /> */}


              {/* CREATE EVENT */}
              <Route
                path="organizer/create-event/basics"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <EventFormProvider>
                        <CreateEventBasics />
                      </EventFormProvider>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route
                path="organizer/create-event/banner"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <EventFormProvider>
                        <CreateEventBanner />
                      </EventFormProvider>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route
                path="organizer/create-event/ticket"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <EventFormProvider>
                        <CreateEventTickets />
                      </EventFormProvider>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route
                path="organizer/create-event/review"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <EventFormProvider>
                        <CreateEventReview />
                      </EventFormProvider>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route
                path="organizer/update-event"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessGate>
                      <EventFormProvider>
                        <UpdateEvent />
                      </EventFormProvider>
                    </OrganizerAccessGate>
                  </ProtectedRoutes>
                }
              />

              <Route path="organizer/upgrade" element={<UpgradePage />} />
              <Route path="organizer/otp-verification" element={<OTPVerificationPageOrganizer />} />
              <Route
                path="organizer/status"
                element={
                  <ProtectedRoutes Roles={["organizer"]}>
                    <OrganizerAccessStatusPage />
                  </ProtectedRoutes>
                }
              />

              {/* NEWSLETTER */}
              <Route
                path="newsletter/confirmation"
                element={<ConfirmNewsletter />}
              />
              <Route
                path="newsletter/already-subscribed"
                element={<AlreadySubscribedNewsletter />}
              />
              <Route path="newsletter/failure" element={<FailureNewsletter />} />

              {/* PAYMENT */}
              <Route
                path="payment/tickets"
                element={
                  <ProtectedRoutes Roles={["organizer", "user"]}>
                    <PayTicketsPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="payment/confirmation"
                element={
                  <ProtectedRoutes Roles={["organizer", "user"]}>
                    <PaymanetConfirmationPage />
                  </ProtectedRoutes>
                }
              />

              <Route path="payment/success" element={<PaymentSuccessPage />} />
              <Route path="payment/cancel" element={<PaymentCancelPage />} />

              {/* USER */}
              <Route
                path="tickets"
                element={
                  <>
                    <NavigationBar />
                    <DisplayUserTickets />
                    <Footer />
                  </>
                }
              />

              <Route
                path="profile/:userId"
                element={
                  <>
                    <NavigationBar />
                    <UserProfileInfoPage />
                    <Footer />
                  </>
                }
              />

              <Route
                path="profile/:userId/setting"
                element={
                  <>
                    <NavigationBar />
                    <UserAccountSettings />
                    <Footer />
                  </>
                }
              />

              <Route path="organizer/:id" element={<OrganizerProfileInfoPage />} />

              <Route path="confirm-email" element={<ConfirmEmail />} />

              <Route
                path="interested"
                element={
                  <div className="flex flex-col min-h-screen">
                    <NavigationBar />
                    <main className="flex-grow">
                      <InterestedEventsPage />
                    </main>
                    <Footer />
                  </div>
                }
              />

              <Route path="google/callback" element={<GoogleCallback />} />

              <Route
                path="about"
                element={
                  <>
                    <NavigationBar />
                    {savedLang === "ar" ? <AboutPageAR /> : <AboutPage />}
                    <Footer />
                  </>
                }
              />
              {/* ADMIN AUTH */}
                <Route path="admin/login" element={<LoginPageAdmin />} />
              <Route path="admin/signup" element={<SignUpPageAdmin />} />
              <Route path="admin/pending-approval" element={<AdminPendingApprovalPage />} />
              {/* ADMIN */}

              <Route
                path="admin"
                element={
                  <ProtectedRoutes Roles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoutes>
                }
              />

            {/* chatbotHelper */}
            <Route
              path="help/chatbot"
              element={
                <>
                  <NavigationBar />
                  <ChatbotHelper />
                  <Footer />
                </>
              }
            />
            {/* NOT FOUND */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
  );
}

export default AppRouter;
