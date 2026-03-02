import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "../Components/EventCard";
import { eventsData } from "../Data/events";

const UpcomingEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % eventsData.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + eventsData.length) % eventsData.length,
    );
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
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
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[480px]">
          {/* Cards Grid */}
          <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <Motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visibleEvents.slice(0, 3).map((event, idx) => (
                  <div
                    key={event.id}
                    className={`${idx === 2 ? "hidden lg:block" : ""} ${idx === 1 ? "hidden sm:block" : ""} block w-full`}
                  >
                    <Link to={`/events/${event.id}`}>
                      <EventCard event={event} />
                    </Link>
                  </div>
                ))}
              </Motion.div>
            </AnimatePresence>
          </div>

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
