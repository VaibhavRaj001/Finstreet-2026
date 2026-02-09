import React from "react";
import { ArrowUpRight } from "lucide-react";

const EventCard = ({ event }) => {
  return (
    <div className="group relative h-[400px] w-full min-w-[300px] overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-gray-900 shadow-lg transition-transform hover:scale-[1.02]">
      {/* Background Image */}
      <img
        src={event.image}
        alt={event.title}
        className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-40"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Top Info */}
        <div className="text-sm font-medium text-gray-300">
          <p>
            {event.date} // {event.venue}
          </p>
        </div>

        {/* Bottom Info */}
        <div>
          <h3 className="mb-2 font-antonio text-4xl font-bold uppercase leading-none text-white">
            {event.title}
          </h3>

          <p className="mb-4 text-sm font-medium leading-tight text-gray-300">
            {event.description}
          </p>

          <button className="flex items-center gap-2 rounded border border-[#D4AF37]/50 bg-black/40 px-4 py-2 text-xs font-bold text-[#D4AF37] backdrop-blur-md transition-colors hover:bg-[#D4AF37] hover:text-black">
            VIEW MORE
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
