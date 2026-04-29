
import CardDisplaySection from "../components/Layout/CardDisplaySection";
import CuratedEventsSection from "../components/Layout/CuratedEventsSection";
import Footer from "../components/Layout/Footer";
import ExploreCategories from "../components/Layout/ExploreCategoriesSection";
import CreateEventHomePageSection from "../components/Layout/CreateEventHomePageSection";

import { Title } from "react-head";
import {
  categories,
  latestEvents,
  nearbyEvents,
  newEventsThisWeek,
  pastEvents,
  personalizedEvents,
} from "../APIs/homeApis";
import Loading from "../components/Layout/LoadingLayout";
import { useState } from "react";
import HomeHeader from "../components/Layout/HomeHeader";

function HomePage() {
  // const {user} = useAuth();
  const [loading, setloading] = useState(false);

  return (
    <>
      <Title>Fa3liat | HOME</Title>
      <HomeHeader />
      <ExploreCategories endpoint={categories} />
      <CardDisplaySection
        title={"Events Just for You"}
        endpoint={personalizedEvents}
      />
      <CardDisplaySection
        title={"What's New This Week"}
        endpoint={newEventsThisWeek}
      />
      <CuratedEventsSection />
      <CardDisplaySection
        title={"Happening Near You"}
        endpoint={nearbyEvents}
      />
      <CardDisplaySection
        title={"Past Events and Highlights"}
        endpoint={pastEvents}
      />
      <CreateEventHomePageSection />
      <Footer />
      {loading && <Loading />}
    </>
  );
}

export default HomePage;
