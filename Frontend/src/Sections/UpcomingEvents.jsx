import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "../Components/EventCard";
import { eventsData } from "../Data/events";

const UpcomingEvents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const isLg = windowWidth >= 1024;
  const isMd = windowWidth >= 640 && windowWidth < 1024;

  const getCardStyles = (idx) => {
    if (isLg) {
      // LG: Center (idx 1) is Front, Sides are Back
      if (idx === 1) return { z: 100, scale: 1.05, opacity: 1, rotateY: 0 };
      if (idx === 0)
        return { z: -150, scale: 0.85, opacity: 0.5, rotateY: 15, x: -20 };
      if (idx === 2)
        return { z: -150, scale: 0.85, opacity: 0.5, rotateY: -15, x: 20 };
    } else if (isMd) {
      // MD: Left (idx 0) is Front, Right is Back
      if (idx === 0) return { z: 60, scale: 1.02, opacity: 1, rotateY: 5 };
      if (idx === 1) return { z: -80, scale: 0.95, opacity: 0.6, rotateY: -5 };
    }
    // SM: Flat
    return { z: 0, scale: 1, opacity: 1, rotateY: 0 };
  };

  const getVisibleEvents = () => {
    const visible = [];
    const count = isLg ? 3 : isMd ? 2 : 1;
    for (let i = 0; i < count; i++) {
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
        <div
          className="relative h-[480px] w-full"
          style={{ perspective: "1500px" }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-full">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleEvents.map((event, idx) => {
                const styles = getCardStyles(idx);
                return (
                  <Motion.div
                    key={event.id}
                    layout
                    initial={{
                      opacity: 0,
                      x: direction > 0 ? 100 : -100,
                      z: -200,
                    }}
                    animate={{
                      opacity: styles.opacity,
                      x: 0,
                      z: styles.z,
                      scale: styles.scale,
                      rotateY: styles.rotateY,
                    }}
                    exit={{
                      opacity: 0,
                      x: direction > 0 ? -100 : 100,
                      z: -200,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                      mass: 1,
                    }}
                    className="w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Link to={`/events/${event.id}`} className="block h-full">
                      <EventCard event={event} />
                    </Link>
                  </Motion.div>
                );
              })}
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
