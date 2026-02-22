import React, { useState, useEffect, useMemo } from "react";
import { MapPin } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const computeTimeLeft = (targetDate) => {
  const difference = +targetDate - +new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, mins: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    mins: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const EventsHero = ({ event }) => {
  const targetDate = useMemo(
    () => (event?.fullDate ? new Date(event.fullDate) : new Date("2026-03-06")),
    [event],
  );

  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(computeTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!event) return null;

  const isFlagship = event.type === "FLAGSHIP";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0F0F12]">
      <img
        src="/Enigma_bck.png"
        alt="Event Background"
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex h-full max-w-[90%] flex-col justify-between pt-[15vh] pb-12 md:max-w-[85%]">
        {/* Top Section: Title */}
        <div className="flex flex-col text-white select-none">
          <h3 className="mb-1 ml-1 text-[10px] font-medium tracking-[0.2em] text-gray-300 md:text-xs">
            {isFlagship ? "INTRODUCING OUR" : "INTRODUCING "}
          </h3>

          <div className="w-fit">
            <div className="relative flex items-baseline">
              <h1 className="font-antonio text-[6vw] font-bold leading-[0.85] tracking-tight text-[#D4AF37] md:text-[4.5rem]">
                {isFlagship ? "FLAGSHIP" : "FINSTREET"}
              </h1>

              <span className="ml-2 text-[10px] font-bold tracking-[0.2em] text-white md:text-sm">
                EVENT
              </span>
            </div>

            {/* Gold divider */}
            <div className="md:h-[1.5px] h-[0.41px] w-full bg-linear-to-r from-[#D4AF37] to-[#6E5B1D] opacity-80 md:mt-0.5" />
          </div>

          <h1 className="font-antonio ml-[5vw] text-[6vw] font-bold leading-[0.85] tracking-tight text-[#D4AF37] md:ml-16 md:text-[4.5rem] uppercase">
            {event.title}
          </h1>

          <p className="mt-4 max-w-[250px] text-[10px] font-light tracking-wide text-gray-300 md:max-w-[400px] md:text-xs">
            {event.description}
          </p>
        </div>

        {/* Bottom Section: Timer & Details */}
        <div className="flex w-full flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          {/* Countdown Timer */}
          <div className="flex items-center gap-6 rounded-2xl border border-white/10 bg-black/20 md:px-8 md:py-4 px-4 py-4 backdrop-blur-md shadow-[3px_8px_15px_1px_rgba(212,175,55,0.5)]">
            <div className="flex flex-col items-center gap-1">
              <span className="font-antonio text-3xl text-[#D4AF37] md:text-5xl">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                Days
              </span>
            </div>
            <div className="h-8 w-px bg-gray-600/50"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-antonio text-3xl text-[#D4AF37] md:text-5xl">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                Hours
              </span>
            </div>
            <div className="pb-4 text-2xl text-gray-500">:</div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-antonio text-3xl text-[#D4AF37] md:text-5xl">
                {String(timeLeft.mins).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                Mins
              </span>
            </div>
            <div className="pb-4 text-2xl text-gray-500">:</div>
            <div className="flex flex-col items-center gap-1">
              <div className="relative h-9 w-12 overflow-hidden md:h-12 md:w-16">
                <AnimatePresence mode="popLayout">
                  <Motion.span
                    key={timeLeft.seconds}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute inset-0 flex items-center justify-center font-antonio text-3xl text-[#D4AF37] md:text-5xl"
                  >
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </Motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                Secs
              </span>
            </div>
          </div>

          {/* Event Details Box */}
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 px-6 py-4 backdrop-blur-md transition-transform hover:scale-105">
            <div className="flex items-center justify-center rounded bg-[#D4AF37] p-2 text-black shadow-lg shadow-[#D4AF37]/20">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white uppercase tracking-wide">
                {event.fullDate}
              </span>
              <span className="text-[10px] text-gray-300">
                {event.fullVenue}
              </span>
              <span className="text-[10px] text-gray-300">
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsHero;
