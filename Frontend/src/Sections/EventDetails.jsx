import React from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { useNavigate } from "react-router-dom";

const EventDetails = ({ event }) => {
  const { isAuthenticated, user } = useAuth();
  const { openContact } = useModal();
  const navigate = useNavigate();

  if (!event) return null;

  const handleAction = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    if (event.id === "enigma") {
      window.location.href =
        "https://unstop.com/o/yUb06ca?lb=1Eimu2z&utm_medium=Share&utm_source=competitions&utm_campaign=Financeclubbitm";
      return;
    }

    if (!user?.team) {
      navigate("/create-team");
    } else {
      navigate("/my-teams");
    }
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "SIGN UP";
    if (!user?.team) return "CREATE/JOIN TEAM";
    return "MY TEAM";
  };

  return (
    <section className="relative w-full bg-[#0F0F12] py-20 px-6 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
        {/* Poster Image */}
        <div className="flex justify-center lg:w-1/2">
          <img
            src={event.image || "/EnigmaPoster.png"}
            alt={`${event.title} Poster`}
            className="h-auto w-full max-w-[400px] object-cover opacity-90 lg:max-w-[500px]"
          />
        </div>
        {/* Content Box */}
        <div className="flex flex-col lg:w-1/2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-12">
            <h2 className="mb-6 text-3xl font-bold uppercase leading-tight text-[#D4AF37] md:text-4xl lg:text-3xl">
              {event.title} - {event.subtitle}
            </h2>
            <p className="mb-6 leading-relaxed text-gray-300">
              {event.description}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Date
                </p>
                <p className="font-semibold text-white">{event.fullDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Time
                </p>
                <p className="font-semibold text-white">{event.time}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Venue
                </p>
                <p className="font-semibold text-white">{event.fullVenue}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Location
                </p>
                <p className="font-semibold text-white">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleAction}
                className="flex items-center justify-center gap-2 rounded bg-[#D4AF37] px-6 py-3 font-bold text-black transition-colors hover:bg-[#b08d2b]"
              >
                {getButtonText()}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={openContact}
                className="flex items-center justify-center gap-2 rounded border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                CONTACT US
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
