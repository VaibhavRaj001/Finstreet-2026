import React from "react";
import EventsHero from "../Sections/EventsHero";
import EventDetails from "../Sections/EventDetails";
import UpcomingEvents from "../Sections/UpcomingEvents";
import Footer from "../Sections/Footer";
import Navbar from "../Sections/Navbar";
import SectionSeperator from "../Components/SectionSeperator";
import { eventsData } from "../Data/events";
import OurSpeaker from "../Sections/OurSpeaker";

function Events() {
  
  const defaultEvent = eventsData.find((e) => e.id === "enigma");

  return (
    <div className="h-fit overflow-y-clip w-fit bg-[#0F0F12] text-white">
      <Navbar />

      <EventsHero event={defaultEvent} />
      <SectionSeperator />
      <EventDetails event={defaultEvent} />
      <SectionSeperator />
      <UpcomingEvents />
      <SectionSeperator />
      <OurSpeaker />
      <SectionSeperator />
      <Footer />
    </div>
  );
}

export default Events;
