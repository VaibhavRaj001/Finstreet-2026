import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative w-full text-white">
      <div className="absolute inset-0 w-full h-full z-10 opacity-60">
        <img
          src="/Footer_Bck_Img.jpg"
          alt="Footer Background"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-12 md:py-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-6 lg:gap-8">
          <div className="flex flex-col items-center lg:items-start space-y-2 md:space-y-6">
            <div className="relative">
              <img
                src="/FooterBtc.png"
                alt="Finance Club Bitcoin"
                className="h-32 w-auto object-cover drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] scale-150 origin-left relative -z-10 -ml-8 mb-5 md:h-[400px] md:scale-210 md:-ml-28"
              />
            </div>
          </div>

          <div className="flex flex-col items-start space-y-2 md:space-y-6">
            <h4 className="text-white font-medium tracking-widest text-[10px] md:text-sm uppercase">
              CLUB
            </h4>
            <div className="flex flex-col space-y-1 md:space-y-4 text-left">
              <Link
                to="/about"
                className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] md:text-sm"
              >
                About Us
              </Link>
              <Link
                to="/careers"
                className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] md:text-sm"
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] md:text-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start space-y-2 md:space-y-6">
            <h4 className="text-white font-medium tracking-widest text-[10px] md:text-sm uppercase">
              FEATURES
            </h4>
            <div className="flex flex-col space-y-1 md:space-y-4 text-left">
              <Link
                to="/events"
                className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] md:text-sm"
              >
                Events
              </Link>
              <Link
                to="/gallery"
                className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] md:text-sm"
              >
                Photo Gallery
              </Link>
              <Link
                to="/register"
                className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] md:text-sm"
              >
                Registrations
              </Link>
              <Link
                to="/user-management"
                className="text-white/70 hover:text-[#D4AF37] transition-colors text-[10px] md:text-sm"
              >
                User Management
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start space-y-4 md:space-y-8">
            <div className="flex flex-col items-start space-y-2 md:space-y-4 text-left">
              <h4 className="text-white font-medium tracking-widest text-[10px] md:text-sm uppercase">
                CONTACT US
              </h4>
              <div className="flex flex-col space-y-1 md:space-y-2 text-[10px] md:text-sm text-white/70">
                <a
                  href="mailto:financeclub@bitmesra.ac.in"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  financeclub@bitmesra.ac.in
                </a>
                <a
                  href="tel:+919546949124"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  +91 95469 49124
                </a>
                <p className="leading-relaxed mt-1 md:mt-2">
                  BIT Mesra Road,
                  <br />
                  Mesra,
                  <br />
                  Ranchi- 835215,
                  <br />
                  Jharkhand , India
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start space-y-2 md:space-y-4 w-full">
              <h4 className="text-white font-medium tracking-widest text-[10px] md:text-sm uppercase">
                STAY UP TO DATE
              </h4>
              <p className="text-white/50 text-[8px] md:text-xs">
                Register For Our events Now
              </p>
              <div className="relative w-full max-w-xs">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white text-black pl-2 pr-8 py-1 md:pl-4 md:pr-10 md:py-2 rounded-sm text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D4AF37] transition-colors">
                  <ArrowRight size={14} className="md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
