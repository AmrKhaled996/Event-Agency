import { Title } from "react-head";
import { getInterestedEvents } from "../../APIs/userAPIs";
import CardDisplaySection from "../../components/Layout/CardDisplaySection";
import ErrorDialog from "../../components/Dialogs/ErrorDialog";
import { useState } from "react";

function InterestedEventsPage() {



    

  return (
    <>
      <Title>Interested Events</Title>

      <div className="px-4 sm:px-6 lg:px-16 xl:px-24 my-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl font-serif text-shadow-md text-shadow-gray-400">
            Interested Events
          </h1>

        </div>

        <hr className="my-4 text-gray-300" />

        <CardDisplaySection endpoint={getInterestedEvents}/>
        
      </div>

    </>
  );
}

export default InterestedEventsPage;
