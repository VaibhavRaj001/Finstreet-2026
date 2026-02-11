import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"; 
import EventCard from "../Components/EventCard";
import { eventsData } from "../Data/events"; 

const UpcomingEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % eventsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + eventsData.length) % eventsData.length,
    );
  };

  const getVisibleEvents = () => {
    const visible = [];
    for (let i = 0; i < eventsData.length; i++) {
      visible.push(eventsData[(currentIndex + i) % eventsData.length]);
    }
    return visible;
  };

  const visibleEvents = getVisibleEvents();

  return (
    <section className="bg-[#0F0F12] py-20 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <h2 className="font-antonio text-5xl font-bold uppercase bg-clip-text text-transparent bg-linear-to-r from-[#EDEDED] to-[#2A2A2E]/50 md:text-7xl lg:text-8xl leading-[1.1] tracking-[-0.02em] overflow-visible">
            UPCOMING{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-[#EDEDED] to-[#2A2A2E]/50">
              EVENTS
            </span>
          </h2>

          {/* Navigation Buttons */}
          <div className="hidden gap-4 md:flex">
            <button
              onClick={prevSlide}
              className="rounded-full border border-gray-700 p-3 text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="rounded-full border border-gray-700 p-3 text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <ChevronRight className="h-6 w-6"/>
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Cards Grid */}
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            layout
          >
            <AnimatePresence mode="popLayout">
              {visibleEvents.slice(0, 3).map((event, idx) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`${idx === 2 ? "hidden lg:block" : ""} ${idx === 1 ? "hidden sm:block" : ""} block w-full`}
                >
                  <Link to={`/events/${event.id}`}>
                    <EventCard event={event} />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-8 flex justify-center gap-4 md:hidden">
            <button
              onClick={prevSlide}
              className="rounded-full border border-gray-700 p-3 text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="rounded-full border border-gray-700 p-3 text-white transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
