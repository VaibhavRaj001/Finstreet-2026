import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Sections/Navbar";
import EventsHero from "../Sections/EventsHero";
import EventDetails from "../Sections/EventDetails";
import UpcomingEvents from "../Sections/UpcomingEvents";
import Footer from "../Sections/Footer";
import SectionSeperator from "../Components/SectionSeperator";
import { eventsData } from "../Data/events";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find event by ID
  const event = eventsData.find((e) => e.id === id);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!event) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0F0F12] text-white">
        <h2 className="mb-4 text-3xl font-bold text-[#D4AF37]">
          Event Not Found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="rounded border border-[#D4AF37] px-6 py-2 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-fit overflow-y-clip w-full bg-[#0F0F12] text-white">
      <Navbar />
      <EventsHero event={event} />
      <SectionSeperator />
      <EventDetails event={event} />
      <SectionSeperator />
      <UpcomingEvents />
      <SectionSeperator />
      <Footer />
    </div>
  );
};

export default EventPage;
