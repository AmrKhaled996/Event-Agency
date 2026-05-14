import CardDisplaySection from "../components/Layout/CardDisplaySection";
import CuratedEventsSection from "../components/Layout/CuratedEventsSection";
import Footer from "../components/Layout/Footer";
import ExploreCategories from "../components/Layout/ExploreCategoriesSection";
import CreateEventHomePageSection from "../components/Layout/CreateEventHomePageSection";

import { Title } from "react-head";
import {
  categories,
  // latestEvents,
  nearbyEvents,
  newEventsThisWeek,
  pastEvents,
  personalizedEvents,
} from "../APIs/homeApis";
import Loading from "../components/Layout/LoadingLayout";

import HomeHeader from "../components/Layout/HomeHeader";
import { useTranslation } from "react-i18next";

function HomePage() {
  // const {user} = useAuth();

  const { t } = useTranslation();

  return (
    <>
      <Title>{t(`homePage.seoTitle`)}</Title>
      <HomeHeader />
      <ExploreCategories endpoint={categories} />
      <CardDisplaySection
        title={t(`homePage.sections.curated`)}
        endpoint={personalizedEvents}
        type="curated"
      />
      <CardDisplaySection
        title={t(`homePage.sections.new`)}
        endpoint={newEventsThisWeek}
        type="new"
      />
      <CuratedEventsSection />
      <CardDisplaySection
        title={t(`homePage.sections.nearby`)}
        endpoint={nearbyEvents}
        type="nearby"
      />
      <CardDisplaySection
        title={t(`homePage.sections.past`)}
        endpoint={pastEvents}
        type="past"
      />
      <CreateEventHomePageSection />
      <Footer />

    </>
  );
}

export default HomePage;
