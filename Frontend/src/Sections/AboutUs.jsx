import React from "react";

const AboutUs = () => {
  return (
    <section className="relative w-full min-h-screen py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-7xl w-full flex flex-col space-y-12 z-10">
        <div className="flex flex-col space-y-2">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
            <span className="text-white/80">About</span>{" "}
            <span className="text-white/30">Us</span>
          </h2>
          <div className="w-24 md:w-32 h-1 bg-white/20 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 w-full lg:w-1/2">
            <div className="border border-white/20 rounded-2xl bg-[#0B0B0D]/40 backdrop-blur-md p-8 md:p-10 relative overflow-hidden group hover:border-white/30 transition-all duration-300">
              <div className="absolute left-8 top-10 bottom-10 w-[2px] bg-[#D4AF37]"></div>

              <p className="text-white/70 text-base md:text-lg leading-relaxed pl-6 font-light">
                The{" "}
                <span className="text-[#D4AF37] font-medium">
                  Finance Club of Birla Institute of Technology
                </span>
                , Mesra is a student-led community that promotes financial
                literacy and practical understanding of finance. It provides
                students with exposure to financial markets, investment
                strategies, corporate finance, and economic trends through
                workshops, discussions, and real-world case studies. The club
                aims to bridge the gap between academic learning and industry
                application while helping members develop analytical,
                professional, and decision-making skills essential for careers
                in finance and related fields.
              </p>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-[400px]">
              <img
                src="./heroGif.gif"
                alt="Finance Decoration"
                className="w-full h-full object-contain drop-shadow-xl opacity-80"
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_10%,#0F0F12_50%)] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
