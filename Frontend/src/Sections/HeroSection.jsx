import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PolygonNetworkBackground from "../Components/PolygonNetworkBackground";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 w-full h-full -z-10">
        <img
          src="./heroSection.svg"
          alt="Background Decoration"
          className="hidden md:block w-full h-full opacity-90"
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

        <div className="md:hidden block">
          <PolygonNetworkBackground />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 py-24 lg:py-0 h-full min-h-screen flex flex-col lg:block justify-center">
        <div className="flex flex-col items-start lg:absolute lg:top-[12%] lg:left-[5%] transition-all duration-500 z-20">
          <h1 className="text-[12vw] sm:text-[80px] md:text-[85px] lg:text-[90px] xl:text-[100px] leading-[0.85] font-normal tracking-[-0.03em] bg-linear-to-r from-[#D4AF37] via-[#F3E5AB] to-[#806a28] bg-clip-text text-transparent select-none uppercase font-sans">
            FINANCE
          </h1>

          <div className="flex items-end gap-3 sm:gap-6 mt-[-.4vw] sm:mt-[-8.6px] md:mt-[-9px] lg:mt-[-6px]">
            <h2 className="text-[9vw] sm:text-[70px] md:text-[80px] lg:text-[80px] xl:text-[85px] leading-none font-normal tracking-[-0.03em] bg-linear-to-r from-[#D4AF37] via-[#F3E5AB] to-[#806a28] bg-clip-text text-transparent select-none uppercase font-sans">
              CLUB
            </h2>

            <div className="flex flex-col items-end mb-2 sm:mb-8 lg:mb-9">
              <div className="w-[15vw] sm:w-24 md:w-32 lg:w-40 h-px bg-linear-to-r from-[#D4AF37] to-transparent mb-1 opacity-70"></div>
              <span className="text-[2.5vw] sm:text-[10px] md:text-[12px] lg:text-[14px] text-white/90 tracking-[0.2em] font-light uppercase">
                PRESENTS
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end lg:block lg:absolute lg:top-[31%] lg:right-[0%] mt-8 lg:mt-0 transition-all duration-500 pointer-events-none select-none z-10 opacity-90 mix-blend-overlay">
          <h1 className="text-[18vw] sm:text-[120px] md:text-[150px] lg:text-[200px] xl:text-[180px] leading-[0.8] font-bold tracking-tighter text-white/28 text-right uppercase">
            FINSTREET
          </h1>
        </div>

        <div className="mt-16 lg:mt-0 lg:absolute lg:bottom-[1.5%] lg:left-[5%] w-full max-w-md sm:max-w-lg transition-all duration-500 z-30">
          <div className="border border-white/10 rounded-3xl bg-[#0B0B0D]/40 backdrop-blur-xl p-6 md:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-[#D4AF37]/30 transition-colors duration-300 group">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3 tracking-tight bg-linear-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B88A00] bg-clip-text text-transparent uppercase">
              DOLLAR
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8 font-light tracking-wide">
              A Tool that can cut both ways —{" "}
              <span className="text-white">
                Creating Wealth or Causing Harm
              </span>
            </p>

            <div className="flex gap-4">
              <Link
                to={
                  isAuthenticated
                    ? "/create-team"
                    : "/login?redirect=/create-team"
                }
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-[#D4AF37]/90 hover:text-[#D4AF37] rounded-sm py-3 px-6 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 text-[10px] sm:text-xs font-medium tracking-widest uppercase group/btn"
              >
                SIGN UP YOUR TEAM
                <span className="text-[#D4AF37] ml-1 group-hover/btn:translate-x-1 transition-transform">
                  ▸
                </span>
              </Link>

              <button className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-white/70 hover:text-white rounded-sm py-3 px-6 border border-white/10 hover:border-white/30 transition-all duration-300 text-[10px] sm:text-xs font-medium tracking-widest uppercase group/btn2">
                CONTACT US
                <span className="text-white/50 group-hover/btn2:text-white ml-1 group-hover/btn2:translate-x-1 transition-transform">
                  ▸
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
